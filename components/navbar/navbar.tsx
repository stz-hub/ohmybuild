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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e8e8e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-black">O</span>
          </div>
          <span className="text-sm font-bold tracking-tight">
            Oh<span className="text-blue-600">My</span>Build
          </span>
        </Link>

        <nav className="flex items-center gap-1">
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

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <span className="text-xs text-zinc-400">…</span>
          ) : isAuthed ? (
            <>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-zinc-500">
                <User className="w-3.5 h-3.5" />
                {session?.user?.name ?? session?.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Se déconnecter"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
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
        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
        active
          ? "bg-blue-50 text-blue-600"
          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
      )}
    >
      {label}
    </Link>
  );
}
