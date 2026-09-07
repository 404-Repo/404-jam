import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=createServer((q,r)=>{let rel=decodeURIComponent(q.url.split('?')[0]);if(rel==='/')rel='/index.html';const f=path.join(ROOT,rel);
 if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end('x')}r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
for(const W of [1920,1600,1320,1280]){
 const p=await b.newPage(); await p.setViewport({width:W,height:900,deviceScaleFactor:1});
 await p.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,900));
 const o=await p.evaluate(()=>{const q=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return +r.left.toFixed(1)};
  return {h1:q('h1'),tagline:q('.stage .tagline'),heroP:q('.stage .row p'),bar:q('.bar .mark'),play:q('.play'),playR:(()=>{const e=document.querySelector('.play');return e?+(innerWidth-e.getBoundingClientRect().right).toFixed(1):null})(),
   lbl:q('.promptwrap .lbl'),panel:q('.panel'),stat:q('.stat b'),h2:q('#what h2'),lab:q('#what .lab'),step:q('.step h3'),prize:q('.prize .amt'),tcell:q('.tcell .d'),cap:q('.shotcell .cap'),foot:q('footer a'),
   navR:(()=>{const e=document.querySelector('.bar nav a:last-child');return e?+(innerWidth-e.getBoundingClientRect().right).toFixed(1):null})()};});
 console.log(W, JSON.stringify(o));
 await p.close();
}
await b.close(); server.close();
