"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Gamepad2 } from "lucide-react";

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
          setErrors([{ message: body?.error?.message ?? "Registration failed." }]);
        }
        setLoading(false);
        return;
      }

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
      setErrors([{ message: "Network error, try again." }]);
    }
  }

  const errorFor = (field: string) => errors.find((e) => e.field === field)?.message;
  const generalErrors = errors.filter((e) => !e.field);

  return (
    <div className="min-h-screen bg-[#0d0d1a] pixel-grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1a1a2e] border-4 border-[#ff00aa] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,0,170,0.5)]">
            <Gamepad2 className="w-8 h-8 text-[#ff00aa]" />
          </div>
          <h1 className="font-[var(--font-pixel)] text-xl text-[#e8e8ff] mb-2">
            NEW PLAYER
          </h1>
          <p className="text-sm text-[#9090c0]">Create your account to save builds</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="bg-[#1a1a2e] border-4 border-[#2d2d5a] p-6 space-y-5" noValidate>
          <Field
            label="NAME"
            type="text"
            value={name}
            onChange={setName}
            autoComplete="name"
            error={errorFor("name")}
            required
          />
          <Field
            label="EMAIL"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            error={errorFor("email")}
            required
          />
          <Field
            label="PASSWORD"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            error={errorFor("password")}
            hint="Min 12 chars with uppercase, numbers, and special chars."
            required
          />

          {generalErrors.length > 0 && (
            <div className="px-4 py-3 bg-[#ff3366]/10 border-4 border-[#ff3366] text-sm text-[#ff3366] space-y-1">
              {generalErrors.map((e, i) => (
                <p key={i}>{e.message}</p>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-[#ff00aa] border-4 border-[#ff00aa] text-[#e8e8ff] font-bold disabled:opacity-50 hover:bg-[#ff33bb] hover:shadow-[0_0_20px_rgba(255,0,170,0.4)] transition-all"
          >
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>

          <p className="text-sm text-[#9090c0] text-center pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-[#00d4ff] font-bold hover:underline">
              LOGIN
            </Link>
          </p>
        </form>
      </div>
    </div>
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
      <label htmlFor={id} className="block font-[var(--font-pixel)] text-xs text-[#9090c0] mb-2">
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
        className={`w-full px-4 py-3 bg-[#0d0d1a] border-4 text-[#e8e8ff] text-sm focus:outline-none transition-all ${
          error 
            ? "border-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.3)]" 
            : "border-[#2d2d5a] focus:border-[#ff00aa] focus:shadow-[0_0_15px_rgba(255,0,170,0.3)]"
        }`}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[10px] text-[#6060a0] mt-2">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-[10px] text-[#ff3366] mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
