import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
 const p=await browser.newPage({viewport:{width:1600,height:1050},reducedMotion:'no-preference'});const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{const counts={tones:0,buffers:0};(window as unknown as {audioCounts:typeof counts}).audioCounts=counts;const tone=AudioContext.prototype.createOscillator,noise=AudioContext.prototype.createBufferSource;AudioContext.prototype.createOscillator=function(){counts.tones++;return tone.call(this);};AudioContext.prototype.createBufferSource=function(){counts.buffers++;return noise.call(this);};});
 await p.goto('http://127.0.0.1:5173');await p.getByText('Szerver online',{exact:true}).waitFor();await p.getByRole('button',{name:'Mérkőzés indítása'}).click();await p.getByRole('button').filter({hasText:'Őt választom'}).first().click();await p.getByText('Kínálat • 3 arany / egység').waitFor();
 assert.ok(await p.locator('.player-hero img').getAttribute('src'));assert.ok(await p.locator('.keeper-avatar img').getAttribute('src'));
 const image=await p.locator('.arena').evaluate(el=>getComputedStyle(el).backgroundImage);assert.ok(image.includes('classroom-arena.png'));
 await p.locator('.shop .unit').first().click();await p.locator('.hand .unit').click();
 const sounds=await p.evaluate(()=>(window as unknown as {audioCounts:{tones:number;buffers:number}}).audioCounts);assert.ok(sounds.tones>0);assert.ok(sounds.buffers>0);
 await p.getByRole('button',{name:'Hang kikapcsolása'}).click();const muted=await p.evaluate(()=>(window as unknown as {audioCounts:{tones:number;buffers:number}}).audioCounts);
 await p.getByRole('button',{name:'Harc indítása'}).click();await p.waitForTimeout(1800);
 assert.deepEqual(await p.evaluate(()=>(window as unknown as {audioCounts:{tones:number;buffers:number}}).audioCounts),muted);
 await p.getByRole('button',{name:'Következő kör'}).click();await p.getByRole('button',{name:'Tesztpad',exact:false}).click();for(let i=0;i<10;i++){await p.getByRole('button',{name:'Bot lépés a saját helyemen is'}).click();await p.waitForTimeout(100);}
 await p.screenshot({path:'test-results/classroom-board-desktop.png',fullPage:true});
 await p.setViewportSize({width:390,height:844});await p.getByRole('button',{name:'Tesztpad',exact:false}).click();await p.waitForTimeout(100);await p.screenshot({path:'test-results/classroom-board-mobile.png',fullPage:true});
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const viewport=p.locator('.board-viewport');assert.ok(await viewport.evaluate(el=>el.scrollWidth>el.clientWidth));
 assert.deepEqual(errors,[]);await writeFile('test-results/board-audio.json',JSON.stringify({mapLoaded:true,selectedHeroPortrait:true,audioNodes:sounds,mutingPreventsSounds:true,mobileBoardScrollable:true,consoleErrors:errors},null,2));console.log('Board, portraits, audio and mute checks passed.');
}finally{await browser.close();}
