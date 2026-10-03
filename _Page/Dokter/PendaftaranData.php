<?php
// Process before HTML so successful submissions can redirect safely.
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
header('Cache-Control: no-store');
$escapeAntrian = static function ($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
};
$nowAntrian = new DateTimeImmutable('now', new DateTimeZone('Asia/Jakarta'));
$jadwalData = json_decode((string) @file_get_contents(__DIR__ . '/jadwal_dokter.json'), true);
$antrianError = '';
$antrianSuccess = $_SESSION['antrian_success'] ?? null;
unset($_SESSION['antrian_success']);
$namaPasien = is_string($_POST['nama_pasien'] ?? null) ? trim($_POST['nama_pasien']) : '';
$kontakPasien = is_string($_POST['kontak_pasien'] ?? null) ? trim($_POST['kontak_pasien']) : '';
$pilihanJadwal = is_string($_POST['jadwal'] ?? null) ? $_POST['jadwal'] : '';
$dokterPilihan = is_string($_GET['dokter_id'] ?? null) ? $_GET['dokter_id'] : '';
$dokterAntrian = [];
$opsiAntrian = [];
$hariAntrian = [1 => 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
if (!is_array($jadwalData) || !isset($jadwalData['dokter'], $jadwalData['jadwal'])) {
    $antrianError = 'Jadwal tidak dapat dimuat. Silakan coba kembali nanti.';
} else {
    foreach ($jadwalData['dokter'] as $dokter) {
        $dokterAntrian[$dokter['dokter_id']] = $dokter;
    }
    for ($offset = 0; $offset < 7; $offset++) {
        $date = $nowAntrian->setTime(0, 0)->modify("+$offset days");
        foreach ($jadwalData['jadwal'] as $jadwal) {
            if (empty($jadwal['aktif']) || (int) $jadwal['hari_iso'] !== (int) $date->format('N') || !isset($dokterAntrian[$jadwal['dokter_id']])) continue;
            if ($date->setTime(...array_map('intval', explode(':', $jadwal['jam_selesai']))) <= $nowAntrian) continue;
            $key = $jadwal['jadwal_id'] . '|' . $date->format('Y-m-d');
            $opsiAntrian[$key] = $jadwal + ['tanggal_kunjungan' => $date->format('Y-m-d'), 'label_tanggal' => $hariAntrian[(int) $date->format('N')] . ', ' . $date->format('d/m/Y')];
        }
    }
}
$_SESSION['antrian_csrf'] = $_SESSION['antrian_csrf'] ?? bin2hex(random_bytes(32));
$storageAntrian = dirname(__DIR__, 2) . '/pendaftaran_pasien.json';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$antrianError) {
    if (!is_string($_POST['csrf'] ?? null) || !hash_equals($_SESSION['antrian_csrf'], $_POST['csrf'])) {
        $antrianError = 'Sesi formulir tidak valid. Silakan muat ulang halaman.';
    } elseif ($namaPasien === '' || strlen($namaPasien) > 150) {
        $antrianError = 'Isi nama pasien (maksimal 150 karakter).';
    } elseif (!preg_match('/^\+?[0-9][0-9 ()-]{7,23}$/', $kontakPasien) || strlen(preg_replace('/\D/', '', $kontakPasien)) < 8 || strlen(preg_replace('/\D/', '', $kontakPasien)) > 15) {
        $antrianError = 'Isi nomor telepon/WhatsApp yang valid (8–15 digit).';
    } elseif (!isset($opsiAntrian[$pilihanJadwal])) {
        $antrianError = 'Pilih jadwal aktif dalam tujuh hari yang tersedia.';
    } else {
        $handle = @fopen($storageAntrian, 'c+');
        if (!$handle || !flock($handle, LOCK_EX)) {
            $antrianError = 'Pendaftaran belum dapat disimpan. Silakan coba kembali.';
            if ($handle) fclose($handle);
        } else {
            try {
                $raw = stream_get_contents($handle);
                $records = trim($raw) === '' ? [] : json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
                if (!is_array($records) || !array_is_list($records)) throw new RuntimeException('Format penyimpanan tidak valid.');
                $selected = $opsiAntrian[$pilihanJadwal];
                $count = 0;
                foreach ($records as $record) {
                    if (($record['jadwal_id'] ?? '') === $selected['jadwal_id'] && ($record['tanggal_kunjungan'] ?? '') === $selected['tanggal_kunjungan'] && ($record['status'] ?? '') !== 'dibatalkan') $count++;
                }
                if ($count >= (int) $selected['kuota_pasien']) {
                    $antrianError = 'Kuota jadwal ini sudah penuh. Silakan pilih jadwal lain.';
                } else {
                    $record = [
                        'pendaftaran_id' => 'REG-' . $nowAntrian->format('Ymd') . '-' . strtoupper(bin2hex(random_bytes(5))),
                        'nama_pasien' => $namaPasien, 'kontak_pasien' => $kontakPasien,
                        'jadwal_id' => $selected['jadwal_id'], 'dokter_id' => $selected['dokter_id'], 'poli_id' => $selected['poli_id'],
                        'nama_dokter' => $dokterAntrian[$selected['dokter_id']]['nama'],
                        'tanggal_kunjungan' => $selected['tanggal_kunjungan'], 'jam_mulai' => $selected['jam_mulai'], 'jam_selesai' => $selected['jam_selesai'],
                        'ruangan' => $selected['ruangan'], 'nomor_antrian' => $count + 1,
                        'status' => 'terdaftar', 'dummy' => !empty($jadwalData['dummy']), 'waktu_daftar' => $nowAntrian->format(DATE_ATOM)
                    ];
                    $records[] = $record;
                    $encoded = json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR) . "\n";
                    rewind($handle);
                    if (fwrite($handle, $encoded) !== strlen($encoded) || !ftruncate($handle, strlen($encoded)) || !fflush($handle)) throw new RuntimeException('Gagal menulis data.');
                    $_SESSION['antrian_success'] = $record;
                    $_SESSION['antrian_csrf'] = bin2hex(random_bytes(32));
                }
            } catch (Throwable $error) {
                $antrianError = 'Data pendaftaran tidak dapat disimpan. Silakan hubungi petugas atau coba kembali.';
            } finally {
                flock($handle, LOCK_UN);
                fclose($handle);
            }
            if (!$antrianError) {
                header('Location: index.php?page=daftar_antrian', true, 303);
                exit;
            }
        }
    }
}
$kuotaTerpakai = [];
$readHandle = @fopen($storageAntrian, 'r');
if ($readHandle) {
    if (flock($readHandle, LOCK_SH)) {
        $records = json_decode(stream_get_contents($readHandle), true);
        foreach (is_array($records) ? $records : [] as $record) {
            if (($record['status'] ?? '') === 'dibatalkan') continue;
            $key = ($record['jadwal_id'] ?? '') . '|' . ($record['tanggal_kunjungan'] ?? '');
            $kuotaTerpakai[$key] = ($kuotaTerpakai[$key] ?? 0) + 1;
        }
        flock($readHandle, LOCK_UN);
    }
    fclose($readHandle);
}
