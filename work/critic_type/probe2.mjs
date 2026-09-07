import { createServer } from 'http';
import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=createServer((req,res)=>{let rel=decodeURIComponent(req.url.split('?')[0]);if(rel==='/')rel='/index.html';
 const f=path.join(ROOT,rel); if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('nf');}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const page=await b.newPage(); await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
await page.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,500));
const out=await page.evaluate(()=>{
  const res={};
  const textRect=(el)=>{const r=document.createRange();
    // first text node inside
    const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); const n=w.nextNode(); if(!n) return null;
    r.selectNodeContents(n); const b=r.getBoundingClientRect(); return {left:+b.left.toFixed(2),right:+b.right.toFixed(2),top:+b.top.toFixed(2),bottom:+b.bottom.toFixed(2)};};
  const s=document.querySelector('.faq summary');
  res.summaryTextRect=textRect(s);
  res.summaryRect=s.getBoundingClientRect().left;
  const mk=getComputedStyle(s,'::before');
  res.markerFont=mk.fontSize+' '+mk.fontFamily.split(',')[0];
  res.answerLeft=document.querySelector('.faq details[open] p').getBoundingClientRect().left;
  // prompt panel: code text vs body text sizes and the slot
  const code=document.querySelector('.panel code'); res.codeRect=code.getBoundingClientRect().height;
  // measure natural vs rendered width of the prize suffix by cloning without letter-spacing
  const em=document.querySelector('.prize.first .amt em');
  const c=em.cloneNode(true); c.style.letterSpacing='normal'; c.style.position='absolute'; c.style.visibility='hidden';
  document.body.appendChild(c); res.prizeEm={set:+em.getBoundingClientRect().width.toFixed(2), natural:+c.getBoundingClientRect().width.toFixed(2), fs:getComputedStyle(em).fontSize, ls:getComputedStyle(em).letterSpacing}; c.remove();
  const em2=document.querySelector('.stat.live b em');
  const c2=em2.cloneNode(true); c2.style.letterSpacing='normal'; c2.style.position='absolute'; c2.style.visibility='hidden';
  document.body.appendChild(c2); res.statEm={set:+em2.getBoundingClientRect().width.toFixed(2), natural:+c2.getBoundingClientRect().width.toFixed(2), fs:getComputedStyle(em2).fontSize, ls:getComputedStyle(em2).letterSpacing}; c2.remove();
  // characters per line for the main body paragraphs
  const meas=(sel)=>{const e=document.querySelector(sel); if(!e) return null; const cs=getComputedStyle(e);
    const r=document.createRange(); r.selectNodeContents(e); const rects=r.getClientRects();
    const txt=e.textContent.trim(); return {fs:cs.fontSize, lh:cs.lineHeight, w:+e.getBoundingClientRect().width.toFixed(0), lines:rects.length, chars:txt.length, cpl:+(txt.length/rects.length).toFixed(1)};};
  res.body={}; for(const sel of ['#what p.g','p.lead','#gate p.g','#judging p.g','.faq details[open] p','#gate .spec .v','.step p','.prize.first p','.tcell.now p','.stage .row p']) res.body[sel]=meas(sel);
  // tbd marker
  const t=document.querySelector('#how .tbd'); const cs=getComputedStyle(t,'::after');
  res.tbd={fs:cs.fontSize, ls:cs.letterSpacing, va:cs.verticalAlign, ff:cs.fontFamily.split(',')[0], parentFs:getComputedStyle(t.parentElement).fontSize};
  return res;
});
console.log(JSON.stringify(out,null,1));
await b.close(); server.close();
