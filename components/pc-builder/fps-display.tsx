"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Gamepad2, Star, Zap } from "lucide-react";
import type { GPU, CPU } from "@/lib/pc-data";
import { getFpsLevel } from "@/lib/pc-data";

const LEVEL_STYLES = {
  excellent: { 
    color: "#32cd32", 
    label: "Excellent!",
    bg: "from-[#e8f5e9] to-[#c8e6c9]",
    border: "#32cd32",
    shadow: "#228b22",
    stars: 3
  },
  good: { 
    color: "#1e90ff", 
    label: "Smooth",
    bg: "from-[#e3f2fd] to-[#bbdefb]",
    border: "#1e90ff",
    shadow: "#0066cc",
    stars: 2
  },
  poor: { 
    color: "#ff8c00", 
    label: "Limited",
    bg: "from-[#fff3e0] to-[#ffe0b2]",
    border: "#ff8c00",
    shadow: "#cc7000",
    stars: 1
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
      className={cn(
        "relative bg-gradient-to-b border-4 p-5 rounded-2xl overflow-hidden",
        styles.bg
      )}
      style={{ 
        borderColor: styles.border,
        boxShadow: `0 4px 0 ${styles.shadow}`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-[#2d3436]">{resolution}</span>
        <div className="flex gap-0.5">
          {[1, 2, 3].map(n => (
            <Star 
              key={n} 
              className={cn(
                "w-4 h-4",
                n <= styles.stars 
                  ? "text-[#ffd700] fill-[#ffd700]" 
                  : "text-[#c0c0c0]"
              )} 
            />
          ))}
        </div>
      </div>

      {/* Big FPS number */}
      <div 
        className="text-5xl md:text-6xl font-bold leading-none mb-1"
        style={{ color: styles.color }}
      >
        {displayed}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-4 h-4" style={{ color: styles.color }} />
        <span className="text-sm font-semibold" style={{ color: styles.color }}>
          {styles.label}
        </span>
      </div>
      <div className="text-[10px] text-[#808080]">Source: {src}</div>

      {/* Progress bar */}
      <div className="absolute bottom-0 inset-x-0 h-2 bg-white/50">
        <div 
          className="h-full transition-all duration-700 ease-out rounded-r-full"
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
      <div className="bg-white border-4 border-dashed border-[#c0c0c0] p-10 rounded-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#f0f0f0] border-4 border-[#c0c0c0] rounded-full flex items-center justify-center">
          <Gamepad2 className="w-8 h-8 text-[#a0a0a0]" />
        </div>
        <div className="text-lg font-bold text-[#808080] mb-2">
          Select a GPU
        </div>
        <p className="text-sm text-[#a0a0a0]">
          Performance estimates will appear here
        </p>
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="w-4 h-4 bg-[#e0e0e0] rounded-full animate-pulse" 
              style={{ animationDelay: `${i * 200}ms` }} 
            />
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
