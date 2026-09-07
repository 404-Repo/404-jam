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
await p.goto(BASE+'#entries',{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,900));
console.log(JSON.stringify(await p.evaluate(()=>{
  const box=el=>{const r=el.getBoundingClientRect();return{x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+r.width.toFixed(1),bottom:+(r.y+r.height).toFixed(1)};};
  const q=s=>document.querySelector(s);
  const out={};
  out.ehead_h1=box(q('#view-entries h1'));
  out.stats=box(q('#view-entries .stats'));
  out.stat1span=box(q('#view-entries .stat span'));
  out.filters=box(q('.filters'));
  out.grid=box(q('.grid'));
  out.gapStatsFilters=+(box(q('.filters')).y-box(q('#view-entries .stats')).bottom).toFixed(1);
  // focus on chips + card actions
  const keys=['backgroundColor','color','borderTopColor','outlineStyle','outlineColor','outlineWidth'];
  const snap=el=>{const c=getComputedStyle(el);const o={};keys.forEach(k=>o[k]=c[k]);return o;};
  out.focus=[...document.querySelectorAll('.chip,.cact a')].slice(0,6).map(el=>{
    const b1=snap(el); el.focus(); const b2=snap(el); const d={}; keys.forEach(k=>{if(b1[k]!==b2[k])d[k]=b1[k]+' -> '+b2[k];}); el.blur();
    return {t:el.textContent.trim(), d:Object.keys(d).length?d:'NO VISUAL CHANGE'};
  });
  out.muteColor=getComputedStyle(q('.cact a.mute')).color;
  out.cactRow=box(q('.cact'));
  out.refBg=getComputedStyle(q('.card.ref')).backgroundColor;
  out.cardBg=getComputedStyle(q('.card:not(.ref)')).backgroundColor;
  out.tagGhost=box(q('.tag.ghosttag'));
  out.emptyText=q('#empty').textContent;
  return out;
},null,1)));
await b.close(); server.close();
