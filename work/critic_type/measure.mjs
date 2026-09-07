#!/usr/bin/env node
// Dump computed type metrics for every text role on the page, at several widths.
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT = '/Users/atlas/404_jam_site';
const MIME = { '.html': 'text/html', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

const SELS = [
  ['bar mark', '.bar .mark'], ['bar nav a', '.bar nav a'],
  ['h1 hero', '.stage h1'], ['hero tagline', '.stage .tagline'], ['hero p', '.stage .row p'],
  ['hero btn', '.stage .btn'], ['play btn', '.play'],
  ['prompt lbl', '.promptwrap .lbl'], ['prompt code', '.panel code'], ['prompt slot', '.panel .slot'],
  ['prompt button', '.panel button'],
  ['stat b', '.stat b'], ['stat em', '.stat b em'], ['stat span', '.stat span'],
  ['section lab', '#what .lab'], ['h2', '#what h2'], ['p.lead', 'p.lead'], ['p.g body', '#what p.g'],
  ['gal cap', '.shotcell .cap'], ['gal cap b', '.shotcell .cap b'],
  ['step n', '.step .n'], ['step h3', '.step h3'], ['step p', '.step p'], ['step code', '.step code'],
  ['spec k', '.spec .k'], ['spec v', '.spec .v'], ['spec v code', '.spec .v code'],
  ['prize pix', '.prize .pix'], ['prize amt', '.prize .amt'], ['prize amt em', '.prize .amt em'], ['prize p', '.prize p'],
  ['tcell pix', '.tcell .pix'], ['tcell d', '.tcell .d'], ['tcell p', '.tcell p'],
  ['faq summary', '.faq summary'], ['faq p', '.faq p'],
  ['btn', '#faq .btn'], ['footer a', 'footer a'], ['footer pix', 'footer .pix.g'],
  ['judging p.pix', '#judging p.pix'],
];
const ESELS = [
  ['e h1', '#view-entries h1'], ['e lab', '#view-entries .lab'], ['e g', '#view-entries .ehead p.g'],
  ['filters lbl', '.filters .lbl'], ['chip', '.chip'],
  ['card h3', '.cbody h3'], ['card by', '.by'], ['card found', '.found'], ['found b', '.found b'],
  ['badge', '.badge'], ['cact a', '.cact a'], ['tag', '.tag'], ['empty', '.empty'],
];

const grab = new Function('sels', `return sels.map(([n,s]) => {
  const el = document.querySelector(s); if (!el) return {n, s, missing:true};
  const c = getComputedStyle(el); const r = el.getBoundingClientRect();
  return {n, s, fs:c.fontSize, fw:c.fontWeight, lh:c.lineHeight, ls:c.letterSpacing, ff:c.fontFamily.split(',')[0],
    tt:c.textTransform, color:c.color, w:Math.round(r.width), h:Math.round(r.height),
    mt:c.marginTop, mb:c.marginBottom, pt:c.paddingTop, pb:c.paddingBottom};
})`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const out = {};
for (const w of [1440, 1280, 1024, 768, 412]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  out[w] = await page.evaluate(grab, SELS);
  await page.goto(BASE + '#entries', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  out[w + '_entries'] = await page.evaluate(grab, ESELS);
  await page.close();
}
fs.writeFileSync('/Users/atlas/404_jam_site/work/critic_type/metrics.json', JSON.stringify(out, null, 1));
// pretty table
for (const k of Object.keys(out)) {
  console.log('\n===== ' + k + ' =====');
  console.log(['role', 'font', 'size', 'wt', 'lh', 'tracking', 'w', 'h'].join('\t'));
  for (const r of out[k]) {
    if (r.missing) { console.log(r.n + '\tMISSING'); continue; }
    const lhr = r.lh === 'normal' ? 'normal' : (parseFloat(r.lh) / parseFloat(r.fs)).toFixed(3);
    const lsem = r.ls === 'normal' ? '0' : (parseFloat(r.ls) / parseFloat(r.fs)).toFixed(4) + 'em';
    console.log([r.n, r.ff.replace(/"/g, ''), r.fs, r.fw, r.lh + ' (' + lhr + ')', r.ls + ' (' + lsem + ')', r.w, r.h].join('\t'));
  }
}
await browser.close();
server.close();
