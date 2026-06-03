"use client";

import { cn } from "@/lib/utils";
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
  const idealoUrl = IDEALO_URLS[item.id];

  return (
    <div
      onClick={() => !isConflict && onSelect()}
      className={cn(
        "relative flex flex-col gap-1 p-2 border min-w-[180px] transition-all",
        isSelected
          ? "bg-[#C1D2EE] border-[#316AC5]"
          : isConflict
          ? "bg-[#F5F5F5] border-[#C0C0C0] opacity-50 cursor-not-allowed"
          : "bg-white border-[#7F9DB9] hover:bg-[#E8EEF7] hover:border-[#316AC5] cursor-pointer"
      )}
    >
      {item.badge && (
        <span className={cn(
          "absolute -top-2 right-2 px-2 py-0.5 text-[9px] font-bold border",
          isSelected 
            ? "bg-[#316AC5] border-[#003399] text-white" 
            : "bg-[#FFFFCC] border-[#CCCC66] text-[#000]"
        )}>
          {item.badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold text-[#000] leading-tight">
          {item.name}
        </span>
        {isSelected && (
          <span className="text-[12px] text-[#008000] font-bold shrink-0">&#10003;</span>
        )}
        {isConflict && (
          <span className="text-[12px] text-[#FF0000] font-bold shrink-0">&#9888;</span>
        )}
      </div>

      <div className="flex items-end justify-between mt-auto pt-1">
        <span className={cn(
          "text-[13px] font-bold",
          isSelected ? "text-[#003399]" : "text-[#FF6600]"
        )}>
          {item.price > 0 ? `${item.price} EUR` : "Included"}
        </span>

        {item.tier && (
          <div className="flex gap-0.5">
            {[1, 2, 3].map(n => (
              <span 
                key={n} 
                className={cn(
                  "text-[10px]",
                  n <= item.tier!
                    ? "text-[#FFD700]" 
                    : "text-[#C0C0C0]"
                )}
              >
                &#9733;
              </span>
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
          className="text-[10px] text-[#0066CC] hover:underline mt-1 flex items-center gap-1"
        >
          &#128279; View on Idealo
        </a>
      )}
    </div>
  );
}
