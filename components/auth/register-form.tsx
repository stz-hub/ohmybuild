"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Registration Window */}
        <div className="xp-window">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/User Accounts.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>Create New User Account</span>
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
                src="/xp-icons/User Personalization.ico"
                alt="New User"
                width={48}
                height={48}
              />
              <div>
                <h1 className="text-[16px] font-bold text-[#003399]">
                  New User Account
                </h1>
                <p className="text-[11px] text-[#808080]">Create your account to save and share builds</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="block text-[11px] font-bold text-[#000] mb-1">
                  Display Name:
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="xp-input w-full"
                />
                {errorFor("name") && (
                  <p className="text-[10px] text-[#FF0000] mt-1">{errorFor("name")}</p>
                )}
              </div>

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
                {errorFor("email") && (
                  <p className="text-[10px] text-[#FF0000] mt-1">{errorFor("email")}</p>
                )}
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
                  autoComplete="new-password"
                  required
                  className="xp-input w-full"
                />
                <p className="text-[10px] text-[#808080] mt-1">
                  Min 12 chars with uppercase, numbers, and special chars.
                </p>
                {errorFor("password") && (
                  <p className="text-[10px] text-[#FF0000] mt-1">{errorFor("password")}</p>
                )}
              </div>

              {generalErrors.length > 0 && (
                <div className="xp-error-box">
                  <span className="text-[14px]">&#9888;</span>
                  <div className="text-[11px]">
                    {generalErrors.map((e, i) => (
                      <p key={i}>{e.message}</p>
                    ))}
                  </div>
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
                  {loading ? "Please wait..." : "Create Account"}
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
              onClick={() => signIn("google", { callbackUrl: "/mes-configs" })}
              className="xp-button w-full flex items-center justify-center gap-2 text-[11px] px-4 py-1.5"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C39.9 35.6 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z"/>
              </svg>
              Sign up with Google
            </button>

            {/* Info */}
            <div className="xp-info-box mt-4">
              <Image src="/xp-icons/User 1.ico" alt="" width={24} height={24} />
              <div className="text-[10px]">
                <span>Already have an account? </span>
                <Link href="/login" className="text-[#0066CC] hover:underline">
                  Click here to log on
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
