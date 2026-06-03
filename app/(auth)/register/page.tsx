import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Créer un compte — OhMyBuild",
};

export default function RegisterPage() {
  return (
    <main className="content-layer min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md retro-card p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] mb-4"
        >
          ← Retour
        </Link>
        <h1 className="font-[var(--font-display)] text-3xl font-extrabold tracking-tight mb-2">
          Créer un <span className="text-[var(--color-grass)]">compte</span>
        </h1>
        <p className="text-sm text-[var(--color-ink)]/70 mb-8">
          Pour sauvegarder tes configurations et les retrouver plus tard.
        </p>
        <RegisterForm />
      </div>
    </main>
  );
}
