"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/configurateur", label: "Configurateur" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-[var(--color-ink)] bg-[var(--color-ring)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 gap-3">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-ink)] border-2 border-[var(--color-ink)] flex items-center justify-center shadow-[3px_3px_0_var(--color-sunset)] group-hover:shadow-[4px_4px_0_var(--color-sunset)] group-hover:-translate-y-0.5 transition-all">
            <span className="text-[var(--color-ring)] text-sm font-black">O</span>
          </div>
          <span className="text-base font-extrabold tracking-tight font-[var(--font-display)]">
            Oh<span className="text-[var(--color-sky-dark)]">My</span>Build
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <NavLink key={href} href={href} active={pathname === href} label={label} />
          ))}
          {isAuthed && (
            <NavLink
              href="/mes-configs"
              active={pathname === "/mes-configs"}
              label="Mes configs"
            />
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {status === "loading" ? (
            <span className="text-xs text-[var(--color-ink)]/60">…</span>
          ) : isAuthed ? (
            <>
              <span className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-[var(--color-ink)] bg-white border-2 border-[var(--color-ink)] rounded-full px-2.5 py-1 shadow-[2px_2px_0_var(--color-ink)]">
                <User className="w-3.5 h-3.5" />
                {session?.user?.name ?? session?.user?.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Se déconnecter"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-[var(--color-ink)] bg-white text-xs font-bold hover:bg-[var(--color-cherry)] hover:text-white transition-colors shadow-[2px_2px_0_var(--color-ink)]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quitter</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg border-2 border-[var(--color-ink)] bg-white text-xs font-bold hover:bg-[var(--color-sky-light)] transition-colors shadow-[2px_2px_0_var(--color-ink)]"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-grass)] text-white text-xs font-bold hover:bg-[var(--color-grass-dark)] transition-colors shadow-[2px_2px_0_var(--color-ink)]"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
        active
          ? "bg-[var(--color-ink)] text-[var(--color-ring)] shadow-[2px_2px_0_var(--color-sunset)]"
          : "text-[var(--color-ink)] hover:bg-[var(--color-ink)]/10",
      )}
    >
      {label}
    </Link>
  );
}
