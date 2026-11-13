import type { Character, Ability } from './types';
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
  // Flexible tribe membership trades some base stats for a modest first-attack buff.
  ability={name:'Sokoldalúság',trigger:'attack',effect:'buff',target:'self',attack:tier};
  text=`Sokoldalúság: az első támadásától +${tier} támadást kap erre a harcra. Minden törzs tagjának számít.`;
 }else{
  ability={name:'Közös segítség',trigger:'play',effect:'buff',target:'other',attack:Math.ceil(tier/2),health:Math.floor(tier/2)};
  text=`Közös segítség: egy választott másik szövetséges véglegesen +${ability.attack}/+${ability.health} értéket kap.`;
 }
 return {id,name,tags:[franchise],tier,tribe,attack:tier+(tribe==='all'?0:1),health:tier+2,ability,text,portrait:'/portraits/1.svg'};
}

export const SHARED_CARDS:Character[]=SHARED_ROSTERS.flatMap(([franchise,neutral,all],index)=>[
 card(315+index*2,neutral,franchise,index%6+1,'neutral'),
 card(316+index*2,all,franchise,(index+3)%6+1,'all'),
]);

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
 c.ability={name:'Törzsi összefogás',trigger:'start',effect:'buff',target:'neighbors',attack:Math.floor(tier/2),health:Math.floor(tier/2)};
 c.text=`Törzsi összefogás: a közvetlen szomszédok +${c.ability.attack}/+${c.ability.health} értéket kapnak erre a harcra.`;
 return c;
});
