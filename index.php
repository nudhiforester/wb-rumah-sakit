<?php
  // Resolve only registered pages before sending HTML or rendering navigation.
  $pages = [
    'Beranda' => '_Page/Beranda/Beranda.php',
    'Dokter' => '_Page/Dokter/Dokter.php',
    'RuangRawat' => '_Page/RuangRawat/RuangRawat.php',
    'Artikel' => '_Page/Artikel/Artikel.php',
    'Testimonial' => '_Page/Testimonial/Testimonial.php',
    'Galeri' => '_Page/Galeri/Galeri.php',
    'Unit' => '_Page/Unit/Unit.php',
    'DetailUnit' => '_Page/Unit/DetailUnit.php',
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

    // Modal
    include "_Partial/Modal.php";

    // Footer JS
    include "_Partial/FooterJs.php";
  ?>
</body>

</html>
