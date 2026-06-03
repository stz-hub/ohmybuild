"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="retro-btn retro-btn-white w-full"
      >
        <GoogleIcon />
        Continuer avec Google
      </button>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-[var(--color-ink)]/30" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[var(--color-background)] px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink)]/60">
            ou
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <Field
          label="Mot de passe"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />

        {error && (
          <p
            role="alert"
            className="text-sm font-semibold text-white bg-[var(--color-cherry)] border-2 border-[var(--color-ink)] rounded-xl px-3 py-2 shadow-[3px_3px_0_var(--color-ink)]"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="retro-btn retro-btn-blue w-full"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p className="text-sm text-[var(--color-ink)]/70 text-center">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="text-[var(--color-sky-dark)] font-bold underline decoration-2 decoration-[var(--color-ring)] underline-offset-2"
          >
            S&apos;inscrire
          </Link>
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-ink)] mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="retro-input"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
