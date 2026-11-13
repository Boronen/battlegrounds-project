import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {createApp} from '../server/index';
import {createMatch,makeUnit} from '../shared/engine';
import {character} from '../shared/catalog';
import type {Keyword} from '../shared/types';

const keys:Keyword[]=['stealth','windfury','venomous','reborn'];
let seed=1;
for(;seed<1000;seed++){
 const m=createMatch(seed);
 if(keys.every(k=>m.activeCardIds.some(id=>character(id).keywords?.includes(k))))break;
}
assert.ok(seed<1000);
const server=await createApp(true);
await new Promise<void>(resolve=>server.http.listen(0,'127.0.0.1',resolve));
const {port}=server.http.address() as {port:number};
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
await mkdir('test-results',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${port}`);
 await page.locator('.start-button:enabled').waitFor();
 await page.locator('.start-settings input').fill(String(seed));
 await page.locator('.start-button').click();await page.locator('.hero-offer').first().click();
 await page.locator('.shop .unit').first().waitFor();
 const session=[...server.sessions.values()][0],m=session.match,p=m.players[0];
 for(const key of keys){const id=m.activeCardIds.find(id=>character(id).keywords?.includes(key))!;m.pool[id]--;p.board.push(makeUnit(m,id));}
 await page.reload();await page.locator('.board .unit').nth(3).waitFor();
 for(const key of keys)assert.equal(await page.locator(`.board .unit .keyword-${key}`).count(),1);
 await page.screenshot({path:'test-results/keyword-board.png',fullPage:true});
 await page.locator('.card-pool-toggle').click();
 await page.locator('.pool-filters input').fill('venomous');
 assert.ok(await page.locator('.pool-card').count()>0);
 assert.equal(await page.locator('.pool-card .keyword-venomous').count(),await page.locator('.pool-card').count());
 await page.screenshot({path:'test-results/keyword-catalog.png',fullPage:true});
 await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:1000});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.screenshot({path:'test-results/keyword-mobile.png',fullPage:true});
 await page.reload();await page.locator('.board .unit').nth(3).waitFor();
 assert.equal(await page.locator('.board .unit-keywords').count(),4);
 assert.deepEqual(errors,[]);
 console.log('All four keyword badges, catalog search, mobile overflow and reconnect passed.');
}finally {await browser.close();await server.close();}
