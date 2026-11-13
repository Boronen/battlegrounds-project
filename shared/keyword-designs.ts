import type {Character, Keyword} from './types';
import {KEYWORDS} from './keywords';

// Keep tiers and tribes unchanged: the 80-card match quotas remain intact.
export const KEYWORD_DESIGNS:{name:string;keyword:Keyword;attack:number;health:number}[]=[
 {name:'Selina Kyle / Catwoman',keyword:'stealth',attack:4,health:8},
 {name:'Gollum',keyword:'stealth',attack:3,health:11},
 {name:'Frodo Baggins',keyword:'stealth',attack:5,health:6},
 {name:'Haze',keyword:'stealth',attack:3,health:11},
 {name:'Greirat',keyword:'stealth',attack:4,health:7},
 {name:'Klein Moretti',keyword:'stealth',attack:5,health:6},
 {name:'General Grievous',keyword:'windfury',attack:3,health:5},
 {name:'Abyss Watcher',keyword:'windfury',attack:3,health:5},
 {name:'Gwen Stacy / Ghost-Spider',keyword:'windfury',attack:4,health:4},
 {name:'Flying Snow',keyword:'windfury',attack:3,health:6},
 {name:'Pontiff Sulyvahn',keyword:'windfury',attack:3,health:10},
 {name:'Darth Maul',keyword:'windfury',attack:12,health:15},
 {name:'Nameless',keyword:'venomous',attack:3,health:6},
 {name:'Jim Moriarty',keyword:'venomous',attack:4,health:12},
 {name:'Hazmat Scientist',keyword:'venomous',attack:1,health:12},
 {name:'Green Goblin',keyword:'venomous',attack:8,health:11},
 {name:'Venom',keyword:'venomous',attack:9,health:13},
 {name:'Yuria of Londor',keyword:'venomous',attack:8,health:13},
 {name:'Ashen One',keyword:'reborn',attack:1,health:4},
 {name:'Seraph',keyword:'reborn',attack:1,health:3},
 {name:'Kimiko',keyword:'reborn',attack:2,health:3},
 {name:'Kenny McCormick',keyword:'reborn',attack:6,health:4},
 {name:'The Doctor',keyword:'reborn',attack:4,health:6},
 {name:'Soul of Cinder',keyword:'reborn',attack:6,health:9},
];

/** The balance harness uses these immutable originals for paired comparisons. */
export const KEYWORD_BASELINES=new Map<number,Character>();
export function applyKeywordDesigns(cards:Character[]){
 for(const design of KEYWORD_DESIGNS){
  const c=cards.find(c=>c.name===design.name);
  if(!c)throw new Error(`Missing keyword card: ${design.name}`);
  KEYWORD_BASELINES.set(c.id,structuredClone(c));
  Object.assign(c,{attack:design.attack,health:design.health,keywords:[design.keyword],
   ability:{name:KEYWORDS[design.keyword].name,trigger:'passive',effect:'buff',target:'self'},
   text:`${KEYWORDS[design.keyword].name}: ${KEYWORDS[design.keyword].text}`});
 }
}
