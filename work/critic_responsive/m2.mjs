import { createServer } from 'http';
import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT = '/Users/atlas/404_jam_site';
const MIME = { '.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2' };
const server = createServer((req,res)=>{ let rel=decodeURIComponent(req.url.split('?')[0]); if(rel==='/')rel='/index.html';
  const f=path.join(ROOT,rel); if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('nf');}
  res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'}); fs.createReadStream(f).pipe(res); });
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--force-device-scale-factor=1']});
const IDEAS=['a coastal kart racer','a night market chase','a lighthouse platformer','a submarine salvage sim','a rooftop parkour run','a desert train heist','a haunted arcade','a game nobody has made yet'];
const widths=[1440,1180,1024,900,768,700,620,500,412,375,360,320];
const out={};
for(const w of widths){
  const page=await browser.newPage();
  await page.setViewport({width:w,height:900,deviceScaleFactor:1});
  await page.goto(BASE,{waitUntil:'networkidle2',timeout:60000});
  await new Promise(r=>setTimeout(r,900));
  const res=await page.evaluate((IDEAS)=>{
    const slot=document.getElementById('slot');
    const panel=document.querySelector('.panel');
    const heights={};
    IDEAS.forEach(p=>{ slot.textContent=p; heights[p]= +panel.getBoundingClientRect().height.toFixed(1); });
    slot.textContent=IDEAS[0];
    const box=e=>{const r=e.getBoundingClientRect();return [+r.x.toFixed(1),+r.y.toFixed(1),+r.width.toFixed(1),+r.height.toFixed(1)];};
    const all=s=>[...document.querySelectorAll(s)].map(e=>({b:box(e),t:(e.textContent||'').trim().slice(0,26)}));
    // line boxes of h1
    const h1=document.querySelector('h1');
    const lines=[];
    const rng=document.createRange();
    for(const n of h1.childNodes){ if(n.nodeType===3&&n.textContent.trim()){rng.selectNodeContents(n); lines.push([n.textContent.trim(), +rng.getBoundingClientRect().width.toFixed(1)]);} else if(n.nodeType===1&&n.tagName!=='BR'){lines.push([n.textContent.trim(), +n.getBoundingClientRect().width.toFixed(1)]);} }
    // code line count
    const code=document.querySelector('.panel code');
    const codeLines = Math.round(code.getBoundingClientRect().height / parseFloat(getComputedStyle(code).lineHeight));
    // tap targets
    const tap=[...document.querySelectorAll('a,button,summary')].filter(e=>e.offsetParent!==null).map(e=>{const r=e.getBoundingClientRect();return {t:(e.textContent||'').trim().slice(0,18), h:+r.height.toFixed(1), w:+r.width.toFixed(1)};}).filter(o=>o.h>0&&o.h<44);
    // gaps between last-row cell bottom and container black rule
    const stats=document.querySelector('.stats'), lastStat=[...document.querySelectorAll('#view-jam .stat')].pop();
    const gal=document.querySelector('.gal'), lastCell=[...document.querySelectorAll('.gal .shotcell')].pop();
    const sect=document.querySelector('#what');
    return {
      panelHeights:heights,
      panelSpread: Math.max(...Object.values(heights))-Math.min(...Object.values(heights)),
      h1lines:lines, h1w:box(h1), codeLines, codeBox:box(code), acts:box(document.querySelector('.panel .acts')),
      innerPad:getComputedStyle(document.querySelector('.panel .inner')).padding,
      steps:all('.step'), prizes:all('.prize'), tcells:all('.tcell'), shotcells:all('.shotcell'),
      cards:all('.card').slice(0,3),
      tapSmall:tap,
      statsBottom:box(stats), lastStatBottom:box(lastStat),
      galBottom:box(gal), lastShot:box(lastCell), sectBottom:box(sect),
      specRows:all('.spec > div').slice(0,2), specK:all('.spec .k').slice(0,2),
      barNav:all('.bar nav a'),
      play:box(document.querySelector('.play')), heroBtns:all('.stage .btn'),
      heroP:box(document.querySelector('.stage .row p')),
      lead:box(document.querySelector('p.lead')),
      faq:all('.faq summary').slice(0,3),
    };
  }, IDEAS);
  out[w]=res; await page.close();
}
fs.writeFileSync('/Users/atlas/404_jam_site/work/critic_responsive/m2.json', JSON.stringify(out,null,1));
console.log('done');
await browser.close(); server.close();
