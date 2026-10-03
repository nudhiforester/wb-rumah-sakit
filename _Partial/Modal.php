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
          <div class="table-responsive" id="doctorScheduleRows" hidden></div>
          <p class="schedule-guidance" id="doctorScheduleGuidance"></p>
          <a id="doctorScheduleAction" href="https://wa.me/6285910577797" class="btn btn-elsyifa schedule-action w-100" target="_blank" rel="noopener noreferrer">
            <i class="bi bi-whatsapp" id="doctorScheduleActionIcon" aria-hidden="true"></i>
            <span id="doctorScheduleActionLabel">Konfirmasi Jadwal</span>
          </a>
          <p class="schedule-action-note" id="doctorScheduleActionNote">Tombol membuka WhatsApp rumah sakit untuk konfirmasi jadwal.</p>
        </div>
      </div>
    </div>
  </div>
