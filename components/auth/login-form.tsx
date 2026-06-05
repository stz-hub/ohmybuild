"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

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
      <div className="w-full max-w-md">
        {/* Login Window */}
        <div className="xp-window">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/User Accounts.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>Log On to OhMyBuild</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/xp-icons/User 1.ico"
                alt="User"
                width={48}
                height={48}
              />
              <div>
                <h1 className="text-[16px] font-bold text-[#003399]">
                  Welcome Back!
                </h1>
                <p className="text-[11px] text-[#808080]">Enter your credentials to continue</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="block text-[11px] font-bold text-[#000] mb-1">
                  Email Address:
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="xp-input w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[11px] font-bold text-[#000] mb-1">
                  Password:
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="xp-input w-full"
                />
              </div>

              {error && (
                <div className="xp-error-box">
                  <span className="text-[14px]">&#9888;</span>
                  <span className="text-[11px]">{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#919B9C]">
                <Link href="/" className="xp-button text-[11px] px-4 py-1">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="xp-button xp-button-primary text-[11px] px-4 py-1 disabled:opacity-50"
                >
                  {loading ? "Please wait..." : "Log On"}
                </button>
              </div>
            </form>

            {/* Separateur */}
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-[#919B9C]" />
              <span className="text-[10px] text-[#808080]">or</span>
              <div className="flex-1 h-px bg-[#919B9C]" />
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="xp-button w-full flex items-center justify-center gap-2 text-[11px] px-4 py-1.5"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C39.9 35.6 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z"/>
              </svg>
              Sign in with Google
            </button>

            {/* Info */}
            <div className="xp-info-box mt-4">
              <Image src="/xp-icons/User Accounts.ico" alt="" width={24} height={24} />
              <div className="text-[10px]">
                <span>New user? </span>
                <Link href="/register" className="text-[#0066CC] hover:underline">
                  Click here to create a new account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
