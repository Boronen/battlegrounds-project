import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) ready művelet típusbiztos parancsobjektuma. */
export class ReadyCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'ready'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
