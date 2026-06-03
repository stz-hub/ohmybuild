"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Gamepad2 } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "HOME" },
  { href: "/configurateur", label: "BUILD" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d1a]/95 backdrop-blur border-b-4 border-[#2d2d5a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#1a1a2e] border-4 border-[#00d4ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.5)] group-hover:shadow-[0_0_30px_rgba(0,212,255,0.8)] transition-shadow">
            <Gamepad2 className="w-5 h-5 text-[#00d4ff]" />
          </div>
          <span className="font-[var(--font-pixel)] text-xs tracking-wider">
            <span className="text-[#e8e8ff]">Oh</span>
            <span className="text-[#00d4ff] drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]">My</span>
            <span className="text-[#ff00aa] drop-shadow-[0_0_10px_rgba(255,0,170,0.8)]">Build</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <NavLink key={href} href={href} active={pathname === href} label={label} />
          ))}
          {isAuthed && (
            <NavLink
              href="/mes-configs"
              active={pathname === "/mes-configs"}
              label="SAVES"
            />
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <span className="text-xs text-[#6060a0] animate-pulse">LOADING...</span>
          ) : isAuthed ? (
            <>
              <span className="hidden sm:inline-flex items-center gap-2 text-sm text-[#9090c0] bg-[#1a1a2e] border-2 border-[#2d2d5a] px-3 py-1">
                <User className="w-4 h-4 text-[#00ff88]" />
                <span className="truncate max-w-24">{session?.user?.name ?? session?.user?.email}</span>
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Se deconnecter"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] border-4 border-[#ff3366] text-[#ff3366] text-sm hover:bg-[#ff3366] hover:text-[#0d0d1a] hover:shadow-[0_0_20px_rgba(255,51,102,0.5)] transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">QUIT</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 bg-[#1a1a2e] border-4 border-[#2d2d5a] text-sm text-[#9090c0] hover:border-[#00d4ff] hover:text-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all"
              >
                LOGIN
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-[#00d4ff] border-4 border-[#00d4ff] text-sm text-[#0d0d1a] font-bold hover:bg-[#00ffcc] hover:border-[#00ffcc] hover:shadow-[0_0_20px_rgba(0,255,204,0.5)] transition-all"
              >
                JOIN
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
        "px-4 py-2 text-sm transition-all border-4",
        active
          ? "bg-[#00d4ff] border-[#00d4ff] text-[#0d0d1a] shadow-[0_0_20px_rgba(0,212,255,0.5)]"
          : "bg-[#1a1a2e] border-[#2d2d5a] text-[#9090c0] hover:border-[#00d4ff] hover:text-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]",
      )}
    >
      {label}
    </Link>
  );
}
