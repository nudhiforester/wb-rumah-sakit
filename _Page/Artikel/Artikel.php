<?php
$articles = require __DIR__ . '/ArticleData.php';
$escapeArticle = static fn($value) => htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
?>
<!-- PAGE HEADER -->
  <section class="section-dark" style="padding: 4rem 0 3rem;">
    <div class="container text-center">
      <span class="section-subtitle">Informasi Terkini</span>
      <h1 class="section-title" style="color: #fff;">Artikel &amp; Berita</h1>
      <p class="section-desc">Informasi kesehatan terbaru dan kegiatan RSU El-Syifa Kuningan untuk masyarakat.</p>
      <nav aria-label="breadcrumb" class="mt-3">
        <ol class="breadcrumb justify-content-center" style="font-size: 0.85rem;">
          <li class="breadcrumb-item"><a href="index.php" style="color: var(--color-accent);">Beranda</a></li>
          <li class="breadcrumb-item active" style="color: rgba(255,255,255,0.6);" aria-current="page">Artikel &amp; Berita</li>
        </ol>
      </nav>
    </div>
  </section>

  <!-- ARTIKEL LIST -->
  <section class="section-padding section-warm">
    <div class="container article-browser">
      <p class="text-secondary small mb-4">Konten demo: seluruh artikel dan kegiatan di halaman ini merupakan data dummy.</p>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">Artikel Pilihan</h2>
        <div class="d-flex gap-2">
          <button type="button" class="unit-prev article-featured-prev" aria-label="Artikel pilihan sebelumnya"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
          <button type="button" class="unit-next article-featured-next" aria-label="Artikel pilihan berikutnya"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
        </div>
      </div>
      <div class="swiper article-featured-swiper mb-5" aria-label="Slider artikel pilihan">
        <div class="swiper-wrapper"></div>
        <div class="article-featured-dots text-center mt-3"></div>
      </div>
      <div class="article-tools mb-4">
        <h2 class="h4">Jelajahi Artikel</h2>
        <form id="articleSearchForm" role="search" class="d-flex gap-2 mb-4">
          <div class="flex-grow-1">
            <label for="articleSearch" class="visually-hidden">Cari artikel</label>
            <input type="search" id="articleSearch" class="form-control" placeholder="Cari judul atau topik artikel…">
          </div>
          <button type="submit" class="btn btn-elsyifa">Cari</button>
        </form>
        <h3 class="h6">Tag Artikel</h3>
        <div class="article-tags" aria-label="Filter tag artikel"></div>
      </div>
      <p id="articleResultStatus" role="status" aria-live="polite" class="small text-secondary"></p>
      <div class="row g-4" id="articlePageGrid">

        <?php foreach ($articles as $article): ?>
        <div class="col-md-6 col-lg-4 fade-in-up" data-tag="<?= $escapeArticle($article['tag']) ?>">
          <div class="card-elsyifa article-card">
            <img src="<?= $escapeArticle($article['cover']) ?>" class="card-img-top" alt="<?= $escapeArticle($article['alt']) ?>" loading="lazy">
            <div class="card-body">
              <span class="article-category"><?= $escapeArticle($article['tag']) ?></span>
              <span class="card-date"><?= $escapeArticle($article['published']) ?></span>
              <h5 class="card-title mt-2"><?= $escapeArticle($article['title']) ?></h5>
              <p class="card-text"><?= $escapeArticle($article['summary']) ?></p>
              <a href="index.php?page=DetailArtikel&amp;title=<?= rawurlencode($article['slug']) ?>" class="btn btn-elsyifa btn-sm mt-2">Baca Selengkapnya <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
      <p id="articleEmpty" class="text-center py-5" hidden>Tidak ada artikel yang cocok. Coba kata kunci atau tag lain.</p>
      <nav class="doctor-pagination" id="articlePagination" aria-label="Halaman daftar artikel" hidden>
        <button type="button" class="doctor-page-arrow" data-article-prev aria-label="Halaman sebelumnya" aria-controls="articlePageGrid"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
        <div class="doctor-page-numbers"></div>
        <button type="button" class="doctor-page-arrow" data-article-next aria-label="Halaman berikutnya" aria-controls="articlePageGrid"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
      </nav>
    </div>
  </section>
  <script src="assets/js/article-browser.js?v=5" defer></script>
