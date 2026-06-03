"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertTriangle, CheckCircle2, Gamepad2 } from "lucide-react";

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
    <div className="min-h-screen bg-[#0d0d1a] pixel-grid-bg">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-[#1a1a2e] border-4 border-[#00d4ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)]">
            <Gamepad2 className="w-6 h-6 text-[#00d4ff]" />
          </div>
          <div>
            <h1 className="font-[var(--font-pixel)] text-xl text-[#e8e8ff]">
              {loadedBuild ? loadedBuild.name : "PC BUILDER"}
            </h1>
            <p className="text-sm text-[#9090c0]">
              {loadedBuild
                ? "Modify components then save to update"
                : "Select your components - Real-time compatibility check"}
            </p>
          </div>
        </div>
        {loadError && (
          <div className="mt-4 px-4 py-3 bg-[#1a1a2e] border-4 border-[#ff3366] text-sm text-[#ff3366]">
            {loadError}
          </div>
        )}
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            {/* Presets */}
            <section>
              <Label>SELECT CLASS</Label>
              <PresetCards
                presets={PRESETS}
                currentSelection={selection}
                onApply={handleApplyPreset}
              />
            </section>

            {/* Compatibility Status */}
            {selectedCount > 1 &&
              (errors.length > 0 ? (
                <div className="bg-[#1a1a2e] border-4 border-[#ff3366] p-4 shadow-[0_0_20px_rgba(255,51,102,0.3)]">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-[#ff3366]" />
                    <span className="font-[var(--font-pixel)] text-xs text-[#ff3366]">
                      INCOMPATIBILITY DETECTED
                    </span>
                  </div>
                  {errors.map((err, i) => (
                    <p key={i} className="text-sm text-[#ff6688] flex gap-2 pl-8">
                      <span className="text-[#ff3366]">&gt;</span>
                      <span>{err}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-[#1a1a2e] border-4 border-[#00ff88] px-4 py-3 shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                  <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
                  <span className="font-[var(--font-pixel)] text-xs text-[#00ff88]">
                    ALL SYSTEMS GO - NO ISSUES DETECTED
                  </span>
                </div>
              ))}

            {/* Components */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <Label>COMPONENTS</Label>
                {selectedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs text-[#6060a0] hover:text-[#ff3366] transition-colors px-3 py-1 border-2 border-[#2d2d5a] hover:border-[#ff3366]"
                  >
                    CLEAR ALL
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
                <Label>PERFORMANCE STATS</Label>
                <span className="text-xs text-[#6060a0] bg-[#1a1a2e] px-3 py-1 border-2 border-[#2d2d5a]">
                  CYBERPUNK 2077 - ULTRA - NATIVE
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
                <div className="bg-[#1a1a2e] border-4 border-[#2d2d5a] p-4">
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
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#1a1a2e]/95 backdrop-blur border-t-4 border-[#2d2d5a] px-4 py-3 flex items-center justify-between z-50">
        <div>
          <p className="text-xs text-[#6060a0]">TOTAL COST</p>
          <p className="font-[var(--font-pixel)] text-lg text-[#00d4ff]">
            {total > 0 ? `${total.toLocaleString("fr-FR")} EUR` : "---"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={selectedCount === 0}
          className="px-6 py-3 bg-[#00d4ff] border-4 border-[#00d4ff] text-[#0d0d1a] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00ffcc] transition-colors"
        >
          COPY
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-[#2d2d5a] py-6 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-[var(--font-pixel)] text-xs">
            <span className="text-[#e8e8ff]">Oh</span>
            <span className="text-[#00d4ff]">My</span>
            <span className="text-[#ff00aa]">Build</span>
          </span>
          <p className="text-xs text-[#6060a0]">
            FPS: TechPowerUp - Hardware Unboxed - Digital Foundry | Indicative prices
          </p>
        </div>
      </footer>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[var(--font-pixel)] text-xs text-[#9090c0] mb-4 flex items-center gap-2">
      <span className="w-2 h-2 bg-[#00d4ff]" />
      {children}
    </h2>
  );
}
