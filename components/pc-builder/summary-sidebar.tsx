"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
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
    <div className="xp-window">
      <div className="xp-titlebar">
        <div className="xp-titlebar-text">
          <Image src="/xp-icons/List File.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
          <span>Build Summary ({selectedCount}/{GROUPS.length})</span>
        </div>
        <div className="xp-window-controls">
          <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
          <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
          <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
        </div>
      </div>
      <div className="xp-window-content">
        {/* Total */}
        <div className="bg-[#316AC5] text-white p-3 flex items-center justify-between">
          <span className="text-[11px] font-bold">TOTAL:</span>
          <span className="text-[16px] font-bold">
            {total > 0 ? `${total.toLocaleString("fr-FR")} EUR` : "---"}
          </span>
        </div>

        {/* Items list */}
        <div className="xp-listview max-h-[300px] overflow-y-auto">
          {GROUPS.map((group) => {
            const item = group.items.find((i) => i.id === selection[group.key]);
            return (
              <div
                key={group.key}
                className={cn(
                  "xp-listview-item flex items-center justify-between py-1.5 px-2",
                  !item && "opacity-40"
                )}
              >
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-[#808080] uppercase">
                    {group.label}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] truncate",
                      item ? "text-[#000]" : "text-[#A0A0A0] italic"
                    )}
                  >
                    {item ? item.name : "Not selected"}
                  </p>
                </div>
                {item && (
                  <span className="font-bold text-[#FF6600] ml-2 shrink-0 text-[11px]">
                    {item.price > 0 ? `${item.price}` : "Inc"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="p-3 border-t border-[#919B9C] space-y-2 bg-[#ECE9D8]">
          <button
            type="button"
            onClick={onCopy}
            disabled={selectedCount === 0}
            className="xp-button xp-button-primary w-full text-[11px] py-1.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>&#128203;</span>
            Copy Build to Clipboard
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={selectedCount === 0}
            className="xp-button w-full text-[11px] py-1.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>&#8634;</span>
            Reset All
          </button>

          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="xp-button w-full text-[11px] py-1.5 flex items-center justify-center gap-2 text-[#FF0000]"
            >
              <span>&#9658;</span>
              Watch Benchmarks on YouTube
            </a>
          )}
        </div>

        {/* Idealo links */}
        {selectedCount > 0 && (
          <div className="p-3 border-t border-[#919B9C] bg-[#F5F5F5]">
            <p className="text-[9px] font-bold text-[#808080] uppercase mb-2">
              Compare on Idealo:
            </p>
            <div className="flex flex-wrap gap-1">
              {GROUPS.map((group) => {
                const item = group.items.find((i) => i.id === selection[group.key]);
                if (!item || !IDEALO_URLS[item.id]) return null;
                return (
                  <a
                    key={group.key}
                    href={IDEALO_URLS[item.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] text-[#0066CC] hover:underline border border-[#C0C0C0] bg-white px-1.5 py-0.5"
                  >
                    {group.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
