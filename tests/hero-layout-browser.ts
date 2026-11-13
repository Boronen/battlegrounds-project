import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createApp} from '../server/index';
import {HEROES} from '../shared/catalog';
import {makeUnit} from '../shared/engine';

const server=await createApp(true);
await new Promise<void>(resolve=>server.http.listen(0,'127.0.0.1',resolve));
const {port}=server.http.address() as {port:number};
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
await mkdir('test-results',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${port}`);
 await page.getByText('Szerver online',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Mérkőzés indítása'}).click();
 await page.locator('.hero-offer').first().waitFor();
 for(const width of [1440,390]) {
  await page.setViewportSize({width,height:1100});
  await page.locator('.hero-offer img').evaluateAll(async images=>Promise.all(images.map(img=>(img as HTMLImageElement).decode())));
  assert.equal(await page.locator('.hero-offer').count(),3);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:'test-results/hero-selection-'+width+'.png',fullPage:true});
 }
 await page.setViewportSize({width:1440,height:1100});
 await page.locator('.hero-offer').first().click();
 await page.locator('.shop .unit').first().waitFor();
 const session=[...server.sessions.values()][0];
 const m=session.match,p=m.players[0];
 const active=m.activeCardIds[0];
 m.pool[active]-=7;p.board=Array.from({length:7},()=>makeUnit(m,active));
 // Reconnect to receive the representative full warband through the real snapshot.
 await page.reload();
 await page.locator('.board .unit').nth(6).waitFor();
 for(const width of [1440,1000,390]) {
  await page.setViewportSize({width,height:1100});
  const arena=await page.locator('.arena').boundingBox();
  assert.equal(await page.locator('.arena>.hero-dock').count(),1);
  const portrait=await page.locator('.player-hero').boundingBox();
  const hand=await page.locator('.hand-dock').boundingBox();
  assert.ok(arena&&hand&&portrait);
  assert.ok(portrait.y>arena.y+arena.height*.70&&portrait.y+portrait.height<arena.y+arena.height,`hero portrait is inside its original board position at ${width}`);
  assert.ok(hand.y>=arena.y+arena.height,`hand overlaps arena at ${width}`);
  for(const card of await page.locator('.board .unit').all()) {
   const bounds=await card.boundingBox();
   assert.ok(bounds&&(bounds.y+bounds.height<portrait.y || bounds.x+bounds.width<portrait.x || bounds.x>portrait.x+portrait.width),JSON.stringify({width,bounds,portrait}));
  }
  assert.equal(await page.locator('.mini-portrait img').count(),8);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  if(width===1440)await page.screenshot({path:'test-results/hero-dock-desktop.png',fullPage:true});
  if(width===390)await page.screenshot({path:'test-results/hero-dock-mobile.png',fullPage:true});
 }
 await page.setViewportSize({width:1440,height:1100});
 assert.equal(await page.locator('.arena .hero-frame').count(),2);
 const tavernGem=await page.locator('.player-hero .hero-frame-gem').evaluate(el=>getComputedStyle(el).fill);
 await page.locator('.round-actions .primary').click();
 await page.locator('.arena.in-combat').waitFor();
 assert.equal(await page.locator('.arena .hero-frame').count(),2);
 const combatGem=await page.locator('.player-hero .hero-frame-gem').evaluate(el=>getComputedStyle(el).fill);
 assert.notEqual(tavernGem,combatGem);
 await page.screenshot({path:'test-results/hero-frames-combat.png',fullPage:true});
 assert.deepEqual(errors,[]);
 // A contact sheet uses the actual local portrait SVGs for visual review.
 const cards=await Promise.all(HEROES.map(async h=>`<figure><img src="data:${h.portrait.endsWith('.png')?'image/png':'image/svg+xml'};base64,${(await readFile(new URL('../public'+h.portrait,import.meta.url))).toString('base64')}"/><figcaption>${h.name}</figcaption></figure>`));
 const html=`<!doctype html><html lang="hu"><meta charset="utf-8"><title>Hero avatars</title><style>*{box-sizing:border-box}body{margin:0;padding:32px;background:#1c2029;color:#f2e5cb;font:16px Georgia}h1{margin:0 0 24px;font-size:30px}main{display:grid;grid-template-columns:repeat(9,1fr);gap:18px}figure{margin:0;text-align:center}img{width:100%;height:auto;display:block}figcaption{padding:8px 0;font-size:14px}</style><h1>34 hős · külön karakterek</h1><main>${cards.join('')}</main></html>`;
 await writeFile('test-results/hero-portraits.html',html);
 await page.setViewportSize({width:1440,height:1100});await page.setContent(html);
 await page.screenshot({path:'test-results/hero-portraits.png',fullPage:true});
 console.log('Distinct portraits and a full warband verified at desktop, tablet and mobile widths; hero portrait stays in its original board position.');
}finally {await browser.close();await server.close();}

