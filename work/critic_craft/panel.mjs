import { createServer } from 'http';
import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=createServer((req,res)=>{let rel=decodeURIComponent(req.url.split('?')[0]);if(rel==='/')rel='/index.html';const f=path.join(ROOT,rel);if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('nf');}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--force-device-scale-factor=1']});
for (const W of [1440,1024,768,412]) {
  const p=await b.newPage(); await p.setViewport({width:W,height:900,deviceScaleFactor:1});
  await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,700));
  const r=await p.evaluate(()=>{
    const IDEAS=['a coastal kart racer','a night market chase','a lighthouse platformer','a submarine salvage sim','a rooftop parkour run','a desert train heist','a haunted arcade','a game nobody has made yet'];
    const slot=document.getElementById('slot'), panel=document.querySelector('.panel');
    const res=[];
    IDEAS.forEach(t=>{ slot.textContent=t; res.push([t, +panel.getBoundingClientRect().height.toFixed(1)]); });
    slot.textContent=IDEAS[0];
    return res;
  });
  console.log(W, JSON.stringify(r));
  await p.close();
}
// element shot of the beam panel
const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:3});
await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,700));
await p.evaluate(()=>window.scrollTo(0,760));
await new Promise(r=>setTimeout(r,600));
await p.screenshot({path:'/Users/atlas/404_jam_site/work/critic_craft/beam_edge.png', clip:{x:80,y:40,width:420,height:220}});
await p.screenshot({path:'/Users/atlas/404_jam_site/work/critic_craft/beam_bottom.png', clip:{x:80,y:120,width:600,height:180}});
await b.close(); server.close();
