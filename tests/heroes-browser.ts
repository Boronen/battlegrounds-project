import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(process.env.TEST_BASE_URL||'http://127.0.0.1:5173');
 await page.getByText('Szerver online',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Mérkőzés indítása'}).click();
 await page.locator('.hero-offer').first().waitFor();
 assert.equal(await page.locator('.hero-offer').count(),3);
 const seen=new Set(await page.locator('.hero-offer h2').allTextContents());
 for(let remaining=3;remaining>0;remaining--) {
  await page.getByRole('button',{name:'Új hősök ('+remaining+'/3)',exact:true}).click();
  await page.getByRole('button',{name:'Új hősök ('+(remaining-1)+'/3)',exact:true}).waitFor();
  const names=await page.locator('.hero-offer h2').allTextContents();
  assert.equal(names.length,3);
  for(const name of names){assert.ok(!seen.has(name));seen.add(name);}
  if(remaining===2){await page.reload();await page.locator('.hero-offer').first().waitFor();assert.deepEqual(await page.locator('.hero-offer h2').allTextContents(),names);}
 }
 assert.equal(seen.size,12);
 assert.equal(await page.getByRole('button',{name:'Új hősök (0/3)',exact:true}).isDisabled(),true);
 const offer=page.locator('.hero-offer').first();
 const name=await offer.locator('h2').innerText();
 const image=await offer.locator('img').getAttribute('src');
 assert.match(image!,/^\/portraits\/sketch\/([1-9]|[12][0-9]|3[0-4])\.png$/);
 assert.ok(await offer.locator('img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0));
 await offer.click();
 const power=page.locator('.hero-power button');
 await power.waitFor();
 assert.equal(await power.isDisabled(),true);
 assert.equal(await power.innerText(),'Hősképesség később');
 assert.equal(await page.locator('.hero-power strong').innerText(),name);
 assert.equal(await page.locator('.player-hero img').getAttribute('src'),image);
 assert.equal(await page.locator('.player-hero .hero-hp').innerText(),'30 ♥');
 assert.equal(await page.locator('.player-hero .armor').innerText(),'0 ◈');
 await page.locator('.shop .unit').first().click();
 await page.locator('.hand .unit').click();
 await page.locator('.board .unit').waitFor();
 await page.reload();
 await page.locator('.board .unit').waitFor();
 assert.equal(await page.locator('.hero-power strong').innerText(),name);
 assert.equal(await page.locator('.hero-power button').isDisabled(),true);
 assert.deepEqual(errors,[]);
 console.log('Hero selection, portrait, disabled power, recruitment and reconnect passed.');
} finally {await browser.close();}
