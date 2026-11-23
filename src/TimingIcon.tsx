import { GameIcon, type IconName } from "./GameIcon";
import { TRIGGER_LABELS } from "../shared/minion-effects";
import type { Trigger } from "../shared/types";

const icons: Record<Trigger, IconName> = {
  play: "trumpet",
  rally: "flag",
  death: "skull",
  turnStart: "sun",
  turnEnd: "moon",
  start: "spark",
  attack: "swords",
  passive: "shield",
};
export function TimingIcon({ trigger }: { trigger: Trigger }) {
  return (
    <span className="timing-icon" title={TRIGGER_LABELS[trigger]}>
      <GameIcon name={icons[trigger]} size={14} />
    </span>
  );
}
