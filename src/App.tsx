import {
  createHashRouter,
  RouterProvider,
  Link,
  useParams,
} from "react-router";
import { Layout, RequireAccount } from "./pages/Layout";
import { AuthPage, OwnProfile } from "./pages/Account";
import { Leaderboard, PublicProfile, MatchSummary } from "./pages/Community";
import { LobbyPage } from "./pages/LobbyPage";
import {
  AdminLayout,
  Overview,
  AdminUsers,
  AdminCharacters,
  AdminGames,
  AuditLog,
} from "./pages/Admin";
import { GameScreen } from "./GameScreen";

function LiveGame() {
  const { id } = useParams();
  return <GameScreen key={id} matchId={Number(id)} />;
}
const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <GameScreen /> },
      { path: "gyakorlas", element: <GameScreen /> },
      { path: "belepes", element: <AuthPage /> },
      { path: "regisztracio", element: <AuthPage register /> },
      { path: "ranglista", element: <Leaderboard /> },
      { path: "profil/:username", element: <PublicProfile /> },
      { path: "meccs/:id", element: <MatchSummary /> },
      {
        element: <RequireAccount />,
        children: [
          { path: "profil", element: <OwnProfile /> },
          { path: "lobbi", element: <LobbyPage /> },
          { path: "jatek/:id", element: <LiveGame /> },
        ],
      },
      {
        element: <RequireAccount admin />,
        children: [
          {
            path: "admin",
            element: <AdminLayout />,
            children: [
              { index: true, element: <Overview /> },
              { path: "jatekosok", element: <AdminUsers /> },
              { path: "karakterek", element: <AdminCharacters /> },
              { path: "meccsek", element: <AdminGames /> },
              { path: "naplo", element: <AuditLog /> },
            ],
          },
        ],
      },
      {
        path: "*",
        element: (
          <main className="site-page">
            <h1>Az oldal nem található.</h1>
            <Link to="/">Kezdőlap</Link>
          </main>
        ),
      },
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
