"use client";

import { cn } from "@/lib/utils";
import { Copy, RotateCcw, ExternalLink, Youtube, Star, Zap } from "lucide-react";
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
    <div className="bg-white border-4 border-[#ffd700] rounded-2xl overflow-hidden shadow-[0_6px_0_#b8860b]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ffd700] to-[#ff8c00] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-white fill-white" />
          <span className="font-bold text-white">
            Your Build ({selectedCount}/{GROUPS.length})
          </span>
        </div>
        <span className="font-bold text-white text-lg">
          {total > 0 ? `${total.toLocaleString("fr-FR")} EUR` : "---"}
        </span>
      </div>

      {/* Items list */}
      <div className="divide-y-2 divide-[#e0e0e0]">
        {GROUPS.map((group) => {
          const item = group.items.find((i) => i.id === selection[group.key]);
          return (
            <div
              key={group.key}
              className={cn("flex items-center justify-between px-4 py-3", !item && "opacity-40")}
            >
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#808080] uppercase">
                  {group.label}
                </p>
                <p
                  className={cn(
                    "text-sm truncate",
                    item ? "text-[#2d3436] font-medium" : "text-[#a0a0a0] italic",
                  )}
                >
                  {item ? item.name : "Not selected"}
                </p>
              </div>
              {item && (
                <span className="font-bold text-[#ff8c00] ml-3 shrink-0 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {item.price > 0 ? item.price : "Inc"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t-2 border-[#e0e0e0] space-y-3 bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0]">
        <button
          type="button"
          onClick={onCopy}
          disabled={selectedCount === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-b from-[#32cd32] to-[#228b22] border-4 border-[#006400] text-white font-bold rounded-xl shadow-[0_4px_0_#004d00] disabled:opacity-40 disabled:cursor-not-allowed hover:translate-y-[-2px] hover:shadow-[0_6px_0_#004d00] active:translate-y-[1px] active:shadow-[0_2px_0_#004d00] transition-all"
        >
          <Copy className="w-4 h-4" />
          Copy Build
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={selectedCount === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-4 border-[#c0c0c0] text-[#4a5568] font-semibold rounded-xl shadow-[0_3px_0_#808080] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#e52521] hover:text-[#e52521] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-b from-[#ff6b6b] to-[#e52521] border-4 border-[#a01a17] text-white font-bold rounded-xl shadow-[0_4px_0_#7a1410] hover:translate-y-[-2px] hover:shadow-[0_6px_0_#7a1410] transition-all"
          >
            <Youtube className="w-4 h-4" />
            Watch Benchmarks
          </a>
        )}
      </div>

      {/* Idealo links */}
      {selectedCount > 0 && (
        <div className="px-4 pb-4 bg-gradient-to-b from-[#f0f0f0] to-[#e8e8e8]">
          <p className="text-[10px] font-bold text-[#808080] uppercase mb-3">
            Compare on Idealo
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
                  className="inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-white border-2 border-[#c0c0c0] text-[#4a5568] rounded-lg font-semibold hover:border-[#1e90ff] hover:text-[#1e90ff] transition-colors"
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
