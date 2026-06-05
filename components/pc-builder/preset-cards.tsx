"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
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

  const icons = [
    "/xp-icons/Laptop.ico",
    "/xp-icons/My Computer.ico",
    "/xp-icons/Network Computers.ico",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {presets.map((preset, index) => {
        const active = isActive(preset);
        const total = calculateTotal(preset.selection);

        return (
          <button
            key={preset.name}
            onClick={() => onApply(preset)}
            className={cn(
              "text-left p-3 border transition-all",
              active
                ? "bg-[#C1D2EE] border-[#316AC5]"
                : "bg-white border-[#7F9DB9] hover:bg-[#E8EEF7] hover:border-[#316AC5]"
            )}
          >
            <div className="flex items-start gap-3 mb-2">
              <Image src={icons[index]} alt="" width={32} height={32} />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold text-white bg-[#316AC5] px-2 py-0.5 inline-block mb-1">
                  {preset.target}
                </div>
                <h3 className="text-[12px] font-bold text-[#003399] truncate">
                  {preset.name}
                </h3>
              </div>
              {active && (
                <span className="text-[14px] text-[#008000] font-bold">&#10003;</span>
              )}
            </div>

            <p className="text-[10px] text-[#808080] mb-2 line-clamp-2">{preset.description}</p>

            <div className="flex items-center justify-between border-t border-[#C0C0C0] pt-2">
              <span className="text-[13px] font-bold text-[#003399]">
                {total.toLocaleString("fr-FR")} EUR
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3].map(n => (
                  <span 
                    key={n} 
                    className={cn(
                      "text-[10px]",
                      n <= index + 1 
                        ? "text-[#FFD700]" 
                        : "text-[#C0C0C0]"
                    )}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
