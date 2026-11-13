import type { Character } from './types';

export const TRIBES = [
 {id:'warriors',name:'Harcosok'}, {id:'guardians',name:'Őrzők'},
 {id:'mystics',name:'Misztikusok'}, {id:'technologists',name:'Technológusok'},
 {id:'survivors',name:'Túlélők'}, {id:'beasts',name:'Vadak'},
 {id:'undead',name:'Élőholtak'}, {id:'tricksters',name:'Bajkeverők'},
] as const;
export type Tribe = typeof TRIBES[number]['id'];
export type CardType = Tribe|'neutral'|'all';

// Initial thematic assignments, independent of franchise tags and card mechanics.
const groups:Record<Tribe,string[]> = {
 warriors:['Star Wars','Hero (2002)','The Lord of the Rings','Jake Long: American Dragon'],
 guardians:['The Chosen','9-1-1','Doctor Who'],
 mystics:['Clair Obscur: Expedition 33','Lord of Mysteries','Dixit'],
 technologists:['Back to the Future','Rocket League','Hearthstone Battlegrounds','The Matrix'],
 survivors:['The Truman Show','Chernobyl (2019)','Friends','East of Eden (2008)','Shutter Island'],
 beasts:['Rust','Vintage Story','Avatar (James Cameron)'],
 undead:['Solo Leveling','Dark Souls III','Little Misfortune'],
 tricksters:["The Hitchhiker's Guide to the Galaxy",'The Batman (2022)','Squid Game','Sherlock (BBC)','The Boys','South Park: The Stick of Truth / The Fractured But Whole','Deadlock','Spider-Man','The Residence','Fawlty Towers'],
};
// Individual exceptions give cross-franchise tribes a coherent starting identity.
const overrides:Record<string,Tribe> = {
 'Doc Brown':'technologists','Fu Dog':'beasts','Dark Dragon':'beasts',
 'Yoda':'mystics','Darth Sidious':'mystics','General Grievous':'technologists',
 'Yoo Jinho':'guardians','Sung Jinah':'survivors','Go Gunhee':'guardians',
 'Ragnaros the Firelord':'mystics','The Lich King':'undead',
 'Marvin':'technologists','Deep Thought':'technologists',
 'Benjamin':'beasts','Puppy':'beasts','Hamster':'beasts',
 'Misfortune Ramirez Hernandez':'survivors','Misfortune’s Mother':'survivors',
 'Bruce Wayne / Batman':'guardians','James Gordon':'guardians',
 'Alfred Pennyworth':'guardians','Bella Real':'survivors',
 'Seong Gi-hun':'survivors','Kang Sae-byeok':'survivors','Abdul Ali':'guardians',
 'Hazmat Scientist':'technologists','Heavy Scientist':'technologists',
 'Bandit Camp Guard':'guardians','Outpost Scientist':'technologists','Patrol Helicopter':'technologists',
 'Seraph':'survivors','Surface Drifter':'undead','Corrupt Drifter':'undead',
 'Locust':'technologists','Sawblade Locust':'technologists','Bell':'technologists','Trader':'survivors',
 'Trudy Chacon':'technologists','Grace Augustine':'technologists','Norm Spellman':'technologists',
 'Mo’at':'mystics','Miles Quaritch':'technologists','Tsu’tey':'warriors',
 'Gandalf':'mystics','Gollum':'tricksters','Samwise Gamgee':'guardians',
 'Kenny McCormick':'undead','Kimiko':'warriors','Queen Maeve':'guardians',
 'Ivy':'beasts','Abrams':'guardians','Bebop':'technologists','Dynamo':'technologists',
 'Infernus':'mystics','Seven':'mystics','Vindicta':'undead',
 'Peter Parker / Spider-Man':'guardians','Miles Morales':'guardians',
 'Gwen Stacy / Ghost-Spider':'guardians','May Parker':'survivors','Mary Jane Watson':'survivors',
 'Doctor Octopus':'technologists','Venom':'beasts',
};
export function tribeFor(c:Character):CardType {
 if(c.tribe)return c.tribe;
 const tribe=overrides[c.name]||TRIBES.find(t=>groups[t.id].includes(c.tags[0]))?.id;
 if(!tribe)throw new Error(`Missing tribe for ${c.name}`);
 return tribe;
}
export const tribeName=(id:CardType)=>id==='neutral'?'Semleges':id==='all'?'Minden típus':TRIBES.find(t=>t.id===id)!.name;
export const hasTribe=(c:Character,tribe:Tribe)=>tribeFor(c)==='all'||tribeFor(c)===tribe;
