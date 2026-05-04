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
        "relative flex flex-col gap-2 p-3 rounded-xl border min-w-[180px] transition-all",
        isSelected
          ? "bg-blue-50 border-blue-300 shadow-sm"
          : isConflict
          ? "bg-zinc-50 border-zinc-200 opacity-40 cursor-not-allowed"
          : "bg-white border-[#e8e8e4] hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer"
      )}
    >
      {item.badge && (
        <span className={cn(
          "absolute -top-2 right-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full",
          isSelected ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-500"
        )}>
          {item.badge}
        </span>
      )}

      <div className="flex items-start justify-between">
        <span className={cn(
          "text-xs font-medium leading-tight",
          isSelected ? "text-blue-700" : "text-zinc-700"
        )}>
          {item.name}
        </span>
        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2 mt-0.5" />}
        {isConflict && <AlertTriangle className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-2 mt-0.5" />}
      </div>

      <div className="flex items-end justify-between mt-auto">
        <span className={cn(
          "text-base font-bold tabular-nums",
          isSelected ? "text-blue-600" : "text-zinc-800"
        )}>
          {item.price > 0 ? `${item.price} €` : "Inclus"}
        </span>

        {item.tier && (
          <div className="flex gap-0.5">
            {[1, 2, 3].map(n => (
              <div key={n} className={cn(
                "w-1.5 h-1.5 rounded-full",
                n <= item.tier!
                  ? isSelected ? "bg-blue-500" : "bg-zinc-400"
                  : "bg-zinc-200"
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
          className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Voir sur Idealo
        </a>
      )}
    </div>
  );
}
