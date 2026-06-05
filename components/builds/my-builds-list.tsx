"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <div className="xp-window">
        <div className="xp-titlebar">
          <div className="xp-titlebar-text">
            <Image src="/xp-icons/Folder Open.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
            <span>No Saved Configurations</span>
          </div>
          <div className="xp-window-controls">
            <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
            <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
            <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
          </div>
        </div>
        <div className="xp-window-content p-8 text-center">
          <Image 
            src="/xp-icons/Folder Closed.ico" 
            alt="" 
            width={64} 
            height={64}
            className="mx-auto mb-4 opacity-50"
          />
          <p className="text-[14px] font-bold text-[#003399] mb-2">
            No Saved Builds
          </p>
          <p className="text-[11px] text-[#808080] mb-4">
            Configure your first PC, then click &quot;Save Build&quot;.
          </p>
          <Link
            href="/configurateur"
            className="xp-button xp-button-primary text-[11px] px-4 py-1 inline-flex items-center gap-2"
          >
            <span>+</span>
            New Configuration
          </Link>
        </div>
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
          <div key={b.id} className="xp-window">
            <div className="xp-titlebar">
              <div className="xp-titlebar-text">
                <Image src="/xp-icons/My Computer.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
                <span className="truncate">{b.name}</span>
              </div>
              <div className="xp-window-controls">
                <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
                <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
                <button 
                  className="xp-control-btn xp-close-btn" 
                  aria-label="Delete"
                  onClick={() => handleDelete(b.id)}
                  disabled={pendingId === b.id}
                >
                  X
                </button>
              </div>
            </div>
            <div className="xp-window-content">
              {/* Header Info */}
              <div className="bg-[#316AC5] text-white p-2 flex items-center justify-between">
                <span className="text-[10px]">
                  {new Date(b.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  - {count} component{count > 1 ? "s" : ""}
                </span>
                <span className="text-[12px] font-bold">
                  {total.toLocaleString("fr-FR")} EUR
                </span>
              </div>

              {/* Parts list */}
              <div className="xp-listview max-h-[200px] overflow-y-auto">
                {GROUPS.map((g) => {
                  const item = g.items.find((i) => i.id === sel[g.key]);
                  if (!item) return null;
                  return (
                    <div key={g.key} className="xp-listview-item flex items-center justify-between py-1 px-2">
                      <span className="text-[9px] text-[#808080] uppercase">
                        {g.label}
                      </span>
                      <span className="text-[10px] text-[#000] truncate ml-2">{item.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-[#919B9C] flex items-center justify-between bg-[#ECE9D8]">
                <Link
                  href={`/configurateur?build=${b.id}`}
                  className="xp-button text-[10px] px-3 py-0.5 flex items-center gap-1"
                >
                  Open in Builder &#8594;
                </Link>
                <button
                  onClick={() => handleDelete(b.id)}
                  disabled={pendingId === b.id}
                  className="text-[10px] text-[#808080] hover:text-[#FF0000] disabled:opacity-50 transition-colors"
                >
                  {pendingId === b.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
