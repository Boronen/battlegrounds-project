import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../api";
import { useSession } from "./Layout";
import { Field, Form } from "./forms";

interface Room {
  id: number;
  code: string;
  mode: string;
  status: string;
  members: { user_id: number; name: string; ready: boolean }[];
}
export function LobbyPage() {
  const { user } = useSession(),
    navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true,
      timer: ReturnType<typeof setTimeout>;
    async function refresh() {
      try {
        const data = await api<Room | null>("lobbies/current");
        if (active) {
          setRoom(data);
          setError("");
        }
      } catch (e) {
        if (active) setError((e as Error).message);
      } finally {
        if (active) timer = setTimeout(refresh, 1500);
      }
    }
    void refresh();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    if (room?.status === "running")
      navigate("/jatek/" + room.id, { replace: true });
  }, [room, navigate]);
  const act = async (path: string, body?: unknown) =>
    setRoom(await api<Room | null>(path, "POST", body));
  const mine = room?.members.find((m) => m.user_id === user?.id);
  return (
    <main className="site-page">
      <h1>Online játék</h1>
      <p role="status">{error}</p>
      {room === undefined ? (
        <p>Szoba keresése…</p>
      ) : room ? (
        <>
          <h2>
            {room.mode === "ranked"
              ? "Rangsorolt várólista"
              : "Szobakód: " + room.code}
          </h2>
          <p>{room.members.length} / 8 játékos</p>
          <ul>
            {room.members.map((m) => (
              <li key={m.user_id}>
                {m.name} {m.ready ? "· Kész" : ""}
              </li>
            ))}
          </ul>
          {room.mode === "private" && (
            <>
              <Form
                label={mine?.ready ? "Mégsem állok készen" : "Készen állok"}
                submit={() =>
                  act("lobbies/" + room.id + "/ready", { ready: !mine?.ready })
                }
              >
                {null}
              </Form>
              {room.members[0]?.user_id === user?.id && (
                <Form
                  label="Meccs indítása"
                  submit={() => act("lobbies/" + room.id + "/start")}
                >
                  {null}
                </Form>
              )}
            </>
          )}
          <Form
            label="Kilépés"
            submit={() => act("lobbies/" + room.id + "/leave")}
          >
            {null}
          </Form>
        </>
      ) : (
        <>
          <Form
            label="Rangsorolt várólistára lépek"
            submit={() => act("queue")}
          >
            {null}
          </Form>
          <Form label="Privát szoba létrehozása" submit={() => act("lobbies")}>
            {null}
          </Form>
          <Form
            label="Csatlakozás"
            submit={(values) => act("lobbies/join", values)}
          >
            <Field name="code" label="Meghívókód" />
          </Form>
        </>
      )}
    </main>
  );
}
