"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: "/xp-icons/My Computer.ico" },
  { href: "/configurateur", label: "PC Builder", icon: "/xp-icons/System Properties.ico" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";

  return (
    <header className="xp-taskbar sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 flex items-center justify-between h-[30px]">
        {/* Start Button / Logo */}
        <Link href="/" className="xp-start-button flex items-center gap-2 h-[26px] -ml-2">
          <Image 
            src="/xp-logo.png" 
            alt="Windows XP Logo" 
            width={20} 
            height={20}
            className="drop-shadow-md"
          />
          <span>OhMyBuild</span>
        </Link>

        {/* Navigation - Quick Launch */}
        <nav className="flex items-center gap-1 ml-4">
          {links.map(({ href, label, icon }) => (
            <TaskbarButton 
              key={href} 
              href={href} 
              active={pathname === href} 
              label={label} 
              icon={icon}
            />
          ))}
          {isAuthed && (
            <TaskbarButton
              href="/mes-configs"
              active={pathname === "/mes-configs"}
              label="My Builds"
              icon="/xp-icons/Folder Closed.ico"
            />
          )}
        </nav>

        {/* System Tray */}
        <div className="flex items-center gap-2 ml-auto">
          {status === "loading" ? (
            <span className="text-[11px] text-white/80 animate-pulse px-2">Loading...</span>
          ) : isAuthed ? (
            <>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-white bg-[#1D4EAC] px-2 py-0.5 rounded-sm border border-[#0D3E9C]">
                <Image 
                  src="/xp-icons/User 1.ico" 
                  alt="User" 
                  width={16} 
                  height={16}
                />
                <span className="truncate max-w-24">{session?.user?.name ?? session?.user?.email}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Sign Out"
                className="xp-button text-[11px] flex items-center gap-1 py-0.5 px-2"
              >
                <span className="text-red-600">X</span>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="xp-button text-[11px] py-0.5 px-2"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="xp-button xp-button-primary text-[11px] py-0.5 px-2 flex items-center gap-1"
              >
                <Image 
                  src="/xp-icons/User Accounts.ico" 
                  alt="" 
                  width={14} 
                  height={14}
                />
                Register
              </Link>
            </>
          )}
          
          {/* Clock */}
          <div className="bg-[#1D4EAC] border border-[#0D3E9C] px-2 py-0.5 text-[11px] text-white font-normal rounded-sm ml-2">
            <Clock />
          </div>
        </div>
      </div>
    </header>
  );
}

function TaskbarButton({ 
  href, 
  active, 
  label, 
  icon 
}: { 
  href: string; 
  active: boolean; 
  label: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1 px-2 py-0.5 text-[11px] font-normal text-white rounded-sm transition-all",
        active
          ? "bg-[#1D4EAC] border border-[#0D3E9C] shadow-inner"
          : "hover:bg-[#3366CC] border border-transparent"
      )}
    >
      <Image 
        src={icon} 
        alt="" 
        width={16} 
        height={16}
        className="drop-shadow-sm"
      />
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}

function Clock() {
  // Simple clock that updates via client
  const time = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  return <span suppressHydrationWarning>{time}</span>;
}
