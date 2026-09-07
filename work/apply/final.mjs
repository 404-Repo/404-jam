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
await p.goto(BASE+'#entries',{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,800));
console.log(JSON.stringify(await p.evaluate(()=>{
  const c=document.querySelectorAll('.chip')[2]; c.focus();
  const cs=getComputedStyle(c);
  // filter still works
  c.click();
  const shown=[...document.getElementById('grid').children].filter(e=>!e.hidden).length;
  return {chipFocus:[cs.outlineStyle,cs.outlineWidth,cs.outlineColor], chipH:+c.getBoundingClientRect().height.toFixed(1),
          racingShown:shown, empty:document.getElementById('empty').hidden};
})));
// bar goes solid early
await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,600));
for(const y of [0,30,300,500]){
  await p.evaluate(v=>window.scrollTo(0,v),y); await new Promise(r=>setTimeout(r,300));
  const s=await p.evaluate(()=>document.getElementById('bar').classList.contains('solid'));
  console.log('scrollY',y,'solid',s);
}
await b.close(); server.close();
