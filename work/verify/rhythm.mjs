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
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
for (const W of [1440,412]) {
  const p=await b.newPage(); await p.setViewport({width:W,height:900,deviceScaleFactor:1});
  await p.goto(B,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,800));
  const r = await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('section[id]').forEach(sec=>{
      const sb=sec.getBoundingClientRect();
      const first=sec.querySelector('.lab');
      const fb=first?first.getBoundingClientRect():null;
      // last painted child
      const kids=[...sec.children]; const last=kids[kids.length-1];
      const lb=last.getBoundingClientRect();
      out.push({id:sec.id,
        topToLabel: fb?Math.round((fb.top-sb.top)*10)/10 : null,
        lastToBottom: Math.round((sb.bottom-lb.bottom)*10)/10,
        height: Math.round(sb.height)});
    });
    return out;
  });
  console.log('=== '+W);
  for (const x of r) console.log('  %s  topToLabel=%s  lastToBottom=%s  h=%s', x.id.padEnd(9), String(x.topToLabel).padEnd(6), String(x.lastToBottom).padEnd(6), x.height);
  await p.close();
}
await b.close(); s.close();
