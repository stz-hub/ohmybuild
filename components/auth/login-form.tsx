"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Gamepad2, Star } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Sky gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1e90ff] via-[#87ceeb] to-[#32cd32] -z-10" />
      <div className="fixed inset-0 clouds-bg -z-10" />
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] border-4 border-[#b8860b] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_6px_0_#8b6914]">
            <Gamepad2 className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-[2px_2px_0_#0066cc] mb-2">
            Welcome Back!
          </h1>
          <p className="text-white/80 drop-shadow-md">Enter your credentials to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="bg-white border-4 border-[#c0c0c0] rounded-2xl p-6 space-y-5 shadow-[0_6px_0_#808080]" noValidate>
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="px-4 py-3 bg-[#fce4ec] border-4 border-[#e52521] rounded-xl text-sm text-[#e52521] font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-b from-[#32cd32] to-[#228b22] border-4 border-[#006400] text-white font-bold rounded-xl shadow-[0_4px_0_#004d00] disabled:opacity-50 hover:translate-y-[-2px] hover:shadow-[0_6px_0_#004d00] active:translate-y-[1px] active:shadow-[0_2px_0_#004d00] transition-all"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="text-sm text-[#4a5568] text-center pt-2">
            New player?{" "}
            <Link href="/register" className="text-[#1e90ff] font-bold hover:underline flex items-center gap-1 justify-center mt-1">
              <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
              Create Account
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
      <label htmlFor={id} className="block font-semibold text-[#2d3436] mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="w-full px-4 py-3 bg-[#f8f8f8] border-4 border-[#c0c0c0] rounded-xl text-[#2d3436] text-sm focus:outline-none focus:border-[#1e90ff] focus:shadow-[0_0_0_4px_rgba(30,144,255,0.2)] transition-all"
      />
    </div>
  );
}
