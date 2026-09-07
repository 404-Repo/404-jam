import { createServer } from 'http'; import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const puppeteer=createRequire('/Users/atlas/drive/recipe/node_modules/x.js')('puppeteer');
const ROOT='/Users/atlas/404_jam_site';
const MIME={'.html':'text/html','.mp4':'video/mp4','.jpg':'image/jpeg','.png':'image/png','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=createServer((req,res)=>{let rel=decodeURIComponent(req.url.split('?')[0]);if(rel==='/')rel='/index.html';
 const f=path.join(ROOT,rel); if(!f.startsWith(ROOT)||!fs.existsSync(f)){res.writeHead(404);return res.end('nf');}
 res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const BASE=`http://127.0.0.1:${server.address().port}/`;
const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const page=await b.newPage(); await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
await page.goto(BASE,{waitUntil:'networkidle2'}); await new Promise(r=>setTimeout(r,400));
console.log(JSON.stringify(await page.evaluate(()=>{
  const g=(sel,pe)=>{const e=document.querySelector(sel); if(!e) return 'missing';
    const c=getComputedStyle(e,pe||null); return {fs:c.fontSize, ls:c.letterSpacing, lh:c.lineHeight, ff:c.fontFamily.split(',')[0], va:c.verticalAlign};};
  return {
    faqMarker:g('.faq summary','::before'),
    tbdInDate:g('.tcell.now .d .tbd','::after'),
    tbdInDateParent:g('.tcell.now .d .tbd'),
    tbdInStep:g('#how .tbd','::after'),
    tbdInH1none:g('.stage .tbd','::after'),
    tbdInTagline:g('.stage .tagline .tbd'),
    stepN:g('.step .n'),
    barMark:g('.bar .mark'), footMark:g('footer .mark'),
    pixBase:g('.tcell .pix'), emptyEl:g('#empty'),
  };
},null),null,1));
await b.close(); server.close();
