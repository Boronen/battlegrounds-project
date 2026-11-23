import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { api, ApiError } from "./api";
import { useCatalog } from "../shared/catalog";
import type { Snapshot } from "../shared/types";

export function useGameConnection(matchId?: number) {
  const navigate = useNavigate();
  const [state, setState] = useState<Snapshot | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const socket = useMemo(
    () =>
      matchId
        ? io("/matches", {
            autoConnect: false,
            forceNew: true,
            auth: async (callback) => {
              try {
                callback(
                  await api("game-tickets", "POST", { game_id: matchId }),
                );
              } catch (error) {
                if (
                  error instanceof ApiError &&
                  [401, 403].includes(error.status)
                ) {
                  if (error.status === 401)
                    navigate("/belepes", { replace: true });
                  else {
                    const finished = await api("matches/" + matchId)
                      .then(() => true)
                      .catch(() => false);
                    navigate(finished ? "/meccs/" + matchId : "/lobbi", {
                      replace: true,
                    });
                  }
                }
                callback({});
              }
            },
          })
        : io({
            autoConnect: false,
            auth: { token: sessionStorage.getItem("battleToken") },
          }),
    [matchId, navigate],
  );
  useEffect(() => {
    const onState = (s: Snapshot) => {
      setState(s);
    };
    const onConnect = () => {
      setError("");
      setConnected(true);
    };
    const onDisconnect = () => {
      setConnected(false);
      setBusy(false);
    };
    let retry: ReturnType<typeof setTimeout>;
    const onError = (e: Error) => {
      setError(e.message);
      if (matchId) retry = setTimeout(() => socket.connect(), 3000);
    };
    const onSaved = () => navigate("/meccs/" + matchId, { replace: true });
    const onClosed = () => navigate("/lobbi", { replace: true });
    socket
      .on("catalog", useCatalog)
      .on("matchSaved", onSaved)
      .on("matchClosed", onClosed);
    socket
      .on("snapshot", onState)
      .on("connect", onConnect)
      .on("disconnect", onDisconnect)
      .on("connect_error", onError);
    socket.connect();
    return () => {
      clearTimeout(retry);
      socket.removeAllListeners();
      socket.disconnect();
      useCatalog();
    };
  }, [socket, matchId, navigate]);

  return { socket, state, setState, connected, error, setError, busy, setBusy };
}
