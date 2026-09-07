#!/usr/bin/env node
/**
 * Screenshot the built site for review.
 *
 *   node shot.mjs                     every default frame into shots/
 *   node shot.mjs --out=before        into shots/before/
 *   node shot.mjs --w=412 --scroll=1800 --hash=#entries --name=phone_entries
 *   node shot.mjs --sel=".panel" --name=panel        just that element
 *   node shot.mjs --full --w=1440 --name=whole       the whole page in one image
 *
 * It serves this folder the way a static host would, so media/ and the two views both work.
 * Frames default to a 1440, 1024, 768 and 412 sweep down the jam page plus the entries page.
 */
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT = path.dirname(new URL(import.meta.url).pathname);
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d; };
const OUT = path.join(ROOT, 'shots', arg('out', ''));
const MIME = { '.html': 'text/html', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2' };

const server = createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required', '--force-device-scale-factor=1'],
});

// one frame: viewport, optional hash, optional scroll in px, optional selector, optional full page
async function frame({ name, w = 1440, h = 900, dsf = 2, scroll = 0, hash = '', sel = '', full = false }) {
  const page = await browser.newPage();
  await page.setViewport({ width: +w, height: +h, deviceScaleFactor: +dsf });
  await page.goto(BASE + hash, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1400));
  if (scroll) { await page.evaluate((y) => window.scrollTo(0, y), +scroll); await new Promise((r) => setTimeout(r, 500)); }
  const file = path.join(OUT, name + '.png');
  if (sel) { const el = await page.$(sel); if (!el) throw new Error('no element for ' + sel); await el.screenshot({ path: file }); }
  else await page.screenshot({ path: file, fullPage: !!full });
  await page.close();
  console.log(file);
}

const one = arg('name', '');
if (one) {
  await frame({ name: one, w: arg('w', 1440), h: arg('h', 900), dsf: arg('dsf', 2), scroll: arg('scroll', 0), hash: arg('hash', ''), sel: arg('sel', ''), full: process.argv.includes('--full') });
} else {
  const sweep = [
    ['desk_hero', 1440, 900, 0, ''], ['desk_prompt', 1440, 900, 780, ''], ['desk_what', 1440, 900, 1350, ''],
    ['desk_how', 1440, 900, 2400, ''], ['desk_gate', 1440, 900, 3100, ''], ['desk_prizes', 1440, 900, 4200, ''],
    ['desk_dates', 1440, 900, 5000, ''], ['desk_faq', 1440, 900, 5700, ''],
    ['lap_hero', 1024, 800, 0, ''], ['lap_mid', 1024, 800, 1800, ''], ['lap_low', 1024, 800, 4200, ''],
    ['tab_hero', 768, 900, 0, ''], ['tab_mid', 768, 900, 1900, ''], ['tab_low', 768, 900, 4600, ''],
    ['phone_hero', 412, 915, 0, ''], ['phone_prompt', 412, 915, 700, ''], ['phone_mid', 412, 915, 2200, ''],
    ['phone_low', 412, 915, 5200, ''],
    ['entries_desk', 1440, 900, 0, '#entries'], ['entries_desk2', 1440, 900, 700, '#entries'],
    ['entries_phone', 412, 915, 0, '#entries'], ['entries_phone2', 412, 915, 900, '#entries'],
  ];
  for (const [name, w, h, scroll, hash] of sweep) await frame({ name, w, h, scroll, hash, dsf: 2 });
  await frame({ name: 'full_desk', w: 1440, h: 900, dsf: 1, full: true });
  await frame({ name: 'full_phone', w: 412, h: 915, dsf: 1, full: true });
}

await browser.close();
server.close();
