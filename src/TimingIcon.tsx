import {ArrowsOutSimple,FlagPennant,MegaphoneSimple,MoonStars,ShieldChevron,Skull,SunHorizon,Sword} from '@phosphor-icons/react';
import {TRIGGER_LABELS} from '../shared/minion-effects';
import type {Trigger} from '../shared/types';

const icons={play:MegaphoneSimple,rally:FlagPennant,death:Skull,turnStart:SunHorizon,turnEnd:MoonStars,start:ArrowsOutSimple,attack:Sword,passive:ShieldChevron};

export function TimingIcon({trigger}:{trigger:Trigger}){
 const Icon=icons[trigger];
 return <span className="timing-icon" title={TRIGGER_LABELS[trigger]} aria-hidden="true"><Icon weight="duotone"/></span>;
}
