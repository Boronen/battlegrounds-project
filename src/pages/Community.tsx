import { GameIcon, type IconName } from "../GameIcon";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { useResource, type Page, type Player } from "../api";
import { Pager } from "./forms";

const avatarIcons: Record<string, IconName> = {
  default_01: "swords",
  default_02: "shield",
  default_03: "crown",
};

interface Result {
  id: number;
  name: string;
  mode: string;
  place: number;
  delta: number;
}
export function Leaderboard() {
  const [search, setSearch] = useState(""),
    [page, setPage] = useState(1);
  const { data, error } = useResource<Page<Player>>(
    "leaderboard?search=" + encodeURIComponent(search) + "&page=" + page,
  );
  return (
    <main className="site-page">
      <h1>Ranglista</h1>
      <label>
        Játékos keresése
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </label>
      <p role="status">{error}</p>
      {data && (
        <>
          <ol start={(page - 1) * 20 + 1}>
            {data.data.map((p) => (
              <li key={p.name}>
                <Link to={"/profil/" + p.name}>{p.display_name}</Link> ·{" "}
                {p.rating} pont
              </li>
            ))}
          </ol>
          {!data.data.length && <p>Nincs találat.</p>}
          <Pager page={page} last={data.last_page} change={setPage} />
        </>
      )}
    </main>
  );
}
export function PublicProfile() {
  const { username } = useParams(),
    [page, setPage] = useState(1);
  const path = "profiles/" + encodeURIComponent(username!);
  const profile = useResource<Player>(path),
    history = useResource<Page<Result>>(path + "/matches?page=" + page);
  const p = profile.data;
  return (
    <main className="site-page">
      <h1>{p?.display_name || username}</h1>
      <p role="status">{profile.error || history.error}</p>
      {p && (
        <>
          <p>
            <GameIcon name={avatarIcons[p.avatar_key] || "swords"} size={36} />{" "}
            {p.rating} rangpont
          </p>
          <p>{p.bio}</p>
        </>
      )}
      <h2>Meccselőzmények</h2>
      {history.data && (
        <>
          {history.data.data.map((r) => (
            <p key={r.id}>
              <Link to={"/meccs/" + r.id}>{r.id}. mérkőzés</Link> · {r.place}.
              hely · {r.delta} pont
            </p>
          ))}
          {!history.data.data.length && <p>Még nincs lezárt mérkőzés.</p>}
          <Pager page={page} last={history.data.last_page} change={setPage} />
        </>
      )}
    </main>
  );
}
export function MatchSummary() {
  const { id } = useParams();
  const { data, error } = useResource<{ mode: string; players: Result[] }>(
    "matches/" + id,
  );
  return (
    <main className="site-page">
      <h1>{id}. mérkőzés</h1>
      <p role="status">{error}</p>
      {data && (
        <>
          <p>{data.mode === "ranked" ? "Rangsorolt" : "Privát"} mérkőzés</p>
          <ol>
            {data.players.map((p) => (
              <li key={p.name}>
                <Link to={"/profil/" + p.name}>{p.name}</Link> · {p.delta} pont
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}
