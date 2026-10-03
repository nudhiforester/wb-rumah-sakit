(function () {
  'use strict';
  var modal = document.getElementById('roomBedsModal');
  if (!modal) return;
  var request = 0;
  var statuses = {
    tersedia: ['Tersedia', 'text-bg-success'],
    terisi: ['Terisi', 'text-bg-danger'],
    pemeliharaan: ['Dalam pemeliharaan', 'text-bg-warning'],
    belum_dikonfirmasi: ['Belum dikonfirmasi', 'text-bg-secondary']
  };
  modal.addEventListener('hidden.bs.modal', function () { request++; });
  modal.addEventListener('show.bs.modal', async function (event) {
    var card = event.relatedTarget && event.relatedTarget.closest('.room-card');
    if (!card) return;
    var current = ++request;
    var name = card.querySelector('.card-title').textContent.trim();
    document.getElementById('roomBedsName').textContent = name;
    document.getElementById('roomBedsDescription').textContent = card.querySelector('.card-text').textContent.trim();
    var image = document.getElementById('roomBedsImage');
    image.src = card.querySelector('.room-photo img').src;
    image.alt = 'Foto ' + name;
    image.hidden = false;
    var facilities = document.getElementById('roomBedsFacilities');
    facilities.replaceChildren();
    card.querySelectorAll('.card-body li').forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item.textContent.trim();
      facilities.appendChild(li);
    });
    var table = document.getElementById('roomBedsTable');
    var rows = document.getElementById('roomBedsRows');
    var message = document.getElementById('roomBedsMessage');
    var notice = document.getElementById('roomBedsNotice');
    rows.replaceChildren();
    table.hidden = true;
    message.hidden = false;
    message.textContent = 'Memuat status tempat tidur…';
    notice.textContent = '';
    try {
      var response = await fetch('_Page/RuangRawat/tempat_tidur.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Data gagal dimuat');
      var data = await response.json();
      if (current !== request) return;
      notice.textContent = data.catatan || 'Konfirmasikan ketersediaan tempat tidur kepada petugas rumah sakit.';
      var room = data.ruangan && data.ruangan[name];
      if (!room || !Array.isArray(room.tempat_tidur) || !room.tempat_tidur.length) {
        message.textContent = 'Data jumlah dan status tempat tidur ruangan ini belum tersedia. Silakan hubungi petugas rumah sakit.';
        return;
      }
      room.tempat_tidur.forEach(function (bed, index) {
        var status = statuses[bed.status] || statuses.belum_dikonfirmasi;
        var row = document.createElement('tr');
        var label = document.createElement('th');
        label.scope = 'row';
        label.textContent = bed.kode || 'Tempat tidur ' + (index + 1);
        var cell = document.createElement('td');
        var badge = document.createElement('span');
        badge.className = 'badge ' + status[1];
        badge.textContent = status[0];
        cell.appendChild(badge);
        row.append(label, cell);
        rows.appendChild(row);
      });
      message.hidden = true;
      table.hidden = false;
    } catch (error) {
      if (current !== request) return;
      message.textContent = 'Status tempat tidur gagal dimuat. Tutup modal lalu coba kembali.';
    }
  });
})();
