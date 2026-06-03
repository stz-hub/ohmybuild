"use client";

import { cn } from "@/lib/utils";
import { X, Zap } from "lucide-react";
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
      "bg-white border-4 rounded-2xl transition-all overflow-hidden",
      selectedItem 
        ? "border-[#32cd32] shadow-[0_4px_0_#228b22]" 
        : hasError 
        ? "border-[#e52521] shadow-[0_4px_0_#a01a17]" 
        : "border-[#c0c0c0] shadow-[0_4px_0_#808080]"
    )}>

      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3 border-b-4",
        selectedItem 
          ? "bg-gradient-to-r from-[#e8f5e9] to-[#c8e6c9] border-[#32cd32]" 
          : hasError
          ? "bg-gradient-to-r from-[#fce4ec] to-[#f8bbd9] border-[#e52521]"
          : "bg-gradient-to-r from-[#f8f8f0] to-[#e8e8e0] border-[#c0c0c0]"
      )}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#2d3436]">{group.label}</span>
          {socketHint && (
            <span className="px-2 py-1 text-[10px] font-bold bg-[#e3f2fd] text-[#1e90ff] border-2 border-[#1e90ff] rounded-full">
              {socketHint}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {selectedItem ? (
            <>
              <span className="font-bold text-[#ff8c00] flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {selectedItem.price > 0 ? `${selectedItem.price} EUR` : "Included"}
              </span>
              <button
                onClick={() => onClear(group.key)}
                aria-label={`Remove ${group.label}`}
                className="w-8 h-8 bg-gradient-to-b from-[#ff6b6b] to-[#e52521] border-3 border-[#a01a17] rounded-lg flex items-center justify-center text-white shadow-[0_2px_0_#7a1410] hover:translate-y-[-1px] hover:shadow-[0_3px_0_#7a1410] active:translate-y-[1px] active:shadow-[0_1px_0_#7a1410] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-sm text-[#808080] italic">Not selected</span>
          )}
        </div>
      </div>

      {/* Items Scroll */}
      <div className="flex gap-4 px-4 py-4 overflow-x-auto bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0]">
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
