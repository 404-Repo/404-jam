import { createServer } from 'http';
import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
const server=createServer((req,res)=>{let rel=decodeURIComponent(req.url.split('?')[0]);if(rel==='/')rel='/index.html';const f=path.join(ROOT,rel);
 if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--force-device-scale-factor=1']});
const out = process.argv[2] || 'work/verify/focus';
fs.mkdirSync(path.join(ROOT,out),{recursive:true});
// bar focus while solid
{
  const p=await b.newPage(); await p.setViewport({width:1440,height:400,deviceScaleFactor:2});
  await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,900));
  await p.evaluate(()=>window.scrollTo(0,1500)); await new Promise(r=>setTimeout(r,400));
  for(let i=0;i<3;i++) await p.keyboard.press('Tab'); // mark, how, gate
  const el=await p.$('.bar');
  await el.screenshot({path:path.join(ROOT,out,'bar_solid_focus.png')});
  // and at scroll 0
  await p.evaluate(()=>window.scrollTo(0,0)); await new Promise(r=>setTimeout(r,500));
  await p.screenshot({path:path.join(ROOT,out,'bar_top_focus.png'),clip:{x:0,y:0,width:1440,height:70}});
  // bar solid over the hero (scroll 300)
  await p.evaluate(()=>window.scrollTo(0,300)); await new Promise(r=>setTimeout(r,500));
  await p.screenshot({path:path.join(ROOT,out,'bar_over_hero.png'),clip:{x:0,y:0,width:1440,height:200}});
  await p.close();
}
// panel button focus
{
  const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2});
  await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,900));
  await p.evaluate(()=>{document.getElementById('shuffle').focus();});
  await new Promise(r=>setTimeout(r,200));
  const el=await p.$('.beamwrap'); await el.screenshot({path:path.join(ROOT,out,'panel_focus.png')});
  await p.close();
}
await b.close(); server.close(); console.log('ok');
