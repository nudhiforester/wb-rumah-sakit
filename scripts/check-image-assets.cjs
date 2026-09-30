const fs = require('node:fs');
const path = require('node:path');

const imageExtension = /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)(?:[?#]|$)/i;
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)));

function extractReferences(text, extension) {
  const refs = [];
  const add = value => { if (value && !/^(?:data:|blob:|#)/i.test(value)) refs.push(decode(value.trim())); };
  if (extension === '.html') {
    text = text.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[\s\S]*?<\/script>/gi, '');
    for (const tag of text.matchAll(/<([\w-]+)\b([^>]+)>/g)) {
      const attrs = Object.fromEntries([...tag[2].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m => [m[1].toLowerCase(), m[2] ?? m[3]]));
      if (tag[1].toLowerCase() === 'img' || (tag[1].toLowerCase() === 'input' && attrs.type === 'image')) add(attrs.src);
      if (['img', 'source'].includes(tag[1].toLowerCase()) && attrs.srcset) {
        // Width/density descriptors delimit URLs; commas inside imgix queries are retained.
        for (const item of attrs.srcset.matchAll(/([^\s]+)\s+(?:\d+w|[\d.]+x)(?:\s*,\s*|$)/g)) add(item[1]);
      }
      add(attrs['data-img']);
      if (tag[1].toLowerCase() === 'link' && /icon/i.test(attrs.rel || '')) add(attrs.href);
      if (tag[1].toLowerCase() === 'meta' && /^(?:og:image|twitter:image)(?::url)?$/.test(attrs.property || attrs.name || '')) add(attrs.content);
    }
  }
  for (const match of text.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/gi)) {
    const value = match[1] || match[2] || match[3];
    if (imageExtension.test(value) || /\.imgix\.net\//i.test(value)) add(value);
  }
  return refs;
}

function discover(root) {
  const assets = new Map();
  function add(reference, source, relativeTo = source) {
    if (!reference || /^(?:data:|blob:|#)/i.test(reference)) return;
    let target;
    if (/^(?:https?:)?\/\//i.test(reference)) {
      const url = new URL(reference.startsWith('//') ? 'https:' + reference : reference);
      url.hash = '';
      target = url.href;
    } else {
      const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
      target = path.resolve(reference.startsWith('/') ? root : path.dirname(path.join(root, relativeTo)), '.' + (reference.startsWith('/') ? clean : path.sep + clean));
    }
    const key = target;
    if (!assets.has(key)) assets.set(key, { target, remote: /^https?:\/\//i.test(target), sources: [] });
    if (!assets.get(key).sources.includes(source)) assets.get(key).sources.push(source);
  }
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || ['node_modules', 'reports', 'tests'].includes(entry.name) || entry.isSymbolicLink()) continue;
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      const ext = path.extname(entry.name).toLowerCase();
      const source = path.relative(root, full).replaceAll(path.sep, '/');
      if (['.html', '.css'].includes(ext)) {
        for (const ref of extractReferences(fs.readFileSync(full, 'utf8'), ext)) add(ref, source);
      }
      if (ext === '.webmanifest') {
        const manifest = JSON.parse(fs.readFileSync(full, 'utf8'));
        for (const icon of manifest.icons || []) add(icon.src, source);
      }
    }
  }
  walk(root);
  const unitData = path.join(root, 'assets/data/units.json');
  if (fs.existsSync(unitData)) for (const unit of JSON.parse(fs.readFileSync(unitData, 'utf8'))) {
    const source = 'assets/data/units.json';
    add('assets/img/Unit/' + unit.icon, source, 'index.html');
    for (const person of unit.personnel || []) if (person.photo) add(person.photo, source, 'index.html');
    for (const photo of unit.photos || []) add(photo.src, source, 'index.html');
  }
  return [...assets.values()];
}

function checkLocal(target, root) {
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return { ok: false, error: 'Path berada di luar root proyek' };
  let current = root;
  try {
    for (const part of relative.split(path.sep)) {
      if (!fs.readdirSync(current).includes(part)) return { ok: false, error: 'File tidak ditemukan atau kapitalisasi path tidak sesuai' };
      current = path.join(current, part);
    }
    const stat = fs.statSync(current);
    return stat.isFile() && stat.size > 0 ? { ok: true } : { ok: false, error: 'Bukan file gambar atau file kosong' };
  } catch (error) { return { ok: false, error: error.message }; }
}

async function checkRemote(url, { timeout = 10000, attempts = 2 } = {}) {
  let result;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      // GET supports servers that reject HEAD. Cancel the body after reading headers.
      const response = await fetch(url, { signal: AbortSignal.timeout(timeout), redirect: 'follow', headers: { Accept: 'image/avif,image/webp,image/*;q=0.9', 'User-Agent': 'ImageAssetCheck/1.0' } });
      const type = response.headers.get('content-type') || '';
      await response.body?.cancel();
      result = { ok: response.ok && /^image\//i.test(type), status: response.status, contentType: type, finalUrl: response.url, attempts: attempt };
      if (!result.ok) result.error = response.ok ? 'Respons bukan gambar (Content-Type)' : 'HTTP ' + response.status;
      if (result.ok || (response.status !== 429 && response.status < 500)) return result;
    } catch (error) { result = { ok: false, attempts: attempt, error: error.name + ': ' + error.message + (error.cause?.code ? ' (' + error.cause.code + ')' : '') }; }
    if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, 300 * attempt));
  }
  return result;
}

async function run({ root = path.resolve(__dirname, '..'), localOnly = false, concurrency = 6, timeout = 10000, attempts = 2 } = {}) {
  const assets = discover(root);
  const results = new Array(assets.length);
  let next = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (next < assets.length) {
      const index = next++;
      const asset = assets[index];
      const outcome = asset.remote ? (localOnly ? { skipped: true } : await checkRemote(asset.target, { timeout, attempts })) : checkLocal(asset.target, root);
      results[index] = { ...asset, target: asset.remote ? asset.target : path.relative(root, asset.target).replaceAll(path.sep, '/'), ...outcome };
    }
  }));
  return { checkedAt: new Date().toISOString(), total: results.length, passed: results.filter(r => r.ok).length, failed: results.filter(r => !r.ok && !r.skipped).length, skipped: results.filter(r => r.skipped).length, results };
}

async function cli() {
  const args = process.argv.slice(2);
  const report = await run({ localOnly: args.includes('--local-only') });
  const output = path.resolve('reports');
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'image-assets.json'), JSON.stringify(report, null, 2));
  const failures = report.results.filter(r => !r.ok && !r.skipped);
  const summary = `# Pemeriksaan aset gambar\n\nTotal: ${report.total}; lolos: ${report.passed}; gagal: ${report.failed}; dilewati: ${report.skipped}.\n\n` + failures.map(r => `- ${r.target.replace(/[<>]/g, '')}\n  - ${r.error}\n  - Sumber: ${r.sources.join(', ')}`).join('\n');
  fs.writeFileSync(path.join(output, 'image-assets.md'), summary);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  console.log(summary);
  console.log('\nLaporan: reports/image-assets.json dan reports/image-assets.md');
  if (report.failed || !report.total) process.exitCode = 1;
}
if (require.main === module) cli().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { extractReferences, discover, checkLocal, checkRemote, run };
