import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createApp} from '../server/index';
import {makeUnit} from '../shared/engine';
import {fight} from '../shared/combat';
import clips from '../src/series-audio.json';
import {CHARACTERS} from '../shared/catalog';
import {HERO_MUSIC} from '../src/hero-media';
const server=await createApp(true);await new Promise<void>(r=>server.http.listen(0,'127.0.0.1',r));
const {port}=server.http.address() as {port:number};
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const page=await browser.newPage({viewport:{width:1440,height:1100}});
const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
await mkdir('test-results/media',{recursive:true});
// Deterministic YouTube contract stub; local files below are really fetched and decoded.
await page.route('https://www.youtube.com/iframe_api',route=>route.fulfill({contentType:'application/javascript',body:`window.musicCalls=[];window.YT={Player:class {constructor(el,o){this.o=o;el.innerHTML='<iframe title="YouTube test" src="about:blank"></iframe>';window.musicCalls.push(['create',o.videoId||o.playerVars.list]);setTimeout(()=>o.events.onReady({target:this}),0)}setVolume(n){window.musicCalls.push(['volume',n])}playVideo(){window.musicCalls.push(['play'])}pauseVideo(){window.musicCalls.push(['pause'])}destroy(){window.musicCalls.push(['destroy'])}}};window.onYouTubeIframeAPIReady();`}));
try{
 await page.goto(`http://127.0.0.1:${port}`);await page.locator('.start-button:enabled').waitFor();await page.locator('.start-button').click();await page.locator('.hero-offer').first().waitFor();
 const session=[...server.sessions.values()][0],m=session.match;let p=m.players[0],enemy=m.players[1];
 p.heroOffers=['original-2','original-12','original-1'];await page.reload();await page.locator('.hero-offer').first().waitFor();assert.equal(await page.locator('.hero-offer .hero-media-badges').count(),3);
 await page.locator('.hero-offer').first().click();await page.locator('.youtube-host iframe').waitFor();
 const calls=()=>page.evaluate(()=>(window as unknown as {musicCalls:unknown[][]}).musicCalls);
 assert.ok((await calls()).some(c=>c[0]==='create'&&c[1]===HERO_MUSIC['original-2'].videoId));
 await page.getByRole('button',{name:'Hang kikapcsolása'}).click();assert.ok((await calls()).some(c=>c[0]==='pause'));await page.getByRole('button',{name:'Hang bekapcsolása'}).click();
 // Every downloaded file must decode as audio, not merely return HTTP 200.
 const urls=[...clips.map(c=>c.file),...['break','coin','fall','jump','land','walking'].map(n=>`/audio/sfx/${n}.ogg`)];
 for(const url of urls){const duration=await page.evaluate(async src=>{const a=new Audio();a.src=src;return await new Promise<number>((resolve,reject)=>{a.onloadedmetadata=()=>resolve(a.duration);a.onerror=()=>reject(Error(src));});},url);assert.ok(duration>0&&Number.isFinite(duration),url);}
 // Real successful play command: inspect requested clip.
 p=m.players[0];enemy=m.players[1];
 const card=CHARACTERS.find(c=>c.tags.includes('Star Wars'))!;m.activeCardIds.push(card.id);p.hand=[makeUnit(m,card.id)];p.board=[];p.gold=10;await page.reload();await page.locator('.hand .unit').waitFor();
 const audioRequests:string[]=[];page.on('request',r=>{if(r.url().includes('/audio/'))audioRequests.push(r.url());});
 await page.locator('.hand .unit').click();await page.locator('.board .unit').waitFor();await page.waitForTimeout(200);assert.ok(audioRequests.some(u=>u.includes('hello-there')),'series quote requested on successful play');
 // The hero belonging to either battle side chooses that side's signature.
 p=m.players[0];enemy=m.players[1];const id=m.activeCardIds[0];p.board=[makeUnit(m,id)];enemy.board=[makeUnit(m,id)];
 for(const [heroId,style] of [['original-2','tire'],['original-12','dumbbell'],['original-1','volleyball']]){
  p.heroId=heroId;enemy.heroId=heroId;m.phase='combat';session.paused=true;m.battles=[{leftId:'p0',rightId:enemy.id,ghost:false,events:fight(p.board,enemy.board,42).events,winner:null,damage:0}];
  await page.reload();await page.locator('.arena.in-combat').waitFor();await page.locator('.tools-toggle').click();await page.locator('.test-panel select').selectOption('0.5');
  for(let i=0;i<5&&!(await page.locator(`[data-attack-style="${style}"]`).count());i++){await page.getByRole('button',{name:'Esemény léptetése'}).click();await page.waitForTimeout(50);}
  await page.locator(`[data-attack-style="${style}"]`).waitFor({state:'attached'});await page.waitForTimeout(390);await page.screenshot({path:`test-results/media/${style}-flight.png`,fullPage:true});await page.waitForTimeout(250);assert.ok(await page.locator('.impact-shockwave').count());await page.screenshot({path:`test-results/media/${style}.png`,fullPage:true});
 }
 await page.getByRole('button',{name:'Animációk ki'}).or(page.getByRole('button',{name:'Animációk be'})).click();
 await page.getByRole('button',{name:'Következő kör'}).click();await page.locator('.shop .unit').first().waitFor();assert.equal(await page.locator('.signature-attack').count(),0);
 p=m.players[0];p.heroId='original-35';await page.reload();await page.locator('.youtube-host iframe').waitFor();assert.ok((await calls()).some(c=>c[0]==='create'&&c[1]===HERO_MUSIC['original-35'].playlistId));
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'test-results/media/mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);await writeFile('test-results/media/report.json',JSON.stringify({decodedFiles:urls.length,seriesPlay:true,signatures:3,musicMapping:true,playlist:true,mute:true,mobile:true,errors},null,2));console.log('Media checks passed: downloaded files decode, series play, three signatures, music, mute, mobile.');
}finally{await browser.close();await server.close();}

