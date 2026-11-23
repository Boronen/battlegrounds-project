import { useCallback, useEffect, useState } from "react";

export interface Player {
  name: string;
  display_name: string;
  avatar_key: string;
  bio: string | null;
  rating: number;
}
export interface Account {
  id: number;
  name: string;
  email: string;
  role: "player" | "admin";
  profile: Player;
}
export interface Page<T> {
  data: T[];
  current_page: number;
  last_page: number;
}
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fields: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (method !== "GET") {
    let cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("XSRF-TOKEN="));
    if (!cookie) {
      await fetch("/sanctum/csrf-cookie", { credentials: "same-origin" });
      cookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("XSRF-TOKEN="));
    }
    if (cookie) headers["X-XSRF-TOKEN"] = decodeURIComponent(cookie.slice(11));
  }
  const response = await fetch("/api/" + path, {
    method,
    headers,
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      response.status,
      data.message || "A szolgáltatás nem elérhető.",
      data.errors,
    );
  return data;
}

export function useResource<T>(path: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let active = true;
    setData(undefined);
    setError("");
    api<T>(path)
      .then((value) => {
        if (active) setData(value);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [path, version]);
  return { data, error, reload };
}
