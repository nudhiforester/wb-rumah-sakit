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

        <div class="col-md-6 col-lg-4 fade-in-up">
          <div class="card-elsyifa article-card">
            <img src="https://6aa97c5b9422e77b387ff09b.imgix.net/Artikel/5e7fd3a1878d3dfc736bf02657989f51.jpg" class="card-img-top" alt="Tips Menjaga Kesehatan Jantung" loading="lazy">
            <div class="card-body">
              <span class="card-date">20 September 2026</span>
              <h5 class="card-title mt-2">Tips Menjaga Kesehatan Jantung di Usia Muda</h5>
              <p class="card-text">Penyakit jantung bukan hanya menyerang lansia. Kenali cara menjaga kesehatan jantung sejak dini dengan pola hidup sehat dan olahraga teratur.</p>
              <a href="#" class="btn btn-elsyifa btn-sm mt-2">Baca Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 fade-in-up">
          <div class="card-elsyifa article-card">
            <img src="https://6aa97c5b9422e77b387ff09b.imgix.net/Artikel/ee82309347da2e13c5092b4de12706eb.jpg" class="card-img-top" alt="Pentingnya Imunisasi Anak" loading="lazy">
            <div class="card-body">
              <span class="card-date">15 September 2026</span>
              <h5 class="card-title mt-2">Pentingnya Imunisasi Lengkap untuk Anak</h5>
              <p class="card-text">Imunisasi merupakan langkah penting untuk melindungi anak dari berbagai penyakit berbahaya. Ketahui jadwal imunisasi yang tepat.</p>
              <a href="#" class="btn btn-elsyifa btn-sm mt-2">Baca Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 fade-in-up">
          <div class="card-elsyifa article-card">
            <img src="https://6aa97c5b9422e77b387ff09b.imgix.net/Artikel/_DSC0495.JPG" class="card-img-top" alt="Bakti Sosial Kesehatan" loading="lazy">
            <div class="card-body">
              <span class="card-date">10 September 2026</span>
              <h5 class="card-title mt-2">RSU El-Syifa Gelar Bakti Sosial Kesehatan</h5>
              <p class="card-text">RSU El-Syifa menggelar bakti sosial pemeriksaan kesehatan gratis untuk masyarakat sekitar sebagai bentuk kepedulian terhadap kesehatan.</p>
              <a href="#" class="btn btn-elsyifa btn-sm mt-2">Baca Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 fade-in-up">
          <div class="card-elsyifa article-card">
            <img src="https://6aa97c5b9422e77b387ff09b.imgix.net/Artikel/6e1b6283f7bba9d47fed76ce8252662a.jpg" class="card-img-top" alt="Gejala Diabetes" loading="lazy">
            <div class="card-body">
              <span class="card-date">5 September 2026</span>
              <h5 class="card-title mt-2">Mengenal Gejala Diabetes dan Cara Pencegahannya</h5>
              <p class="card-text">Diabetes menjadi penyakit kronis yang terus meningkat. Kenali gejalanya dan cara pencegahan efektif untuk hidup lebih sehat.</p>
              <a href="#" class="btn btn-elsyifa btn-sm mt-2">Baca Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 fade-in-up">
          <div class="card-elsyifa article-card">
            <img src="https://silamparitv.disway.id/upload/34030eaea25fd783d3f42f92f0dc3851.jpg" class="card-img-top" alt="Pola Hidup Sehat" loading="lazy">
            <div class="card-body">
              <span class="card-date">1 September 2026</span>
              <h5 class="card-title mt-2">5 Kebiasaan Pola Hidup Sehat yang Mudah Diterapkan</h5>
              <p class="card-text">Menjaga kesehatan tidak harus sulit. Berikut 5 kebiasaan sederhana yang bisa Anda lakukan setiap hari untuk tubuh yang lebih sehat.</p>
              <a href="#" class="btn btn-elsyifa btn-sm mt-2">Baca Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 fade-in-up">
          <div class="card-elsyifa article-card">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqzwCUYSEfrbdoJLqw1iIZgAE8kLo713CrppgXiVExT28Xqeyok96Xs5Y&s=10" class="card-img-top" alt="Seminar Kesehatan" loading="lazy">
            <div class="card-body">
              <span class="card-date">28 Agustus 2026</span>
              <h5 class="card-title mt-2">RSU El-Syifa Adakan Seminar Kesehatan Masyarakat</h5>
              <p class="card-text">Dalam rangka meningkatkan kesadaran kesehatan, RSU El-Syifa mengadakan seminar terbuka untuk masyarakat umum.</p>
              <a href="#" class="btn btn-elsyifa btn-sm mt-2">Baca Selengkapnya <i class="bi bi-arrow-right ms-1"></i></a>
            </div>
          </div>
        </div>

      </div>
      <p id="articleEmpty" class="text-center py-5" hidden>Tidak ada artikel yang cocok. Coba kata kunci atau tag lain.</p>
      <nav class="doctor-pagination" id="articlePagination" aria-label="Halaman daftar artikel" hidden>
        <button type="button" class="doctor-page-arrow" data-article-prev aria-label="Halaman sebelumnya" aria-controls="articlePageGrid"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
        <div class="doctor-page-numbers"></div>
        <button type="button" class="doctor-page-arrow" data-article-next aria-label="Halaman berikutnya" aria-controls="articlePageGrid"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
      </nav>
    </div>
  </section>
  <div class="modal fade" id="articleDemoModal" tabindex="-1" aria-labelledby="articleDemoTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="articleDemoTitle"></h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup artikel"></button>
        </div>
        <div class="modal-body"><p class="small text-secondary">Artikel dummy untuk demonstrasi tampilan.</p><p id="articleDemoText"></p></div>
      </div>
    </div>
  </div>
  <script src="assets/js/article-browser.js?v=2" defer></script>
