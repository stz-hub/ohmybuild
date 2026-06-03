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
