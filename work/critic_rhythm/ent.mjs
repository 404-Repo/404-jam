import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=createServer((q,r)=>{let rel=decodeURIComponent(q.url.split('?')[0]);if(rel==='/')rel='/index.html';const f=path.join(ROOT,rel);
 if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end('x')}r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
const p=await b.newPage(); await p.setViewport({width:+process.argv[2]||1440,height:900,deviceScaleFactor:1});
await p.goto(`http://127.0.0.1:${server.address().port}/#entries`,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,900));
const o=await p.evaluate(()=>{const out=[];
 for(const s of ['.ehead','.ehead .lab','#view-entries h1','.ehead p.g','#view-entries .stats','#view-entries .stat','.filters','.grid','.card:first-child','.card:first-child .cbody','.card:first-child .cact','#view-entries .cols','#view-entries .cols h2','#view-entries .cols .g','footer']){
  const e=document.querySelector(s); if(!e){out.push([s,'MISS']);continue}
  const r=e.getBoundingClientRect(),c=getComputedStyle(e);
  out.push([s,+(r.top+scrollY).toFixed(1),+(r.bottom+scrollY).toFixed(1),+r.left.toFixed(1),c.paddingTop,c.paddingBottom,c.marginTop]);}
 return {out,docH:document.documentElement.scrollHeight};});
console.log(JSON.stringify(o.out,null,0).replace(/\],\[/g,'\n['), '\ndocH',o.docH);
await b.close(); server.close();
