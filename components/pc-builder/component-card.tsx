"use client";

import { cn } from "@/lib/utils";
import { Check, AlertTriangle, ExternalLink, Star } from "lucide-react";
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
        "relative flex flex-col gap-2 p-4 border-4 min-w-[200px] rounded-xl transition-all",
        isSelected
          ? "bg-gradient-to-b from-[#e8f5e9] to-[#c8e6c9] border-[#32cd32] shadow-[0_4px_0_#228b22]"
          : isConflict
          ? "bg-[#f5f5f5] border-[#c0c0c0] opacity-40 cursor-not-allowed"
          : "bg-gradient-to-b from-white to-[#f5f5f5] border-[#c0c0c0] hover:border-[#1e90ff] hover:shadow-[0_4px_0_#808080] cursor-pointer shadow-[0_3px_0_#a0a0a0]"
      )}
    >
      {item.badge && (
        <span className={cn(
          "absolute -top-3 right-3 px-2 py-1 text-[10px] font-bold rounded-full border-2",
          isSelected 
            ? "bg-[#32cd32] border-[#228b22] text-white" 
            : "bg-[#ffd700] border-[#b8860b] text-[#2d3436]"
        )}>
          {item.badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <span className={cn(
          "text-sm font-semibold leading-tight",
          isSelected ? "text-[#2d3436]" : "text-[#2d3436]"
        )}>
          {item.name}
        </span>
        {isSelected && (
          <div className="w-6 h-6 bg-[#32cd32] border-2 border-[#228b22] rounded-full flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
        {isConflict && (
          <div className="w-6 h-6 bg-[#fce4ec] border-2 border-[#e52521] rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3 h-3 text-[#e52521]" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between mt-auto pt-2">
        <span className={cn(
          "text-lg font-bold",
          isSelected ? "text-[#1e90ff]" : "text-[#ff8c00]"
        )}>
          {item.price > 0 ? `${item.price} EUR` : "Included"}
        </span>

        {item.tier && (
          <div className="flex gap-1">
            {[1, 2, 3].map(n => (
              <Star 
                key={n} 
                className={cn(
                  "w-4 h-4",
                  n <= item.tier!
                    ? isSelected 
                      ? "text-[#32cd32] fill-[#32cd32]" 
                      : "text-[#ffd700] fill-[#ffd700]"
                    : "text-[#c0c0c0]"
                )} 
              />
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
          className="flex items-center gap-1 text-xs text-[#1e90ff] hover:text-[#0066cc] transition-colors mt-1 font-semibold"
        >
          <ExternalLink className="w-3 h-3" />
          View on Idealo
        </a>
      )}
    </div>
  );
}
