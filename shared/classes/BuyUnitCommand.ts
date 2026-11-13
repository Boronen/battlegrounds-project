import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) buy művelet típusbiztos parancsobjektuma. */
export class BuyUnitCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'buy'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
