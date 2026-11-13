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
].map(arena=>({...arena, image:`/boards/tribes/${arena.id}.webp`}));

// The server gives every new match a random UUID, independently of its gameplay
// seed. Hashing that ID keeps the random arena stable across rounds and reloads.
export function arenaForMatch(matchId?:string){
  let hash=2166136261;
  for(const char of matchId||'welcome') hash=Math.imul(hash^char.charCodeAt(0),16777619);
  return ARENAS[(hash>>>0)%ARENAS.length];
}
