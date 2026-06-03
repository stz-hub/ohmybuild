"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertTriangle, CheckCircle2, Gamepad2, Sparkles, Star } from "lucide-react";

import { ComponentGroup } from "./component-group";
import { PresetCards } from "./preset-cards";
import { FpsDisplay } from "./fps-display";
import { SummarySidebar } from "./summary-sidebar";
import { SaveBuildButton } from "./save-build-button";
import type { Selection, ComponentKey, Preset } from "@/lib/pc-data";
import {
  GROUPS,
  PRESETS,
  CPUS,
  GPUS,
  getCompatibilityErrors,
  calculateTotal,
} from "@/lib/pc-data";

export function PCBuilder() {
  const searchParams = useSearchParams();
  const buildIdFromQuery = searchParams.get("build");
  const session = useSession();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selection, setSelection] = useState<Selection>({});
  const [loadedBuild, setLoadedBuild] = useState<{ id: string; name: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!buildIdFromQuery) return;
    let cancelled = false;
    (async () => {
      setLoadError(null);
      try {
        const res = await fetch(`/api/builds/${buildIdFromQuery}`);
        if (!res.ok) {
          if (!cancelled) setLoadError("Failed to load this configuration.");
          return;
        }
        const json = (await res.json()) as {
          data: { id: string; name: string; selection: Selection };
        };
        if (cancelled) return;
        setSelection(json.data.selection ?? {});
        setLoadedBuild({ id: json.data.id, name: json.data.name });
      } catch {
        if (!cancelled) setLoadError("Network error while loading.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [buildIdFromQuery]);

  const errors = getCompatibilityErrors(selection);
  const total = calculateTotal(selection);
  const selectedCpu = CPUS.find((c) => c.id === selection.cpu) ?? null;
  const selectedGpu = GPUS.find((g) => g.id === selection.gpu) ?? null;
  const selectedCount = GROUPS.filter((g) => selection[g.key]).length;

  const handleSelect = useCallback((key: ComponentKey, id: string) => {
    setSelection((prev) => ({ ...prev, [key]: prev[key] === id ? undefined : id }));
  }, []);

  const handleClear = useCallback((key: ComponentKey) => {
    setSelection((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelection({});
    setLoadedBuild(null);
  }, []);

  const handleApplyPreset = useCallback((preset: Preset) => {
    setSelection(preset.selection);
    setLoadedBuild(null);
  }, []);

  const handleCopy = useCallback(() => {
    const lines = GROUPS.map((g) => {
      const item = g.items.find((i) => i.id === selection[g.key]);
      return item ? `${g.label}: ${item.name} — ${item.price} EUR` : null;
    }).filter(Boolean);
    if (!lines.length) return;
    lines.push(`\nTotal: ${total.toLocaleString("fr-FR")} EUR`, `\nBuilt with OhMyBuild.fr`);
    navigator.clipboard?.writeText(lines.join("\n"));
  }, [selection, total]);

  return (
    <div className="min-h-screen">
      {/* Sky gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1e90ff] via-[#87ceeb] to-[#32cd32] -z-10" />
      <div className="fixed inset-0 clouds-bg -z-10" />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-[#ffd700] to-[#ff8c00] border-4 border-[#b8860b] rounded-2xl flex items-center justify-center shadow-[0_4px_0_#8b6914]">
            <Gamepad2 className="w-7 h-7 text-white drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-[2px_2px_0_#0066cc]">
              {loadedBuild ? loadedBuild.name : "PC Builder"}
            </h1>
            <p className="text-sm text-white/80 drop-shadow-md">
              {loadedBuild
                ? "Modify components then save to update"
                : "Select your components - Real-time compatibility check"}
            </p>
          </div>
        </div>
        {loadError && (
          <div className="mt-4 px-4 py-3 bg-white border-4 border-[#e52521] rounded-xl text-sm text-[#e52521] font-medium">
            {loadError}
          </div>
        )}
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6">
            {/* Presets */}
            <section>
              <Label icon={Star} color="#ffd700">Quick Start Builds</Label>
              <PresetCards
                presets={PRESETS}
                currentSelection={selection}
                onApply={handleApplyPreset}
              />
            </section>

            {/* Compatibility Status */}
            {selectedCount > 1 &&
              (errors.length > 0 ? (
                <div className="bg-white border-4 border-[#e52521] p-4 rounded-2xl shadow-[0_4px_0_#a01a17]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#fce4ec] border-3 border-[#e52521] rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-[#e52521]" />
                    </div>
                    <span className="font-bold text-[#e52521]">
                      Incompatibility Detected!
                    </span>
                  </div>
                  {errors.map((err, i) => (
                    <p key={i} className="text-sm text-[#c62828] flex gap-2 pl-12">
                      <span className="text-[#e52521]">&bull;</span>
                      <span>{err}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-white border-4 border-[#32cd32] px-4 py-3 rounded-2xl shadow-[0_4px_0_#228b22]">
                  <div className="w-10 h-10 bg-[#e8f5e9] border-3 border-[#32cd32] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#32cd32]" />
                  </div>
                  <span className="font-bold text-[#32cd32]">
                    All Systems Go - No Issues Detected!
                  </span>
                </div>
              ))}

            {/* Components */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <Label icon={Sparkles} color="#1e90ff">Components</Label>
                {selectedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-sm text-white font-medium hover:text-[#ffd700] transition-colors px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-white/30"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {GROUPS.map((group) => (
                  <ComponentGroup
                    key={group.key}
                    group={group}
                    selection={selection}
                    onSelect={handleSelect}
                    onClear={handleClear}
                  />
                ))}
              </div>
            </section>

            {/* FPS Display */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <Label icon={Gamepad2} color="#e52521">Performance Stats</Label>
                <span className="text-xs text-white font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border-2 border-white/30">
                  Cyberpunk 2077 - Ultra
                </span>
              </div>
              <FpsDisplay gpu={selectedGpu} cpu={selectedCpu} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <SummarySidebar
                selection={selection}
                onClear={handleClearAll}
                onCopy={handleCopy}
              />
              {mounted && (
                <div className="bg-white border-4 border-[#c0c0c0] p-4 rounded-2xl shadow-[0_4px_0_#808080]">
                  <SaveBuildButton
                    selection={selection}
                    selectedCount={selectedCount}
                    hasErrors={errors.length > 0}
                    isAuthed={session.status === "authenticated"}
                    authStatus={session.status}
                    initialName={loadedBuild?.name}
                    initialBuildId={loadedBuild?.id}
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t-4 border-[#c0c0c0] px-4 py-3 flex items-center justify-between z-50">
        <div>
          <p className="text-xs text-[#4a5568] font-medium">Total Cost</p>
          <p className="text-xl font-bold text-[#1e90ff]">
            {total > 0 ? `${total.toLocaleString("fr-FR")} EUR` : "---"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={selectedCount === 0}
          className="px-6 py-3 bg-gradient-to-b from-[#ffd700] to-[#ff8c00] border-4 border-[#b8860b] text-[#2d3436] font-bold rounded-xl shadow-[0_4px_0_#8b6914] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Copy List
        </button>
      </div>

      {/* Footer - Grass strip */}
      <footer className="grass-strip py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-lg font-bold">
            <span className="text-white drop-shadow-[1px_1px_0_#006400]">Oh</span>
            <span className="text-[#ffd700] drop-shadow-[1px_1px_0_#b8860b]">My</span>
            <span className="text-[#87ceeb] drop-shadow-[1px_1px_0_#0066cc]">Build</span>
          </span>
          <p className="text-xs text-white/80">
            FPS: TechPowerUp - Hardware Unboxed - Digital Foundry | Indicative prices
          </p>
        </div>
      </footer>
    </div>
  );
}

function Label({ children, icon: Icon, color }: { children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <h2 className="text-lg font-bold text-white drop-shadow-[1px_1px_0_#0066cc] mb-4 flex items-center gap-2">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center border-2"
        style={{ backgroundColor: `${color}30`, borderColor: color }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      {children}
    </h2>
  );
}
