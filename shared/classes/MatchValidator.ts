import { assertInvariants } from '../engine';
import type { Match } from '../types';
export class MatchValidator {
  validate(match:Match):void {assertInvariants(match);}
}
