"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/configurateur", label: "Build PC" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-[var(--color-ink)] bg-[var(--color-night)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-night)]/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="relative flex items-center justify-center w-8 h-8 rounded-md border-2 border-[var(--color-ink)] bg-[var(--color-amber)] shadow-[3px_3px_0_var(--color-ink)] group-hover:shadow-[4px_4px_0_var(--color-ink)] group-hover:-translate-y-0.5 transition-all">
            <span className="font-[var(--font-display)] text-sm font-black text-[var(--color-ink)]">O</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-magenta)] border border-[var(--color-ink)]" />
          </span>
          <span className="font-[var(--font-display)] text-base font-extrabold tracking-tight text-[var(--color-cream)]">
            Oh<span className="text-[var(--color-cyan)] glow-cyan">My</span>Build
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <NavLink key={href} href={href} active={pathname === href} label={label} />
          ))}
          {isAuthed && (
            <NavLink
              href="/mes-configs"
              active={pathname === "/mes-configs"}
              label="My Builds"
            />
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {status === "loading" ? (
            <span className="text-xs text-[var(--color-cream)]/60 font-mono">…</span>
          ) : isAuthed ? (
            <>
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-cream)] bg-[var(--color-teal)] border-2 border-[var(--color-cyan)] rounded px-2.5 py-1 shadow-[2px_2px_0_var(--color-ink)]">
                <User className="w-3 h-3 text-[var(--color-cyan)]" />
                {session?.user?.name ?? session?.user?.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Quitter"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border-2 border-[var(--color-ink)] bg-[var(--color-cream)] text-[10px] font-extrabold uppercase tracking-wider hover:bg-[var(--color-magenta)] hover:text-[var(--color-cream)] transition-colors shadow-[2px_2px_0_var(--color-ink)]"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1 rounded border-2 border-[var(--color-cyan)] bg-transparent text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-ink)] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1 rounded border-2 border-[var(--color-ink)] bg-[var(--color-amber)] text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-ink)] hover:bg-[var(--color-amber-dark)] transition-colors shadow-[2px_2px_0_var(--color-ink)]"
              >
                Join ★
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
        "px-3 py-1.5 rounded text-[11px] font-extrabold uppercase tracking-widest transition-all",
        active
          ? "bg-[var(--color-cyan)] text-[var(--color-ink)] shadow-[2px_2px_0_var(--color-magenta)]"
          : "text-[var(--color-cream)]/70 hover:text-[var(--color-cream)] hover:bg-[var(--color-teal)]",
      )}
    >
      {label}
    </Link>
  );
}
