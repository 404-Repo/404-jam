import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=createServer((q,s)=>{let rel=decodeURIComponent(q.url.split('?')[0]); if(rel==='/')rel='/index.html';
 const f=path.join(ROOT,rel); if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);return s.end();}
 s.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(s);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
async function run(W,HASH,SELS){
 const p=await b.newPage(); await p.setViewport({width:W,height:900,deviceScaleFactor:1});
 await p.goto(BASE+HASH,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,1200));
 const out=await p.evaluate((SELS)=>{const R=[];
  for(const [lab,sel,idx] of SELS){const els=document.querySelectorAll(sel); const el=els[idx||0]; if(!el){R.push({lab,miss:1});continue;}
   const r=el.getBoundingClientRect(),c=getComputedStyle(el);
   R.push({lab,x:+r.left.toFixed(1),rr:+r.right.toFixed(1),y:+r.top.toFixed(1),bb:+r.bottom.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1),pad:c.padding,m:c.margin,bR:c.borderRight,bB:c.borderBottom,bT:c.borderTop,bL:c.borderLeft});}
  return R;},SELS);
 console.log('=== W='+W+' '+HASH);
 console.log(out.map(o=>o.miss?o.lab+' MISSING':`${o.lab.padEnd(22)} x=${String(o.x).padStart(7)} r=${String(o.rr).padStart(7)} y=${String(o.y).padStart(8)} b=${String(o.bb).padStart(8)} w=${String(o.w).padStart(7)} h=${String(o.h).padStart(6)} pad=${o.pad} m=${o.m} | bT=${o.bT} bR=${o.bR} bB=${o.bB} bL=${o.bL}`).join('\n'));
 await p.close();
}
const A=[['bar mark','.bar .mark'],['h1','h1'],['sec faq','#faq'],['faq div','#faq .faq'],['faq btns','#faq .btns'],['footer','footer'],['footer wrap','footer .wrap'],['footer mark','footer .mark'],['footer a2','footer a',1],
 ['what cols','#what .cols'],['what col2','#what .cols > div',1],['what lead','#what .lead'],['what pg','#what .g'],
 ['gal last cell','.gal .shotcell',5],['gal cell2','.gal .shotcell',2],
 ['rules cols l','#rules .cols > div',0],['rules cols r','#rules .cols > div',1],['rules spec','#rules .spec'],['rules lab','#rules .lab'],['rules k0','#rules .spec .k'],
 ['judging lab','#judging .lab'],['judging k0','#judging .spec .k'],['judging pix','#judging p.pix'],['judging p g','#judging .g'],
 ['prize1','.prize',1],['prize1 pix','.prize .pix',1],['spec-after-prizes k','#prizes .spec .k'],['spec-after-prizes v','#prizes .spec .v'],
 ['dates h2','#dates h2'],['time','.time'],['tcell3','.tcell',3],
 ['stat4','.stat',4],['stat4 b','.stat b',4],
 ['step4','.step',4],['steps','.steps'],
 ['promptwrap','.promptwrap'],['stats','.stats']];
await run(1440,'',A);
await run(1024,'',A);
await run(768,'',A);
await run(412,'',A);
const E=[['ehead','.ehead'],['ehead lab','.ehead .lab'],['ehead h1','.ehead h1'],['e stats','#view-entries .stats'],['e stat0','#view-entries .stat'],['filters','.filters'],['grid','.grid'],['card0','.card'],['card0 shot','.card .shot'],['card0 body','.cbody'],['card0 h3','.cbody h3'],['card0 by','.by'],['card0 found','.found'],['card0 meta','.meta'],['card0 cact','.cact'],['card1','.card',1],['card2','.card',2],['e cols','#view-entries .cols'],['e wrap','#view-entries .wrap',1],['tag','.tag']];
await run(1440,'#entries',E);
await run(412,'#entries',E);
await b.close(); server.close();
