import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {createApp} from '../server/index';
import {CHARACTERS} from '../shared/catalog';
import {tribeFor,hasTribe} from '../shared/tribes';
import {mkdir} from 'node:fs/promises';

const server=await createApp(true);
await new Promise<void>(resolve=>server.http.listen(0,'127.0.0.1',resolve));
const {port}=server.http.address() as {port:number};
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${port}`);
 await page.getByText('Szerver online',{exact:true}).waitFor();
 const toggle=page.getByRole('button',{name:'Kártyakatalógus',exact:true});
 await toggle.click();
 const dialog=page.getByRole('dialog',{name:'Kártyakatalógus'});
 await dialog.waitFor();
 assert.equal(await dialog.locator('.pool-card').count(),0);
 await dialog.getByText('Indíts egy mérkőzést az aktív törzsek és kártyák megtekintéséhez.').waitFor();
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Mérkőzés indítása'}).click();
 await page.locator('.hero-offer').first().waitFor();
 const match=[...server.sessions.values()][0].match;
 const active=CHARACTERS.filter(c=>match.activeCardIds.includes(c.id));
 await toggle.click();
 assert.equal(await dialog.locator('.pool-card').count(),80);
 await mkdir('test-results',{recursive:true});
 await page.screenshot({path:'test-results/catalog-templates.png',fullPage:true});
 assert.equal(await dialog.locator('.pool-card>.tribe-surface').count(),80);
 assert.equal(await dialog.locator('.pool-card img').count(),0);
 assert.equal(await dialog.getByRole('combobox',{name:'Törzs'}).locator('option').count(),8);
 assert.deepEqual((await dialog.locator('.pool-card').evaluateAll(cards=>cards.map(c=>Number(c.getAttribute('data-card-id'))))).sort((a,b)=>a-b),match.activeCardIds);
 assert.equal(await dialog.locator('.pool-tier').count(),6);
 for(let tier=1;tier<=6;tier++) {
  await dialog.getByRole('button',{name:new RegExp(`^${tier}\\. szint`)}).click();
  assert.equal(await dialog.locator('.pool-card').count(),active.filter(c=>c.tier===tier).length);
  assert.ok((await dialog.locator('.pool-card').evaluateAll(cards=>cards.map(c=>c.getAttribute('data-tier')))).every(t=>t===String(tier)));
 }
 await dialog.getByRole('button',{name:/^Összes/}).click();
 for(const tribe of match.activeTribes) {
  await dialog.getByRole('combobox',{name:'Törzs'}).selectOption(tribe);
  assert.equal(await dialog.locator('.pool-card').count(),active.filter(c=>hasTribe(c,tribe)).length);
  await dialog.getByRole('button',{name:/^1\. szint/}).click();
  assert.equal(await dialog.locator('.pool-card').count(),active.filter(c=>hasTribe(c,tribe)&&c.tier===1).length);
  await dialog.getByRole('button',{name:/^Összes/}).click();
 }
 await dialog.getByRole('combobox',{name:'Törzs'}).selectOption('');
 for(const [type,count] of [['neutral',12],['all',8]] as const){
  await dialog.getByRole('combobox',{name:'Törzs'}).selectOption(type);
  assert.equal(await dialog.locator('.pool-card').count(),count);
  assert.ok((await dialog.locator('.pool-card').evaluateAll(cards=>cards.map(c=>c.getAttribute('data-tribe')))).every(value=>value===type));
 }
 await dialog.getByRole('combobox',{name:'Törzs'}).selectOption('');
 await dialog.getByRole('searchbox',{name:'Keresés'}).fill(active[0].name);
 assert.equal(await dialog.locator('.pool-card').count(),1);
 assert.ok((await dialog.locator('.pool-card').innerText()).includes('Támadás'));
 assert.ok((await dialog.locator('.pool-card').innerText()).includes(active[0].text));
 const inactive=CHARACTERS.find(c=>!match.activeCardIds.includes(c.id))!;
 await dialog.getByRole('searchbox',{name:'Keresés'}).fill(inactive.name);
 assert.equal(await dialog.locator('.pool-card').count(),0);
 await dialog.getByRole('searchbox',{name:'Keresés'}).fill('not-a-card-name');
 await dialog.getByText('Nincs a keresésnek megfelelő kártya ezen a szinten.').waitFor();
 await page.keyboard.press('Escape');
 await dialog.waitFor({state:'detached'});
 assert.equal(await toggle.evaluate(el=>el===document.activeElement),true);
 await page.locator('.hero-offer').first().click();
 await page.locator('.shop .unit').first().waitFor();
 await toggle.click();
 assert.equal(await dialog.locator('.pool-card').count(),80);
 await page.reload();
 await page.locator('.shop .unit').first().waitFor();
 await toggle.click();
 assert.equal(await dialog.locator('.pool-card').count(),80);
 await page.setViewportSize({width:390,height:844});
 const bounds=await dialog.boundingBox();
 assert.ok(bounds&&bounds.x>=0&&bounds.x+bounds.width<=390);
 assert.equal(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth),true);
 await dialog.getByRole('button',{name:'Kártyakatalógus bezárása'}).click();
 await page.locator('.shop .unit').first().click();
 await page.locator('.hand .unit').waitFor();
 assert.equal(await page.locator('.unit img').count(),0);
 assert.ok(await page.locator('.shop .unit>.tribe-surface').count()>0);
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:'test-results/game-templates.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('Match-only roster, five tribe filters, combined tiers, inactive-card exclusion, search, reload, keyboard and mobile checks passed.');
}finally {await browser.close();await server.close();}
