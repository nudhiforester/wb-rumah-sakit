<?php
  // Resolve only registered pages before sending HTML or rendering navigation.
  $pages = [
    'Beranda' => '_Page/Beranda/Beranda.php',
    'Dokter' => '_Page/Dokter/Dokter.php',
    'RuangRawat' => '_Page/RuangRawat/RuangRawat.php',
    'Artikel' => '_Page/Artikel/Artikel.php',
    'Testimonial' => '_Page/Testimonial/Testimonial.php',
    'Galeri' => '_Page/Galeri/Galeri.php',
  ];
  $page = $_GET['page'] ?? 'Beranda';
  $pageFile = is_string($page) ? ($pages[$page] ?? null) : null;
  if ($pageFile === null) {
    http_response_code(404);
    $pageFile = '_Page/Error/Unknown-Page.php';
  }
?>
<!DOCTYPE html>
<html lang="id">

<?php
  include "_Partial/Head.php";
?>

<body>

<?php
  // Body Components
  include "_Partial/Preloader.php";
  include "_Partial/TopBar.php";
  include "_Partial/Navbar.php";

  // Page Routing
  include __DIR__ . '/' . $pageFile;

  // Footer & Copyright
  include "_Partial/Footer_Copyright.php";

  // Floating Button
  include "_Partial/FloatingButton.php";

?>
  
  

  
  

  <!-- ============================================
       SCRIPTS
       ============================================ -->

  <div class="modal fade" id="doctorScheduleModal" tabindex="-1" aria-labelledby="doctorScheduleTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content doctor-schedule-modal">
        <div class="modal-header">
          <h2 class="modal-title fs-5" id="doctorScheduleTitle">Jadwal Dokter</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup jadwal"></button>
        </div>
        <div class="modal-body">
          <h3 class="fs-6" id="doctorScheduleName"></h3>
          <p class="schedule-demo-note" id="doctorScheduleDemo" hidden>Contoh jadwal dummy untuk ilustrasi, bukan jadwal praktik resmi.</p>
          <p class="schedule-information" id="doctorScheduleText"></p>
          <p class="schedule-guidance" id="doctorScheduleGuidance"></p>
          <a id="doctorScheduleAction" href="https://wa.me/6285910577797" class="btn btn-elsyifa schedule-action w-100" target="_blank" rel="noopener noreferrer">
            <i class="bi bi-whatsapp" id="doctorScheduleActionIcon" aria-hidden="true"></i>
            <span id="doctorScheduleActionLabel">Konfirmasi Jadwal</span>
          </a>
          <p class="schedule-action-note">Tombol membuka WhatsApp rumah sakit. Jadwal dan nomor antrean berlaku setelah dikonfirmasi oleh petugas.</p>
        </div>
      </div>
    </div>
  </div>

  <?php
    include "_Partial/FooterJs.php";
  ?>
</body>

</html>
