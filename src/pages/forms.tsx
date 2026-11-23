import {
  createContext,
  useContext,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ApiError } from "../api";

const FieldErrors = createContext<Record<string, string[]>>({});

export function Form({
  submit,
  label,
  children,
}: {
  submit: (values: Record<string, string>) => Promise<void>;
  label: string;
  children: ReactNode;
}) {
  const [fields, setFields] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function handle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as Record<string, string>;
    setFields({});
    setBusy(true);
    setMessage("");
    try {
      await submit(data);
      setMessage("Mentve.");
    } catch (e) {
      if (e instanceof ApiError) setFields(e.fields);
      const details =
        e instanceof ApiError ? Object.values(e.fields).flat().join(" ") : "";
      setMessage(
        details || (e instanceof Error ? e.message : "Sikertelen művelet."),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={handle}>
      <fieldset disabled={busy}>
        <FieldErrors.Provider value={fields}>{children}</FieldErrors.Provider>
        <button>{label}</button>
      </fieldset>
      <span role="status">{message}</span>
    </form>
  );
}
export function Field({
  name,
  label,
  type = "text",
  value,
  required = true,
}: {
  name: string;
  label: string;
  type?: string;
  value?: string;
  required?: boolean;
}) {
  const errors = useContext(FieldErrors)[name];
  const id = useId();
  return (
    <label>
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value}
        required={required}
        aria-invalid={!!errors}
        aria-describedby={errors ? id : undefined}
      />
      {errors && <small id={id}>{errors.join(" ")}</small>}
    </label>
  );
}
export function Pager({
  page,
  last,
  change,
}: {
  page: number;
  last: number;
  change: (n: number) => void;
}) {
  return (
    <nav aria-label="Lapozás">
      <button disabled={page <= 1} onClick={() => change(page - 1)}>
        Előző
      </button>{" "}
      {page} / {last}{" "}
      <button disabled={page >= last} onClick={() => change(page + 1)}>
        Következő
      </button>
    </nav>
  );
}
