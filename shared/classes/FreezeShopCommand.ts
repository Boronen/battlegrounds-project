import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) freeze művelet típusbiztos parancsobjektuma. */
export class FreezeShopCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'freeze'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
