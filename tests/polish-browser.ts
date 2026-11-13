import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try{
 const p=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'no-preference'});const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:5173');await p.getByText('Szerver online',{exact:true}).waitFor();await p.getByRole('button',{name:'Mérkőzés indítása'}).click();await p.getByRole('button').filter({hasText:'Őt választom'}).first().click();await p.getByText('Kínálat • 3 arany / egység').waitFor();await p.getByRole('button',{name:'Tesztpad',exact:false}).click();
 // Reach a representative battle through the public controls, using the real server.
 for(let i=0;i<13;i++){await p.getByRole('button',{name:'Bot lépés a saját helyemen is'}).click();await p.waitForTimeout(100);}
 await p.getByRole('button',{name:'Szünet',exact:false}).click();
 let motion=false,damage=false,buff=false;
 for(let i=0;i<25;i++){
  const button=p.getByRole('button',{name:'Esemény léptetése'});if(await button.isDisabled())break;
  await button.click();await p.waitForTimeout(190);
  const moving=await p.locator('.unit-wrap').evaluateAll(nodes=>nodes.some(n=>n.getAnimations().some(a=>a.playState==='running')&&getComputedStyle(n).transform!=='none'));
  motion ||= moving;await p.waitForTimeout(130);
  if(await p.locator('.battle-float.damage').count()){damage=true;await p.screenshot({path:'test-results/impact-polished.png',fullPage:true});}
  buff ||= (await p.locator('.combat-mark').count())>0;
  if(motion&&damage&&buff)break;
 }
 assert.ok(motion,'Attack motion did not run');assert.ok(damage,'Damage feedback absent');assert.ok(buff,'Temporary buffs absent');
 await p.getByRole('button',{name:'Következő kör'}).click();await p.getByText('Kínálat • 3 arany / egység').waitFor();
 await p.screenshot({path:'test-results/arena-polished.png',fullPage:true});
 await p.setViewportSize({width:390,height:844});await p.getByRole('button',{name:'Tesztpad',exact:false}).click();await p.screenshot({path:'test-results/mobile-polished.png',fullPage:true});
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 // Reduced motion must suppress travel and shake, while retaining static combat feedback.
 await p.emulateMedia({reducedMotion:'reduce'});await p.getByRole('button',{name:'Harc indítása'}).or(p.getByRole('button',{name:'Harc megtekintése'})).click();await p.getByRole('button',{name:'Tesztpad',exact:false}).click();await p.getByRole('button',{name:'Esemény léptetése'}).click();await p.waitForTimeout(100);
 const waapi=await p.locator('.arena,.unit-wrap').evaluateAll(nodes=>nodes.flatMap(n=>n.getAnimations()).filter(a=>a.playState==='running').length);assert.equal(waapi,0);
 assert.deepEqual(errors,[]);const report={attackMotion:motion,damageFeedback:damage,temporaryBuffs:buff,reducedMotion:true,mobileOverflow:false,consoleErrors:errors};await writeFile('test-results/polish.json',JSON.stringify(report,null,2));console.log(report);
}finally{await browser.close();}
