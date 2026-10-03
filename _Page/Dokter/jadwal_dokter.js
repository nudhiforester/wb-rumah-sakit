(function () {
  'use strict';
  var dataPromise;
  var requestNumber = 0;
  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch('_Page/Dokter/jadwal_dokter.json', { cache: 'no-cache' })
        .then(function (response) {
          if (!response.ok) throw new Error('Jadwal gagal dimuat');
          return response.json();
        }).catch(function (error) { dataPromise = null; throw error; });
    }
    return dataPromise;
  }
  window.loadDummyDoctorSchedule = async function (trigger) {
    var currentRequest = ++requestNumber;
    var target = document.getElementById('doctorScheduleRows');
    var text = document.getElementById('doctorScheduleText');
    target.replaceChildren();
    target.hidden = true;
    text.textContent = 'Memuat jadwal dokter…';
    try {
      var data = await loadData();
      if (currentRequest !== requestNumber) return;
      var doctor = data.dokter.find(function (item) {
        return trigger.dataset.doctorId ? item.dokter_id === trigger.dataset.doctorId
          : item.nama.trim() === (trigger.dataset.doctor || '').trim();
      });
      var schedules = doctor ? data.jadwal.filter(function (item) {
        return item.dokter_id === doctor.dokter_id && item.aktif;
      }).sort(function (a, b) { return a.hari_iso - b.hari_iso || a.jam_mulai.localeCompare(b.jam_mulai); }) : [];
      document.getElementById('doctorScheduleDemo').hidden = false;
      text.textContent = schedules.length ? doctor.spesialisasi : 'Jadwal dummy dokter ini belum tersedia.';
      if (!schedules.length) return;
      var table = document.createElement('table');
      table.className = 'table table-sm align-middle';
      var caption = table.createCaption();
      caption.textContent = 'Jadwal mingguan (WIB) · kuota per hari praktik';
      var head = table.createTHead().insertRow();
      ['Hari', 'Jam', 'Ruangan', 'Kuota'].forEach(function (label) {
        var cell = document.createElement('th');
        cell.scope = 'col';
        cell.textContent = label;
        head.appendChild(cell);
      });
      var body = table.createTBody();
      schedules.forEach(function (schedule) {
        var row = body.insertRow();
        row.dataset.jadwalId = schedule.jadwal_id;
        row.dataset.dokterId = doctor.dokter_id;
        row.dataset.poliId = schedule.poli_id;
        [schedule.hari, schedule.jam_mulai + ' – ' + schedule.jam_selesai, schedule.ruangan, schedule.kuota_pasien + ' pasien'].forEach(function (value) {
          row.insertCell().textContent = value;
        });
      });
      target.appendChild(table);
      target.hidden = false;
      document.getElementById('doctorScheduleAction').dataset.dokterId = doctor.dokter_id;
      var action = document.getElementById('doctorScheduleAction');
      action.href = 'index.php?page=daftar_antrian&dokter_id=' + encodeURIComponent(doctor.dokter_id);
      action.target = '_self';
      action.classList.remove('schedule-action-whatsapp');
      document.getElementById('doctorScheduleActionIcon').className = 'bi bi-calendar-plus';
      document.getElementById('doctorScheduleActionLabel').textContent = 'Daftar Antrian';
      document.getElementById('doctorScheduleActionNote').textContent = 'Pilih jadwal dan isi data pasien pada halaman pendaftaran antrian.';
    } catch (error) {
      if (currentRequest !== requestNumber) return;
      text.textContent = 'Jadwal gagal dimuat. Tutup modal lalu coba kembali.';
    }
  };
})();
