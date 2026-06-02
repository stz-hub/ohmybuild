"use client";

/**
 * Wrapper client autour du SessionProvider de NextAuth.
 * Permet aux composants client (Navbar, formulaires, bouton "Sauvegarder")
 * d'utiliser `useSession()`.
 */
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
