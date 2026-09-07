import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
const server=createServer((req,res)=>{let rel=decodeURIComponent(req.url.split('?')[0]);if(rel==='/')rel='/index.html';
 const f=path.join(ROOT,rel);if(!fs.existsSync(f)){res.writeHead(404);return res.end('x')}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(res)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--force-device-scale-factor=1']});
const W=[320,360,375,412,500,600,620,680,700,768,880,900,1000,1180,1280,1320,1440,1920];
const bad=[];
for(const hash of ['','#entries']){
 for(const w of W){
  const p=await b.newPage(); await p.setViewport({width:w,height:900,deviceScaleFactor:1});
  await p.goto(BASE+hash,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,600));
  const r=await p.evaluate(()=>{
    const s=document.getElementById('slot'); if(s) s.textContent='a game nobody has made yet';
    return {sw:document.documentElement.scrollWidth, iw:window.innerWidth};
  });
  if(r.sw>r.iw) bad.push([hash||'jam',w,r.sw,r.iw]);
  await p.close();
 }
}
console.log('h-scroll problems:',JSON.stringify(bad));
// touch target audit + spec/faq/geometry checks at 412 and 1440
for(const w of [412,1440]){
  const p=await b.newPage(); await p.setViewport({width:w,height:900,deviceScaleFactor:1});
  await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,600));
  const r=await p.evaluate(()=>{
    const o={};
    o.controls=[...document.querySelectorAll('.bar a,.play,.panel button,.btn,.faq summary,footer a')]
      .map(e=>[e.className||e.tagName,+e.getBoundingClientRect().height.toFixed(1)])
      .filter(x=>x[1]<44);
    const sm=document.querySelector('.faq summary'), sb=getComputedStyle(sm,'::before');
    const q=document.querySelector('.faq summary'), ans=document.querySelector('.faq p');
    o.faq={ansLeft:+ans.getBoundingClientRect().left.toFixed(1),
           qTextLeft:+(q.getBoundingClientRect().left + 20 + 12).toFixed(1)};
    const k=document.querySelector('#gate .spec .k'), v=document.querySelector('#gate .spec .v');
    o.specBaseline={k:+k.getBoundingClientRect().top.toFixed(1), v:+v.getBoundingClientRect().top.toFixed(1),
                    kfs:getComputedStyle(k).fontSize, vfs:getComputedStyle(v).fontSize};
    return o;
  });
  console.log(w, JSON.stringify(r));
  await p.close();
}
await b.close(); server.close();
