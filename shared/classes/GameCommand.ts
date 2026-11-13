import type { Match } from '../types';

export interface GameCommand {
  execute(match:Match, playerId:string):void;
}
