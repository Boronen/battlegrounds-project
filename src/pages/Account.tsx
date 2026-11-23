import { Link, useLocation, useNavigate } from "react-router";
import { api, type Account } from "../api";
import { useSession } from "./Layout";
import { Field, Form } from "./forms";

export function AuthPage({ register = false }: { register?: boolean }) {
  const { setUser } = useSession(),
    navigate = useNavigate(),
    location = useLocation();
  return (
    <main className="site-page">
      <h1>{register ? "Regisztráció" : "Belépés"}</h1>
      <Form
        label={register ? "Fiók létrehozása" : "Belépés"}
        submit={async (values) => {
          setUser(
            await api<Account>(register ? "register" : "login", "POST", values),
          );
          navigate(location.state?.from || "/profil", { replace: true });
        }}
      >
        {register && <Field name="name" label="Felhasználónév" />}
        <Field name="email" label="E-mail" type="email" />
        <Field name="password" label="Jelszó" type="password" />
        {register && (
          <Field
            name="password_confirmation"
            label="Jelszó ismét"
            type="password"
          />
        )}
      </Form>
    </main>
  );
}
export function OwnProfile() {
  const { user, setUser } = useSession();
  if (!user) return null;
  return (
    <main className="site-page">
      <h1>Saját profil</h1>
      <Link to={"/profil/" + user.name}>
        Nyilvános profil és meccselőzmények
      </Link>
      <Form
        label="Profil mentése"
        submit={async (values) =>
          setUser(await api<Account>("me/profile", "PATCH", values))
        }
      >
        <Field
          name="display_name"
          label="Megjelenő név"
          value={user.profile.display_name}
        />
        <label>
          Bemutatkozás
          <textarea
            name="bio"
            maxLength={500}
            defaultValue={user.profile.bio || ""}
          />
        </label>
        <label>
          Avatár
          <select name="avatar_key" defaultValue={user.profile.avatar_key}>
            <option value="default_01">Kard</option>
            <option value="default_02">Pajzs</option>
            <option value="default_03">Korona</option>
          </select>
        </label>
      </Form>
      <h2>Jelszó módosítása</h2>
      <Form
        label="Jelszó mentése"
        submit={(v) => api("me/password", "PATCH", v)}
      >
        <Field
          name="current_password"
          label="Jelenlegi jelszó"
          type="password"
        />
        <Field name="password" label="Új jelszó" type="password" />
        <Field
          name="password_confirmation"
          label="Új jelszó ismét"
          type="password"
        />
      </Form>
    </main>
  );
}
