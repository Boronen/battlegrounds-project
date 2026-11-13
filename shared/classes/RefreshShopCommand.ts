import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) refresh művelet típusbiztos parancsobjektuma. */
export class RefreshShopCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'refresh'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
