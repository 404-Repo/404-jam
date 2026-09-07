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
const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:1});
await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,800));
console.log(JSON.stringify(await p.evaluate(()=>{
  const c=document.getElementById('copy'), sh=document.getElementById('shuffle'), pl=document.getElementById('vtoggle');
  const w=e=>+e.getBoundingClientRect().width.toFixed(2);
  const out={copy:{},shuffleX:{},play:{}};
  for(const t of ['copy','copied','select it']){c.textContent=t;out.copy[t]=w(c);out.shuffleX[t]=+sh.getBoundingClientRect().left.toFixed(2)}
  c.textContent='copy';
  for(const t of ['pause','play']){pl.textContent=t;out.play[t]=w(pl)}
  const s=document.querySelector('.faq summary'), d=s.parentElement;
  const before=s.querySelector; // measure heading x closed vs open
  const x1=+s.getBoundingClientRect().left.toFixed(2);
  const r1=+document.querySelector('.faq details:nth-of-type(2) summary').getBoundingClientRect().height.toFixed(1);
  document.querySelector('.faq details:nth-of-type(2)').open=true;
  const r2=+document.querySelector('.faq details:nth-of-type(2) summary').getBoundingClientRect().height.toFixed(1);
  out.faqSummaryH=[r1,r2];
  return out;
})));
// anchor jump
await p.goto(BASE+'#how',{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,800));
console.log('anchor', JSON.stringify(await p.evaluate(()=>{
  const s=document.getElementById('how');
  return {sectionTop:+s.getBoundingClientRect().top.toFixed(1), barH:document.querySelector('.bar .wrap').getBoundingClientRect().height,
          labTop:+document.querySelector('#how .lab').getBoundingClientRect().top.toFixed(1)};
})));
await b.close(); server.close();
