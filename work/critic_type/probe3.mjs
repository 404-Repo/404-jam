import { createServer } from 'http';
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const puppeteer=createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=createServer((req,res)=>{let rel=decodeURIComponent(req.url.split('?')[0]);if(rel==='/')rel='/index.html';
 const f=path.join(ROOT,rel); if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('nf');}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const page=await b.newPage(); await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
await page.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,400));
const out=await page.evaluate(()=>{
  const R={};
  const test=(sel)=>{const el=document.querySelector(sel); const p=el.parentElement;
    const c=el.cloneNode(true); c.style.letterSpacing='normal'; p.appendChild(c);
    const r={set:+el.getBoundingClientRect().width.toFixed(2), natural:+c.getBoundingClientRect().width.toFixed(2),
      fs:getComputedStyle(el).fontSize, ls:getComputedStyle(el).letterSpacing}; c.remove(); return r;};
  R.prizeEm=test('.prize.first .amt em'); R.statEm=test('.stat.live b em');
  // gap between numeral ink and suffix ink
  const gap=(numSel,emSel)=>{const num=document.querySelector(numSel), em=document.querySelector(emSel);
    const r=document.createRange(); const w=document.createTreeWalker(num,NodeFilter.SHOW_TEXT); const n=w.nextNode();
    r.selectNodeContents(n); const nb=r.getBoundingClientRect(); const eb=em.getBoundingClientRect();
    return {numRight:+nb.right.toFixed(2), emLeft:+eb.left.toFixed(2), gap:+(eb.left-nb.right).toFixed(2), numFs:getComputedStyle(num).fontSize};};
  R.prizeGap=gap('.prize.first .amt','.prize.first .amt em');
  R.statGap=gap('.stat.live b','.stat.live b em');
  // h1 and h2 optical: compare tracking at the two ends of the clamp is impossible here; report set values
  R.h1=(()=>{const e=document.querySelector('.stage h1');const c=getComputedStyle(e);return{fs:c.fontSize,ls:c.letterSpacing,lh:c.lineHeight};})();
  R.h2=(()=>{const e=document.querySelector('#what h2');const c=getComputedStyle(e);return{fs:c.fontSize,ls:c.letterSpacing,lh:c.lineHeight};})();
  return R;
});
console.log(JSON.stringify(out,null,1));
await b.close(); server.close();
