"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { GPU, CPU } from "@/lib/pc-data";
import { getFpsLevel } from "@/lib/pc-data";

const LEVEL_STYLES = {
  excellent: { 
    color: "#008000", 
    label: "Excellent",
    stars: 3
  },
  good: { 
    color: "#0066CC", 
    label: "Good",
    stars: 2
  },
  poor: { 
    color: "#FF6600", 
    label: "Limited",
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
    <div className="xp-panel p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-[#003399]">{resolution}</span>
        <div className="flex gap-0.5">
          {[1, 2, 3].map(n => (
            <span 
              key={n} 
              className={cn(
                "text-[10px]",
                n <= styles.stars 
                  ? "text-[#FFD700]" 
                  : "text-[#C0C0C0]"
              )}
            >
              &#9733;
            </span>
          ))}
        </div>
      </div>

      <div 
        className="text-[32px] font-bold leading-none mb-1"
        style={{ color: styles.color }}
      >
        {displayed}
        <span className="text-[12px] ml-1">FPS</span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <span 
          className="text-[10px] font-bold px-2 py-0.5 border"
          style={{ 
            color: styles.color, 
            borderColor: styles.color,
            backgroundColor: `${styles.color}15`
          }}
        >
          {styles.label}
        </span>
      </div>

      {/* XP-style progress bar */}
      <div className="xp-progress">
        <div 
          className="h-full transition-all duration-700 ease-out"
          style={{ 
            width: `${pct}%`, 
            background: level === 'excellent' 
              ? 'linear-gradient(180deg, #38D738 0%, #19B319 50%, #0DA10D 100%)'
              : level === 'good'
              ? 'linear-gradient(180deg, #5790F5 0%, #2D6CE6 50%, #2768E3 100%)'
              : 'linear-gradient(180deg, #FFB838 0%, #FF9919 50%, #FF8800 100%)'
          }}
        />
      </div>
      
      <div className="text-[9px] text-[#808080] mt-1">Source: {src}</div>
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
      <div className="xp-panel p-6 text-center">
        <Image 
          src="/xp-icons/Game Controller.ico" 
          alt="" 
          width={48} 
          height={48}
          className="mx-auto mb-3 opacity-50"
        />
        <div className="text-[12px] font-bold text-[#808080] mb-1">
          Select a GPU
        </div>
        <p className="text-[11px] text-[#A0A0A0]">
          Performance estimates will appear here once you select a graphics card.
        </p>
      </div>
    );
  }

  const mult = cpu?.fps_mult ?? 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <FpsCard resolution="1080p Full HD" fps={Math.round(gpu.fps["1080p"] * mult)} src={gpu.src} />
      <FpsCard resolution="1440p QHD" fps={Math.round(gpu.fps["1440p"] * mult)} src={gpu.src} />
      <FpsCard resolution="4K Ultra HD" fps={Math.round(gpu.fps["4K"] * mult)} src={gpu.src} />
    </div>
  );
}
