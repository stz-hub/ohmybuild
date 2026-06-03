"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { GPU, CPU } from "@/lib/pc-data";
import { getFpsLevel } from "@/lib/pc-data";

const LEVEL_STYLES = {
  excellent: { 
    color: "#00ff88", 
    label: "EXCELLENT",
    glow: "0 0 20px rgba(0,255,136,0.5)"
  },
  good: { 
    color: "#00d4ff", 
    label: "SMOOTH",
    glow: "0 0 20px rgba(0,212,255,0.5)"
  },
  poor: { 
    color: "#ffdd00", 
    label: "LIMITED",
    glow: "0 0 20px rgba(255,221,0,0.5)"
  },
};

function FpsCard({ resolution, fps, src }: { resolution: string; fps: number; src: string }) {
  const level = getFpsLevel(fps);
  const styles = LEVEL_STYLES[level];
  const pct = Math.min(100, Math.round((fps / 180) * 100));

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
    <div 
      className="relative bg-[#1a1a2e] border-4 border-[#2d2d5a] p-5 overflow-hidden"
      style={{ boxShadow: styles.glow }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-[var(--font-pixel)] text-xs text-[#9090c0]">{resolution}</span>
        <span 
          className="px-3 py-1 text-[10px] font-bold tracking-wider border-2"
          style={{ 
            color: styles.color, 
            borderColor: styles.color,
            backgroundColor: `${styles.color}20`
          }}
        >
          {styles.label}
        </span>
      </div>

      {/* Big FPS number */}
      <div 
        className="font-[var(--font-pixel)] text-4xl md:text-5xl leading-none mb-2"
        style={{ 
          color: styles.color,
          textShadow: `0 0 10px ${styles.color}, 0 0 20px ${styles.color}` 
        }}
      >
        {displayed}
      </div>
      <div className="text-xs text-[#6060a0] mb-1">FPS - ULTRA - NATIVE</div>
      <div className="text-[10px] text-[#4a4a8a]">Source: {src}</div>

      {/* Progress bar */}
      <div className="absolute bottom-0 inset-x-0 h-2 bg-[#0d0d1a]">
        <div 
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: styles.color }}
        />
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
      <div className="bg-[#1a1a2e] border-4 border-dashed border-[#2d2d5a] p-10 text-center">
        <div className="font-[var(--font-pixel)] text-sm text-[#6060a0] mb-2">
          SELECT A GPU
        </div>
        <p className="text-xs text-[#4a4a8a]">
          Performance estimates will appear here
        </p>
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-3 h-3 bg-[#2d2d5a] animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  const mult = cpu?.fps_mult ?? 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FpsCard resolution="1080p" fps={Math.round(gpu.fps["1080p"] * mult)} src={gpu.src} />
      <FpsCard resolution="1440p" fps={Math.round(gpu.fps["1440p"] * mult)} src={gpu.src} />
      <FpsCard resolution="4K"    fps={Math.round(gpu.fps["4K"]    * mult)} src={gpu.src} />
    </div>
  );
}
