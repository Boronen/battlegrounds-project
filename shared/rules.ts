/** Numbers are explicitly versioned; see docs/rules.md for evidence and limits. */
export const RULES = {
 id:'bg-37.0.2-core-custom-11', catalogVersion:'franchise-360-heroes-35-v14', referencePatch:'37.0.2',
 heroChoices:3, heroRerolls:3,
 startHealth:30, buy:3, sell:1, refresh:1, boardSize:7, handSize:10,
 shopSizes:[0,3,4,4,5,5,6], poolCopies:[0,15,15,13,11,9,7],
 upgradeCosts:[0,5,7,8,11,11,0], maxAttacks:500, maxRounds:60,
 recruitMs:120000, heroMs:30000, combatMs:18000,
} as const;
export function damageCap(round:number,alive:number){return alive<=4?Infinity:round<4?5:round<8?10:15;}
