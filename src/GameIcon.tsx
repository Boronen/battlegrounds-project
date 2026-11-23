export type IconName =
  | "swords"
  | "shield"
  | "skull"
  | "flag"
  | "sun"
  | "moon"
  | "trumpet"
  | "spark"
  | "book"
  | "gear"
  | "snowflake"
  | "refresh"
  | "music"
  | "speaker"
  | "mute"
  | "sliders"
  | "players"
  | "eye"
  | "exit"
  | "close"
  | "crown"
  | "coin"
  | "heart";

export function GameIcon({
  name,
  size = 18,
}: {
  name: IconName;
  size?: number;
}) {
  return (
    <img
      className="game-icon"
      width={size}
      height={size}
      src={"/art/icons/" + name + ".png"}
      alt=""
      draggable={false}
    />
  );
}
