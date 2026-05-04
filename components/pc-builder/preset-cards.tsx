"use client";

import { cn } from "@/lib/utils";
import type { Preset, Selection } from "@/lib/pc-data";
import { GROUPS, calculateTotal } from "@/lib/pc-data";

interface Props {
  presets: Preset[];
  currentSelection: Selection;
  onApply: (preset: Preset) => void;
}

export function PresetCards({ presets, currentSelection, onApply }: Props) {
  function isActive(preset: Preset) {
    return GROUPS.every(g => (currentSelection[g.key] ?? null) === (preset.selection[g.key] ?? null));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {presets.map(preset => {
        const active = isActive(preset);
        const total  = calculateTotal(preset.selection);

        return (
          <button
            key={preset.name}
            onClick={() => onApply(preset)}
            className={cn(
              "relative text-left p-5 rounded-xl border transition-all overflow-hidden",
              active
                ? "bg-blue-50 border-blue-300 shadow-sm"
                : "bg-white border-[#e8e8e4] hover:border-blue-200 hover:bg-blue-50/20"
            )}
          >
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transition-transform origin-left",
              active ? "scale-x-100" : "scale-x-0"
            )} />

            <span className={cn(
              "inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded mb-3",
              active ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-500"
            )}>
              {preset.target}
            </span>

            <h3 className={cn("text-sm font-bold mb-0.5", active ? "text-blue-700" : "text-zinc-800")}>
              {preset.name}
            </h3>
            <p className="text-xs text-zinc-400 mb-3">{preset.description}</p>

            <div className={cn("text-xl font-bold tabular-nums", active ? "text-blue-600" : "text-zinc-800")}>
              {total.toLocaleString("fr-FR")} €
            </div>
          </button>
        );
      })}
    </div>
  );
}
