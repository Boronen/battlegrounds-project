import {mkdir,writeFile} from 'node:fs/promises';
const queries=process.argv.slice(2).length?process.argv.slice(2):['Back to the Future','American Dragon','Expedition 33','Star Wars','Solo Leveling','Hearthstone','Hitchhiker','Doctor Who','Little Misfortune','Batman','Squid Game','Rocket League','Matrix','The Chosen','Rust','Sherlock','Dark Souls','Avatar','The Boys','South Park','Truman Show','Chernobyl','Deadlock','Shutter Island','Friends','East of Eden','Lord of the Rings','Lord of Mysteries','Vintage Story','Spider Man','911','Hero 2002','The Residence','Fawlty Towers','Dixit'];
await mkdir('test-results',{recursive:true});
const results=await Promise.all(queries.map(async query=>{
 try{const html=await (await fetch(`https://www.myinstants.com/en/search/?name=${encodeURIComponent(query)}`)).text();
 const clips=[...html.matchAll(/play\('([^']+)'[^]*?<a[^>]+class="instant-link[^\"]*"[^>]*>([^]*?)<\/a>/g)].slice(0,8).map(m=>({path:m[1],name:m[2].replace(/<[^>]+>/g,'').trim()}));return {query,clips};
 }catch(e){return {query,error:String(e)}}
}));
await writeFile('test-results/series-candidates.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));

