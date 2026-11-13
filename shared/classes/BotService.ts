import { botTurn } from '../engine';
import type { Match } from '../types';
export class BotService {
  takeTurn(match:Match,playerId:string):void {botTurn(match,playerId);}
}
