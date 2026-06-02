"use client";

import { cn } from "@/lib/utils";
import { Copy, RotateCcw, ExternalLink, Youtube } from "lucide-react";
import type { Selection } from "@/lib/pc-data";
import {
  GROUPS,
  IDEALO_URLS,
  calculateTotal,
  getSelectedCount,
  getYouTubeUrl,
} from "@/lib/pc-data";

interface Props {
  selection: Selection;
  onClear: () => void;
  onCopy: () => void;
}

// Pas de `sticky` ici : le parent <aside> dans pc-builder.tsx applique le
// sticky sur tout le bloc (Récap + Save) pour qu'ils défilent ensemble.
export function SummarySidebar({ selection, onClear, onCopy }: Props) {
  const total = calculateTotal(selection);
  const selectedCount = getSelectedCount(selection);
  const youtubeUrl =
    selection.cpu && selection.gpu ? getYouTubeUrl(selection.cpu, selection.gpu) : null;

  return (
    <div className="rounded-xl border border-[#e8e8e4] bg-white overflow-hidden">
      <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
          Récapitulatif · {selectedCount}/{GROUPS.length}
        </span>
        <span className="text-lg font-bold text-white tabular-nums">
          {total > 0 ? `${total.toLocaleString("fr-FR")} €` : "—"}
        </span>
      </div>

      <div className="divide-y divide-[#f0f0ec]">
        {GROUPS.map((group) => {
          const item = group.items.find((i) => i.id === selection[group.key]);
          return (
            <div
              key={group.key}
              className={cn("flex items-center justify-between px-4 py-2.5", !item && "opacity-50")}
            >
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {group.label}
                </p>
                <p
                  className={cn(
                    "text-xs truncate",
                    item ? "text-zinc-800" : "text-zinc-400 italic",
                  )}
                >
                  {item ? item.name : "Non sélectionné"}
                </p>
              </div>
              {item && (
                <span className="text-xs font-bold text-blue-600 tabular-nums ml-3 shrink-0">
                  {item.price > 0 ? `${item.price} €` : "Inclus"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#e8e8e4] space-y-2">
        <button
          type="button"
          onClick={onCopy}
          disabled={selectedCount === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-40 hover:bg-blue-700 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Copier la configuration
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={selectedCount === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#e8e8e4] text-zinc-600 text-sm font-medium disabled:opacity-40 hover:bg-zinc-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser
        </button>

        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            <Youtube className="w-3.5 h-3.5" />
            Voir benchmarks
          </a>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="px-4 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Comparer sur Idealo
          </p>
          <div className="flex flex-wrap gap-1.5">
            {GROUPS.map((group) => {
              const item = group.items.find((i) => i.id === selection[group.key]);
              if (!item || !IDEALO_URLS[item.id]) return null;
              return (
                <a
                  key={group.key}
                  href={IDEALO_URLS[item.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded-md bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 text-zinc-600 transition-colors"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  {group.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
