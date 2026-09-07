import { createServer } from 'http'; import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const s=createServer((q,r)=>{let rel=decodeURIComponent(q.url.split('?')[0]); if(rel==='/')rel='/index.html';
 const f=path.join(ROOT,rel); if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end();}
 r.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(r);});
await new Promise(r=>s.listen(0,'127.0.0.1',r));
const B=`http://127.0.0.1:${s.address().port}/`;
const br=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const p=await br.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:1});
await p.goto(B,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,1000));
console.log(await p.evaluate(()=>{
 const o=[]; const r=(l,e)=>{if(!e){o.push(l+' MISSING');return;} const b=e.getBoundingClientRect(); o.push(l+' x='+b.left.toFixed(1)+' r='+b.right.toFixed(1)+' y='+b.top.toFixed(1)+' b='+b.bottom.toFixed(1)+' w='+b.width.toFixed(1)+' h='+b.height.toFixed(1));};
 const d=document.querySelector('.faq details[open]');
 r('summary',d.querySelector('summary'));
 const range=document.createRange(); range.selectNodeContents(d.querySelector('summary'));
 // marker pseudo width
 const cs=getComputedStyle(d.querySelector('summary'),'::before'); o.push('marker w='+cs.width+' fs='+cs.fontSize);
 r('answer p',d.querySelector('p'));
 r('faq details1',document.querySelectorAll('.faq details')[1]);
 r('sig btns',document.querySelector('#faq .btns'));
 r('btn1',document.querySelector('#faq .btn'));
 r('hero btns',document.querySelector('.stage .btns'));
 r('hero p',document.querySelector('.stage .row p'));
 r('hero row',document.querySelector('.stage .row'));
 r('stage in',document.querySelector('.stage .in'));
 r('play',document.querySelector('.play'));
 r('bar',document.querySelector('.bar'));
 r('stage',document.querySelector('.stage'));
 r('judging lastp',document.querySelector('#judging p.pix'));
 r('judging spec',document.querySelector('#judging .spec'));
 r('judging col1',document.querySelectorAll('#judging .cols>div')[0]);
 r('what col1',document.querySelectorAll('#what .cols>div')[0]);
 r('what h2',document.querySelector('#what h2'));
 r('cap0',document.querySelector('.gal .cap'));
 r('cell0 img',document.querySelector('.gal .shotcell img'));
 // font sizes of every pixel label
 const px=['.bar a','.stage .tagline','.promptwrap .lbl','.panel button','.stat span','.lab','.spec .k','.step .n','.shotcell .cap','.prize .pix','.tcell .pix','.faq summary::before','footer a','.filters .lbl','.chip','.by','.badge','.tag','.cact a','.found b','.empty'];
 for(const sel of px){ let e; let cs2;
   if(sel.includes('::before')){e=document.querySelector(sel.split('::')[0]); cs2=getComputedStyle(e,'::before');}
   else {e=document.querySelector(sel); cs2=e&&getComputedStyle(e);} 
   o.push('PIX '+sel.padEnd(22)+' fs='+(cs2?cs2.fontSize:'?')+' ls='+(cs2?cs2.letterSpacing:'?')+' color='+(cs2?cs2.color:'?')); }
 return o.join('\n');}));
await br.close(); s.close();
