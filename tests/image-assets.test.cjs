const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { extractReferences, discover, checkLocal, checkRemote, run } = require('../scripts/check-image-assets.cjs');

test('extract img, source srcset, popup, CSS and metadata; preserve imgix commas', () => {
  const refs = extractReferences(`<!-- <img src="ignored.png"> -->
    <img src="photo.jpg" srcset="https://demo.imgix.net/a?auto=format,compress&amp;w=240 240w, https://demo.imgix.net/a?auto=format,compress&amp;w=480 480w">
    <source srcset="small.webp 1x, large.webp 2x">
    <button data-img="full.jpg"></button><div style="background-image:url('hero.png')"></div>
    <meta property="og:image" content="social.png"><link rel="icon" href="favicon.ico">
    <img src=""><img src="data:image/png;base64,AA==">
    <script>var demo='<img src="not-markup.jpg">';</script>`, '.html');
  for (const expected of ['photo.jpg', 'https://demo.imgix.net/a?auto=format,compress&w=240', 'https://demo.imgix.net/a?auto=format,compress&w=480', 'small.webp', 'large.webp', 'full.jpg', 'hero.png', 'social.png', 'favicon.ico']) assert(refs.includes(expected), expected);
  assert(!refs.some(ref => /ignored|not-markup|^data:/.test(ref)));
  assert.deepEqual(extractReferences(`@import url('https://fonts.googleapis.com/css2?family=Inter'); a{background:url('../img/a.png')} @font-face{src:url('a.woff2')}`, '.css'), ['../img/a.png']);
});

test('discover resolves relative URLs, manifest paths and deduplicates without dropping queries', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'asset-check-test-'));
  fs.mkdirSync(path.join(root, 'pages'));
  fs.mkdirSync(path.join(root, 'images'));
  fs.writeFileSync(path.join(root, 'images', 'Logo.png'), 'fixture');
  fs.writeFileSync(path.join(root, 'index.html'), '<img src="images/Logo.png"><img src="https://a.example/img?w=1"><img src="https://a.example/img?w=2">');
  fs.writeFileSync(path.join(root, 'pages/detail.html'), '<img src="../images/Logo.png"><img src="/images/Logo.png">');
  fs.writeFileSync(path.join(root, 'site.webmanifest'), JSON.stringify({ icons: [{ src: '/images/Logo.png' }] }));
  const assets = discover(root);
  assert.equal(assets.length, 3);
  assert.equal(assets.find(a => !a.remote).sources.length, 3);
  assert(checkLocal(path.join(root, 'images/Logo.png'), root).ok);
  assert.equal(checkLocal(path.join(root, 'images/logo.png'), root).ok, false);
  fs.writeFileSync(path.join(root, 'images/empty.png'), '');
  assert.equal(checkLocal(path.join(root, 'images/empty.png'), root).ok, false);
  assert.equal(checkLocal(path.resolve(root, '../outside.png'), root).ok, false);
  const result = await run({ root, localOnly: true });
  assert.equal(result.passed, 1);
  assert.equal(result.skipped, 2);
  assert.equal(result.failed, 0);
});

test('HTTP check handles redirects, failures, retries, non-image responses and timeout', async t => {
  let retries = 0;
  const server = http.createServer((req, res) => {
    if (req.url === '/timeout') return;
    if (req.url === '/redirect') { res.writeHead(302, { Location: '/image' }); res.end(); return; }
    if (req.url === '/missing') { res.writeHead(404); res.end(); return; }
    if (req.url === '/forbidden') { res.writeHead(403); res.end(); return; }
    if (req.url === '/html') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<h1>Not an image</h1>'); return; }
    if (req.url === '/retry' && ++retries === 1) { res.writeHead(503); res.end(); return; }
    if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
    res.writeHead(200, { 'Content-Type': 'image/png' }); res.end(Buffer.from([137, 80, 78, 71]));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = 'http://127.0.0.1:' + server.address().port;
  assert((await checkRemote(base + '/image')).ok);
  const redirect = await checkRemote(base + '/redirect');
  assert(redirect.ok); assert.equal(redirect.finalUrl, base + '/image');
  assert.equal((await checkRemote(base + '/missing')).status, 404);
  assert.equal((await checkRemote(base + '/forbidden')).status, 403);
  assert.equal((await checkRemote(base + '/html')).ok, false);
  const retry = await checkRemote(base + '/retry');
  assert(retry.ok); assert.equal(retry.attempts, 2);
  const timeout = await checkRemote(base + '/timeout', { timeout: 30, attempts: 1 });
  assert.equal(timeout.ok, false); assert.match(timeout.error, /Timeout/);
});
