"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2 } from "lucide-react";

import type { Selection } from "@/lib/pc-data";

type Props = {
  selection: Selection;
  selectedCount: number;
  hasErrors: boolean;
  isAuthed: boolean;
  authStatus: "loading" | "authenticated" | "unauthenticated";
  initialName?: string;
  initialBuildId?: string;
};

export function SaveBuildButton({
  selection,
  selectedCount,
  hasErrors,
  isAuthed,
  authStatus,
  initialName,
  initialBuildId,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  if (authStatus === "loading") {
    return (
      <button
        disabled
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0d0d1a] border-4 border-[#2d2d5a] text-[#6060a0] font-bold"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        LOADING...
      </button>
    );
  }

  if (!isAuthed) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent("/configurateur")}`}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0d0d1a] border-4 border-[#ffdd00] text-[#ffdd00] font-bold hover:bg-[#ffdd00] hover:text-[#0d0d1a] hover:shadow-[0_0_20px_rgba(255,221,0,0.4)] transition-all"
      >
        <Bookmark className="w-4 h-4" />
        LOGIN TO SAVE
      </Link>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const method = initialBuildId ? "PUT" : "POST";
      const url = initialBuildId ? `/api/builds/${initialBuildId}` : "/api/builds";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), selection }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error?.message ?? "Failed to save.");
        return;
      }
      setSavedAt(new Date());
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (open) {
    return (
      <form onSubmit={handleSave} className="space-y-3">
        <label htmlFor="build-name" className="block font-[var(--font-pixel)] text-xs text-[#9090c0]">
          BUILD NAME
        </label>
        <input
          id="build-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My 1440p Build"
          maxLength={80}
          required
          autoFocus
          className="w-full px-4 py-3 bg-[#0d0d1a] border-4 border-[#2d2d5a] text-[#e8e8ff] text-sm focus:outline-none focus:border-[#00ff88] focus:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
        />
        {error && (
          <p className="text-xs text-[#ff3366] px-2">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !name.trim() || selectedCount === 0}
            className="flex-1 px-4 py-3 bg-[#00ff88] border-4 border-[#00ff88] text-[#0d0d1a] font-bold disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
          >
            {loading ? "SAVING..." : initialBuildId ? "UPDATE" : "SAVE"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-3 bg-[#0d0d1a] border-4 border-[#2d2d5a] text-[#9090c0] hover:border-[#ff3366] hover:text-[#ff3366] transition-all"
          >
            CANCEL
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      disabled={selectedCount === 0 || hasErrors}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00ff88] border-4 border-[#00ff88] text-[#0d0d1a] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all"
      title={
        selectedCount === 0
          ? "Select at least one component"
          : hasErrors
            ? "Fix compatibility issues first"
            : undefined
      }
    >
      <Bookmark className="w-4 h-4" />
      {savedAt ? "SAVED!" : initialBuildId ? "UPDATE BUILD" : "SAVE BUILD"}
    </button>
  );
}
