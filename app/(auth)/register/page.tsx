import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Créer un compte — OhMyBuild",
};

export default function RegisterPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Créer un compte</h1>
        <p className="text-sm text-zinc-500 mb-8">
          Pour sauvegarder vos configurations et y revenir plus tard.
        </p>
        <RegisterForm />
      </div>
    </main>
  );
}
