import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createApp} from '../server/index';
import {makeUnit} from '../shared/engine';
import {fight} from '../shared/combat';
import {ARENAS,arenaForMatch} from '../src/arenas';
import {combatBeats} from '../src/combat-presentation';

await mkdir('test-results/arena-redesign',{recursive:true});
const server=await createApp(true);
await new Promise<void>(resolve=>server.http.listen(0,'127.0.0.1',resolve));
const {port}=server.http.address() as {port:number};
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce',hasTouch:true});
const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
const path='test-results/arena-redesign';
const sheet:{label:string;image:string}[]=[];
const overflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
try{
 await page.goto(`http://127.0.0.1:${port}`);await page.locator('.start-button:enabled').waitFor();
 await page.screenshot({path:`${path}/lobby-desktop.png`,fullPage:true});
 await page.setViewportSize({width:390,height:844});await overflow();await page.screenshot({path:`${path}/lobby-mobile.png`,fullPage:true});
 await page.getByRole('button',{name:'Mérkőzés indítása'}).click();await page.locator('.hero-offer').first().waitFor();await overflow();
 assert.equal(await page.locator('.hero-offer').count(),3);await page.screenshot({path:`${path}/hero-mobile.png`,fullPage:true});
 await page.locator('.hero-offer').first().click();await page.locator('.shop .unit').first().waitFor();
 const session=[...server.sessions.values()][0],m=session.match;
 // Real buy, drag/play, reorder and mounted sell target, with snapshots and ACKs.
 await page.setViewportSize({width:1440,height:1100});
 await page.locator('.shop .unit').first().hover();
 await page.locator('.card-preview:visible .tribe-surface').waitFor();
 await page.locator('.shop .unit').first().dragTo(page.locator('.hand-dock'));
 await page.locator('.hand .unit').waitFor();await page.locator('.hand .unit').dragTo(page.locator('.board-zone'));
 await page.locator('.board .unit').waitFor();await page.locator('.board .unit').click();
 await page.getByRole('button',{name:'Kijelölt egység eladása'}).click();await page.locator('.board .unit').waitFor({state:'detached'});
 await page.locator('.freeze-control').click();await page.waitForFunction(()=>document.querySelector('.freeze-control')?.getAttribute('aria-pressed')==='true');
 await page.locator('.freeze-control').click();
 await page.waitForFunction(()=>document.querySelector('.freeze-control')?.getAttribute('aria-pressed')==='false');
 await page.locator('.freeze-control').focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelector('.freeze-control')?.getAttribute('aria-pressed')==='true');
 assert.ok(await page.locator('.freeze-control').evaluate(el=>el.matches(':focus-visible')));
 await page.keyboard.press('Enter');
 await page.waitForFunction(()=>document.querySelector('.freeze-control')?.getAttribute('aria-pressed')==='false');
 let p=m.players[0];
 const id=m.activeCardIds[0];p.board=Array.from({length:7},()=>makeUnit(m,id));p.gold=10;p.upgradeCost=5;
 const enemy=m.players[1];enemy.board=Array.from({length:7},()=>makeUnit(m,id));m.pairings=[['p0',enemy.id]];
 for(const arena of ARENAS){
  let n=0;while(arenaForMatch(`visual-${n}`).id!==arena.id)n++;m.id=`visual-${n}`;
  for(const width of [1440,1000]){
   await page.setViewportSize({width,height:1100});
   for(const phase of ['recruit','combat'] as const){
    m.phase=phase;session.paused=true;
    m.battles=[{leftId:'p0',rightId:enemy.id,ghost:false,events:fight(p.board,enemy.board,42).events,winner:null,damage:0}];
    await page.reload();await page.locator('.board .unit').nth(6).waitFor();
    await page.locator('.arena').evaluate(el=>new Promise<void>(resolve=>{const img=new Image();img.onload=()=>resolve();img.onerror=()=>resolve();img.src=getComputedStyle(el).backgroundImage.slice(5,-2);}));
    assert.equal(await page.locator('.arena').getAttribute('data-arena'),arena.id);await overflow();
    const controls=page.locator('.shop-actions button,.round-actions .primary');
    for(const control of await controls.all()){
     const box=await control.boundingBox();assert.ok(box&&box.height>=44);
     assert.ok(await control.evaluate(el=>{const r=el.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return !!hit&&el.contains(hit);}));
     if(phase==='combat'&&await control.evaluate(el=>!!el.closest('.shop-actions')))assert.ok(await control.isDisabled());
    }
    const png=await page.locator('.board-viewport').screenshot({path:`${path}/${arena.id}-${phase}-${width}.png`});
    sheet.push({label:`${arena.name} · ${phase} · ${width}`,image:png.toString('base64')});
   }
  }
 }
 m.phase='recruit';session.paused=false;p.gold=0;
 await page.setViewportSize({width:390,height:844});await page.reload();await page.locator('.board .unit').nth(6).waitFor();await overflow();
 assert.ok(await page.locator('.board-viewport').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
 assert.ok(await page.locator('.upgrade-control').isDisabled());assert.ok(await page.locator('.refresh-control').isDisabled());
 await page.screenshot({path:`${path}/board-mobile.png`,fullPage:true});
 // Artwork is decorative: controls remain available even when background images fail.
 await page.route('**/boards/tribes/**',route=>route.abort());await page.reload();await page.locator('.freeze-control').waitFor();
 await page.locator('.freeze-control').scrollIntoViewIfNeeded();await page.locator('.freeze-control').tap();
 await page.waitForFunction(()=>document.querySelector('.freeze-control')?.getAttribute('aria-pressed')==='true');await page.unroute('**/boards/tribes/**');
 // A genuine combat with consumed keywords exercises the mounted presentation.
 p=m.players[0];
 p.board=[{...makeUnit(m,id),attack:3,health:40,keywords:['venomous','windfury','stealth'],shield:true}];
 enemy.board=[{...makeUnit(m,id),attack:2,health:5,shield:true,keywords:['reborn']}];
 const events=fight(p.board,enemy.board,42).events;
 m.phase='combat';session.paused=true;m.battles=[{leftId:'p0',rightId:enemy.id,ghost:false,events,winner:null,damage:0}];
 await page.setViewportSize({width:1440,height:1100});await page.emulateMedia({reducedMotion:'no-preference'});await page.reload();await page.locator('.arena.in-combat').waitFor();
 await page.locator('.tools-toggle').click();await page.locator('.test-panel select').selectOption('0.5');
 const beats=combatBeats(events);
 for(let i=1;i<beats.length;i++){
  await page.getByRole('button',{name:'Esemény léptetése'}).click();
  if(beats[i].events.some(e=>e.type==='damage')) await page.locator('.card-hit').first().waitFor();
 }
 await page.getByRole('button',{name:'Következő kör'}).click();await page.locator('.shop .unit').first().waitFor();await page.waitForTimeout(700);
 assert.equal(await page.locator('.card-hit').count(),0);assert.equal(await page.locator('.arena,.unit-wrap').evaluateAll(nodes=>nodes.flatMap(n=>n.getAnimations()).filter(a=>a.playState==='running').length),0);
 assert.deepEqual(errors,[]);
 await writeFile(`${path}/report.json`,JSON.stringify({arenas:10,screenshots:sheet.length,controlHitAreas:true,keyboardFocusAndActivation:true,touchActivation:true,dragDropAndSell:true,phoneBoardFits:true,missingArtworkFallback:true,combatMedia:true,interruptionCleanup:true,browserErrors:errors},null,2));
 await page.setViewportSize({width:1200,height:1100});
 await page.setContent(`<html><style>body{background:#101218;color:#ddd;font:14px sans-serif;margin:20px}main{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}figure{margin:0}img{width:100%}figcaption{padding:5px}</style><main>${sheet.map(s=>`<figure><img src="data:image/png;base64,${s.image}"><figcaption>${s.label}</figcaption></figure>`).join('')}</main></html>`);
 await page.screenshot({path:`${path}/all-arenas-contact-sheet.jpg`,type:'jpeg',quality:65,fullPage:true});
 console.log('Ten arena skins, 40 full-team views, real interactions, mobile layouts, VFX and cleanup passed.');
}finally{await browser.close();await server.close();}
