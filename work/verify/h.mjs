import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const roots={after:'/Users/atlas/404_jam_site', before:'/Users/atlas/404_jam_site/work/verify/beforebuild'};
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
for (const [k,ROOT] of Object.entries(roots)) {
  const s=createServer((q,r)=>{let rel=decodeURIComponent(q.url.split('?')[0]);if(rel==='/')rel='/index.html';const f=path.join(ROOT,rel);
   if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end('x');}
   r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(r);});
  await new Promise(r=>s.listen(0,'127.0.0.1',r));
  const B=`http://127.0.0.1:${s.address().port}/`;
  const line=[];
  for (const W of [1440,1024,768,412]) {
    const p=await b.newPage(); await p.setViewport({width:W,height:900,deviceScaleFactor:1});
    await p.goto(B,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,700));
    const h=await p.evaluate(()=>({doc:document.documentElement.scrollHeight,
      lead:(()=>{const e=document.querySelector('p.lead');const b=e.getBoundingClientRect();return Math.round(b.width)+'x'+Math.round(b.height);})()}));
    line.push(W+': '+h.doc+'px  lead '+h.lead);
    await p.close();
  }
  console.log(k.toUpperCase().padEnd(7), line.join('   |   '));
  s.close();
}
await b.close();
