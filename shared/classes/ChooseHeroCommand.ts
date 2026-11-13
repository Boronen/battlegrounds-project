import { act } from '../engine';
import type { Action, Match } from '../types';
import type { GameCommand } from './GameCommand';

/** A(z) chooseHero művelet típusbiztos parancsobjektuma. */
export class ChooseHeroCommand implements GameCommand {
  constructor(private readonly action:Extract<Action,{type:'chooseHero'|'rerollHeroes'}>){}

  execute(match:Match, playerId:string):void {
    act(match,playerId,this.action);
  }
}
