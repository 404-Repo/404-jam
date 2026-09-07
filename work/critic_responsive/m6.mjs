import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
const server=createServer((req,res)=>{let rel=decodeURIComponent(req.url.split('?')[0]); if(rel==='/')rel='/index.html';
 const f=path.join(ROOT,rel); if(!fs.existsSync(f)){res.writeHead(404);return res.end('x');}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
for(const w of [880,900,1000,1024,1200,1440,768]){
 const p=await b.newPage(); await p.setViewport({width:w,height:900,deviceScaleFactor:1});
 await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,600));
 const r=await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('section h2').forEach(h=>{
    const col=h.parentElement.getBoundingClientRect().width;
    const rng=document.createRange(); const lines=[];
    for(const n of h.childNodes){ if(n.nodeType===3&&n.textContent.trim()){rng.selectNodeContents(n);lines.push(+rng.getBoundingClientRect().width.toFixed(0));}}
    out.push({t:h.textContent.trim().slice(0,18),col:+col.toFixed(0),max:Math.max(...lines),fs:getComputedStyle(h).fontSize});
  });
  const sv=document.querySelector('#gate .spec .v');
  return {h2:out, specV:+sv.getBoundingClientRect().width.toFixed(0), lead:+document.querySelector('p.lead').getBoundingClientRect().width.toFixed(0)};
 });
 console.log('=== '+w,'specV',r.specV,'lead',r.lead);
 r.h2.forEach(o=>console.log('   ',JSON.stringify(o)));
 await p.close();
}
await b.close(); server.close();
