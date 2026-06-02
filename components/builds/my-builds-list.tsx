"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ArrowRight, Plus } from "lucide-react";

import {
  GROUPS,
  calculateTotal,
  getSelectedCount,
  type Selection,
} from "@/lib/pc-data";

type Build = {
  id: string;
  name: string;
  selection: Selection;
  createdAt: string | Date;
};

export function MyBuildsList({ initialBuilds }: { initialBuilds: Build[] }) {
  const router = useRouter();
  const [builds, setBuilds] = useState<Build[]>(initialBuilds);
  const [, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer définitivement cette configuration ?")) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/builds/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        alert("Suppression impossible. Réessayez.");
        return;
      }
      setBuilds((prev) => prev.filter((b) => b.id !== id));
      startTransition(() => router.refresh());
    } finally {
      setPendingId(null);
    }
  }

  if (builds.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#e8e8e4] bg-white p-10 text-center">
        <p className="text-sm font-semibold text-zinc-600 mb-2">
          Pas encore de configuration sauvegardée
        </p>
        <p className="text-xs text-zinc-400 mb-6">
          Configurez votre premier PC, puis cliquez sur « Sauvegarder ma config ».
        </p>
        <Link
          href="/configurateur"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Configurer un PC
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {builds.map((b) => {
        const sel = b.selection ?? {};
        const total = calculateTotal(sel);
        const count = getSelectedCount(sel);

        return (
          <article key={b.id} className="rounded-xl border border-[#e8e8e4] bg-white overflow-hidden">
            <header className="px-4 py-3 border-b border-[#f0f0ec] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold truncate">{b.name}</h2>
                <p className="text-[11px] text-zinc-400">
                  {new Date(b.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {count} composant{count > 1 ? "s" : ""}
                </p>
              </div>
              <span className="text-lg font-bold text-blue-600 tabular-nums">
                {total.toLocaleString("fr-FR")} €
              </span>
            </header>

            <ul className="divide-y divide-[#f0f0ec]">
              {GROUPS.map((g) => {
                const item = g.items.find((i) => i.id === sel[g.key]);
                if (!item) return null;
                return (
                  <li key={g.key} className="px-4 py-1.5 text-xs flex items-center justify-between">
                    <span className="text-zinc-400 uppercase tracking-wider text-[10px]">
                      {g.label}
                    </span>
                    <span className="text-zinc-700 truncate ml-3">{item.name}</span>
                  </li>
                );
              })}
            </ul>

            <footer className="px-4 py-3 border-t border-[#e8e8e4] flex items-center justify-between">
              <Link
                href={`/configurateur?build=${b.id}`}
                className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
              >
                Ouvrir dans le configurateur
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => handleDelete(b.id)}
                disabled={pendingId === b.id}
                aria-label="Supprimer"
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-red-600 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer
              </button>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
