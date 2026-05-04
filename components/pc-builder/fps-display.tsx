"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { GPU, CPU } from "@/lib/pc-data";
import { getFpsLevel } from "@/lib/pc-data";

const LEVEL_STYLES = {
  excellent: { number: "text-green-600",  bar: "bg-green-500",  tag: "bg-green-50 text-green-700 border-green-200",   label: "Excellent" },
  good:      { number: "text-blue-600",   bar: "bg-blue-500",   tag: "bg-blue-50 text-blue-700 border-blue-200",      label: "Fluide"    },
  poor:      { number: "text-orange-500", bar: "bg-orange-400", tag: "bg-orange-50 text-orange-700 border-orange-200", label: "Limité"   },
};

function FpsCard({ resolution, fps, src }: { resolution: string; fps: number; src: string }) {
  const styles = LEVEL_STYLES[getFpsLevel(fps)];
  const pct    = Math.min(100, Math.round((fps / 180) * 100));

  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    setDisplayed(0);
    let current = 0;
    const step = Math.ceil(fps / 25);
    const id = setInterval(() => {
      current = Math.min(current + step, fps);
      setDisplayed(current);
      if (current >= fps) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [fps]);

  return (
    <div className="relative bg-white rounded-xl border border-[#e8e8e4] p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">{resolution}</span>
        <span className={cn("px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider", styles.tag)}>
          {styles.label}
        </span>
      </div>
      <div className={cn("text-5xl font-bold tabular-nums leading-none mb-1", styles.number)}>{displayed}</div>
      <div className="text-xs text-zinc-400 mb-0.5">FPS · Ultra · Natif</div>
      <div className="text-[10px] text-zinc-300 italic">Source : {src}</div>
      <div className="absolute bottom-0 inset-x-0 h-1 bg-zinc-100">
        <div className={cn("h-full transition-all duration-700 ease-out", styles.bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface Props {
  gpu: GPU | null;
  cpu: CPU | null;
}

export function FpsDisplay({ gpu, cpu }: Props) {
  if (!gpu) {
    return (
      <div className="rounded-xl border border-dashed border-[#e8e8e4] bg-white p-10 text-center">
        <p className="text-sm font-semibold text-zinc-400 mb-1">Sélectionnez une carte graphique</p>
        <p className="text-xs text-zinc-300">Les performances estimées apparaîtront ici</p>
      </div>
    );
  }

  const mult = cpu?.fps_mult ?? 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <FpsCard resolution="1080p" fps={Math.round(gpu.fps["1080p"] * mult)} src={gpu.src} />
      <FpsCard resolution="1440p" fps={Math.round(gpu.fps["1440p"] * mult)} src={gpu.src} />
      <FpsCard resolution="4K"    fps={Math.round(gpu.fps["4K"]    * mult)} src={gpu.src} />
    </div>
  );
}
