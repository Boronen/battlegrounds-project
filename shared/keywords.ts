import type {Keyword, Unit} from './types';

export const KEYWORDS:Record<Keyword,{name:string;symbol:string;text:string}>= {
 stealth:{name:'Lopakodás',symbol:'◌',text:'Nem támadható, amíg nem támad. Területi sebzés éri. Ha minden ellenfél lopakodik, támadhatóvá válnak.'},
 windfury:{name:'Szélvész',symbol:'»',text:'Kétszer támad a saját támadási körében, ha túléli az első támadást.'},
 venomous:{name:'Méreg',symbol:'◆',text:'Az első sikeres támadási vagy visszaütési sebzése megöli a célpontot, majd a méreg elfogy. Pajzs nem fogyasztja el.'},
 reborn:{name:'Újjászületés',symbol:'↟',text:'Egyszer visszatér 1 életerővel és alap támadással, bónuszok, pajzs és kulcsszavak nélkül, ha van hely.'},
};
export const hasKeyword=(u:Pick<Unit,'keywords'>,key:Keyword)=>u.keywords?.includes(key)??false;
export function consumeKeyword(u:Unit,key:Keyword){u.keywords=u.keywords?.filter(k=>k!==key)??[];}
