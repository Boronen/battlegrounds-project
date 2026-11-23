import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { api, useResource, type Page } from "../api";
import type { Character } from "../../shared/types";
import { Field, Form, Pager } from "./forms";

export function AdminLayout() {
  return (
    <main className="site-page">
      <h1>Adminisztráció</h1>
      <nav aria-label="Admin menü">
        {[
          ["", "Áttekintés"],
          ["jatekosok", "Játékosok"],
          ["karakterek", "Karakterek"],
          ["meccsek", "Meccsek"],
          ["naplo", "Napló"],
        ].map(([path, label]) => (
          <NavLink end key={path} to={"/admin" + (path ? "/" + path : "")}>
            {label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </main>
  );
}
export function Overview() {
  const { data, error } = useResource<{
    players: number;
    running: number;
    characters: number;
  }>("admin/overview");
  return (
    <>
      <h2>Áttekintés</h2>
      <p>{error}</p>
      {data && (
        <p>
          {data.players} fiók · {data.running} aktív mérkőzés ·{" "}
          {data.characters} karakter
        </p>
      )}
    </>
  );
}
export function AdminUsers() {
  const [page, setPage] = useState(1),
    [search, setSearch] = useState("");
  const { data, error, reload } = useResource<
    Page<{ id: number; name: string; suspended: boolean }>
  >("admin/users?page=" + page + "&search=" + encodeURIComponent(search));
  return (
    <>
      <h2>Játékosok</h2>
      <label>
        Keresés
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </label>
      <p>{error}</p>
      {data && (
        <>
          {data.data.map((u) => (
            <section key={u.id}>
              <h3>{u.name}</h3>
              <Form
                label={u.suspended ? "Feloldás" : "Felfüggesztés"}
                submit={async () => {
                  await api("admin/users/" + u.id + "/status", "PATCH", {
                    suspended: !u.suspended,
                  });
                  reload();
                }}
              >
                {null}
              </Form>
            </section>
          ))}
          <Pager page={page} last={data.last_page} change={setPage} />
        </>
      )}
    </>
  );
}
interface Version {
  id: number;
  version: number;
  enabled: boolean;
  definition: Character;
}
export function AdminCharacters() {
  const { data, error, reload } = useResource<Version[]>("admin/characters");
  const [selected, setSelected] = useState(0);
  const card = data?.find((c) => c.id === selected),
    template = card || data?.[0];
  return (
    <>
      <h2>Karakterek</h2>
      <p>{error}</p>
      {template && (
        <>
          <label>
            Karakter
            <select
              value={selected}
              onChange={(e) => setSelected(Number(e.target.value))}
            >
              <option value={0}>Új karakter</option>
              {data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.definition.name}
                </option>
              ))}
            </select>
          </label>
          <Form
            key={selected + "-" + template.version}
            label="Verzió publikálása"
            submit={async (v) => {
              await api(
                "admin/characters" + (card ? "/" + card.id + "/versions" : ""),
                "POST",
                v,
              );
              reload();
            }}
          >
            <label>
              Képesség és grafika mintája
              <select name="template" defaultValue={template.id}>
                {data?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.definition.name}
                  </option>
                ))}
              </select>
            </label>
            <Field name="name" label="Név" value={card?.definition.name} />
            {(["tier", "attack", "health"] as const).map((k, i) => (
              <Field
                key={k}
                name={k}
                label={["Szint", "Támadás", "Életerő"][i]}
                type="number"
                value={String(template.definition[k])}
              />
            ))}
          </Form>
          {card && (
            <Form
              label={card.enabled ? "Letiltás új meccsekben" : "Engedélyezés"}
              submit={async () => {
                await api("admin/characters/" + card.id, "PATCH", {
                  enabled: !card.enabled,
                });
                reload();
              }}
            >
              {null}
            </Form>
          )}
        </>
      )}
    </>
  );
}
export function AdminGames() {
  const [page, setPage] = useState(1);
  const { data, error, reload } = useResource<
    Page<{ id: number; status: string; mode: string; heartbeat: string }>
  >("admin/matches?page=" + page);
  return (
    <>
      <h2>Meccsek</h2>
      <p>{error}</p>
      {data && (
        <>
          {data.data.map((g) => (
            <section key={g.id}>
              <h3>
                #{g.id} · {g.mode} · {g.status}
              </h3>
              <p>{g.heartbeat}</p>
              {g.status === "running" && (
                <Form
                  label="Érvénytelenítés"
                  submit={async (v) => {
                    await api("admin/matches/" + g.id + "/void", "POST", v);
                    reload();
                  }}
                >
                  <Field name="reason" label="Indok" />
                </Form>
              )}
            </section>
          ))}
          <Pager page={page} last={data.last_page} change={setPage} />
        </>
      )}
    </>
  );
}
export function AuditLog() {
  const [page, setPage] = useState(1);
  const { data, error } = useResource<
    Page<{
      id: number;
      user_id: number;
      action: string;
      target: number;
      reason: string;
      created_at: string;
    }>
  >("admin/audit?page=" + page);
  return (
    <>
      <h2>Műveleti napló</h2>
      <p>{error}</p>
      {data && (
        <>
          <ul>
            {data.data.map((r) => (
              <li key={r.id}>
                {r.created_at} · Admin #{r.user_id} · {r.action} #{r.target}{" "}
                {r.reason}
              </li>
            ))}
          </ul>
          <Pager page={page} last={data.last_page} change={setPage} />
        </>
      )}
    </>
  );
}
