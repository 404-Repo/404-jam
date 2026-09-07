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
await p.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,1200));
const out=await p.evaluate(()=>{
  const R=[];
  const cs=(el,ps)=>{const c=getComputedStyle(el);const o={};ps.forEach(k=>o[k]=c[k]);return o;};
  const box=el=>{const r=el.getBoundingClientRect();return{x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1)};};
  // 1. every border colour in use
  const seen={};
  document.querySelectorAll('*').forEach(el=>{
    const c=getComputedStyle(el);
    ['Top','Right','Bottom','Left'].forEach(s=>{
      const wdt=c['border'+s+'Width'], col=c['border'+s+'Color'];
      if(parseFloat(wdt)>0){
        const key=el.tagName.toLowerCase()+'.'+[...el.classList].join('.')+' |'+s+' '+wdt+' '+col;
        seen[key]=(seen[key]||0)+1;
      }
    });
  });
  R.push({borders:seen});
  // 2. left x of full-bleed row first-cell text vs wrap
  const q=s=>document.querySelector(s);
  R.push({leftEdges:{
    wrapContent: box(q('#what .wrap')),
    h2_dates: box(q('#dates h2')),
    lab_dates: box(q('#dates .lab')),
    stat1_label: box(q('.stats .stat span')),
    stat1_pad: getComputedStyle(q('.stats .stat')).padding,
    step1_pad: getComputedStyle(q('.step')).padding,
    step1_n: box(q('.step .n')),
    prize1_pad: getComputedStyle(q('.prize')).padding,
    prize1_pix: box(q('.prize .pix')),
    tcell1_pad: getComputedStyle(q('.tcell')).padding,
    tcell1_pix: box(q('.tcell .pix')),
    spec_k: box(q('#gate .spec .k')),
    h1: box(q('h1')),
    tagline: box(q('.stage .tagline')),
    heroP: box(q('.stage .row p')),
    barMark: box(q('.bar .mark')),
    play: box(q('.play')),
    navLast: box(q('#navEntries')),
  }});
  // 3. focus styles
  const focusables=[...document.querySelectorAll('a[href],button,summary,[tabindex]')];
  R.push({focusCount:focusables.length});
  // 4. hero entries btn inline
  const eb=[...document.querySelectorAll('.stage .btn')][1];
  R.push({heroEntriesBtn:{style:eb.getAttribute('style'),cs:cs(eb,['backgroundColor','borderColor','color','outlineStyle'])}});
  // 5. tbd count
  R.push({tbdCount:document.querySelectorAll('.tbd').length, coralEls:[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).color==='rgb(248, 89, 81)').length});
  // 6. doubled rules: last cell bottom border vs section bottom border
  ['#what .shotcell:last-child','#how .step:last-child','#dates .tcell:last-child'].forEach(s=>{
    const el=q(s); if(!el) return;
    const sec=el.closest('section');
    R.push({doubled:s, cellBottom:box(el).y+box(el).h, cellBorder:getComputedStyle(el).borderBottomColor, secBottom:box(sec).y+box(sec).h, secBorder:getComputedStyle(sec).borderBottomColor});
  });
  // 7. prize first
  const pf=q('.prize.first');
  R.push({prizeFirst:cs(pf,['backgroundColor','borderRightColor','borderBottomColor'])});
  // 8. panel geometry
  const panel=q('.panel'), inner=q('.panel .inner'), code=q('.panel code'), acts=q('.panel .acts');
  R.push({panel:box(panel),inner:box(inner),code:box(code),acts:box(acts),codeCS:cs(code,['fontSize','lineHeight','flex'])});
  // 9. gallery cell borders and right edge
  const cells=[...document.querySelectorAll('.shotcell')].map(c=>({b:box(c),br:getComputedStyle(c).borderRightColor}));
  R.push({cells});
  // 10. caption chip
  const cap=q('.shotcell .cap'); R.push({cap:box(cap),capCS:cs(cap,['borderTopColor','borderRightColor','padding','fontSize'])});
  // 11. video
  const v=q('#hero'); R.push({video:{poster:v.poster,preload:v.preload,readyState:v.readyState,w:v.videoWidth,h:v.videoHeight,box:box(v)}});
  return R;
});
console.log(JSON.stringify(out,null,1));
await b.close(); server.close();
