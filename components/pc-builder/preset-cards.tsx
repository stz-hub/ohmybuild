"use client";

import { cn } from "@/lib/utils";
import { Star, Check } from "lucide-react";
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

  const styles = [
    { bg: "from-[#e8f5e9] to-[#c8e6c9]", border: "#32cd32", shadow: "#228b22", badge: "#32cd32" },
    { bg: "from-[#e3f2fd] to-[#bbdefb]", border: "#1e90ff", shadow: "#0066cc", badge: "#1e90ff" },
    { bg: "from-[#fff3e0] to-[#ffe0b2]", border: "#ff8c00", shadow: "#cc7000", badge: "#ff8c00" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {presets.map((preset, index) => {
        const active = isActive(preset);
        const total  = calculateTotal(preset.selection);
        const style  = styles[index % styles.length];

        return (
          <button
            key={preset.name}
            onClick={() => onApply(preset)}
            className={cn(
              "relative text-left p-5 border-4 rounded-2xl transition-all overflow-hidden",
              active
                ? `bg-gradient-to-b ${style.bg}`
                : "bg-white hover:translate-y-[-2px]"
            )}
            style={{ 
              borderColor: active ? style.border : '#c0c0c0',
              boxShadow: active 
                ? `0 6px 0 ${style.shadow}` 
                : '0 4px 0 #808080'
            }}
          >
            {/* Active checkmark */}
            {active && (
              <div 
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border-3"
                style={{ backgroundColor: style.badge, borderColor: style.shadow }}
              >
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Target badge */}
            <span 
              className="inline-block px-3 py-1 text-[10px] font-bold rounded-full mb-3 text-white"
              style={{ backgroundColor: style.badge }}
            >
              {preset.target}
            </span>

            <h3 className="text-lg font-bold text-[#2d3436] mb-1">
              {preset.name}
            </h3>
            <p className="text-xs text-[#4a5568] mb-4">{preset.description}</p>

            <div className="flex items-center justify-between">
              <span 
                className="text-xl font-bold"
                style={{ color: style.badge }}
              >
                {total.toLocaleString("fr-FR")} EUR
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3].map(n => (
                  <Star 
                    key={n} 
                    className={cn(
                      "w-4 h-4",
                      n <= index + 1 
                        ? "text-[#ffd700] fill-[#ffd700]" 
                        : "text-[#c0c0c0]"
                    )} 
                  />
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
