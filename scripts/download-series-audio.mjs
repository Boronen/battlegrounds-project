import {mkdir,readFile,writeFile} from 'node:fs/promises';
// The reviewed manifest is the source of truth; discovery never replaces mappings.
const clips=JSON.parse(await readFile('src/series-audio.json','utf8'));
await mkdir('public/audio/series',{recursive:true});
for(const clip of clips){
 const response=await fetch(clip.url);if(!response.ok)throw Error(`${response.status} ${clip.url}`);
 const data=Buffer.from(await response.arrayBuffer());
 if(data.length<100||data.toString('utf8',0,100).includes('<html'))throw Error(`Invalid audio: ${clip.url}`);
 await writeFile(`public${clip.file}`,data);
}
await writeFile('public/audio/series-sources.json',JSON.stringify(clips,null,2));
console.log(`Downloaded ${clips.length} reviewed franchise excerpts.`);
