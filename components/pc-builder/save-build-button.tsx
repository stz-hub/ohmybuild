"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        className="xp-button w-full text-[11px] py-1.5 opacity-50"
      >
        Loading...
      </button>
    );
  }

  if (!isAuthed) {
    return (
      <div className="space-y-2">
        <div className="xp-info-box">
          <Image src="/xp-icons/User Accounts.ico" alt="" width={24} height={24} />
          <div className="text-[10px]">
            <strong>Log in required</strong>
            <p>You must be logged in to save your configuration.</p>
          </div>
        </div>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent("/configurateur")}`}
          className="xp-button xp-button-primary w-full text-[11px] py-1.5 text-center block"
        >
          Log In to Save
        </Link>
      </div>
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
        <div>
          <label htmlFor="build-name" className="block text-[11px] font-bold text-[#000] mb-1">
            Configuration Name:
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
            className="xp-input w-full"
          />
        </div>
        {error && (
          <div className="xp-error-box">
            <span className="text-[12px]">&#9888;</span>
            <span className="text-[10px]">{error}</span>
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !name.trim() || selectedCount === 0}
            className="xp-button xp-button-primary flex-1 text-[11px] py-1 disabled:opacity-50"
          >
            {loading ? "Saving..." : initialBuildId ? "Update" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="xp-button text-[11px] py-1 px-3"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-2">
      {savedAt && (
        <div className="xp-success-box">
          <span className="text-[12px] text-[#008000]">&#10003;</span>
          <span className="text-[10px]">Configuration saved successfully!</span>
        </div>
      )}
      <button
        onClick={() => setOpen(true)}
        disabled={selectedCount === 0 || hasErrors}
        className="xp-button xp-button-primary w-full text-[11px] py-1.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        title={
          selectedCount === 0
            ? "Select at least one component"
            : hasErrors
              ? "Fix compatibility issues first"
              : undefined
        }
      >
        <span>&#128190;</span>
        {savedAt ? "Saved!" : initialBuildId ? "Update Configuration" : "Save Configuration"}
      </button>
      {(selectedCount === 0 || hasErrors) && (
        <p className="text-[9px] text-[#808080] text-center">
          {selectedCount === 0 
            ? "Select at least one component to save" 
            : "Fix compatibility issues before saving"}
        </p>
      )}
    </div>
  );
}
