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
const slugs = new Set();
for (const unit of units) {
  if (!/^[a-z0-9-]+$/.test(unit.slug) || slugs.has(unit.slug)) throw new Error('Invalid or duplicate slug');
  slugs.add(unit.slug);
  localAsset('assets/img/Unit/' + unit.icon);
  for (const person of unit.personnel) if (person.photo) localAsset(person.photo);
  for (const photo of unit.photos) localAsset(photo.src);
}
const shell = fs.readFileSync(path.join(root, 'ketentuan-pengguna.html'), 'utf8');
const relativeLinks = html => html.replace(/(href|src)="(?!https?:|mailto:|tel:|#)([^"]+)"/g, '$1="../$2"');
const header = relativeLinks(shell.slice(0, shell.indexOf('  <main')));
const footer = relativeLinks(shell.match(/<footer\b[\s\S]*?<\/footer>/)[0]);
const scripts = relativeLinks(shell.slice(shell.indexOf('  <script src="node_modules/jquery')));
fs.mkdirSync(path.join(root, 'unit'), {recursive:true});
for (const unit of units) {
  const personnel = unit.personnel.length ? `<div class="unit-personnel-grid">${unit.personnel.map(person => `<article class="unit-personnel-card">${person.photo ? `<img src="../${localAsset(person.photo)}" alt="${escape(person.name)}" loading="lazy" width="72" height="72">` : ''}<h3>${escape(person.name)}</h3><p>${escape(person.role)}</p></article>`).join('')}</div>` : '<p class="unit-empty">Informasi personel unit belum tersedia. Silakan hubungi rumah sakit untuk informasi lebih lanjut.</p>';
  const photos = unit.photos.length ? `<div class="unit-photo-grid">${unit.photos.map(photo => `<figure><a href="../${localAsset(photo.src)}" target="_blank" rel="noopener noreferrer"><img src="../${localAsset(photo.src)}" alt="${escape(photo.alt)}" loading="lazy"></a>${photo.caption ? `<figcaption>${escape(photo.caption)}</figcaption>` : ''}</figure>`).join('')}</div>` : '<p class="unit-empty">Dokumentasi foto unit belum tersedia.</p>';
  const pageHeader = header.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(unit.name)} - RSU El-Syifa Kuningan</title>`).replace(/(<meta name="description"\s+content=")[^"]+/, '$1' + escape(unit.summary));
  const main = `  <main class="section-padding section-warm">
    <div class="container unit-detail-container">
      <nav aria-label="Breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="../index.html">Beranda</a></li><li class="breadcrumb-item"><a href="../index.html#unit-instalasi">Unit &amp; Instalasi</a></li><li class="breadcrumb-item active" aria-current="page">${escape(unit.name)}</li></ol></nav>
      <header class="unit-detail-header">
        <div class="unit-icon"><img src="../${localAsset('assets/img/Unit/' + unit.icon)}" alt="" width="64" height="64"></div>
        <div><span class="unit-category">${escape(unit.category)}</span><h1>${escape(unit.name)}</h1><p>${escape(unit.summary)}</p></div>
      </header>
      <div class="unit-detail-layout">
        <div>
          <section class="unit-detail-panel" aria-labelledby="about-unit"><h2 id="about-unit">Tentang Unit</h2><p>${escape(unit.description)}</p><h3>Lingkup kegiatan</h3><ul>${unit.scope.map(item => `<li>${escape(item)}</li>`).join('')}</ul></section>
          <section class="unit-detail-panel" aria-labelledby="unit-personnel"><h2 id="unit-personnel">Personel</h2>${personnel}</section>
          <section class="unit-detail-panel" aria-labelledby="unit-photos"><h2 id="unit-photos">Foto Unit &amp; Instalasi</h2>${photos}</section>
        </div>
        <aside class="unit-detail-panel unit-contact-panel"><h2>Informasi Unit</h2><p>Hubungi rumah sakit untuk informasi alur pelayanan, jadwal, dan kebutuhan administrasi unit.</p><a class="btn btn-elsyifa" href="tel:+62232876240">Hubungi Rumah Sakit</a><a class="unit-back-link" href="../index.html#unit-instalasi">Lihat seluruh unit &amp; instalasi</a></aside>
      </div>
    </div>
  </main>`;
  fs.writeFileSync(path.join(root, 'unit', unit.slug + '.html'), pageHeader + main + '\n' + footer + '\n' + scripts);
}
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
