<?php
$units = json_decode(file_get_contents(__DIR__ . '/../../assets/data/units.json'), true) ?: [];
$escape = static function ($value) { return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'); };
?>
<section class="section-dark unit-page-header" aria-labelledby="unit-orbit-title">
    <div class="container text-center">
        <span class="section-subtitle">Pelayanan RSU El-Syifa</span>
        <h1 class="section-title" id="unit-orbit-title">Unit &amp; Instalasi</h1>
        <p class="section-desc">Sorot ikon untuk mengenali unit, lalu pilih untuk melihat detail.</p>
        <nav aria-label="breadcrumb" class="mt-3">
            <ol class="breadcrumb justify-content-center">
                <li class="breadcrumb-item"><a href="index.php">Beranda</a></li>
                <li class="breadcrumb-item active" aria-current="page">Unit &amp; Instalasi</li>
            </ol>
        </nav>
    </div>
</section>
<section class="unit-orbit-hero" id="unit-orbit-hero" aria-labelledby="unit-orbit-title">
    <video class="unit-orbit-video" muted playsinline preload="auto" aria-hidden="true" tabindex="-1">
        <source src="assets/img/Video/motion-videos.webm" type="video/webm">
    </video>
    <div class="unit-orbit-overlay" aria-hidden="true"></div>
    <nav class="unit-orbit" aria-label="Unit dan instalasi">
    <?php foreach ($units as $index => $unit):
        $angle = -M_PI / 2 + 2 * M_PI * $index / count($units);
        $x = number_format(50 + 44 * cos($angle), 4, '.', '');
        $y = number_format(50 + 44 * sin($angle), 4, '.', '');
        // Desktop: split into outward-facing arcs, leaving the nurse's face clear.
        $leftCount = (int) ceil(count($units) / 2);
        $isLeft = $index < $leftCount;
        $sideIndex = $isLeft ? $index : $index - $leftCount;
        $sideCount = $isLeft ? $leftCount : count($units) - $leftCount;
        $sideAngle = $sideCount > 1 ? M_PI * $sideIndex / ($sideCount - 1) : M_PI / 2;
        $desktopX = number_format($isLeft ? 26 - 16 * sin($sideAngle) : 74 + 16 * sin($sideAngle), 4, '.', '');
        $desktopY = number_format(50 - 38 * cos($sideAngle), 4, '.', '');
        $url = 'index.php?page=DetailUnit&Name=' . rawurlencode(str_replace(' ', '_', $unit['name']));
    ?>
        <a class="unit-orbit-link" href="<?= $escape($url) ?>" style="--unit-x: <?= $x ?>%; --unit-y: <?= $y ?>%; --unit-desktop-x: <?= $desktopX ?>%; --unit-desktop-y: <?= $desktopY ?>%;"
           title="<?= $escape($unit['name']) ?>" aria-label="<?= $escape($unit['name']) ?>" data-bs-toggle="tooltip">
            <img src="assets/img/Unit/<?= $escape($unit['icon']) ?>" alt="" width="48" height="48">
        </a>
    <?php endforeach; ?>
    </nav>
    <p class="unit-orbit-hint">Gerakkan kursor ke kiri atau kanan untuk mengikuti arah pandang perawat.</p>
    <p class="unit-orbit-status" role="status" hidden>Video tidak dapat dimuat. Anda tetap dapat memilih unit pelayanan.</p>
</section>
