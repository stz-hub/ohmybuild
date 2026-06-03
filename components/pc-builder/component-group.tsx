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
      "bg-[#1a1a2e] border-4 transition-all",
      selectedItem 
        ? "border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.2)]" 
        : hasError 
        ? "border-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.2)]" 
        : "border-[#2d2d5a]"
    )}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-4 border-[#2d2d5a] bg-[#0d0d1a]/50">
        <div className="flex items-center gap-3">
          <span className="font-[var(--font-pixel)] text-xs text-[#e8e8ff]">{group.label}</span>
          {socketHint && (
            <span className="px-2 py-1 text-[10px] font-bold tracking-wider bg-[#00ff88]/20 text-[#00ff88] border-2 border-[#00ff88]">
              {socketHint}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {selectedItem ? (
            <>
              <span className="font-[var(--font-pixel)] text-sm text-[#ffdd00]">
                {selectedItem.price > 0 ? `${selectedItem.price} EUR` : "INCLUDED"}
              </span>
              <button
                onClick={() => onClear(group.key)}
                aria-label={`Remove ${group.label}`}
                className="w-8 h-8 bg-[#1a1a2e] border-2 border-[#ff3366] flex items-center justify-center text-[#ff3366] hover:bg-[#ff3366] hover:text-[#0d0d1a] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-xs text-[#6060a0] italic">NOT SELECTED</span>
          )}
        </div>
      </div>

      {/* Items Scroll */}
      <div className="flex gap-4 px-4 py-4 overflow-x-auto">
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
