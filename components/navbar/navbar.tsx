"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Gamepad2, Star } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1e90ff] via-[#4da6ff] to-[#1e90ff] border-b-4 border-[#0066cc] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] border-4 border-[#b8860b] rounded-full flex items-center justify-center shadow-[0_4px_0_#8b6914] group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6 text-white drop-shadow-md" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white drop-shadow-[2px_2px_0_#0066cc]">Oh</span>
            <span className="text-[#ffd700] drop-shadow-[2px_2px_0_#b8860b]">My</span>
            <span className="text-[#32cd32] drop-shadow-[2px_2px_0_#006400]">Build</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
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

        {/* Auth Section */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <span className="text-sm text-white/80 animate-pulse">Loading...</span>
          ) : isAuthed ? (
            <>
              <span className="hidden sm:inline-flex items-center gap-2 text-sm text-white bg-white/20 backdrop-blur-sm border-2 border-white/30 px-3 py-1.5 rounded-full">
                <User className="w-4 h-4" />
                <span className="truncate max-w-24">{session?.user?.name ?? session?.user?.email}</span>
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Se deconnecter"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#ff6b6b] to-[#e52521] border-4 border-[#a01a17] text-white text-sm font-bold rounded-xl shadow-[0_4px_0_#7a1410] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#7a1410] active:translate-y-[2px] active:shadow-[0_2px_0_#7a1410] transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-b from-[#ffd700] to-[#ff8c00] border-4 border-[#b8860b] text-[#2d3436] text-sm font-bold rounded-xl shadow-[0_4px_0_#8b6914] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#8b6914] active:translate-y-[2px] active:shadow-[0_2px_0_#8b6914] transition-all flex items-center gap-1"
              >
                <Star className="w-4 h-4" />
                Join!
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
        "px-4 py-2 text-sm font-semibold transition-all rounded-xl border-4",
        active
          ? "bg-white text-[#1e90ff] border-[#c0c0c0] shadow-[0_4px_0_#808080]"
          : "bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30",
      )}
    >
      {label}
    </Link>
  );
}
