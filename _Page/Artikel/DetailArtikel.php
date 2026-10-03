<?php
$articles = require __DIR__ . '/ArticleData.php';
$requestedTitle = $_GET['title'] ?? '';
$article = null;
if (is_string($requestedTitle)) {
    foreach ($articles as $candidate) {
        if ($candidate['slug'] === $requestedTitle) {
            $article = $candidate;
            break;
        }
    }
}
$escapeArticle = static fn($value) => htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
?>
<section class="section-padding section-warm">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 col-xl-8">
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="index.php">Beranda</a></li>
            <li class="breadcrumb-item"><a href="index.php?page=Artikel">Artikel &amp; Berita</a></li>
            <li class="breadcrumb-item active" aria-current="page">Detail Artikel</li>
          </ol>
        </nav>
        <?php if ($article === null): ?>
          <h1 class="section-title">Artikel tidak ditemukan</h1>
          <p>Artikel yang Anda cari belum tersedia atau alamatnya tidak sesuai.</p>
        <?php else: ?>
          <article>
            <header>
              <p class="card-date mb-2">Tanggal publish: <?= $escapeArticle($article['published']) ?></p>
              <h1 class="section-title mb-4"><?= $escapeArticle($article['title']) ?></h1>
              <img src="<?= $escapeArticle($article['cover']) ?>"
                   alt="<?= $escapeArticle($article['alt']) ?>"
                   class="img-fluid w-100 rounded mb-4" decoding="async">
              <p class="mb-4"><span class="visually-hidden">Tag: </span><span class="article-category"><?= $escapeArticle($article['tag']) ?></span></p>
            </header>
            <div class="article-content" style="text-align: justify; font-size: 0.9375rem; line-height: 1.8;">
              <?php foreach ($article['content'] as $paragraph): ?>
                <p><?= $escapeArticle($paragraph) ?></p>
              <?php endforeach; ?>
            </div>
            <p class="small text-secondary mt-4">Konten demo: artikel ini merupakan data dummy.</p>
          </article>
        <?php endif; ?>
        <a href="index.php?page=Artikel" class="btn btn-elsyifa mt-4"><i class="bi bi-arrow-left me-1" aria-hidden="true"></i>Kembali ke Artikel</a>
      </div>
    </div>
  </div>
</section>
