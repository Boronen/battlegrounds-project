import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {testServer} from './private-browser-fixture';

const email=process.env.ADMIN_EMAIL, password=process.env.ADMIN_PASSWORD;
if(!email || !password)throw Error('A tesztadmin e-mail-címe és jelszava szükséges.');
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE || (process.platform==='win32'?'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe':undefined)});
try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(testServer()+'/#/admin');
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Jelszó',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Belépés',exact:true}).click();
  await page.getByRole('heading',{name:'Áttekintés'}).waitFor();
  await page.getByRole('link',{name:'Karakterek'}).click();
  const name='Vizsgakártya '+Date.now();
  await page.getByLabel('Név',{exact:true}).fill(name);
  await page.getByRole('button',{name:'Verzió publikálása'}).click();
  await page.getByLabel('Karakter',{exact:true}).selectOption({label:name});
  await page.getByRole('button',{name:'Letiltás új meccsekben'}).click();
  await page.getByRole('button',{name:'Engedélyezés'}).waitFor();
  await page.getByRole('link',{name:'Napló'}).click();
  await page.getByText(/disable_character/).first().waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log('Admin belépés, karakter létrehozása és letiltása, napló és mobilnézet sikeres.');
}finally{await browser.close();}
