#!/usr/bin/env node
// Baseline and ink-gap probes. A zero-size inline-block appended to an element
// has its top exactly on that element's last baseline, so it reports the baseline y.
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT = '/Users/atlas/404_jam_site';
const MIME = { '.html': 'text/html', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]); if (rel === '/') rel = '/index.html';
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });

const probe = (sels) => {
  const out = [];
  const bl = (el) => {
    const s = document.createElement('span');
    s.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    el.appendChild(s);
    const y = s.getBoundingClientRect().top; s.remove(); return y;
  };
  for (const [n, sel] of sels) {
    const el = document.querySelector(sel); if (!el) { out.push({ n, missing: 1 }); continue; }
    const r = el.getBoundingClientRect();
    out.push({ n, sel, base: +bl(el).toFixed(2), top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), left: +r.left.toFixed(2), right: +r.right.toFixed(2), h: +r.height.toFixed(2) });
  }
  return out;
};

for (const w of [1440, 412]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));
  const rows = await page.evaluate(probe, [
    ['bar mark', '.bar .mark'], ['bar nav first', '.bar nav a'], ['bar nav last', '#navEntries'],
    ['stat1 b', '.stat.live b'], ['stat1 em', '.stat.live b em'], ['stat1 span', '.stat.live span'],
    ['lab what', '#what .lab'], ['h2 what', '#what h2'],
    ['lab how', '#how .lab'], ['h2 how', '#how h2'],
    ['step n', '.step .n'], ['step h3', '.step h3'], ['step p', '.step p'],
    ['prize pix', '.prize.first .pix'], ['prize amt', '.prize.first .amt'], ['prize em', '.prize.first .amt em'], ['prize p', '.prize.first p'],
    ['tcell pix', '.tcell.now .pix'], ['tcell d', '.tcell.now .d'], ['tcell p', '.tcell.now p'],
    ['spec k1', '#gate .spec .k'], ['spec v1', '#gate .spec .v'],
    ['hero tagline', '.stage .tagline'], ['hero h1', '.stage h1'], ['hero p', '.stage .row p'], ['hero btn', '.stage .btn'],
    ['faq summary', '.faq summary'], ['faq p', '.faq details[open] p'],
    ['gal cap', '.shotcell .cap'],
    ['footer mark', 'footer .mark'], ['footer a2', 'footer a[href="https://404.xyz"]'], ['footer pix', 'footer .pix.g'],
  ]);
  console.log('\n===== width ' + w + ' =====');
  for (const r of rows) console.log(JSON.stringify(r));
  // ink gap: numeral to suffix, measured on the rendered pixels of the prize cell
  await page.close();
}
await browser.close(); server.close();
