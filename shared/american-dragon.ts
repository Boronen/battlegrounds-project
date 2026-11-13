import type { Ability, Character } from './types';

// Initial balance pass, using the existing combat and recruitment effects.
function card(id:number, name:string, tier:number, attack:number, health:number, ability:Ability, description:string):Character {
 return {id, name, tags:['Jake Long: American Dragon'], tier, attack, health,
  ability, text:`${ability.name}: ${description}`, portrait:`/portraits/${id}.svg`};
}

export const AMERICAN_DRAGON:Character[] = [
 card(43, 'Jake Long', 2, 3, 4,
  {name:'Sárkányerő', trigger:'attack', effect:'buff', target:'self', attack:3},
  'Az első támadásától +3 támadást kap erre a harcra.'),
 card(44, 'Rose', 4, 6, 5,
  {name:'Vadászcsapás', trigger:'start', effect:'damage', target:'enemy', amount:3},
  '3 sebzést okoz egy véletlen ellenségnek a harc kezdetén.'),
 card(45, 'Lao Shi', 5, 5, 9,
  {name:'A mester tanítása', trigger:'start', effect:'buff', target:'neighbors', health:4},
  'A közvetlen szomszédok +4 életerőt kapnak erre a harcra.'),
 card(46, 'Fu Dog', 4, 4, 6,
  {name:'Mágikus védelem', trigger:'start', effect:'shield', target:'left'},
  'A bal oldali szomszéd védőpajzsot kap erre a harcra.'),
 card(47, 'Trixie Carter', 1, 2, 2,
  {name:'Baráti biztatás', trigger:'play', effect:'buff', target:'other', attack:1},
  'Egy választott másik szövetséges véglegesen +1 támadást kap.'),
 card(48, 'Arthur “Spud” Spudinski', 1, 1, 3,
  {name:'Szerencsés kitérés', trigger:'start', effect:'shield', target:'self'},
  'Védőpajzsot kap erre a harcra.'),
 card(49, 'Huntsman', 3, 6, 4,
  {name:'A vadászat vezetője', trigger:'passive', effect:'taunt', target:'self'},
  'Őrző: magára vonja az ellenséges támadásokat.'),
 card(50, 'Dark Dragon', 6, 8, 10,
  {name:'Sötét sárkánytűz', trigger:'start', effect:'damage', target:'enemies', amount:3},
  '3 sebzést okoz minden ellenséges egységnek a harc kezdetén.'),
];
