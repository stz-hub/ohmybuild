"use client";

import { useState, useCallback } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { ComponentGroup } from "./component-group";
import { PresetCards } from "./preset-cards";
import { FpsDisplay } from "./fps-display";
import { SummarySidebar } from "./summary-sidebar";
import type { Selection, ComponentKey, Preset } from "@/lib/pc-data";
import { GROUPS, PRESETS, CPUS, GPUS, getCompatibilityErrors, calculateTotal } from "@/lib/pc-data";

export function PCBuilder() {
  const [selection, setSelection] = useState<Selection>({});

  const errors        = getCompatibilityErrors(selection);
  const total         = calculateTotal(selection);
  const selectedCpu   = CPUS.find(c => c.id === selection.cpu) ?? null;
  const selectedGpu   = GPUS.find(g => g.id === selection.gpu) ?? null;
  const selectedCount = GROUPS.filter(g => selection[g.key]).length;

  const handleSelect = useCallback((key: ComponentKey, id: string) => {
    setSelection(prev => ({ ...prev, [key]: prev[key] === id ? undefined : id }));
  }, []);

  const handleClear = useCallback((key: ComponentKey) => {
    setSelection(prev => { const next = { ...prev }; delete next[key]; return next; });
  }, []);

  const handleClearAll = useCallback(() => setSelection({}), []);

  const handleApplyPreset = useCallback((preset: Preset) => {
    setSelection(preset.selection);
  }, []);

  const handleCopy = useCallback(() => {
    const lines = GROUPS
      .map(g => {
        const item = g.items.find(i => i.id === selection[g.key]);
        return item ? `${g.label}: ${item.name} — ${item.price} €` : null;
      })
      .filter(Boolean);
    if (!lines.length) return;
    lines.push(`\nTotal: ${total.toLocaleString("fr-FR")} €`, `\nVia OhMyBuild.fr`);
    navigator.clipboard?.writeText(lines.join("\n"));
  }, [selection, total]);

  return (
    <div className="min-h-screen bg-[#f9f9f7]">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Configurateur PC</h1>
        <p className="text-zinc-500 text-sm">
          Sélectionnez vos composants · Compatibilité vérifiée en temps réel
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          <div className="space-y-6">

            <section>
              <Label>Configurations prédéfinies</Label>
              <PresetCards
                presets={PRESETS}
                currentSelection={selection}
                onApply={handleApplyPreset}
              />
            </section>

            {selectedCount > 1 && (
              errors.length > 0 ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="text-sm font-semibold text-red-700">Incompatibilité détectée</span>
                  </div>
                  {errors.map((err, i) => (
                    <p key={i} className="text-sm text-red-600 flex gap-2 pl-6">
                      <span>—</span><span>{err}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="text-sm font-medium text-green-700">
                    Compatibilité : aucun problème détecté.
                  </span>
                </div>
              )
            )}

            <section>
              <div className="flex items-center justify-between mb-4">
                <Label>Composants</Label>
                {selectedCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    Tout effacer
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {GROUPS.map(group => (
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

            <section>
              <div className="flex items-center justify-between mb-4">
                <Label>Performances estimées</Label>
                <span className="text-xs text-zinc-400">Cyberpunk 2077 · Ultra · Natif</span>
              </div>
              <FpsDisplay gpu={selectedGpu} cpu={selectedCpu} />
            </section>

          </div>

          <aside className="hidden lg:block">
            <SummarySidebar
              selection={selection}
              onClear={handleClearAll}
              onCopy={handleCopy}
            />
          </aside>

        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-[#e8e8e4] px-4 py-3 flex items-center justify-between z-50">
        <div>
          <p className="text-xs text-zinc-400">Total estimé</p>
          <p className="text-xl font-bold text-blue-600 tabular-nums">
            {total > 0 ? `${total.toLocaleString("fr-FR")} €` : "—"}
          </p>
        </div>
        <button
          onClick={handleCopy}
          disabled={selectedCount === 0}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-40 transition-opacity"
        >
          Copier
        </button>
      </div>

      <footer className="border-t border-[#e8e8e4] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-bold">Oh<span className="text-blue-600">My</span>Build</span>
          <p className="text-xs text-zinc-400">
            FPS : TechPowerUp · Hardware Unboxed · Digital Foundry · Prix indicatifs
          </p>
        </div>
      </footer>

    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
      {children}
    </h2>
  );
}
