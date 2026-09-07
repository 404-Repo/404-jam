import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
const s=createServer((q,r)=>{let rel=decodeURIComponent(q.url.split('?')[0]);if(rel==='/')rel='/index.html';const f=path.join(ROOT,rel);
 if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){console.log('  404 ->',rel);r.writeHead(404);return r.end('x');}
 r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(r);});
await new Promise(r=>s.listen(0,'127.0.0.1',r));
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage(); await p.goto(`http://127.0.0.1:${s.address().port}/`,{waitUntil:'networkidle2'});
await new Promise(r=>setTimeout(r,1500)); await b.close(); s.close();
