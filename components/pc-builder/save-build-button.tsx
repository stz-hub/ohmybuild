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

/**
 * Bouton "Sauvegarder ma config" — variantes :
 * - Non connecté : invite à se connecter.
 * - Connecté : ouvre un inline form qui POST /api/builds (ou PUT si initialBuildId).
 */
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
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#e8e8e4] text-zinc-400 text-sm font-medium"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Chargement…
      </button>
    );
  }

  if (!isAuthed) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent("/configurateur")}`}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#e8e8e4] text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors"
      >
        <Bookmark className="w-3.5 h-3.5" />
        Se connecter pour sauvegarder
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
        setError(body?.error?.message ?? "Impossible d'enregistrer.");
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
      <form onSubmit={handleSave} className="space-y-2">
        <label htmlFor="build-name" className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Nom de la config
        </label>
        <input
          id="build-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Build perso 1440p"
          maxLength={80}
          required
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-[#e8e8e4] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !name.trim() || selectedCount === 0}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Enregistrement…" : initialBuildId ? "Mettre à jour" : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg border border-[#e8e8e4] text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      disabled={selectedCount === 0 || hasErrors}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-40 hover:bg-green-700 transition-colors"
      title={
        selectedCount === 0
          ? "Sélectionnez au moins un composant"
          : hasErrors
            ? "Corrigez les incompatibilités avant de sauvegarder"
            : undefined
      }
    >
      <Bookmark className="w-3.5 h-3.5" />
      {savedAt ? "Sauvegardée ✓" : initialBuildId ? "Mettre à jour la config" : "Sauvegarder ma config"}
    </button>
  );
}
