<section class="section-warm" style="padding: 4rem 0 3rem;">
  <div class="container text-center">
    <span class="section-subtitle">Pendaftaran Pasien</span>
    <h1 class="section-title">Daftar Antrian</h1>
    <p class="section-desc">Isi data pasien dan pilih jadwal dokter untuk kunjungan Anda.</p>
    <nav aria-label="breadcrumb"><ol class="breadcrumb justify-content-center mt-3"><li class="breadcrumb-item"><a href="index.php">Beranda</a></li><li class="breadcrumb-item"><a href="index.php?page=Dokter">Dokter</a></li><li class="breadcrumb-item active" aria-current="page">Daftar Antrian</li></ol></nav>
  </div>
</section>
<section class="section-padding">
  <div class="container">
    <div class="row g-4">
      <aside class="col-lg-4">
        <div class="card-elsyifa p-4 h-100">
          <h2 class="h4 mb-4">Tahapan Pendaftaran</h2>
          <ol class="ps-4">
            <li class="mb-4"><strong>Isi data pasien</strong><p class="text-muted mb-0">Masukkan nama lengkap dan nomor telepon/WhatsApp yang aktif.</p></li>
            <li class="mb-4"><strong>Pilih jadwal dokter</strong><p class="text-muted mb-0">Pilih dokter, tanggal, dan jam praktik dalam tujuh hari mulai hari ini (WIB).</p></li>
            <li class="mb-4"><strong>Simpan pendaftaran</strong><p class="text-muted mb-0">Periksa data lalu tekan tombol Daftar Antrian.</p></li>
            <li><strong>Datang sesuai jadwal</strong><p class="text-muted mb-0">Simpan kode pendaftaran dan nomor antrian untuk ditunjukkan kepada petugas.</p></li>
          </ol>
        </div>
      </aside>
      <div class="col-lg-8">
        <?php if (!empty($jadwalData['dummy'])): ?>
          <div class="alert alert-warning">Jadwal yang tersedia masih berupa data simulasi, bukan jadwal praktik resmi. Konfirmasikan kunjungan kepada petugas rumah sakit.</div>
        <?php endif; ?>
        <?php if ($antrianSuccess): ?>
          <div class="alert alert-success" role="status">
            <h2 class="h5">Pendaftaran berhasil disimpan</h2>
            <p>Kode pendaftaran: <strong><?= $escapeAntrian($antrianSuccess['pendaftaran_id']) ?></strong><br>Nomor antrian: <strong><?= $escapeAntrian($antrianSuccess['nomor_antrian']) ?></strong></p>
            <p class="mb-0"><?= $escapeAntrian($antrianSuccess['nama_pasien']) ?> — <?= $escapeAntrian($antrianSuccess['nama_dokter']) ?><br><?= $escapeAntrian($antrianSuccess['tanggal_kunjungan']) ?>, <?= $escapeAntrian($antrianSuccess['jam_mulai']) ?>–<?= $escapeAntrian($antrianSuccess['jam_selesai']) ?> WIB · <?= $escapeAntrian($antrianSuccess['ruangan']) ?></p>
          </div>
        <?php endif; ?>
        <?php if ($antrianError): ?><div class="alert alert-danger" role="alert"><?= $escapeAntrian($antrianError) ?></div><?php endif; ?>
        <div class="card-elsyifa p-4 h-auto">
          <h2 class="h4 mb-4">Form Pendaftaran</h2>
          <form action="index.php?page=daftar_antrian" method="post">
            <input type="hidden" name="csrf" value="<?= $escapeAntrian($_SESSION['antrian_csrf']) ?>">
            <div class="mb-3"><label for="namaPasien" class="form-label">Nama pasien <span class="text-danger">*</span></label><input class="form-control" id="namaPasien" name="nama_pasien" autocomplete="name" maxlength="150" required value="<?= $escapeAntrian($namaPasien) ?>"></div>
            <div class="mb-3"><label for="kontakPasien" class="form-label">Kontak pasien (telepon/WhatsApp) <span class="text-danger">*</span></label><input class="form-control" type="tel" id="kontakPasien" name="kontak_pasien" autocomplete="tel" maxlength="25" required placeholder="Contoh: 081234567890" value="<?= $escapeAntrian($kontakPasien) ?>"></div>
            <div class="mb-3"><label for="filterDokterAntrian" class="form-label">Filter dokter</label><select class="form-select" id="filterDokterAntrian"><option value="">Semua dokter</option><?php foreach ($dokterAntrian as $id => $dokter): ?><option value="<?= $escapeAntrian($id) ?>" <?= $dokterPilihan === $id ? 'selected' : '' ?>><?= $escapeAntrian($dokter['nama']) ?></option><?php endforeach; ?></select></div>
            <div class="mb-4"><label for="jadwalAntrian" class="form-label">Pilih jadwal yang diinginkan <span class="text-danger">*</span></label>
              <select class="form-select" id="jadwalAntrian" name="jadwal" required aria-describedby="jadwalAntrianHelp"><option value="">Pilih jadwal dokter</option>
                <?php foreach ($opsiAntrian as $key => $jadwal): $sisa = max(0, (int) $jadwal['kuota_pasien'] - ($kuotaTerpakai[$key] ?? 0)); ?>
                <option data-dokter-id="<?= $escapeAntrian($jadwal['dokter_id']) ?>" value="<?= $escapeAntrian($key) ?>" <?= $pilihanJadwal === $key ? 'selected' : '' ?> <?= !$sisa ? 'disabled' : '' ?>><?= $escapeAntrian($jadwal['label_tanggal'] . ' · ' . $jadwal['jam_mulai'] . '–' . $jadwal['jam_selesai'] . ' WIB · ' . $dokterAntrian[$jadwal['dokter_id']]['nama'] . ' · ' . $jadwal['ruangan'] . ' · ' . ($sisa ? 'Sisa ' . $sisa . ' pasien' : 'Kuota penuh')) ?></option>
                <?php endforeach; ?>
              </select>
              <div id="jadwalAntrianHelp" class="form-text">Jadwal mengikuti hari praktik dokter. Jadwal hari ini yang sudah selesai tidak ditampilkan.</div>
              <p id="jadwalAntrianEmpty" class="text-muted mt-2" hidden>Tidak ada jadwal tersedia untuk dokter ini dalam tujuh hari ke depan.</p>
            </div>
            <button class="btn btn-elsyifa w-100" type="submit" <?= !$opsiAntrian ? 'disabled' : '' ?>><i class="bi bi-calendar-plus me-2" aria-hidden="true"></i>Daftar Antrian</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
<script>
(function () {
  var filter = document.getElementById('filterDokterAntrian');
  var select = document.getElementById('jadwalAntrian');
  var options = Array.from(select.options).slice(1);
  function update() {
    var chosen = select.value;
    select.replaceChildren(new Option('Pilih jadwal dokter', ''));
    options.forEach(function (option) {
      if (!filter.value || option.dataset.dokterId === filter.value) select.appendChild(option);
    });
    select.value = Array.from(select.options).some(function (option) { return option.value === chosen; }) ? chosen : '';
    document.getElementById('jadwalAntrianEmpty').hidden = Array.from(select.options).some(function (option) { return option.value && !option.disabled; });
  }
  filter.addEventListener('change', update);
  update();
})();
</script>
