import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) play művelet típusbiztos parancsobjektuma. */
export class PlayUnitCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'play'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
