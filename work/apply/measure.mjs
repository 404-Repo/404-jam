import { createServer } from 'http';
import fs from 'fs'; import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT = '/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=createServer((req,res)=>{let rel=decodeURIComponent(req.url.split('?')[0]);if(rel==='/')rel='/index.html';
 const f=path.join(ROOT,rel);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x')}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(res)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--force-device-scale-factor=1']});

async function at(w,hash=''){
  const p=await b.newPage();
  await p.setViewport({width:w,height:900,deviceScaleFactor:1});
  await p.goto(BASE+hash,{waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,900));
  return p;
}
const out={};
// left text edges at several widths
for(const w of [1440,1280,1024,900,768,600,412,320]){
  const p=await at(w);
  out['edges@'+w]=await p.evaluate(()=>{
    const q=s=>document.querySelector(s);
    const x=e=>e?+e.getBoundingClientRect().left.toFixed(1):null;
    return {
      wrapLab:x(q('#what .lab')), h2:x(q('#what h2')), barMark:x(q('.bar .mark')),
      heroTag:x(q('.stage .tagline')), heroH1:x(q('.stage h1')),
      stat:x(q('.stat span')), step:x(q('.step .n')), prize:x(q('.prize .pix')),
      tcell:x(q('.tcell .pix')), panel:x(q('.panel')), footer:x(q('footer .mark')),
      playRight:+(window.innerWidth-q('.play').getBoundingClientRect().right).toFixed(1),
      navRight:+(window.innerWidth-q('.bar nav a:last-child').getBoundingClientRect().right).toFixed(1),
      scrollW:document.documentElement.scrollWidth, innerW:window.innerWidth
    };
  });
  await p.close();
}
// prompt panel height across every idea, at phone and desktop
for(const w of [320,375,412,600,768,1440]){
  const p=await at(w);
  out['panel@'+w]=await p.evaluate(()=>{
    const IDEAS=['a coastal kart racer','a night market chase','a lighthouse platformer','a submarine salvage sim',
      'a rooftop parkour run','a desert train heist','a haunted arcade','a game nobody has made yet'];
    const slot=document.getElementById('slot'), panel=document.querySelector('.promptwrap');
    const hs=IDEAS.map(t=>{slot.textContent=t;return +panel.getBoundingClientRect().height.toFixed(1)});
    return {min:Math.min(...hs),max:Math.max(...hs),spread:+(Math.max(...hs)-Math.min(...hs)).toFixed(1)};
  });
  await p.close();
}
// focus states + outline:none audit + pixel font audit
{
  const p=await at(1440);
  out.focus=await p.evaluate(()=>{
    const r=[];
    for(const s of ['#signup','.stage .btn.wire','.btn.ghost','.faq summary','footer a','.bar nav a','.play','#copy','.chip']){
      const e=document.querySelector(s); if(!e){r.push([s,'MISSING']);continue}
      e.focus();
      const cs=getComputedStyle(e);
      r.push([s,cs.outlineStyle,cs.outlineWidth,cs.outlineColor]);
    }
    return r;
  });
  out.outlineNone = await p.evaluate(()=>document.documentElement.outerHTML.split('outline:none').length-1);
  // every element rendered in the pixel face: size, tracking, transform, and any glyph outside the subset
  out.pixel = await p.evaluate(()=>{
    const SUB=new Set(' (),-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZabdfhlmnpqsuvwxyzö—'.split(''));
    const seen={}, bad=[];
    for(const el of document.querySelectorAll('*')){
      const cs=getComputedStyle(el);
      if(!/fourzerofourpixel/.test(cs.fontFamily)) continue;
      const own=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('');
      const key=cs.fontSize+' / '+cs.letterSpacing+' / '+cs.textTransform;
      (seen[key]=seen[key]||[]).push(el.className||el.tagName);
      let t=own; if(cs.textTransform==='uppercase') t=t.toUpperCase();
      for(const c of t) if(c.trim()&&!SUB.has(c)) bad.push([el.className||el.tagName,c,own.slice(0,30)]);
      for(const ps of ['::before','::after']){
        const c=getComputedStyle(el,ps).content;
        if(c&&c!=='none'&&c!=='normal'){
          const txt=c.replace(/^"|"$/g,'');
          for(const ch of txt) if(ch.trim()&&!SUB.has(ch)) bad.push([el.className+ps,ch,txt]);
        }
      }
    }
    return {sizes:Object.keys(seen).sort(), bad};
  });
  await p.close();
}
console.log(JSON.stringify(out,null,1));
await b.close(); server.close();
