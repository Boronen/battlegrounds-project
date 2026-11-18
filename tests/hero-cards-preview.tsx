import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {HEROES} from '../shared/catalog';

await mkdir('test-results',{recursive:true});
const styles=await readFile('src/hero-cards.css','utf8');
const portraits=await Promise.all(HEROES.map(async h=>({
 ...h, image:`data:image/png;base64,${(await readFile('public'+h.portrait)).toString('base64')}`
})));
const cards=renderToStaticMarkup(<main className="hero-selection"><div className="hero-offers">{portraits.map(h=>
 <article className="hero-offer" key={h.id}>
  <div className="hero-art"><img className="hero-character-art" src={h.image} alt={h.name}/></div>
  <h2>{h.name}</h2><em>{h.title}</em><p>{h.text}</p>
  <span className="hero-armor">◈ {h.armor} páncél</span>
  <strong className="hero-select-label">Őt választom</strong>
 </article>
)}</div></main>);
const html=`<!doctype html><html lang="hu"><meta charset="utf-8"><title>35 hős — ceruzarajz kártyák</title><style>
*{box-sizing:border-box}body{margin:0;padding:32px;background:#24252a;color:#f7ecd6;font:14px Georgia,serif}h1{font-size:32px;margin:0 0 8px}body>p{margin:0 0 28px;color:#c5bcae}.hero-selection .hero-offers{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:22px}.hero-offer{text-align:center;padding:10px;overflow:hidden}.hero-art{position:relative}.hero-character-art{width:100%;height:100%;object-fit:cover;display:block}.hero-offer h2{font-size:24px;margin:12px 0 4px}.hero-offer em{font-size:11px}.hero-offer p{font-size:12px;min-height:30px;line-height:1.4}.hero-armor{display:block;font-size:12px}.hero-select-label{display:block;margin:12px -10px -10px;padding:12px;border-top:1px solid;font-size:15px}${styles}
</style><h1>Az eredeti csapat</h1><p>35 hős · Egyedi grafitceruza-illusztrációk</p>${cards}</html>`;
await writeFile('test-results/hero-cards.html',html);
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
try {
 const page=await browser.newPage({viewport:{width:1680,height:1100},deviceScaleFactor:1});
 await page.setContent(html);
 await page.locator('img').evaluateAll(async images=>Promise.all(images.map(img=>(img as HTMLImageElement).decode())));
 assert.equal(await page.locator('.hero-offer').count(),35);
 assert.equal(await page.locator('img').evaluateAll(images=>images.every(img=>(img as HTMLImageElement).naturalWidth>0)),true);
 await page.screenshot({path:'test-results/hero-cards.png',fullPage:true});
 console.log('All 35 illustrated hero cards rendered: test-results/hero-cards.html and hero-cards.png');
} finally {await browser.close()}
