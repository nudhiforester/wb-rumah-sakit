<!-- ============================================
    NAVBAR
    ============================================ -->
<nav class="navbar navbar-expand-lg navbar-elsyifa sticky-top" id="mainNavbar" data-server-navigation>
    <div class="container">
        <a class="navbar-brand" href="index.php">
            <img src="assets/img/Logo/logo.png" alt="Logo RSU El-Syifa Kuningan" width="42" height="42" loading="eager">
            <span class="navbar-brand-text">RSU El-Syifa<br>Kuningan</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigasi">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
            <li class="nav-item">
                <a class="nav-link<?= $page === 'Beranda' ? ' active' : '' ?>"<?= $page === 'Beranda' ? ' aria-current="page"' : '' ?> href="index.php">Beranda</a>
            </li>
            <li class="nav-item">
                <a class="nav-link<?= $page === 'Dokter' ? ' active' : '' ?>"<?= $page === 'Dokter' ? ' aria-current="page"' : '' ?> href="index.php?page=Dokter">Dokter</a>
            </li>
            <li class="nav-item">
                <a class="nav-link<?= $page === 'RuangRawat' ? ' active' : '' ?>"<?= $page === 'RuangRawat' ? ' aria-current="page"' : '' ?> href="index.php?page=RuangRawat">Ruang Rawat</a>
            </li>
            <li class="nav-item">
                <a class="nav-link<?= $page === 'Artikel' ? ' active' : '' ?>"<?= $page === 'Artikel' ? ' aria-current="page"' : '' ?> href="index.php?page=Artikel">Artikel &amp; Berita</a>
            </li>
            <li class="nav-item">
                <a class="nav-link<?= $page === 'Testimonial' ? ' active' : '' ?>"<?= $page === 'Testimonial' ? ' aria-current="page"' : '' ?> href="index.php?page=Testimonial">Testimonial</a>
            </li>
            <li class="nav-item">
                <a class="nav-link<?= $page === 'Galeri' ? ' active' : '' ?>"<?= $page === 'Galeri' ? ' aria-current="page"' : '' ?> href="index.php?page=Galeri">Galeri</a>
            </li>
            </ul>
        </div>
    </div>
</nav>
