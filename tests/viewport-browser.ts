import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium,type Locator} from '@playwright/test';
import {createApp} from '../server/index';
import {makeUnit} from '../shared/engine';
import {character} from '../shared/catalog';
import {fight} from '../shared/combat';

const sizes=[[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[360,640],[320,568],[844,390]] as const;
const output='test-results/viewport';
await mkdir(output,{recursive:true});
const server=await createApp(true);
await new Promise<void>(resolve=>server.http.listen(0,'127.0.0.1',resolve));
const {port}=server.http.address() as {port:number};
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
const errors:string[]=[];
page.on('pageerror',err=>errors.push(err.message));
page.setDefaultTimeout(7000);
const defects:string[]=[];
async function hit(locator:Locator,label:string){
 for(const el of await locator.all()){
  const problem=await el.evaluate(node=>{
   const r=node.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;
   if(!r.width||!r.height||r.x<-.5||r.y<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5)return 'outside '+JSON.stringify(r.toJSON());
   const top=document.elementFromPoint(x,y);
   return top&&node.contains(top)?'':'covered by '+top?.closest('[class]')?.getAttribute('class');
  });
  if(problem)defects.push(label+' '+problem);
 }
}
async function fit(label:string){
 const d=await page.evaluate(()=>({width:innerWidth,height:innerHeight,docWidth:document.documentElement.scrollWidth,docHeight:document.documentElement.scrollHeight,y:scrollY}));
 if(d.docWidth>d.width+1||d.docHeight>d.height+1||d.y!==0)defects.push(label+' overflow '+JSON.stringify(d));
}
async function shot(label:string){await page.screenshot({path:output+'/'+label+'.png',animations:'disabled'});}
try{
 await page.addInitScript(()=>localStorage.setItem('battleSound','off'));
 await page.route('https://www.youtube.com/**',route=>route.abort());
 await page.goto('http://127.0.0.1:'+port);
 await page.locator('.start-button:enabled').waitFor();
 for(const [width,height] of sizes){
  await page.setViewportSize({width,height});
  await fit('lobby '+width);await hit(page.locator('.entry-card button'),'lobby '+width);
 }
 await page.setViewportSize({width:390,height:844});
 await shot('lobby-phone');
 await page.getByLabel('Játékmód').selectOption('manual');
 await page.getByLabel('Kezdőérték',{exact:false}).fill('62');
 await page.locator('.start-button').click();await page.locator('.hero-offer').first().waitFor();
 await page.locator('.hero-reroll button').click();
 await page.getByRole('button',{name:'Új hősök (2/3)'}).waitFor();
 for(const [width,height] of sizes){
  await page.setViewportSize({width,height});await fit('heroes '+width);
  await hit(page.locator('.hero-reroll button,.hero-offer'),'heroes '+width);
  if(width===390)await shot('heroes-phone');
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator('.hero-offer').first().click();
 await page.locator('.shop .unit').first().click();
 await page.locator('.hand .unit').first().click();
 await page.locator('.board .unit').first().waitFor();
 await page.locator('.freeze-control').click();
 await page.waitForFunction(()=>document.querySelector('.freeze-control')?.getAttribute('aria-pressed')==='true');
 await page.locator('.round-actions .primary').click();
 await page.locator('.arena.in-combat').waitFor();
 await page.locator('.round-actions .primary').click();await page.locator('.power-launch').waitFor();
 const session=[...server.sessions.values()][0],m=session.match,p=m.players[0];
 const ids=m.activeCardIds.filter(id=>character(id).tier<=5);
 const representative=['rally','death','turnStart','play','turnEnd','start','passive'].map(trigger=>ids.find(id=>character(id).ability.trigger===trigger)!);
 const examples=[...representative,...ids.filter(id=>!representative.includes(id))];
 const units=(n:number,offset=0)=>Array.from({length:n},(_,i)=>makeUnit(m,examples[i+offset]));
 m.round=12;p.tier=5;p.gold=10;p.upgradeCost=5;p.board=units(7);p.shop=units(6,7);p.hand=units(10,13);
 p.board[2]=makeUnit(m,p.board[2].characterId,true);
 p.board[2].attack=236;p.board[2].health=174;
 await page.reload();await page.locator('.board .unit').nth(6).waitFor();
 for(const [width,height] of sizes){
  await page.setViewportSize({width,height});await page.waitForTimeout(75);
  const label=width+'x'+height;
  await fit(label);await hit(page.locator('.board .unit,.shop .unit,.power-launch,.shop-actions button,.round-actions .primary,.inspect-toggle'),label);
  await shot('board-'+label);
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator('.power-launch').click();await page.getByRole('dialog',{name:'Hősképesség és varázslatok'}).waitFor();await shot('powers-phone');await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Tabella',exact:true}).click();assert.equal(await page.locator('dialog[open] .standing').count(),8);await page.keyboard.press('Escape');
 await page.locator('.settings-toggle').click();await page.locator('.motion-toggle').click();await page.keyboard.press('Escape');
 await page.locator('.card-pool-toggle').click();await page.locator('.pool-card').first().waitFor();await page.keyboard.press('Escape');
 await page.locator('.inspect-toggle').click();await page.locator('.shop .unit').last().tap();await page.getByRole('dialog',{name:character(p.shop[5]!.characterId).name}).waitFor();await page.keyboard.press('Escape');
 await page.locator('.inspect-toggle').click();await page.locator('.hand .unit').nth(9).scrollIntoViewIfNeeded();await page.locator('.hand .unit').nth(9).tap();await page.locator('.card-inspection').waitFor();await page.keyboard.press('Escape');
 await page.locator('.board .unit').nth(2).tap();await page.locator('.selection-actions .sell-button').tap();await page.waitForFunction(()=>document.querySelectorAll('.board .unit').length===6);
 await page.locator('.refresh-control').tap();await page.waitForFunction(()=>document.querySelector('.arena')?.getAttribute('aria-busy')==='false');
 await page.locator('.upgrade-control').tap();await page.waitForFunction(()=>document.querySelector('.upgrade-control')?.textContent?.includes('Max.'));
 const player=m.players[0];
 const opponent=m.players[1];player.board=units(7);opponent.board=units(7);
 m.phase='combat';session.paused=true;m.pairings=[[player.id,opponent.id]];
 m.battles=[{leftId:player.id,rightId:opponent.id,ghost:false,events:fight(player.board,opponent.board,81).events,winner:null,damage:0}];
 await page.reload();await page.locator('.enemy .unit').nth(6).waitFor();
 for(const [width,height] of sizes){
  await page.setViewportSize({width,height});await page.waitForTimeout(40);
  await fit('combat '+width);
  await hit(page.locator('.enemy .unit,.board .unit,.round-actions .primary'),'combat '+width);
  if(width===390)await shot('combat-phone');
 }
 m.phase='recruit';session.paused=false;await page.setViewportSize({width:390,height:844});
 player.hand=units(10);player.board.pop();player.discover=units(3);
 await page.reload();await page.getByText('Jutalom vár',{exact:false}).waitFor();
 await page.locator('.hand .unit').first().tap();
 await page.locator('.discover button').first().waitFor();await fit('discover phone');await hit(page.locator('.discover button'),'discover phone');await shot('discover-phone');
 await page.locator('.discover button').nth(1).tap();await page.locator('.discover').waitFor({state:'detached'});
 m.phase='finished';m.players.forEach((seat,i)=>seat.place=i+1);
 await page.reload();await page.locator('.result-overlay').waitFor();
 for(const [width,height] of [sizes[4],sizes[6],sizes[7]]){
  await page.setViewportSize({width,height});await fit('finish '+width);await hit(page.locator('.result-overlay button'),'finish '+width);
 }
 await page.locator('.result-overlay .primary').click();await page.locator('.start-button').waitFor();
 assert.deepEqual(errors,[]);assert.deepEqual(defects,[]);
 console.log('Eight viewports passed. Lobby, selection, shop, full boards on both sides, ten-card hand, powers, inspection, catalog, discover, combat and results are reachable.');
}finally{if(defects.length)console.error(defects);await browser.close();await server.close();}
