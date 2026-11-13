import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) sell művelet típusbiztos parancsobjektuma. */
export class SellUnitCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'sell'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
