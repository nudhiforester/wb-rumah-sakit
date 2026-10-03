
  <script src="node_modules/jquery/dist/jquery.min.js"></script>
  <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
  <script src="node_modules/mdb-ui-kit/js/mdb.umd.min.js"></script>
  <script src="node_modules/swiper/swiper-bundle.min.js"></script>
  <script src="assets/js/units.js"></script>
  <script src="assets/js/gallery.js?v=58"></script>
  <script src="_Page/Dokter/jadwal_dokter.js?v=2"></script>
  <script src="assets/js/main.js?v=50"></script>

  <script src="assets/js/stats-nurse.js?v=58"></script>

  <?php
    if(!empty($_GET['page']) && $_GET['page'] === 'Unit') {
      echo '<script src="_Page/Unit/Unit.js?v=58"></script>';
    }
  ?>

  <!-- Preloader -->
  <script src="assets/js/preloader.js"></script>
