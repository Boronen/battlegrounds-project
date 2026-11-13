import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||(process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:5173');await page.getByText('Szerver online',{exact:true}).waitFor();
 await page.screenshot({path:'test-results/welcome.png',fullPage:true});
 await page.getByRole('button',{name:'Mérkőzés indítása'}).click();await page.getByRole('heading',{name:'Válassz hőst!'}).waitFor();await page.screenshot({path:'test-results/heroes.png',fullPage:true});
 await page.getByRole('button').filter({hasText:'Őt választom'}).first().click();await page.getByText('Kínálat • 3 arany / egység').waitFor();
 const buy=page.locator('.shop .unit').first();const name=(await buy.getAttribute('aria-label'))!.split(',')[0];await buy.click();await page.locator('.hand .unit').waitFor();await page.locator('.hand .unit').click();await page.locator('.board .unit').waitFor();
 await page.getByRole('button',{name:'Fagyasztás',exact:false}).click();await page.getByRole('button',{name:'Befagyasztva',exact:false}).waitFor();
 await page.reload();await page.locator('.board .unit').waitFor();assert.ok((await page.locator('.board .unit').getAttribute('aria-label'))!.includes(name));
 await page.screenshot({path:'test-results/recruit.png',fullPage:true});
 await page.getByRole('button',{name:'Harc indítása'}).click();await page.getByText('Az összecsapás elkezdődött').waitFor();await page.getByRole('button',{name:'Tesztpad',exact:false}).click();await page.getByRole('button',{name:'Szünet',exact:false}).click();await page.getByRole('button',{name:'Esemény léptetése'}).click();await page.screenshot({path:'test-results/combat.png',fullPage:true});
 await page.getByRole('button',{name:'Következő kör'}).click();await page.getByText('2. kör',{exact:true}).waitFor();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Visszajátszás exportálása'}).click();const download=await downloadPromise;await download.saveAs('test-results/replay.json');await page.locator('input[type=file]').setInputFiles('test-results/replay.json');await page.getByText('Egyező eredmény',{exact:false}).waitFor();
 await page.getByRole('button',{name:'Teljes meccs lefuttatása'}).click();await page.getByText('Vége a mérkőzésnek',{exact:true}).waitFor({timeout:60000});await page.screenshot({path:'test-results/results.png',fullPage:true});
 await page.getByRole('button',{name:'Új mérkőzés',exact:true}).last().click();await page.getByRole('button',{name:'Mérkőzés indítása'}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Tesztpad',exact:false}).click();await page.getByRole('button',{name:'Mérkőzés indítása'}).click();await page.getByRole('button').filter({hasText:'Őt választom'}).first().click();await page.getByText('Kínálat • 3 arany / egység').waitFor();await page.screenshot({path:'test-results/mobile.png',fullPage:true});
 const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));assert.ok(widths.scroll<=widths.width,JSON.stringify(widths));
 assert.deepEqual(errors,[]);await writeFile('test-results/browser.json',JSON.stringify({passed:true,desktop:'1440×1000',mobile:'390×844',scenarios:['start','hero','buy','play','freeze','reload/resume','combat','step','next round','export','replay verification','full match','mobile'],errors},null,2));console.log('Browser scenarios passed.');
}finally{await browser.close();}
