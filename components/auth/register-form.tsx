"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type FieldError = { field?: string; message: string };

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldError[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (Array.isArray(body?.error?.details)) {
          setErrors(
            body.error.details.map((d: { field?: string; message: string }) => ({
              field: d.field,
              message: d.message,
            })),
          );
        } else {
          setErrors([{ message: body?.error?.message ?? "Inscription impossible." }]);
        }
        setLoading(false);
        return;
      }

      // Inscription OK → auto-login.
      const signin = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      setLoading(false);
      if (signin?.error) {
        router.push("/login");
        return;
      }
      router.push("/mes-configs");
      router.refresh();
    } catch {
      setLoading(false);
      setErrors([{ message: "Erreur réseau, réessayez." }]);
    }
  }

  const errorFor = (field: string) => errors.find((e) => e.field === field)?.message;
  const generalErrors = errors.filter((e) => !e.field);

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field
        label="Nom"
        type="text"
        value={name}
        onChange={setName}
        autoComplete="name"
        error={errorFor("name")}
        required
      />
      <Field
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        error={errorFor("email")}
        required
      />
      <Field
        label="Mot de passe"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        error={errorFor("password")}
        hint="12 caractères minimum, avec majuscules, chiffres et caractères spéciaux."
        required
      />

      {generalErrors.length > 0 && (
        <ul role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 space-y-0.5">
          {generalErrors.map((e, i) => (
            <li key={i}>{e.message}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "Création…" : "Créer mon compte"}
      </button>

      <p className="text-sm text-zinc-500 text-center">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-blue-600 font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  error,
  hint,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-zinc-600 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`w-full px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
          error ? "border-red-400" : "border-[#e8e8e4] focus:border-blue-400"
        }`}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[11px] text-zinc-400 mt-1">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-[11px] text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
