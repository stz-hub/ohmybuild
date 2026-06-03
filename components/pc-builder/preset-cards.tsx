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

  const colors = ["#00ff88", "#00d4ff", "#ff00aa"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {presets.map((preset, index) => {
        const active = isActive(preset);
        const total  = calculateTotal(preset.selection);
        const color  = colors[index % colors.length];

        return (
          <button
            key={preset.name}
            onClick={() => onApply(preset)}
            className={cn(
              "relative text-left p-5 border-4 transition-all overflow-hidden",
              active
                ? "bg-[#0d0d1a]"
                : "bg-[#1a1a2e] border-[#2d2d5a] hover:border-current"
            )}
            style={{ 
              borderColor: active ? color : undefined,
              boxShadow: active ? `0 0 25px ${color}40` : undefined 
            }}
          >
            {/* Active indicator bar */}
            <div 
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1 transition-transform origin-left",
                active ? "scale-x-100" : "scale-x-0"
              )}
              style={{ backgroundColor: color }}
            />

            {/* Target badge */}
            <span 
              className={cn(
                "inline-block px-3 py-1 text-[10px] font-bold tracking-wider border-2 mb-4",
                active ? "text-[#0d0d1a]" : "text-current border-current"
              )}
              style={{ 
                backgroundColor: active ? color : 'transparent',
                borderColor: color,
                color: active ? '#0d0d1a' : color
              }}
            >
              {preset.target}
            </span>

            <h3 
              className={cn(
                "font-[var(--font-pixel)] text-xs mb-2",
                active ? "drop-shadow-[0_0_10px_currentColor]" : ""
              )}
              style={{ color: active ? color : '#e8e8ff' }}
            >
              {preset.name}
            </h3>
            <p className="text-xs text-[#9090c0] mb-4">{preset.description}</p>

            <div 
              className="font-[var(--font-pixel)] text-lg"
              style={{ color }}
            >
              {total.toLocaleString("fr-FR")} EUR
            </div>
          </button>
        );
      })}
    </div>
  );
}
