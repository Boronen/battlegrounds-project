export type Phase = 'hero' | 'recruit' | 'combat' | 'finished';
export type Trigger = 'play' | 'start' | 'death' | 'attack' | 'passive';
export type Effect = 'buff' | 'shield' | 'damage' | 'taunt' | 'bread' | 'stealShield' | 'summon';
export interface Ability { name:string; trigger:Trigger; effect:Effect; target:'self'|'other'|'left'|'neighbors'|'allies'|'enemy'|'enemies'; attack?:number; health?:number; amount?:number; repeats?:number }
export interface Character { id:number; name:string; tags:string[]; tier:number; attack:number; health:number; ability:Ability; text:string; portrait:string }
export interface Unit { uid:string; characterId:number; attack:number; health:number; golden:boolean; shield:boolean; taunt:boolean; copies:number; rewardTier?:number; token?:boolean }
export interface Hero { id:string; name:string; title:string; armor:number; cost:number; text:string; power:'buff'|'shield'|'gold'|'refresh' }
export interface Player { id:string; name:string; bot:boolean; heroId:string|null; heroOffers:string[]; hp:number; armor:number; tier:number; upgradeCost:number; gold:number; board:Unit[]; hand:Unit[]; shop:(Unit|null)[]; frozen:boolean; ready:boolean; powerUsed:boolean; discover:Unit[]; rewards:number[]; opponents:string[]; place:number|null; lastBoard:Unit[] }
export interface CombatEvent { type:'start'|'attack'|'damage'|'shield'|'buff'|'death'|'summon'|'result'; text:string; actor?:string; target?:string; amount?:number; left:Unit[]; right:Unit[] }
export interface Battle { leftId:string; rightId:string; ghost:boolean; events:CombatEvent[]; winner:string|null; damage:number }
export interface Match { id:string; seed:number; rng:number; nextUid:number; version:number; phase:Phase; round:number; mode:'manual'|'timed'; players:Player[]; pool:Record<number,number>; pairings:[string,string][]; battles:Battle[]; log:string[]; pendingDamage:Record<string,number>; roundLimit:number }
export type Action =
 | {type:'chooseHero';heroId:string} | {type:'buy';uid:string} | {type:'sell';uid:string}
 | {type:'play';uid:string;position?:number;targetUid?:string} | {type:'reorder';uids:string[]}
 | {type:'refresh'} | {type:'freeze'} | {type:'upgrade'} | {type:'power';targetUid?:string}
 | {type:'discover';uid:string} | {type:'ready'};
export interface Command { commandId:string; expectedVersion:number; action:Action }
export interface Ack { ok:boolean; version:number; code?:string; message?:string }
export interface Standing { id:string;name:string;heroId:string|null;hp:number;armor:number;tier:number;place:number|null;boardCount:number }
export interface Snapshot { matchId:string;version:number;ruleset:string;seed:number;round:number;phase:Phase;mode:Match['mode'];deadline:number|null;paused:boolean;you:Player;standings:Standing[];opponent:Standing|null;battle:Battle|null;log:string[];connected?:boolean }
export type Control = 'step'|'pause'|'resume'|'finishCombat'|'autoplay';
export interface Replay { format:1;matchId:string; ruleset:string;catalogVersion:string; seed:number; mode:Match['mode']; actions:({kind:'command';playerId:string;action:Action}|{kind:'advance'}|{kind:'autoplay'})[]; finalDigest:string }
