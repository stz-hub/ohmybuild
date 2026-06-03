"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Gamepad2 } from "lucide-react";

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
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] pixel-grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1a1a2e] border-4 border-[#00d4ff] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(0,212,255,0.5)]">
            <Gamepad2 className="w-8 h-8 text-[#00d4ff]" />
          </div>
          <h1 className="font-[var(--font-pixel)] text-xl text-[#e8e8ff] mb-2">
            PLAYER LOGIN
          </h1>
          <p className="text-sm text-[#9090c0]">Enter your credentials to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="bg-[#1a1a2e] border-4 border-[#2d2d5a] p-6 space-y-5" noValidate>
          <Field
            label="EMAIL"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <Field
            label="PASSWORD"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="px-4 py-3 bg-[#ff3366]/10 border-4 border-[#ff3366] text-sm text-[#ff3366]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-[#00d4ff] border-4 border-[#00d4ff] text-[#0d0d1a] font-bold disabled:opacity-50 hover:bg-[#00ffcc] hover:border-[#00ffcc] hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all"
          >
            {loading ? "LOADING..." : "LOGIN"}
          </button>

          <p className="text-sm text-[#9090c0] text-center pt-2">
            New player?{" "}
            <Link href="/register" className="text-[#ff00aa] font-bold hover:underline">
              CREATE ACCOUNT
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
        className="w-full px-4 py-3 bg-[#0d0d1a] border-4 border-[#2d2d5a] text-[#e8e8ff] text-sm focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all"
      />
    </div>
  );
}
