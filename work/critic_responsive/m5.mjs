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
const IDEAS=['a coastal kart racer','a night market chase','a lighthouse platformer','a submarine salvage sim','a rooftop parkour run','a desert train heist','a haunted arcade','a game nobody has made yet'];
for(const w of [320,360,375,412,768,1440]){
 const p=await b.newPage(); await p.setViewport({width:w,height:900,deviceScaleFactor:1});
 await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,600));
 const r=await p.evaluate((IDEAS)=>{
   const slot=document.getElementById('slot'), code=document.querySelector('.panel code'), panel=document.querySelector('.panel');
   const res={};
   for(const s of IDEAS){ slot.textContent=s;
     res[s]={doc:document.documentElement.scrollWidth, panelR:+panel.getBoundingClientRect().right.toFixed(1),
       slotR:+slot.getBoundingClientRect().right.toFixed(1), codeW:+code.getBoundingClientRect().width.toFixed(1),
       codeR:+code.getBoundingClientRect().right.toFixed(1)};
   }
   return res;
 }, IDEAS);
 console.log('=== '+w); for(const k in r) console.log('  ', k.padEnd(28), JSON.stringify(r[k]));
 await p.close();
}
await b.close(); server.close();
