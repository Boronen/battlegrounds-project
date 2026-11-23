import { GameIcon, type IconName } from "./GameIcon";
import type { Keyword } from "../shared/types";
import { KEYWORDS } from "../shared/keywords";
import "./keywords.css";

const keywordIcons: Record<Keyword, IconName> = {
  stealth: "eye",
  windfury: "spark",
  venomous: "skull",
  reborn: "refresh",
};

export function KeywordBadges({
  keywords = [],
  compact = false,
}: {
  keywords?: Keyword[];
  compact?: boolean;
}) {
  if (!keywords.length) return null;
  return (
    <span className={compact ? "unit-keywords" : "keyword-list"}>
      {keywords.map((key) => {
        const k = KEYWORDS[key];
        return (
          <span
            key={key}
            className={`keyword-badge keyword-${key}`}
            title={`${k.name} (${key}): ${k.text}`}
            aria-label={`${k.name}: ${k.text}`}
          >
            <GameIcon name={keywordIcons[key]} size={compact ? 12 : 18} />
            {!compact && <strong>{k.name}</strong>}
          </span>
        );
      })}
    </span>
  );
}
