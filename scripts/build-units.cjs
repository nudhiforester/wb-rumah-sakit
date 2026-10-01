// Generate static unit pages and the home-page cards from a single data source.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const units = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/units.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localAsset = value => {
  if (!/^assets\/[a-zA-Z0-9_./ ()-]+$/.test(value) || value.split('/').includes('..')) throw new Error('Invalid asset: ' + value);
  if (!fs.existsSync(path.join(root, value))) throw new Error('Missing asset: ' + value);
  return escape(value);
};
const imageAsset = (value, options = {}) => {
  if (!/^https:\/\//i.test(value)) return '../' + localAsset(value);
  const url = new URL(value);
  if (url.hostname.endsWith('.imgix.net')) {
    url.searchParams.set('auto', 'format,compress');
    url.searchParams.set('q', '80');
    for (const [key, val] of Object.entries(options)) url.searchParams.set(key, val);
    if (options.fit === 'max') { url.searchParams.delete('ar'); url.searchParams.delete('h'); }
  }
  return escape(url.href);
};
const selectedSlug = process.argv.find(arg => arg.startsWith('--unit='))?.slice(7);
if (selectedSlug && !units.some(unit => unit.slug === selectedSlug)) throw new Error('Unknown unit: ' + selectedSlug);
const slugs = new Set();
for (const unit of units) {
  if (!/^[a-z0-9-]+$/.test(unit.slug) || slugs.has(unit.slug)) throw new Error('Invalid or duplicate slug');
  slugs.add(unit.slug);
  localAsset('assets/img/Unit/' + unit.icon);
  if (unit.teamPhoto) imageAsset(unit.teamPhoto.src);
  for (const person of unit.personnel) if (person.photo) imageAsset(person.photo);
  for (const photo of unit.photos) imageAsset(photo.src);
}
const shell = fs.readFileSync(path.join(root, 'ketentuan-pengguna.html'), 'utf8');
const relativeLinks = html => html.replace(/(href|src)="(?!https?:|mailto:|tel:|#)([^"]+)"/g, '$1="../$2"');
const header = relativeLinks(shell.slice(0, shell.indexOf('  <main')));
const footer = relativeLinks(shell.match(/<footer\b[\s\S]*?<\/footer>/)[0]);
const scripts = relativeLinks(shell.slice(shell.indexOf('  <script src="node_modules/jquery')));
fs.mkdirSync(path.join(root, 'unit'), {recursive:true});
for (const unit of units) {
  if (selectedSlug && unit.slug !== selectedSlug) continue;
  const photoButton = (src, alt, imageClass, options, width, height, eager = false) => `<button type="button" class="unit-photo-trigger ${imageClass}" data-bs-toggle="modal" data-bs-target="#lightboxModal" data-img="${imageAsset(src, { w: 1600, fit: 'max' })}" aria-label="Perbesar foto: ${escape(alt)}" aria-haspopup="dialog"><img src="${imageAsset(src, options)}" alt="${escape(alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" width="${width}" height="${height}"></button>`;
  const team = unit.teamPhoto ? `<figure class="unit-team-photo">${photoButton(unit.teamPhoto.src, unit.teamPhoto.alt, 'unit-team-trigger', { w: 1200, ar: '16:9', fit: 'crop' }, 1200, 675, true)}<figcaption>Tim ${escape(unit.name)}</figcaption></figure>` : '';
  const personnel = unit.personnel.length ? `${unit.personnelDummy ? '<p class="unit-dummy-note">Nama personel berikut merupakan data dummy untuk contoh tampilan.</p>' : ''}<ul class="list-group list-group-flush unit-personnel-list">${unit.personnel.map(person => `<li class="list-group-item">${person.photo ? photoButton(person.photo, person.name, 'unit-personnel-photo', { w: 144, h: 144, fit: 'crop' }, 72, 72) : ''}<div><h3>${escape(person.name)}</h3>${person.role ? `<p>${escape(person.role)}</p>` : ''}</div></li>`).join('')}</ul>` : '<p class="unit-empty">Informasi personel unit belum tersedia. Silakan hubungi rumah sakit untuk informasi lebih lanjut.</p>';
  const photos = unit.photos.length ? `<div class="swiper unit-photo-swiper" aria-label="Foto unit dan instalasi"><div class="swiper-wrapper unit-photo-grid">${unit.photos.map(photo => `<figure>${photoButton(photo.src, photo.alt, 'unit-gallery-photo', { w: 640, h: 640, fit: 'crop' }, 640, 640)}${photo.caption ? `<figcaption>${escape(photo.caption)}</figcaption>` : ''}</figure>`).join('')}</div></div><div class="unit-pagination-controls" hidden><button type="button" class="unit-prev" aria-label="Halaman foto sebelumnya"><i class="bi bi-chevron-left" aria-hidden="true"></i></button><div class="unit-pagination"></div><button type="button" class="unit-next" aria-label="Halaman foto berikutnya"><i class="bi bi-chevron-right" aria-hidden="true"></i></button><span class="unit-page-status" aria-live="polite" aria-atomic="true"></span></div>` : '<p class="unit-empty">Dokumentasi foto unit belum tersedia.</p>';
  const modal = unit.teamPhoto || unit.personnel.some(person => person.photo) || unit.photos.length ? `<div class="modal fade lightbox-modal" id="lightboxModal" tabindex="-1" aria-label="Detail foto unit" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-body"><div class="lightbox-frame"><img src="" alt="" id="lightboxImage" class="img-fluid"><button type="button" class="lightbox-close" data-bs-dismiss="modal" aria-label="Tutup foto"><span aria-hidden="true">&times;</span></button></div></div></div></div></div>` : '';
  const pageHeader = header.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(unit.name)} - RSU El-Syifa Kuningan</title>`).replace(/(<meta name="description"\s+content=")[^"]+/, '$1' + escape(unit.summary));
  const main = `  <main class="section-padding section-warm">
    <div class="container unit-detail-container">
      <nav aria-label="Breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="../index.html">Beranda</a></li><li class="breadcrumb-item"><a href="../index.html#unit-instalasi">Unit &amp; Instalasi</a></li><li class="breadcrumb-item active" aria-current="page">${escape(unit.name)}</li></ol></nav>
      <header class="unit-detail-header">
        <div class="unit-icon"><img src="../${localAsset('assets/img/Unit/' + unit.icon)}" alt="" width="64" height="64"></div>
        <div><span class="unit-category">${escape(unit.category)}</span><h1>${escape(unit.name)}</h1><p>${escape(unit.summary)}</p></div>
      </header>
      <div class="unit-detail-layout${unit.showUnitInfo === false ? ' unit-detail-layout-full' : ''}">
        <div>
          ${team}
          <section class="unit-detail-panel" aria-labelledby="about-unit"><h2 id="about-unit">Tentang Unit</h2><p>${escape(unit.description)}</p><h3>Lingkup kegiatan</h3><ul>${unit.scope.map(item => `<li>${escape(item)}</li>`).join('')}</ul></section>
          <section class="unit-detail-panel" aria-labelledby="unit-personnel"><h2 id="unit-personnel">Personel</h2>${personnel}</section>
          <section class="unit-detail-panel" aria-labelledby="unit-photos"><h2 id="unit-photos">Foto Unit &amp; Instalasi</h2>${photos}</section>
        </div>
${unit.showUnitInfo === false ? '' : '        <aside class="unit-detail-panel unit-contact-panel"><h2>Informasi Unit</h2><p>Hubungi rumah sakit untuk informasi alur pelayanan, jadwal, dan kebutuhan administrasi unit.</p><a class="btn btn-elsyifa" href="tel:+62232876240">Hubungi Rumah Sakit</a><a class="unit-back-link" href="../index.html#unit-instalasi">Lihat seluruh unit &amp; instalasi</a></aside>'}
      </div>
    </div>
  </main>`;
  fs.writeFileSync(path.join(root, 'unit', unit.slug + '.html'), pageHeader.replace('</head>', unit.photos.length ? '<link rel="stylesheet" href="../node_modules/swiper/swiper-bundle.min.css"></head>' : '</head>') + main + '\n' + modal + '\n' + footer + '\n' + scripts.replace('</body>', unit.photos.length ? '<script src="../node_modules/swiper/swiper-bundle.min.js"></script><script src="../assets/js/unit-photos.js"></script></body>' : '</body>'));
}
if (selectedSlug) { console.log('Generated unit/' + selectedSlug + '.html'); process.exit(0); }
const cards = units.map(unit => `<a class="unit-card" href="unit/${unit.slug}.html"><span class="unit-icon"><img src="${localAsset('assets/img/Unit/' + unit.icon)}" alt="" width="48" height="48" loading="lazy"></span><div class="unit-card-content"><span class="unit-category">${escape(unit.category)}</span><h3>${escape(unit.name)}</h3><span class="unit-summary">${escape(unit.summary)}</span><span class="unit-detail-link">Lihat detail <i class="bi bi-arrow-right" aria-hidden="true"></i></span></div></a>`);
// Ungrouped cards are the accessible no-JavaScript fallback; units.js groups them into pages.
const section = `  <section class="section-padding section-cool" id="unit-instalasi">
    <div class="container">
      <div class="section-header fade-in-up"><span class="section-subtitle">Unit &amp; Instalasi</span><h2 class="section-title">Penunjang Medis &amp; Non Medis</h2><p class="section-desc">Kenali unit pelayanan dan penunjang operasional RSU El-Syifa Kuningan. Pilih unit untuk melihat penjelasan, personel, dan dokumentasinya.</p></div>
      <div class="swiper unit-swiper" aria-label="Daftar unit dan instalasi"><div class="swiper-wrapper unit-page-grid">
        ${cards.join('\n        ')}
      </div></div>
      <div class="unit-pagination-controls" hidden>
        <button type="button" class="unit-prev" aria-label="Halaman unit sebelumnya"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
        <div class="unit-pagination"></div>
        <button type="button" class="unit-next" aria-label="Halaman unit berikutnya"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
        <span class="unit-page-status" aria-live="polite" aria-atomic="true"></span>
      </div>
    </div>
  </section>`;
const indexPath = path.join(root, 'index.html');
let index = fs.readFileSync(indexPath, 'utf8');
if (!/<section[^>]*id="unit-instalasi"/.test(index)) throw new Error('Unit section missing');
index = index.replace(/  <section[^>]*id="unit-instalasi"[\s\S]*?<\/section>/, section);
if (!index.includes('src="assets/js/units.js"')) index = index.replace('  <script src="assets/js/main.js">', '  <script src="assets/js/units.js"></script>\n  <script src="assets/js/main.js">');
fs.writeFileSync(indexPath, index);
console.log('Generated ' + units.length + ' unit pages and home-page cards.');
