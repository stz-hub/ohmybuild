"use client";

import { cn } from "@/lib/utils";
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
    <div className="xp-groupbox">
      {/* XP-style group box title */}
      <div className={cn(
        "xp-groupbox-title flex items-center gap-2",
        selectedItem 
          ? "text-[#008000]" 
          : hasError
          ? "text-[#FF0000]"
          : "text-[#003399]"
      )}>
        <span className="font-bold">{group.label}</span>
        {socketHint && (
          <span className="text-[9px] font-normal text-[#0066CC] bg-[#E8EEF7] px-1.5 py-0.5 border border-[#7F9DB9]">
            {socketHint}
          </span>
        )}
        {selectedItem && (
          <span className="text-[10px] text-[#008000]">&#10003;</span>
        )}
        {hasError && !selectedItem && (
          <span className="text-[10px] text-[#FF0000]">&#9888;</span>
        )}
      </div>

      {/* Header info */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          {selectedItem ? (
            <span className="text-[11px] font-bold text-[#FF6600]">
              {selectedItem.price > 0 ? `${selectedItem.price} EUR` : "Included"}
            </span>
          ) : (
            <span className="text-[10px] text-[#808080] italic">Select a component below</span>
          )}
        </div>

        {selectedItem && (
          <button
            onClick={() => onClear(group.key)}
            aria-label={`Remove ${group.label}`}
            className="xp-button text-[10px] px-2 py-0.5 text-[#FF0000]"
          >
            X Clear
          </button>
        )}
      </div>

      {/* Items Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1">
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
