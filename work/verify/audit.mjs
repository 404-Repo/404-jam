import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const puppeteer = createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT = '/Users/atlas/404_jam_site';
const MIME = { '.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2' };
const server = createServer((req,res)=>{
  let rel = decodeURIComponent(req.url.split('?')[0]); if (rel==='/') rel='/index.html';
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('x');}
  res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(f).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE = `http://127.0.0.1:${server.address().port}/`;
const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--force-device-scale-factor=1']});

const out = {};

// ---------- A. left edges + type scale + spacing scale, at each width ----------
for (const W of [1440, 1024, 768, 412]) {
  const page = await browser.newPage();
  await page.setViewport({width:W,height:900,deviceScaleFactor:1});
  await page.goto(BASE,{waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,900));
  const r = await page.evaluate(() => {
    const res = {};
    // left edge of the first text-bearing element inside each top level band
    const probes = [];
    const add=(label,el)=>{ if(!el) return; const b=el.getBoundingClientRect(); if(b.width<1&&b.height<1) return; probes.push([label, Math.round(b.left*100)/100]); };
    add('bar wordmark', document.querySelector('.bar .mark'));
    add('hero h1', document.querySelector('h1'));
    add('hero tagline', document.querySelector('.stage .tagline'));
    add('hero para', document.querySelector('.stage .row p'));
    add('prompt label', document.querySelector('.promptwrap .lbl'));
    add('prompt panel', document.querySelector('.panel'));
    add('stat 1 label', document.querySelector('.stats .stat span'));
    add('what lab', document.querySelector('#what .lab'));
    add('what h2', document.querySelector('#what h2'));
    add('how lab', document.querySelector('#how .lab'));
    add('how h2', document.querySelector('#how h2'));
    add('step 1 n', document.querySelector('.steps .step .n'));
    add('gate lab', document.querySelector('#gate .lab'));
    add('gate spec k', document.querySelector('#gate .spec .k'));
    add('rules lab', document.querySelector('#rules .lab'));
    add('judging lab', document.querySelector('#judging .lab'));
    add('prizes lab', document.querySelector('#prizes .lab'));
    add('prize 1 pix', document.querySelector('.prizes .prize .pix'));
    add('prizes spec k', document.querySelector('#prizes .spec .k'));
    add('dates lab', document.querySelector('#dates .lab'));
    add('tcell 1 pix', document.querySelector('.time .tcell .pix'));
    add('faq lab', document.querySelector('#faq .lab'));
    add('faq summary', document.querySelector('.faq summary'));
    add('faq btn', document.querySelector('#faq .btn'));
    add('footer mark', document.querySelector('footer .mark'));
    res.left = probes;
    // right edges of the same kind of thing
    const rp=[];
    const addR=(l,el)=>{ if(!el) return; const b=el.getBoundingClientRect(); rp.push([l, Math.round((innerWidth-b.right)*100)/100]); };
    addR('what h2 wrap', document.querySelector('#what > .wrap'));
    addR('stat last', document.querySelector('.stats .stat:last-child span'));
    addR('step last p', document.querySelector('.steps .step:last-child p'));
    addR('prize last p', document.querySelector('.prizes .prize:last-child p'));
    addR('tcell last p', document.querySelector('.time .tcell:last-child p'));
    addR('gate spec v', document.querySelector('#gate .spec > div:first-child'));
    res.right = rp;

    // every distinct font-size / letter-spacing / font-family combo actually painted
    const seen = new Map();
    document.querySelectorAll('*').forEach(el=>{
      const b = el.getBoundingClientRect(); if (!b.width || !b.height) return;
      // only elements that directly contain text
      let hasText=false; for (const n of el.childNodes) if (n.nodeType===3 && n.textContent.trim()) hasText=true;
      if (!hasText) return;
      const cs = getComputedStyle(el);
      const fam = cs.fontFamily.split(',')[0].replace(/["']/g,'');
      const key = fam+' | '+cs.fontSize+' | '+cs.fontWeight+' | '+cs.letterSpacing+' | '+cs.lineHeight;
      if (!seen.has(key)) seen.set(key, []);
      const a = seen.get(key); if (a.length<3) a.push((el.className&&typeof el.className==='string'?'.'+el.className.split(' ')[0]:el.tagName.toLowerCase()));
    });
    res.type = [...seen.entries()].map(([k,v])=>k+'   ex: '+v.join(', ')).sort();

    // spacing: all non-zero margins and paddings on block elements
    const sp = new Map();
    document.querySelectorAll('section,div,p,h1,h2,h3,footer,article,details,summary,a,button,span').forEach(el=>{
      const b = el.getBoundingClientRect(); if (!b.width||!b.height) return;
      const cs = getComputedStyle(el);
      for (const prop of ['marginTop','marginBottom','paddingTop','paddingBottom','paddingLeft','paddingRight','marginLeft','marginRight','gap','rowGap','columnGap']) {
        const v = cs[prop]; if (!v || v==='0px' || v==='normal' || v==='auto') continue;
        const n = parseFloat(v); if (!isFinite(n) || n===0) continue;
        const k = Math.round(n*100)/100;
        if (!sp.has(k)) sp.set(k, new Set());
        if (sp.get(k).size<4) sp.get(k).add(prop+' on '+(el.className&&typeof el.className==='string'?'.'+el.className.split(' ')[0]:el.tagName.toLowerCase()));
      }
    });
    res.space = [...sp.entries()].sort((a,b)=>a[0]-b[0]).map(([k,v])=>k+'px  <- '+[...v].join(', '));

    // overflow
    res.overflow = { scrollW: document.documentElement.scrollWidth, innerW: innerWidth };
    const wide=[];
    document.querySelectorAll('*').forEach(el=>{ const b=el.getBoundingClientRect(); if (b.right > innerWidth+1 || b.left < -1) wide.push([(el.className&&typeof el.className==='string'?'.'+el.className.split(' ')[0]:el.tagName.toLowerCase()), Math.round(b.left), Math.round(b.right)]); });
    res.overflowers = wide.slice(0,25);
    res.docHeight = document.documentElement.scrollHeight;
    return res;
  });
  out['w'+W] = r;
  await page.close();
}

// ---------- B. prompt panel height across all eight phrases ----------
for (const W of [1440, 900, 412, 360, 320]) {
  const page = await browser.newPage();
  await page.setViewport({width:W,height:900,deviceScaleFactor:1});
  await page.goto(BASE,{waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,600));
  const r = await page.evaluate(() => {
    const IDEAS = ['a coastal kart racer','a night market chase','a lighthouse platformer','a submarine salvage sim',
                   'a rooftop parkour run','a desert train heist','a haunted arcade','a game nobody has made yet'];
    const slot = document.getElementById('slot');
    const panel = document.querySelector('.panel');
    const hs = [];
    for (const t of IDEAS) { slot.textContent = t; hs.push([t, Math.round(panel.getBoundingClientRect().height*100)/100, Math.round(slot.getBoundingClientRect().right - document.querySelector('.panel .inner').getBoundingClientRect().left)]); }
    return { hs, innerW: document.querySelector('.panel .inner').getBoundingClientRect().width, scrollW: document.documentElement.scrollWidth, innerWidth };
  });
  out['panel'+W] = r;
  await page.close();
}

// ---------- C. tab order + focus visibility ----------
{
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  await page.goto(BASE,{waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,600));
  const seq = [];
  for (let i=0;i<40;i++){
    await page.keyboard.press('Tab');
    const info = await page.evaluate(()=>{
      const a = document.activeElement; if (!a || a===document.body) return null;
      const cs = getComputedStyle(a);
      const b = a.getBoundingClientRect();
      return { tag:a.tagName.toLowerCase(), cls:(typeof a.className==='string'?a.className:''), txt:(a.textContent||'').trim().slice(0,26),
               outline: cs.outlineStyle+' '+cs.outlineWidth+' '+cs.outlineColor, offset: cs.outlineOffset,
               w: Math.round(b.width), h: Math.round(b.height), vis: b.width>0&&b.height>0 };
    });
    if (!info) { seq.push('<body / left document>'); break; }
    seq.push(info);
  }
  out.tab = seq;
  await page.close();
}

// ---------- D. tab order on entries view ----------
{
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  await page.goto(BASE+'#entries',{waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,600));
  const seq = [];
  for (let i=0;i<30;i++){
    await page.keyboard.press('Tab');
    const info = await page.evaluate(()=>{
      const a = document.activeElement; if (!a || a===document.body) return null;
      const cs = getComputedStyle(a); const b=a.getBoundingClientRect();
      return { tag:a.tagName.toLowerCase(), cls:(typeof a.className==='string'?a.className:''), txt:(a.textContent||'').trim().slice(0,22), outline: cs.outlineStyle+' '+cs.outlineWidth, w:Math.round(b.width),h:Math.round(b.height) };
    });
    if (!info) { seq.push('<left document>'); break; }
    seq.push(info);
  }
  out.tabEntries = seq;
  // hidden-view focus trap check: are jam-view controls still tabbable while hidden?
  out.hiddenFocusable = await page.evaluate(()=>{
    const jam = document.getElementById('view-jam');
    const n = jam.querySelectorAll('a[href],button,summary,[tabindex]').length;
    const focusable = [...jam.querySelectorAll('a[href],button')].filter(el=>el.getBoundingClientRect().width>0).length;
    return { total:n, stillLaidOut: focusable, jamHidden: jam.hidden };
  });
  await page.close();
}

// ---------- E. every pixel-font string on the page ----------
for (const view of ['', '#entries']) {
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  await page.goto(BASE+view,{waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,900));
  const strings = await page.evaluate(()=>{
    const res = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walk.nextNode())) {
      const t = n.textContent; if (!t.trim()) continue;
      const el = n.parentElement; if (!el) continue;
      const b = el.getBoundingClientRect(); if (!b.width && !b.height) continue;
      const cs = getComputedStyle(el);
      const fam = cs.fontFamily.split(',')[0].replace(/["']/g,'');
      if (fam !== 'fourzerofourpixel') continue;
      const tt = cs.textTransform;
      res.push({ txt: tt==='uppercase' ? t.toUpperCase() : t, raw: t, transform: tt, sel: el.tagName.toLowerCase()+(typeof el.className==='string'&&el.className?'.'+el.className.split(' ').join('.'):'') });
    }
    // pseudo elements too
    for (const el of document.querySelectorAll('*')) {
      for (const pe of ['::before','::after']) {
        const cs = getComputedStyle(el, pe);
        const c = cs.content;
        if (!c || c==='none' || c==='normal') continue;
        const fam = cs.fontFamily.split(',')[0].replace(/["']/g,'');
        if (fam !== 'fourzerofourpixel') continue;
        const raw = c.replace(/^"|"$/g,'');
        res.push({ txt: cs.textTransform==='uppercase'?raw.toUpperCase():raw, raw, transform: cs.textTransform, sel: el.tagName.toLowerCase()+(typeof el.className==='string'&&el.className?'.'+el.className.split(' ').join('.'):'')+pe });
      }
    }
    return res;
  });
  out['pix'+(view||'jam')] = strings;
  await page.close();
}

await browser.close(); server.close();
fs.writeFileSync('/Users/atlas/404_jam_site/work/verify/audit.json', JSON.stringify(out,null,1));
console.log('written');
