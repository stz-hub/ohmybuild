"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ArrowRight, Plus, Gamepad2, Star, Zap } from "lucide-react";

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
    if (!confirm("Delete this configuration permanently?")) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/builds/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        alert("Deletion failed. Try again.");
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
      <div className="bg-white border-4 border-dashed border-[#c0c0c0] p-10 rounded-2xl text-center">
        <div className="w-20 h-20 bg-[#f0f0f0] border-4 border-[#c0c0c0] rounded-full flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="w-10 h-10 text-[#a0a0a0]" />
        </div>
        <p className="text-xl font-bold text-[#4a5568] mb-2">
          No Saved Builds
        </p>
        <p className="text-sm text-[#808080] mb-6">
          Configure your first PC, then click &quot;Save Build&quot;.
        </p>
        <Link
          href="/configurateur"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#ffd700] to-[#ff8c00] border-4 border-[#b8860b] text-[#2d3436] font-bold rounded-xl shadow-[0_4px_0_#8b6914] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#8b6914] transition-all"
        >
          <Plus className="w-5 h-5" />
          New Build
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {builds.map((b, index) => {
        const sel = b.selection ?? {};
        const total = calculateTotal(sel);
        const count = getSelectedCount(sel);
        const styles = [
          { border: "#32cd32", shadow: "#228b22", bg: "from-[#e8f5e9] to-[#c8e6c9]" },
          { border: "#1e90ff", shadow: "#0066cc", bg: "from-[#e3f2fd] to-[#bbdefb]" },
          { border: "#ff8c00", shadow: "#cc7000", bg: "from-[#fff3e0] to-[#ffe0b2]" },
        ];
        const style = styles[index % styles.length];

        return (
          <article 
            key={b.id} 
            className="bg-white border-4 rounded-2xl overflow-hidden shadow-[0_4px_0_#808080] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#808080] transition-all"
            style={{ borderColor: style.border }}
          >
            {/* Header */}
            <header 
              className={`px-4 py-3 border-b-4 flex items-center justify-between bg-gradient-to-r ${style.bg}`}
              style={{ borderColor: style.border }}
            >
              <div>
                <h2 className="font-bold text-[#2d3436] truncate flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
                  {b.name}
                </h2>
                <p className="text-xs text-[#4a5568]">
                  {new Date(b.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  - {count} part{count > 1 ? "s" : ""}
                </p>
              </div>
              <span 
                className="font-bold text-lg flex items-center gap-1"
                style={{ color: style.border }}
              >
                <Zap className="w-4 h-4" />
                {total.toLocaleString("fr-FR")} EUR
              </span>
            </header>

            {/* Parts list */}
            <ul className="divide-y-2 divide-[#e0e0e0]">
              {GROUPS.map((g) => {
                const item = g.items.find((i) => i.id === sel[g.key]);
                if (!item) return null;
                return (
                  <li key={g.key} className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs text-[#808080] uppercase font-medium">
                      {g.label}
                    </span>
                    <span className="text-sm text-[#2d3436] truncate ml-3 font-medium">{item.name}</span>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <footer className="px-4 py-3 border-t-2 border-[#e0e0e0] flex items-center justify-between bg-[#f8f8f8]">
              <Link
                href={`/configurateur?build=${b.id}`}
                className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
                style={{ color: style.border }}
              >
                Open in Builder
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleDelete(b.id)}
                disabled={pendingId === b.id}
                aria-label="Delete"
                className="inline-flex items-center gap-1 text-sm text-[#808080] font-medium hover:text-[#e52521] disabled:opacity-50 transition-colors px-3 py-1 rounded-lg hover:bg-[#fce4ec]"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
