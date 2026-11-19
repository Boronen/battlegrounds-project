import assert from 'node:assert/strict';
import {chromium,type Locator} from '@playwright/test';
import {createApp} from '../server/index';

const server=await createApp(true);
await new Promise<void>(done=>server.http.listen(0,'127.0.0.1',done));
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
 for(const touch of [false,true]){
  const page=await browser.newPage({hasTouch:touch,viewport:touch?{width:390,height:844}:{width:1366,height:768}});
  const cdp=await page.context().newCDPSession(page);
  await page.goto('http://127.0.0.1:'+(server.http.address() as {port:number}).port);
  await page.getByLabel('Kezdőérték',{exact:false}).fill('1');
  await page.locator('.start-button:enabled').click();await page.locator('.hero-offer').first().click();
  await page.locator('.shop .unit').first().waitFor();
  assert.equal(await page.locator('.round-rope').count(),0);
  const session=[...server.sessions.values()].at(-1)!;session.deadline=Date.now()+19700;
  await page.reload();await page.locator('.round-rope').waitFor();
  const rope=page.locator('.round-rope i'),width=await rope.evaluate(el=>el.getBoundingClientRect().width);
  await page.waitForFunction(w=>document.querySelector('.round-rope i')!.getBoundingClientRect().width<w-2,width);
  async function drag(from:Locator,to:Locator){
   const label=await from.getAttribute('aria-label');
   const a=(await from.boundingBox())!,b=(await to.boundingBox())!;
   const start={x:a.x+a.width/2,y:a.y+a.height/2},end={x:b.x+b.width/2,y:b.y+b.height/2};
   if(touch){
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x,y:start.y+12}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[end]});
   }else{await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:6});}
   await page.locator('.card-in-flight').waitFor();await page.locator('.card-drop-target').waitFor();
   const held=await page.locator('.card-in-flight .unit').boundingBox();
   assert.ok(held&&end.x>=held.x&&end.x<=held.x+held.width&&end.y>=held.y&&end.y<=held.y+held.height,
    'The visible card must follow the pointer for '+(touch?'touch':'mouse')+' drags from '+label);
   if(touch)await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await page.mouse.up();
   await page.locator('.card-in-flight').waitFor({state:'detached'});
  }
  const toolbar=await Promise.all(['.tavern-tier','.upgrade-control','.keeper-avatar','.refresh-control','.freeze-control'].map(s=>page.locator(s).boundingBox()));
  for(let i=1;i<toolbar.length;i++)assert.ok(toolbar[i-1]!.x+toolbar[i-1]!.width<=toolbar[i]!.x);
  await drag(page.locator('.shop .unit').first(),page.locator('.board-zone'));
  await drag(page.locator('.hand .unit'),page.locator('.board-zone'));
  await drag(page.locator('.board .unit'),page.locator('.keeper-avatar'));
  await page.locator('.board .unit').waitFor({state:'detached'});
  assert.equal(session.match.players[0].gold,1);
  await page.locator('.round-actions .primary').click();await page.locator('.arena.in-combat').waitFor();
  assert.equal(await rope.count(),0);await page.close();
 }
 console.log('Mouse and touch purchase, play, sell and the shrinking final-20-second rope passed.');
}finally{await browser.close();await server.close();}
