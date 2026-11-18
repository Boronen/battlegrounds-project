import {mkdir,writeFile} from 'node:fs/promises';
const out='public/audio';
await mkdir(`${out}/sfx`,{recursive:true});
const provenance=[];
for(const name of ['break','coin','fall','jump','land','walking']){
 const url=`https://raw.githubusercontent.com/KenneyNL/Starter-Kit-3D-Platformer/main/sounds/${name}.ogg`;
 const r=await fetch(url);if(!r.ok)throw Error(`${r.status}: ${url}`);
 const bytes=Buffer.from(await r.arrayBuffer());if(bytes.toString('ascii',0,4)!=='OggS')throw Error('Not OGG');
 await writeFile(`${out}/sfx/${name}.ogg`,bytes);provenance.push({file:`sfx/${name}.ogg`,url,license:'CC0',author:'Kenney'});
}
await writeFile(`${out}/sfx-sources.json`,JSON.stringify(provenance,null,2));
console.log(`Downloaded ${provenance.length} real sound files.`);
