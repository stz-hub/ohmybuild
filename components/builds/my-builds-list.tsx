"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ArrowRight, Plus, Gamepad2 } from "lucide-react";

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
      <div className="bg-[#1a1a2e] border-4 border-dashed border-[#2d2d5a] p-10 text-center">
        <div className="w-16 h-16 bg-[#0d0d1a] border-4 border-[#2d2d5a] flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="w-8 h-8 text-[#6060a0]" />
        </div>
        <p className="font-[var(--font-pixel)] text-sm text-[#9090c0] mb-2">
          NO SAVED BUILDS
        </p>
        <p className="text-xs text-[#6060a0] mb-6">
          Configure your first PC, then click &quot;Save Build&quot;.
        </p>
        <Link
          href="/configurateur"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4ff] border-4 border-[#00d4ff] text-[#0d0d1a] font-bold hover:bg-[#00ffcc] hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all"
        >
          <Plus className="w-5 h-5" />
          NEW BUILD
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
        const colors = ["#00d4ff", "#ff00aa", "#00ff88"];
        const color = colors[index % colors.length];

        return (
          <article 
            key={b.id} 
            className="bg-[#1a1a2e] border-4 border-[#2d2d5a] overflow-hidden hover:border-current transition-colors"
            style={{ '--card-color': color } as React.CSSProperties}
          >
            {/* Header */}
            <header 
              className="px-4 py-3 border-b-4 border-[#2d2d5a] flex items-center justify-between"
              style={{ backgroundColor: `${color}20` }}
            >
              <div>
                <h2 className="font-[var(--font-pixel)] text-xs text-[#e8e8ff] truncate">{b.name}</h2>
                <p className="text-[10px] text-[#6060a0]">
                  {new Date(b.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  - {count} part{count > 1 ? "s" : ""}
                </p>
              </div>
              <span 
                className="font-[var(--font-pixel)] text-sm"
                style={{ color }}
              >
                {total.toLocaleString("fr-FR")} EUR
              </span>
            </header>

            {/* Parts list */}
            <ul className="divide-y-2 divide-[#2d2d5a]">
              {GROUPS.map((g) => {
                const item = g.items.find((i) => i.id === sel[g.key]);
                if (!item) return null;
                return (
                  <li key={g.key} className="px-4 py-2 flex items-center justify-between">
                    <span className="text-[10px] text-[#6060a0] uppercase tracking-wider">
                      {g.label}
                    </span>
                    <span className="text-xs text-[#9090c0] truncate ml-3">{item.name}</span>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <footer className="px-4 py-3 border-t-4 border-[#2d2d5a] flex items-center justify-between bg-[#0d0d1a]/50">
              <Link
                href={`/configurateur?build=${b.id}`}
                className="inline-flex items-center gap-2 text-xs font-bold hover:underline"
                style={{ color }}
              >
                OPEN IN BUILDER
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => handleDelete(b.id)}
                disabled={pendingId === b.id}
                aria-label="Delete"
                className="inline-flex items-center gap-1 text-xs text-[#6060a0] hover:text-[#ff3366] disabled:opacity-50 transition-colors px-2 py-1 border-2 border-transparent hover:border-[#ff3366]"
              >
                <Trash2 className="w-4 h-4" />
                DELETE
              </button>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
