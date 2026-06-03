import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Se connecter — OhMyBuild",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
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
          Se <span className="text-[var(--color-sky)]">connecter</span>
        </h1>
        <p className="text-sm text-[var(--color-ink)]/70 mb-8">
          Retrouve tes configurations sauvegardées.
        </p>
        <LoginForm callbackUrl={callbackUrl ?? "/mes-configs"} />
      </div>
    </main>
  );
}
