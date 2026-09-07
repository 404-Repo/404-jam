import { createServer } from 'http';
import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT = '/Users/atlas/404_jam_site';
const MIME = { '.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2' };
const server = createServer((req,res)=>{ let rel=decodeURIComponent(req.url.split('?')[0]); if(rel==='/')rel='/index.html';
  const f=path.join(ROOT,rel); if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}
  res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(res); });
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const W = +(process.argv[2]||1440), HASH = process.argv[3]||'';
const page = await browser.newPage();
await page.setViewport({width:W,height:900,deviceScaleFactor:1});
await page.goto(BASE+HASH,{waitUntil:'networkidle2'});
await new Promise(r=>setTimeout(r,1200));
const out = await page.evaluate(()=>{
  const rows=[];
  const sel = [
    '.stage','.promptwrap','.promptwrap .lbl','.beamwrap','.panel','.panel .inner','.stats','.stat',
    '#what','#what .wrap','#what .lab','#what h2','#what .lead','#what p.g','.gal','.gal .shotcell:first-child',
    '#how','#how .wrap','#how .lab','#how h2','.steps','.step:first-child','.step:first-child h3','.step:first-child p',
    '#gate','#gate .wrap','#gate .lab','#gate h2','#gate p.g','#gate .spec','#gate .spec>div:first-child',
    '#rules','#rules .wrap','#rules .lab','#rules h2',
    '#judging','#judging .wrap','#judging .lab','#judging h2','#judging .pix',
    '#prizes','#prizes .wrap:first-child','#prizes .lab','#prizes h2','.prizes','.prize:first-child','#prizes .wrap:last-child','#prizes .spec',
    '#dates','#dates .wrap','#dates .lab','#dates h2','.time','.tcell:first-child',
    '#faq','#faq .wrap','#faq .lab','.faq','.faq details:first-of-type','#faq .btns','footer','footer .wrap'
  ];
  for(const s of sel){
    const e=document.querySelector(s); if(!e){rows.push({s,miss:true});continue;}
    const r=e.getBoundingClientRect(); const c=getComputedStyle(e);
    rows.push({s, top:+(r.top+scrollY).toFixed(1), bot:+(r.bottom+scrollY).toFixed(1), h:+r.height.toFixed(1),
      left:+r.left.toFixed(1), w:+r.width.toFixed(1),
      pt:c.paddingTop, pb:c.paddingBottom, mt:c.marginTop, mb:c.marginBottom,
      bt:c.borderTopWidth, bb:c.borderBottomWidth, fs:c.fontSize, lh:c.lineHeight});
  }
  return {rows, docH: document.documentElement.scrollHeight};
});
console.log(JSON.stringify(out,null,1));
await browser.close(); server.close();
