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
const out={};
for(const w of [1440,1180,1040,1024,900,768,680,620,412,360]){
  const page=await browser.newPage();
  await page.setViewport({width:w,height:900,deviceScaleFactor:1});
  await page.goto(BASE+'#entries',{waitUntil:'networkidle2',timeout:60000});
  await new Promise(r=>setTimeout(r,800));
  out[w]=await page.evaluate(()=>{
    const box=e=>{const r=e.getBoundingClientRect();return [+r.x.toFixed(1),+r.y.toFixed(1),+r.width.toFixed(1),+r.height.toFixed(1)];};
    const all=s=>[...document.querySelectorAll(s)].map(e=>({b:box(e),t:(e.textContent||'').trim().slice(0,18)}));
    const h2s=[...document.querySelectorAll('#view-entries h2, #view-entries h1')].map(e=>({t:e.textContent.trim().slice(0,20),b:box(e)}));
    return {scrollW:document.documentElement.scrollWidth, inner:innerWidth,
      ehead:box(document.querySelector('.ehead')), h:h2s,
      filters:box(document.querySelector('.filters')), chips:all('.chip'),
      cards:all('.card'), grid:box(document.querySelector('.grid')),
      stats:all('#view-entries .stat'), statsBox:box(document.querySelector('#view-entries .stats')),
      cact:all('.cact a').slice(0,4), badges:all('.badge').slice(0,5),
      cols:box(document.querySelector('#view-entries .cols')),
    };
  });
  await page.close();
}
fs.writeFileSync('/Users/atlas/404_jam_site/work/critic_responsive/m3.json',JSON.stringify(out,null,1));
console.log('ok'); await browser.close(); server.close();
