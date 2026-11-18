import {chromium} from '@playwright/test';
import {resolve} from 'node:path';
const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const p=await b.newPage({viewport:{width:600,height:800},deviceScaleFactor:1});await p.goto('file:///'+resolve('public/portraits/sketch/35.svg').replaceAll('\\','/'));await p.screenshot({path:'public/portraits/sketch/35.png'});await b.close();

