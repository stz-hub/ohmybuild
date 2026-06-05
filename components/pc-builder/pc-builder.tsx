"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

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
    <div className="min-h-screen p-4 md:p-6">
      <main className="max-w-7xl mx-auto">
        {/* Header Window */}
        <div className="xp-window mb-4">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/System Properties.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>{loadedBuild ? loadedBuild.name : "PC Configuration Wizard"}</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content p-4">
            <div className="flex items-center gap-4">
              <Image src="/xp-icons/My Computer.ico" alt="" width={48} height={48} />
              <div>
                <h1 className="text-[16px] font-bold text-[#003399]">
                  {loadedBuild ? loadedBuild.name : "New PC Configuration"}
                </h1>
                <p className="text-[11px] text-[#808080]">
                  {loadedBuild
                    ? "Modify components then click Save to update your configuration."
                    : "Select your components below. The wizard will verify compatibility in real-time."}
                </p>
              </div>
            </div>
            {loadError && (
              <div className="xp-error-box mt-4">
                <span className="text-[14px]">&#9888;</span>
                <span className="text-[11px]">{loadError}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="space-y-4">
            {/* Presets Window */}
            <div className="xp-window">
              <div className="xp-titlebar">
                <div className="xp-titlebar-text">
                  <Image src="/xp-icons/Folder Open.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
                  <span>Quick Start - Preset Configurations</span>
                </div>
                <div className="xp-window-controls">
                  <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
                  <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
                  <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
                </div>
              </div>
              <div className="xp-window-content p-3">
                <PresetCards
                  presets={PRESETS}
                  currentSelection={selection}
                  onApply={handleApplyPreset}
                />
              </div>
            </div>

            {/* Compatibility Status */}
            {selectedCount > 1 && (
              <div className="xp-window">
                <div className="xp-titlebar">
                  <div className="xp-titlebar-text">
                    <Image 
                      src={errors.length > 0 ? "/xp-icons/Activate Windows.ico" : "/xp-icons/Activate Windows.ico"} 
                      alt="" 
                      width={16} 
                      height={16} 
                      className="xp-titlebar-icon" 
                    />
                    <span>Compatibility Check</span>
                  </div>
                  <div className="xp-window-controls">
                    <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
                    <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
                    <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
                  </div>
                </div>
                <div className="xp-window-content p-3">
                  {errors.length > 0 ? (
                    <div className="xp-error-box">
                      <span className="text-[18px]">&#9888;</span>
                      <div>
                        <strong className="text-[11px]">Incompatibility Detected!</strong>
                        {errors.map((err, i) => (
                          <p key={i} className="text-[11px] mt-1">&#8226; {err}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="xp-success-box">
                      <span className="text-[18px] text-[#008000]">&#10003;</span>
                      <div>
                        <strong className="text-[11px] text-[#008000]">All Systems Go!</strong>
                        <p className="text-[11px] mt-1">All selected components are compatible.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Components Window */}
            <div className="xp-window">
              <div className="xp-titlebar">
                <div className="xp-titlebar-text">
                  <Image src="/xp-icons/System Properties.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
                  <span>Select Components ({selectedCount}/{GROUPS.length})</span>
                </div>
                <div className="xp-window-controls">
                  <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
                  <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
                  <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
                </div>
              </div>
              <div className="xp-window-content p-3">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#919B9C]">
                  <p className="text-[11px] text-[#808080]">
                    Click on a component to select it. Click again to deselect.
                  </p>
                  {selectedCount > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="xp-button text-[11px] px-2 py-0.5"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-3">
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
              </div>
            </div>

            {/* FPS Display Window */}
            <div className="xp-window">
              <div className="xp-titlebar">
                <div className="xp-titlebar-text">
                  <Image src="/xp-icons/Game Controller.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
                  <span>Performance Estimates - Cyberpunk 2077 Ultra</span>
                </div>
                <div className="xp-window-controls">
                  <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
                  <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
                  <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
                </div>
              </div>
              <div className="xp-window-content p-3">
                <FpsDisplay gpu={selectedGpu} cpu={selectedCpu} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-12 space-y-4">
              <SummarySidebar
                selection={selection}
                onClear={handleClearAll}
                onCopy={handleCopy}
              />
              {mounted && (
                <div className="xp-window">
                  <div className="xp-titlebar">
                    <div className="xp-titlebar-text">
                      <Image src="/xp-icons/Folder Closed.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
                      <span>Save Configuration</span>
                    </div>
                    <div className="xp-window-controls">
                      <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
                      <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
                      <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
                    </div>
                  </div>
                  <div className="xp-window-content p-3">
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
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 xp-taskbar px-4 py-2 flex items-center justify-between z-50">
        <div className="text-white">
          <p className="text-[10px]">Total Cost</p>
          <p className="text-[14px] font-bold">
            {total > 0 ? `${total.toLocaleString("fr-FR")} EUR` : "---"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={selectedCount === 0}
          className="xp-button text-[11px] px-4 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Copy Build List
        </button>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-6">
        <div className="xp-window">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/Earth (fixed).ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>About</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content p-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <Image src="/xp-logo.png" alt="" width={20} height={20} />
                <span className="font-bold text-[#003399]">OhMyBuild</span>
                <span className="text-[#808080]">XP Edition</span>
              </div>
              <p className="text-[#808080]">
                FPS: TechPowerUp - Hardware Unboxed - Digital Foundry | Indicative prices
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
