import type {CSSProperties} from 'react';

// Coordinates use the same 16:9 canvas as the painted boards. All furniture
// shares these anchors so changing skins never moves an interaction target.
const anchors={shop:[3.5,29,14,42],round:[82,42,15,14]} as const;
const materials = {
 aberration:['chitin','#3e2948','#9d779f','#d6a5eb'],
 beasts:['foliage','#354331','#8c8253','#c2dd88'],
 naga:['pearl','#254e4f','#bca56a','#a4efdb'],
 dragons:['scales','#512d2b','#bb8548','#ffbd64'],
 undead:['bone','#303c42','#a7a38d','#b5decb'],
 demon:['obsidian','#352534','#9c5c59','#ff9771'],
 murlocs:['coral','#315457','#d5967d','#a6e3db'],
 pirate:['timber','#3d3029','#ae8b5a','#e7ca87'],
 quilboar:['hide','#4c352d','#bb936d','#ebc89d'],
 elementals:['crystal','#304656','#91a9bc','#b1e9ff'],
} as const;

export const ARENAS = [
  {id:'aberration', name:'Aberration'},
  {id:'beasts', name:'Beasts'},
  {id:'naga', name:'Naga'},
  {id:'dragons', name:'Dragons'},
  {id:'undead', name:'Undead'},
  {id:'demon', name:'Demon'},
  {id:'murlocs', name:'Murlocs'},
  {id:'pirate', name:'Pirate'},
  {id:'quilboar', name:'Quilboar'},
  {id:'elementals', name:'Elementals'},
].map(arena=>{
 const [material,surface,metal,glow]=materials[arena.id as keyof typeof materials];
 return {...arena, image:`/boards/tribes/${arena.id}.webp`,material,surface,metal,glow,anchors};
});

export type Arena = typeof ARENAS[number];
export function arenaStyle(arena:Arena):CSSProperties {
 const vars:Record<string,string>={'--arena-surface':arena.surface,'--arena-metal':arena.metal,'--arena-glow':arena.glow};
 for(const [name,values] of Object.entries(arena.anchors))
  values.forEach((value,i)=>{vars[`--${name}-${['x','y','w','h'][i]}`]=`${value}%`;});
 return vars as CSSProperties;
}

// The server gives every new match a random UUID, independently of its gameplay
// seed. Hashing that ID keeps the random arena stable across rounds and reloads.
export function arenaForMatch(matchId?:string){
  let hash=2166136261;
  for(const char of matchId||'welcome') hash=Math.imul(hash^char.charCodeAt(0),16777619);
  return ARENAS[(hash>>>0)%ARENAS.length];
}
