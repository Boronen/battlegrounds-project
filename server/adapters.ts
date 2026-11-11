import type { Match } from '../shared/types';
/** Replace these boundaries with Laravel game-ticket verification and an idempotent result API. */
export interface IdentityAdapter { verifyTicket(ticket:string):Promise<{userId:string}|null> }
export interface ResultAdapter { save(result:{matchId:string;ruleset:string;placements:{playerId:string;place:number}[]}):Promise<void> }
export function resultPayload(m:Match){return {matchId:m.id,ruleset:'bg-37.0-core-custom-1',placements:m.players.map(p=>({playerId:p.id,place:p.place!}))};}
