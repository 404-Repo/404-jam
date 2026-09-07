import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
const s=createServer((q,r)=>{let rel=decodeURIComponent(q.url.split('?')[0]);if(rel==='/')rel='/index.html';const f=path.join(ROOT,rel);
 if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end('x');}
 r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(r);});
await new Promise(r=>s.listen(0,'127.0.0.1',r));
const B=`http://127.0.0.1:${s.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--force-device-scale-factor=1']});
const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2});
await p.goto(B,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,900));
for (const y of [0,25,300,700,1500]) {
  await p.evaluate(v=>window.scrollTo(0,v), y); await new Promise(r=>setTimeout(r,450));
  const st = await p.evaluate(()=>{const bar=document.getElementById('bar');const cs=getComputedStyle(bar);
    return {cls:bar.className, bg:cs.backgroundColor, scrollY:Math.round(window.scrollY), linkColor:getComputedStyle(bar.querySelector('nav a')).color};});
  console.log(y, JSON.stringify(st));
  await p.screenshot({path:`${ROOT}/work/verify/focus/bar_at_${y}.png`,clip:{x:0,y:0,width:1440,height:60}});
}
await b.close(); s.close();
