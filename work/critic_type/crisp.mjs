#!/usr/bin/env node
// How crisp is the pixel face at each size actually used on the page?
// Renders the same string at 8..20 px, black on white, and counts the share of
// glyph pixels that land as intermediate grey (an antialiased edge) rather than solid ink.
import fs from 'fs';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const fonts = fs.readFileSync('/Users/atlas/404_jam_site/fonts.css', 'utf8');
const SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 20];
const html = `<!doctype html><meta charset=utf8><style>${fonts}
body{margin:0;background:#fff}
div{font-family:fourzerofourpixel;color:#000;text-transform:uppercase;letter-spacing:.06em;
 background:#fff;padding:6px 8px;white-space:nowrap}
</style>` + SIZES.map(s => `<div id="s${s}" style="font-size:${s}px">PRIZES GATE 0123</div>`).join('');
fs.writeFileSync('/Users/atlas/404_jam_site/work/critic_type/crisp.html', html);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
for (const dsf of [1, 2]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 700, height: 900, deviceScaleFactor: dsf });
  await page.goto('file:///Users/atlas/404_jam_site/work/critic_type/crisp.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  console.log('\n--- deviceScaleFactor ' + dsf + ' ---');
  console.log('size\tinkpx\tsolid\tgrey\tgrey%');
  for (const s of SIZES) {
    const el = await page.$('#s' + s);
    const p = `/Users/atlas/404_jam_site/work/critic_type/crisp_${dsf}x_${s}.png`;
    await el.screenshot({ path: p });
  }
  await page.close();
}
await browser.close();
