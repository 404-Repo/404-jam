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
const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:1});
await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,800));
console.log(JSON.stringify(await p.evaluate(()=>{
  const w=el=>+el.getBoundingClientRect().width.toFixed(2), x=el=>+el.getBoundingClientRect().x.toFixed(2);
  const copy=document.getElementById('copy'), another=document.getElementById('shuffle'), play=document.getElementById('vtoggle');
  const o={};
  o.copyBefore={w:w(copy),x:x(copy),anotherX:x(another)};
  copy.textContent='copied';
  o.copyAfter={w:w(copy),x:x(copy),anotherX:x(another)};
  copy.textContent='select it';
  o.copyFail={w:w(copy),anotherX:x(another)};
  copy.textContent='copy';
  o.playPause={w:w(play),x:x(play)};
  play.textContent='play';
  o.playPlay={w:w(play),x:x(play)};
  play.textContent='pause';
  // faq marker shift
  const s=[...document.querySelectorAll('.faq summary')];
  o.faqTextX=s.map(el=>{const r=document.createRange();r.selectNodeContents(el);return +r.getBoundingClientRect().x.toFixed(2);});
  o.faqOpen=s.map(el=>el.parentElement.open);
  // hero btn heights
  o.heroBtns=[...document.querySelectorAll('.stage .btn')].map(e=>({t:e.textContent.trim(),h:+e.getBoundingClientRect().height.toFixed(1),w:w(e)}));
  // stat em gap
  const em=document.querySelector('.stats .stat:last-child b em');
  o.pctEm={text:em.textContent, ml:getComputedStyle(em).marginLeft, fs:getComputedStyle(em).fontSize, color:getComputedStyle(em).color, font:getComputedStyle(em).fontFamily.split(',')[0]};
  // veil alpha at tagline
  const stage=document.querySelector('.stage'), tag=document.querySelector('.stage .tagline');
  const sh=stage.getBoundingClientRect().height, ty=tag.getBoundingClientRect().y+tag.getBoundingClientRect().height/2-stage.getBoundingClientRect().y;
  o.veil={stageH:+sh.toFixed(1), taglineMidPct:+(100*ty/sh).toFixed(1)};
  o.taglineCS={color:getComputedStyle(tag).color, textShadow:getComputedStyle(tag).textShadow};
  o.navCS={textShadow:getComputedStyle(document.querySelector('.bar a')).textShadow};
  // dead rule
  o.posterEl=!!document.querySelector('.stage img.poster');
  return o;
},null,1)));
await b.close(); server.close();
