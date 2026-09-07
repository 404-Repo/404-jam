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
const widths=[1440,1280,1180,1024,900,880,768,680,620,600,412,360,320];
const out={};
for(const w of widths){
  const page=await browser.newPage();
  await page.setViewport({width:w,height:900,deviceScaleFactor:1});
  await page.goto(BASE,{waitUntil:'networkidle2',timeout:60000});
  await new Promise(r=>setTimeout(r,900));
  out[w]=await page.evaluate(()=>{
    const R=(s)=>{const e=document.querySelector(s); if(!e)return null; const r=e.getBoundingClientRect(); return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1)};};
    const all=(s)=>[...document.querySelectorAll(s)].map(e=>{const r=e.getBoundingClientRect();return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1),t:(e.textContent||'').trim().slice(0,22)};});
    const cs=(s,p)=>{const e=document.querySelector(s); if(!e)return null; const c=getComputedStyle(e); const o={}; p.forEach(k=>o[k]=c[k]); return o;};
    return {
      docScrollW: document.documentElement.scrollWidth, innerW: window.innerWidth,
      bodyScrollW: document.body.scrollWidth,
      stage:R('.stage'), heroWrap:R('.stage .in .wrap'), h1:R('h1'), tagline:R('.stage .tagline'),
      heroP:R('.stage .row p'), heroBtns:R('.stage .btns'), bar:R('.bar .wrap'), barMark:R('.bar .mark'),
      play:R('.play'), sectionWrap:R('#what .wrap'), lab:R('#what .lab'),
      promptWrap:R('.promptwrap .wrap'), panel:R('.panel'), panelInner:R('.panel .inner'),
      code:R('.panel code'), acts:R('.panel .acts'), slot:R('.slot'),
      h1Lines: (()=>{const e=document.querySelector('h1'); const r=e.getClientRects(); return r.length;})(),
      stats:R('.stats'), statCells:all('.stat'),
      steps:R('.steps'), stepCells:all('.step'),
      gal:R('.gal'), galCells:all('.shotcell'),
      prizeCells:all('.prize'), timeCells:all('.tcell'),
      specRow:R('.spec > div'), specK:R('.spec .k'), specV:R('.spec .v'),
      sectionPad: cs('#what',['paddingTop','paddingBottom']),
      wrapPad: cs('#what .wrap',['paddingLeft','paddingRight','maxWidth']),
      buttons: all('.panel button').concat(all('.chip')),
      barLinks: all('.bar nav a'),
      faqSummary: all('.faq summary').slice(0,2),
      footerLinks: all('footer a'),
      h2s: all('h2').map(o=>o),
      cta: all('.btn'),
      h1Font: cs('h1',['fontSize','lineHeight']),
      codeFont: cs('.panel code',['fontSize','lineHeight']),
    };
  });
  await page.close();
}
fs.writeFileSync('/Users/atlas/404_jam_site/work/critic_responsive/measure.json', JSON.stringify(out,null,1));
console.log('ok');
await browser.close(); server.close();
