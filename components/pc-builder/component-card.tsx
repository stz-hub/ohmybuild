"use client";

import { cn } from "@/lib/utils";
import { Check, AlertTriangle, ExternalLink } from "lucide-react";
import type { Component, ComponentKey, Selection } from "@/lib/pc-data";
import { IDEALO_URLS, wouldCreateError } from "@/lib/pc-data";

interface Props {
  item: Component;
  groupKey: ComponentKey;
  isSelected: boolean;
  selection: Selection;
  onSelect: () => void;
}

export function ComponentCard({ item, groupKey, isSelected, selection, onSelect }: Props) {
  const isConflict = !isSelected && wouldCreateError(selection, groupKey, item.id);
  const idealoUrl  = IDEALO_URLS[item.id];

  return (
    <div
      onClick={() => !isConflict && onSelect()}
      className={cn(
        "relative flex flex-col gap-2 p-4 border-4 min-w-[200px] transition-all",
        isSelected
          ? "bg-[#00d4ff]/10 border-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.4)]"
          : isConflict
          ? "bg-[#1a1a2e] border-[#2d2d5a] opacity-40 cursor-not-allowed"
          : "bg-[#1a1a2e] border-[#2d2d5a] hover:border-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] cursor-pointer"
      )}
    >
      {item.badge && (
        <span className={cn(
          "absolute -top-3 right-3 px-2 py-1 text-[10px] font-bold tracking-wider border-2",
          isSelected 
            ? "bg-[#00d4ff] border-[#00d4ff] text-[#0d0d1a]" 
            : "bg-[#ff00aa] border-[#ff00aa] text-[#e8e8ff]"
        )}>
          {item.badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <span className={cn(
          "text-sm leading-tight",
          isSelected ? "text-[#00d4ff]" : "text-[#e8e8ff]"
        )}>
          {item.name}
        </span>
        {isSelected && (
          <div className="w-5 h-5 bg-[#00d4ff] flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-[#0d0d1a]" />
          </div>
        )}
        {isConflict && <AlertTriangle className="w-4 h-4 text-[#ff3366] shrink-0" />}
      </div>

      <div className="flex items-end justify-between mt-auto pt-2">
        <span className={cn(
          "font-[var(--font-pixel)] text-sm",
          isSelected ? "text-[#00d4ff]" : "text-[#ffdd00]"
        )}>
          {item.price > 0 ? `${item.price} EUR` : "INCLUDED"}
        </span>

        {item.tier && (
          <div className="flex gap-1">
            {[1, 2, 3].map(n => (
              <div key={n} className={cn(
                "w-2 h-2",
                n <= item.tier!
                  ? isSelected ? "bg-[#00d4ff]" : "bg-[#00ff88]"
                  : "bg-[#2d2d5a]"
              )} />
            ))}
          </div>
        )}
      </div>

      {isSelected && idealoUrl && (
        <a
          href={idealoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 text-xs text-[#ff00aa] hover:text-[#ff33bb] transition-colors mt-1"
        >
          <ExternalLink className="w-3 h-3" />
          VIEW ON IDEALO
        </a>
      )}
    </div>
  );
}
