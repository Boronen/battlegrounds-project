import type { Tribe } from './tribes';
import type { CardType } from './tribes';
export type Phase = 'hero' | 'recruit' | 'combat' | 'finished';
export type Trigger = 'play' | 'start' | 'death' | 'attack' | 'passive';
export type Effect = 'buff' | 'shield' | 'damage' | 'taunt' | 'bread' | 'stealShield' | 'summon';
export type Keyword = 'stealth' | 'windfury' | 'venomous' | 'reborn';
export interface Ability { name:string; trigger:Trigger; effect:Effect; target:'self'|'other'|'left'|'neighbors'|'allies'|'enemy'|'enemies'; attack?:number; health?:number; amount?:number; repeats?:number }
export interface Character { id:number; name:string; tags:string[]; tier:number; attack:number; health:number; ability:Ability; text:string; portrait:string; tribe?:CardType; keywords?:Keyword[] }
export interface Unit {drunk?:boolean; generated?:boolean;  name?:string; text?:string; ability?:Ability; tier?:number; spellUpgrades?:Record<string,number>; fullReborn?:boolean; heroFighter?:boolean;  uid:string; characterId:number; attack:number; health:number; golden:boolean; shield:boolean; taunt:boolean; copies:number; rewardTier?:number; token?:boolean; keywords?:Keyword[] }
export interface Hero { id:string; name:string; title:string; armor:number; cost:number; text:string; portrait:string; tags?:string[]; power:'buff'|'shield'|'gold'|'refresh'|'custom'|'passive'|null }
export interface SpellCard {uid:string; kind:string; tier:number; cost:number}
export interface HeroState {drunkQuest?:boolean; maxHp?:number; carriedGold?:number; goldenDiscovers?:number; discoverKind?:'golden'|'death'; fallenLast?:number[]; guessOptions?:Unit[]; guessResult?:boolean; powerOffers?:string[]; borrowedId?:string; freeSpellUsed?:boolean;maxGold:number; deferredGold:number; deferSales:boolean; cooldownUntil:number; onceUsed:boolean; quest?:'deaths'|'battlecries'; progress:number; completed:boolean; championAttack:number; championUpgradeRound:number; spellShop:SpellCard[]; spellHand:SpellCard[]; combination:Unit[]; lastRoll?:number}
export interface Player {heroState?:HeroState;  id:string; name:string; bot:boolean; heroId:string|null; heroOffers:string[]; heroSeen:string[]; heroRerolls:number; hp:number; armor:number; tier:number; upgradeCost:number; gold:number; board:Unit[]; hand:Unit[]; shop:(Unit|null)[]; frozen:boolean; ready:boolean; powerUsed:boolean; discover:Unit[]; rewards:number[]; opponents:string[]; place:number|null; lastBoard:Unit[] }
export interface CombatEvent { type:'start'|'attack'|'damage'|'shield'|'buff'|'death'|'summon'|'keyword'|'result'; text:string; actor?:string; target?:string; amount?:number; left:Unit[]; right:Unit[] }
export interface Battle { leftId:string; rightId:string; ghost:boolean; events:CombatEvent[]; winner:string|null; damage:number }
export interface Match {heroSecrets?:Record<string,{correctGuessUid:string}>;  id:string; seed:number; rng:number; nextUid:number; version:number; phase:Phase; round:number; mode:'manual'|'timed'; players:Player[]; pool:Record<number,number>; activeTribes:Tribe[]; activeCardIds:number[]; pairings:[string,string][]; battles:Battle[]; log:string[]; pendingDamage:Record<string,number>; roundLimit:number }
export type Action =
 | {type:'rerollHeroes'} | {type:'chooseHero';heroId:string} | {type:'buy';uid:string} | {type:'sell';uid:string}
 | {type:'play';uid:string;position?:number;targetUid?:string} | {type:'reorder';uids:string[]}
 | {type:'refresh'} | {type:'freeze'} | {type:'upgrade'} | {type:'power';targetUid?:string;mode?:'upgrade'|'buySpell'|'castSpell'|'combine'|'guess'|'choosePower';spellUid?:string;choice?:number}
 | {type:'discover';uid:string} | {type:'ready'};
export interface Command { commandId:string; expectedVersion:number; action:Action }
export interface Ack { ok:boolean; version:number; code?:string; message?:string }
export interface Standing { id:string;name:string;heroId:string|null;hp:number;armor:number;tier:number;place:number|null;boardCount:number }
export interface Snapshot { activeTribes:Tribe[]; activeCardIds:number[]; matchId:string;version:number;ruleset:string;seed:number;round:number;phase:Phase;mode:Match['mode'];deadline:number|null;paused:boolean;you:Player;standings:Standing[];opponent:Standing|null;battle:Battle|null;log:string[];connected?:boolean }
export type Control = 'step'|'pause'|'resume'|'finishCombat'|'autoplay';
export interface Replay { format:1;matchId:string; ruleset:string;catalogVersion:string; seed:number; mode:Match['mode']; actions:({kind:'command';playerId:string;action:Action}|{kind:'advance'}|{kind:'autoplay'})[]; finalDigest:string }
