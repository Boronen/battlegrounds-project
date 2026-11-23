import { createContext, useContext, useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router";
import { api, ApiError, type Account } from "../api";
import "./pages.css";

const Session = createContext<{
  user: Account | null;
  setUser: (user: Account | null) => void;
  loading: boolean;
}>({ user: null, setUser: () => {}, loading: true });
export const useSession = () => useContext(Session);
export function Layout() {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  useEffect(() => {
    api<Account>("me")
      .then(setUser)
      .catch((e) => {
        if (!(e instanceof ApiError && e.status === 401))
          setError("A fiókszolgáltatás nem elérhető.");
      })
      .finally(() => setLoading(false));
  }, []);
  const game =
    location.pathname.startsWith("/jatek/") ||
    location.pathname === "/gyakorlas";
  return (
    <Session.Provider value={{ user, setUser, loading }}>
      {!game && (
        <nav className="site-nav" aria-label="Fő navigáció">
          <NavLink to="/" end>
            Csatatér
          </NavLink>
          <NavLink to="/gyakorlas">Gyakorlás</NavLink>
          <NavLink to="/lobbi">Online játék</NavLink>
          <NavLink to="/ranglista">Ranglista</NavLink>
          {user ? (
            <>
              <NavLink to="/profil">Saját profil</NavLink>
              {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
              <button
                onClick={() =>
                  api("logout", "POST")
                    .then(() => setUser(null))
                    .catch((e) => setError(e.message))
                }
              >
                Kilépés
              </button>
            </>
          ) : (
            <>
              <NavLink to="/belepes">Belépés</NavLink>
              <NavLink to="/regisztracio">Regisztráció</NavLink>
            </>
          )}
        </nav>
      )}
      {error && !game && (
        <p className="site-notice" role="status">
          {error}
        </p>
      )}
      <Outlet />
    </Session.Provider>
  );
}
export function RequireAccount({ admin = false }: { admin?: boolean }) {
  const { user, loading } = useSession();
  const location = useLocation();
  if (loading) return <p>Betöltés…</p>;
  if (!user)
    return (
      <Navigate replace to="/belepes" state={{ from: location.pathname }} />
    );
  if (admin && user.role !== "admin")
    return (
      <main className="site-page">
        <h1>Nincs adminjogosultságod.</h1>
        <Link to="/">Kezdőlap</Link>
      </main>
    );
  return <Outlet />;
}
