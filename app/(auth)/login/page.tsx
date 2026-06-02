import type { Metadata } from "next";
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
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Se connecter</h1>
        <p className="text-sm text-zinc-500 mb-8">
          Retrouvez vos configurations sauvegardées.
        </p>
        <LoginForm callbackUrl={callbackUrl ?? "/mes-configs"} />
      </div>
    </main>
  );
}
