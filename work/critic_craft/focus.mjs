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
await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,900));
const res=await p.evaluate(()=>{
  const keys=['backgroundColor','color','borderTopColor','borderTopWidth','outlineStyle','outlineColor','outlineWidth','outlineOffset','textDecorationLine','boxShadow'];
  const snap=el=>{const c=getComputedStyle(el);const o={};keys.forEach(k=>o[k]=c[k]);return o;};
  const out=[];
  const els=[...document.querySelectorAll('a[href],button,summary')].filter(e=>e.offsetParent!==null||e.closest('#view-jam'));
  els.forEach(el=>{
    const before=snap(el);
    el.focus();
    const after=snap(el);
    const diff={}; keys.forEach(k=>{ if(before[k]!==after[k]) diff[k]=before[k]+' -> '+after[k]; });
    el.blur();
    out.push({sel:el.tagName.toLowerCase()+(el.className?'.'+String(el.className).trim().split(/\s+/).join('.'):'')+(el.id?'#'+el.id:''), text:(el.textContent||'').trim().slice(0,26), changed:Object.keys(diff).length?diff:'NO VISUAL CHANGE'});
  });
  return out;
});
console.log(JSON.stringify(res,null,1));
// pixel-font plus check: measure the ::before advance width for closed vs open
const glyph=await p.evaluate(()=>{
  const s=document.querySelectorAll('.faq summary');
  const r=[];
  s.forEach(x=>{ const st=getComputedStyle(x,'::before'); r.push({content:st.content, font:st.fontFamily, w:st.width, open:x.parentElement.open}); });
  // render + and - in the pixel face vs fallback and compare widths
  const mk=(t,f)=>{const d=document.createElement('span');d.style.cssText='position:absolute;visibility:hidden;font-size:100px;font-family:'+f;d.textContent=t;document.body.appendChild(d);const w=d.getBoundingClientRect().width;d.remove();return w;};
  return {r, plusPix:mk('+','fourzerofourpixel'), plusMono:mk('+','monospace'), dashPix:mk('-','fourzerofourpixel'), dashMono:mk('-','monospace'), parenPix:mk('(','fourzerofourpixel')};
});
console.log(JSON.stringify(glyph,null,1));
await b.close(); server.close();
