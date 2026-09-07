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
for(const w of [1440,768,412]){
 const p=await b.newPage(); await p.setViewport({width:w,height:900,deviceScaleFactor:1});
 await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,700));
 const r=await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('section, .stats, .promptwrap').forEach(s=>{
    const sb=s.getBoundingClientRect().bottom;
    let best=null;
    s.querySelectorAll('*').forEach(e=>{
      const c=getComputedStyle(e); if(parseFloat(c.borderBottomWidth)>0){
        const eb=e.getBoundingClientRect().bottom;
        if(Math.abs(sb-eb)<6){ if(!best||Math.abs(sb-eb)<Math.abs(sb-best.d)) best={sel:e.className||e.tagName, col:c.borderBottomColor, d:eb-sb}; }
      }});
    out.push({sec:s.id||s.className, gap: best? +(best.d).toFixed(2):null, inner: best?best.sel:null, col:best?best.col:null});
  });
  return out;});
 console.log('=== '+w); r.forEach(o=>console.log('  ',JSON.stringify(o)));
 await p.close();
}
await b.close(); server.close();
