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
