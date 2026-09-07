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
for(const w of [320,330,340,350,360,375,412,500,560,600,620,680,700,768,820,900,1000,1100,1200,1320,1440,1920]){
  const p=await b.newPage(); await p.setViewport({width:w,height:900,deviceScaleFactor:1});
  await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,700));
  const r=await p.evaluate(()=>{
    const IDEAS=['a coastal kart racer','a night market chase','a lighthouse platformer','a submarine salvage sim',
      'a rooftop parkour run','a desert train heist','a haunted arcade','a game nobody has made yet'];
    const slot=document.getElementById('slot'), code=document.querySelector('.panel code'), pw=document.querySelector('.promptwrap');
    const hs=IDEAS.map(t=>{slot.textContent=t;return +code.getBoundingClientRect().height.toFixed(2)});
    const ph=IDEAS.map(t=>{slot.textContent=t;return +pw.getBoundingClientRect().height.toFixed(2)});
    return {codeMin:Math.min(...hs),codeMax:Math.max(...hs),panelSpread:+(Math.max(...ph)-Math.min(...ph)).toFixed(2),
            fs:getComputedStyle(code).fontSize, lh:getComputedStyle(code).lineHeight};
  });
  console.log(w, JSON.stringify(r)); await p.close();
}
await b.close(); server.close();
