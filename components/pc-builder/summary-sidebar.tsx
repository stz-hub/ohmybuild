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

export function SummarySidebar({ selection, onClear, onCopy }: Props) {
  const total = calculateTotal(selection);
  const selectedCount = getSelectedCount(selection);
  const youtubeUrl =
    selection.cpu && selection.gpu ? getYouTubeUrl(selection.cpu, selection.gpu) : null;

  return (
    <div className="bg-[#1a1a2e] border-4 border-[#2d2d5a] overflow-hidden">
      {/* Header */}
      <div className="bg-[#00d4ff] px-4 py-3 flex items-center justify-between">
        <span className="font-[var(--font-pixel)] text-xs text-[#0d0d1a]">
          SUMMARY - {selectedCount}/{GROUPS.length}
        </span>
        <span className="font-[var(--font-pixel)] text-sm text-[#0d0d1a]">
          {total > 0 ? `${total.toLocaleString("fr-FR")} EUR` : "---"}
        </span>
      </div>

      {/* Items list */}
      <div className="divide-y-2 divide-[#2d2d5a]">
        {GROUPS.map((group) => {
          const item = group.items.find((i) => i.id === selection[group.key]);
          return (
            <div
              key={group.key}
              className={cn("flex items-center justify-between px-4 py-3", !item && "opacity-40")}
            >
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-wider text-[#6060a0] uppercase">
                  {group.label}
                </p>
                <p
                  className={cn(
                    "text-xs truncate",
                    item ? "text-[#e8e8ff]" : "text-[#4a4a8a] italic",
                  )}
                >
                  {item ? item.name : "Not selected"}
                </p>
              </div>
              {item && (
                <span className="font-[var(--font-pixel)] text-xs text-[#ffdd00] ml-3 shrink-0">
                  {item.price > 0 ? `${item.price}` : "INC"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t-4 border-[#2d2d5a] space-y-3">
        <button
          type="button"
          onClick={onCopy}
          disabled={selectedCount === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00d4ff] border-4 border-[#00d4ff] text-[#0d0d1a] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00ffcc] hover:border-[#00ffcc] hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] transition-all"
        >
          <Copy className="w-4 h-4" />
          COPY BUILD
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={selectedCount === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a2e] border-4 border-[#2d2d5a] text-[#9090c0] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#ff3366] hover:text-[#ff3366] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          RESET
        </button>

        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ff3366] border-4 border-[#ff3366] text-[#e8e8ff] font-bold hover:bg-[#ff5588] hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] transition-all"
          >
            <Youtube className="w-4 h-4" />
            BENCHMARKS
          </a>
        )}
      </div>

      {/* Idealo links */}
      {selectedCount > 0 && (
        <div className="px-4 pb-4">
          <p className="text-[10px] font-bold tracking-wider text-[#6060a0] uppercase mb-3">
            COMPARE ON IDEALO
          </p>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((group) => {
              const item = group.items.find((i) => i.id === selection[group.key]);
              if (!item || !IDEALO_URLS[item.id]) return null;
              return (
                <a
                  key={group.key}
                  href={IDEALO_URLS[item.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-[#0d0d1a] border-2 border-[#2d2d5a] text-[#9090c0] hover:border-[#ff00aa] hover:text-[#ff00aa] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
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
