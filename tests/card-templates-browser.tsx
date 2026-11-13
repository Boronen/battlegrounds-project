import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {TRIBES, type CardType} from '../shared/tribes';
import {TribeSurface} from '../src/TribeSurface';

await mkdir('test-results',{recursive:true});
const styles=(await Promise.all(['src/card-pool.css','src/card-templates.css'].map(p=>readFile(p,'utf8')))).join('\n');
const types:{id:CardType;name:string}[]=[...TRIBES,{id:'neutral',name:'Semleges'},{id:'all',name:'Minden típus'}];
const material=['Brushed copper · angled bands','Silver blue · shield frame','Amethyst · concentric rings','Teal alloy · circuit grid','Worn brass · paper grain','Moss green · organic curves','Aged bone · gothic arch','Mulberry · offset diamonds','Slate · silver trim','Prismatic · shared membership'];
const markup=renderToStaticMarkup(<main><header><p className="eyebrow">UTOLSÓ PAD / CARD SYSTEM 01</p><h1>Egy alapforma. Tíz változat.</h1><p className="intro">Közös elrendezés, eltérő anyagok és keretek. Karakterrajzok nélkül.</p></header><div className="pool-grid">{types.map((t,i)=><article className="pool-card" data-tribe={t.id} key={t.id}>
 <div className="template-tier"><span>3. szint</span><span>★★★</span></div><TribeSurface tribe={t.id}/><div className="pool-card-content"><h4>{t.name}</h4><p className="pool-franchise">{material[i]}</p><dl className="pool-stats"><div><dt>Támadás</dt><dd>4</dd></div><div><dt>Életerő</dt><dd>6</dd></div></dl><p className="pool-ability"><strong>Képesség neve</strong><br/>Itt jelenik meg a kártya képessége. A szöveg, a szint és az értékek minden törzsnél azonos helyen maradnak.</p><p className="pool-tribe">{t.name}</p></div>
 </article>)}</div><footer>RÉZ / EZÜST / AMETISZT / TEAL / BRONZ / MOHA / CSONT / BÍBOR</footer></main>);
const html=`<!doctype html><html lang="hu"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tribe card templates</title><style>${styles}\n*{box-sizing:border-box}body{margin:0;background:#18191e;color:#ede3cf;font-family:Arial,sans-serif}main{max-width:1320px;margin:auto;padding:42px 48px 30px}header{margin-bottom:30px}.eyebrow{font-size:10px;letter-spacing:3px;color:#bea77c}h1{font-family:Georgia,serif;font-size:38px;margin:14px 0}.intro{font-size:13px;color:#a9a498}.pool-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:30px 24px}.pool-card[data-tribe]{min-height:360px}.pool-card h4{font-family:Georgia,serif}footer{font-size:9px;letter-spacing:2px;color:#8f8a7c;margin-top:35px}@media(max-width:700px){main{padding:24px}.pool-grid{grid-template-columns:1fr}h1{font-size:28px}}</style>${markup}</html>`;
await writeFile('test-results/card-templates.html',html);
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
 await page.setContent(html);
 assert.equal(await page.locator('.tribe-surface').count(),10);
 const accents=await page.locator('.pool-card').evaluateAll(cards=>cards.map(c=>getComputedStyle(c).getPropertyValue('--tribe-accent').trim()));
 assert.equal(new Set(accents).size,10);
 assert.ok(await page.locator('.pool-card-content').evaluateAll(cards=>cards.every(c=>c.scrollWidth<=c.clientWidth)));
 await page.screenshot({path:'test-results/card-templates.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 console.log('Ten card templates render with distinct palettes, no character artwork and no mobile overflow.');
}finally {await browser.close();}
