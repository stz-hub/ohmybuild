"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ComponentCard } from "./component-card";
import type { ComponentGroup as Group, ComponentKey, Selection } from "@/lib/pc-data";
import { getSocketHint, getCompatibilityErrors } from "@/lib/pc-data";

interface Props {
  group: Group;
  selection: Selection;
  onSelect: (key: ComponentKey, id: string) => void;
  onClear: (key: ComponentKey) => void;
}

export function ComponentGroup({ group, selection, onSelect, onClear }: Props) {
  const selectedId   = selection[group.key];
  const selectedItem = group.items.find(i => i.id === selectedId);
  const socketHint   = getSocketHint(group.key, selection);
  const hasError     = getCompatibilityErrors(selection).some(e =>
    e.toLowerCase().includes(group.key === "mobo" ? "socket" : group.key)
  );

  return (
    <div className={cn(
      "rounded-xl border bg-white transition-colors",
      selectedItem ? "border-blue-200" : hasError ? "border-red-200" : "border-[#e8e8e4]"
    )}>

      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0ec]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{group.label}</span>
          {socketHint && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-green-50 text-green-700 border border-green-200">
              {socketHint}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {selectedItem ? (
            <>
              <span className="text-sm font-bold text-blue-600 tabular-nums">
                {selectedItem.price > 0 ? `${selectedItem.price} €` : "Inclus"}
              </span>
              <button
                onClick={() => onClear(group.key)}
                aria-label={`Retirer ${group.label}`}
                className="w-6 h-6 rounded-md bg-zinc-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <span className="text-xs text-zinc-400 italic">Non sélectionné</span>
          )}
        </div>
      </div>

      <div className="flex gap-3 px-4 py-3 overflow-x-auto">
        {group.items.map(item => (
          <ComponentCard
            key={item.id}
            item={item}
            groupKey={group.key}
            isSelected={selectedId === item.id}
            selection={selection}
            onSelect={() => onSelect(group.key, item.id)}
          />
        ))}
      </div>

    </div>
  );
}
