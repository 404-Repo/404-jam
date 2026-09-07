import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=createServer((q,r)=>{let rel=decodeURIComponent(q.url.split('?')[0]);if(rel==='/')rel='/index.html';const f=path.join(ROOT,rel);
 if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end('x')}r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:1});
await p.goto(`http://127.0.0.1:${server.address().port}/#entries`,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,900));
console.log(await p.evaluate(()=>{
 const c=document.querySelector('.card'); const kids=[...c.querySelector('.cbody').children];
 const rows=kids.map(e=>[e.className||e.tagName, +e.getBoundingClientRect().top.toFixed(1), +e.getBoundingClientRect().bottom.toFixed(1)]);
 const gaps=[]; for(let i=1;i<rows.length;i++) gaps.push([rows[i-1][0]+' -> '+rows[i][0], +(rows[i][1]-rows[i-1][2]).toFixed(1)]);
 const cb=c.querySelector('.cbody').getBoundingClientRect(), sh=c.querySelector('.shot').getBoundingClientRect(), ca=c.querySelector('.cact').getBoundingClientRect();
 return JSON.stringify({rows,gaps, shotToFirst:+(rows[0][1]-sh.bottom).toFixed(1), lastToCact:+(ca.top-rows[rows.length-1][2]).toFixed(1)},null,1);
}));
// faq
await p.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,600));
console.log(await p.evaluate(()=>{
 const d=[...document.querySelectorAll('.faq details')];
 const o=d.map(e=>{const s=e.querySelector('summary').getBoundingClientRect();const r=e.getBoundingClientRect();return [+ (r.top+scrollY).toFixed(1), +(s.top+scrollY).toFixed(1), +(s.bottom+scrollY).toFixed(1), +(r.bottom+scrollY).toFixed(1)]});
 const p1=document.querySelector('.faq details p').getBoundingClientRect();
 return JSON.stringify({o, pTop:+(p1.top+scrollY).toFixed(1), pLeft:+p1.left.toFixed(1)},null,1);
}));
await b.close(); server.close();
