import type { Character, Ability, AmplifiedTrigger } from './types';
import type { CardType } from './tribes';

// One Neutral and one All-type adaptation from every existing franchise.
// Types are gameplay roles, not claims about canonical character powers.
export const SHARED_ROSTERS:[franchise:string,neutral:string,all:string][] = [
 ['Back to the Future','Einstein','Verne Brown'],
 ['Jake Long: American Dragon','Susan Long','Haley Long'],
 ['Clair Obscur: Expedition 33','Sophie','The Paintress'],
 ['Star Wars','R2-D2','Luke Skywalker'],
 ['Solo Leveling','Song Chi-Yul','Sung Il-Hwan'],
 ['Hearthstone Battlegrounds','Brann Bronzebeard','Reno Jackson'],
 ["The Hitchhiker's Guide to the Galaxy",'Eddie the Computer','Heart of Gold'],
 ['Doctor Who','Wilfred Mott','Captain Jack Harkness'],
 ['Little Misfortune','Stone (Misfortune’s Toy)','Unicorn (Misfortune’s Toy)'],
 ['The Batman (2022)','Gil Colson','The Joker (The Batman)'],
 ['Squid Game','The Recruiter','The Front Man'],
 ['Rocket League','Fennec','Takumi'],
 ['The Matrix','Mouse','The Architect'],
 ['The Chosen','Zebedee','Philip'],
 ['Rust','Boar','Bradley APC'],
 ['Sherlock (BBC)','Philip Anderson','Mary Morstan'],
 ['Dark Souls III','Andre of Astora','Unbreakable Patches'],
 ['Avatar (James Cameron)','Tuktirey','Kiri'],
 ['The Boys','Ashley Barrett','Soldier Boy'],
 ['South Park: The Stick of Truth / The Fractured But Whole','Jimmy Valmer','Timmy Burch'],
 ['The Truman Show','Vivian','Mike Michaelson'],
 ['Chernobyl (2019)','Andrei Glukhov','Nikolai Tarakanov'],
 ['Deadlock','Kelvin','Paradox'],
 ['Shutter Island','Ashecliffe Orderly','Deputy Warden McPherson'],
 ['Friends','Mike Hannigan','Richard Burke'],
 ['East of Eden (2008)','Lee Ki-chul','Gook Dae-hwa'],
 ['The Lord of the Rings','Bilbo Baggins','Galadriel'],
 ['Lord of Mysteries','Melissa Moretti','Azik Eggers'],
 ['Vintage Story','Raccoon','Temporal Storm Drifter'],
 ['Spider-Man','J. Jonah Jameson','Felicia Hardy / Black Cat'],
 ['9-1-1','Josh Russo','Karen Wilson'],
 ['Hero (2002)','Court Musician','Qin Cavalry Rider'],
 ['The Residence','Nan Cox','Didier Gotthard'],
 ['Fawlty Towers','Mr. Hutchinson','Mr. O’Reilly'],
 ['Dixit','Dixit Voting Rabbit','Dixit Dreamweaver'],
];

function card(id:number,name:string,franchise:string,tier:number,tribe:CardType):Character {
 let ability:Ability;
 let text:string;
 if(tribe==='all'){
  const bonus=tier>=5?tier-1:Math.ceil(tier/2);
  ability={name:'Sokoldalúság',trigger:'rally',effect:'buff',target:tier>=5?'neighbors':'self',attack:bonus};
  text=`${tier>=5?'Minden támadásakor a közvetlen szomszédai':'Minden támadásakor'} +${bonus} támadást kap${tier>=5?'nak':''} erre a harcra. Minden törzs tagjának számít.`;
 }else{
  ability={name:'Közös segítség',trigger:'play',effect:'buff',target:'other',attack:Math.ceil(tier/2),health:Math.floor(tier/2)};
  text=`Közös segítség: egy választott másik szövetséges véglegesen +${ability.attack}/+${ability.health} értéket kap.`;
 }
 return {id,name,tags:[franchise],tier,tribe,attack:tier+(tribe==='all'?0:1),health:tier+2,ability,text,portrait:'/portraits/1.svg'};
}

export const SHARED_CARDS:Character[]=SHARED_ROSTERS.flatMap(([franchise,neutral,all],index)=>{
 const shared=card(315+index*2,neutral,franchise,index%6+1,'neutral');
 if(Math.floor(index/6)%2===0){
  const attack=Math.ceil(shared.tier/2);
  const health=shared.tier>=4?2:0;
  shared.ability={name:'Gyülekező',trigger:'turnStart',effect:'buff',target:'neighbors',attack,health};
  shared.text=`A köröd elején a közvetlen szomszédai tartósan +${attack}/+${health}-t kapnak.`;
 }else{
  const health=Math.ceil(shared.tier/2);
  const attack=shared.tier>=3?2:0;
  shared.ability={name:'Utolsó igazítás',trigger:'turnEnd',effect:'buff',target:'neighbors',attack,health};
  shared.text=`A köröd végén a közvetlen szomszédai tartósan +${attack}/+${health}-t kapnak.`;
 }
 if(shared.tier===3&&shared.ability.trigger==='turnStart'){
  shared.ability={name:'Napidíj',trigger:'turnStart',effect:'gold',target:'self',amount:1};
  shared.text='A köröd elején 1 extra aranyat kapsz.';
 }
 if(shared.tier===5&&shared.ability.trigger==='turnEnd'){
  shared.ability={name:'Utánpótlás',trigger:'turnEnd',effect:'recruit',target:'self',amount:1};
  shared.text='A köröd végén egy véletlen 1. szintű miniont kapsz a közös készletből, ha elfér a kezedben.';
 }
 if(shared.tier===4&&shared.ability.trigger==='turnEnd'){
  shared.ability={name:'Váltás',trigger:'death',effect:'summon',target:'self',attack:2,health:2};
  shared.text='Ha meghal, megidéz egy 2/2-es Segítőt.';
 }
 return [shared,card(316+index*2,all,franchise,(index+3)%6+1,'all')];
});

const supportDesigns:(Omit<Character,'ability'|'text'|'tags'|'tribe'>&{amplifies:AmplifiedTrigger;label:string})[] = [
 {id:392,name:'A műsorvezető',tier:5,attack:3,health:7,amplifies:'play',label:'Battlecry',portrait:'/portraits/sketch/18.png'},
 {id:393,name:'Visszhangőr',tier:5,attack:2,health:9,amplifies:'death',label:'Deathrattle',portrait:'/portraits/sketch/14.png'},
 {id:394,name:'Záróra mestere',tier:6,attack:5,health:7,amplifies:'turnEnd',label:'kör végi',portrait:'/portraits/sketch/26.png'},
];
export const TRIGGER_SUPPORT:Character[] = supportDesigns.map(({amplifies,label,...c})=>({
 ...c,tags:['Utolsó pad'],tribe:'neutral',
 ability:{name:c.name,trigger:'passive',effect:'amplify',target:'self',amplifies},
 text:`Amíg a tábládon van, a saját ${label} hatásaid kétszer futnak le. Arany változatban háromszor.`,
}));

// Fill concrete tribe/tier shortages so every tribe supports two cards per tier.
const support:[string,string,number,CardType][] = [
 ['Darth Maul','Star Wars',6,'warriors'],
 ['Eomer','The Lord of the Rings',6,'warriors'],
 ['Ned Leeds','Spider-Man',6,'guardians'],
 ['Dave McFly','Back to the Future',6,'survivors'],
 ['Linda McFly','Back to the Future',6,'survivors'],
 ['Thanator','Avatar (James Cameron)',3,'beasts'],
 ['Yuria of Londor','Dark Souls III',6,'undead'],
];
export const TRIBE_SUPPORT:Character[]=support.map(([name,franchise,tier,tribe],index)=>{
 const c=card(385+index,name,franchise,tier,tribe);
 c.attack=tier+2;c.health=tier+3;
 if(tier===6){
  c.ability={name:'Törzsi összefogás',trigger:'play',effect:'buff',target:'neighbors',attack:5,health:5};
  c.text='Kijátszáskor a közvetlen szomszédai tartósan +5/+5-öt kapnak.';
 }else{
  c.ability={name:'Falkavezér',trigger:'rally',effect:'buff',target:'tribe',attack:2,health:1};
  c.text='Minden támadásakor a többi Vad és minden típusú szövetséges +2/+1-et kap erre a harcra.';
 }
 return c;
});
