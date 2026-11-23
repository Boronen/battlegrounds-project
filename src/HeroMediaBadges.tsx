import { HERO_MUSIC } from "./hero-media";
import { GameIcon } from "./GameIcon";

export function HeroMediaBadges({ id }: { id: string | null | undefined }) {
  const music = id ? HERO_MUSIC[id] : undefined;
  if (!music?.videoId && !music?.playlistId) return null;
  return (
    <span
      className="hero-media-badges"
      title={music.label}
      aria-label="Saját zene"
    >
      <GameIcon name="music" size={14} />
    </span>
  );
}
