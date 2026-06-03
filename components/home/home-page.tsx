import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Cpu, Sparkles, Gamepad2 } from "lucide-react";

import { PRESETS, GROUPS, calculateTotal } from "@/lib/pc-data";

const features = [
  {
    icon: ShieldCheck,
    accent: "var(--color-mint)",
    label: "ZERO-MISTAKE",
    title: "Compat-Check temps réel",
    description:
      "Socket CPU, génération RAM, watts PSU — chaque pièce est validée pendant que tu joues avec le configurateur. Pas de panique au montage.",
  },
  {
    icon: TrendingUp,
    accent: "var(--color-cyan)",
    label: "TRUE FPS",
    title: "Performances benchmarkées",
    description:
      "Les FPS viennent de TechPowerUp, Hardware Unboxed et Digital Foundry. Cyberpunk Ultra, natif, sans bluff marketing.",
  },
  {
    icon: Zap,
    accent: "var(--color-magenta)",
    label: "BEST PRICE",
    title: "Idealo en un clic",
    description:
      "Chaque composant te renvoie sur sa page Idealo. Tu compares les prix réels et tu commandes où c'est le moins cher.",
  },
];

const stats = [
  { value: "8", label: "categories", color: "var(--color-mint)" },
  { value: "100%", label: "compat", color: "var(--color-cyan)" },
  { value: "0 €", label: "no cost", color: "var(--color-amber)" },
  { value: "1-Click", label: "presets", color: "var(--color-magenta)" },
];

export function HomePage() {
  return (
    <main className="content-layer">
      {/* Hero ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="retro-banner">★ READY PLAYER 1</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-cream)]/50">
                <span className="blink">●</span> insert coin
              </span>
            </div>

            <h1 className="font-[var(--font-display)] text-5xl sm:text-7xl font-extrabold leading-[0.92] tracking-tight mb-6">
              <span className="block text-[var(--color-cream)]">Compose ton</span>
              <span className="block text-[var(--color-cyan)] glow-cyan">PC gaming</span>
              <span className="block text-[var(--color-amber)] glow-amber">pièce par pièce.</span>
            </h1>

            <p className="text-lg text-[var(--color-cream)]/80 leading-relaxed mb-8 max-w-xl">
              Compat-check temps réel, FPS benchmarkés, prix Idealo.{" "}
              <span className="font-semibold text-[var(--color-cream)] bg-[var(--color-magenta)]/30 px-1.5 rounded-sm">
                Sans inscription
              </span>
              . Sans bullshit marketing.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/configurateur" className="retro-btn retro-btn-magenta text-base px-6 py-3">
                <Gamepad2 className="w-4 h-4" />
                Start Game
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/register" className="retro-btn retro-btn-paper text-base px-6 py-3">
                Create profile
              </Link>
            </div>
          </div>

          {/* Artwork SVG : niveau bord d'écran arcade */}
          <div className="hidden lg:block">
            <HeroArtwork />
          </div>
        </div>
      </section>

      {/* Stats bar — façon LCD ──────────────────────────────────── */}
      <section className="border-y-[3px] border-[var(--color-ink)] bg-[var(--color-deep)] relative overflow-hidden">
        <div className="absolute inset-0 marquee-strip opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ value, label, color }) => (
            <div key={label} className="text-center">
              <div
                className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold tabular-nums"
                style={{ color }}
              >
                {value}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-cream)]/55 mt-1">
                — {label} —
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <span className="retro-banner mb-4 inline-block">— STAGE 01 —</span>
          <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 mb-3 text-[var(--color-cream)]">
            Pourquoi <span className="text-[var(--color-cyan)] glow-cyan">OhMyBuild</span> ?
          </h2>
          <p className="text-[var(--color-cream)]/70">
            Les autres configurateurs te noient dans mille options. Ici : simple, rapide, honnête. Et tu gardes ton historique si tu te connectes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, accent, label }) => (
            <div key={title} className="retro-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-md flex items-center justify-center border-2 border-[var(--color-ink)] shadow-[3px_3px_0_var(--color-ink)]"
                  style={{ background: accent }}
                >
                  <Icon className="w-5 h-5 text-[var(--color-ink)]" strokeWidth={2.5} />
                </div>
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-ink)]/55"
                  style={{ color: "var(--color-ink)" }}
                >
                  {label}
                </span>
              </div>
              <h3 className="font-[var(--font-display)] font-extrabold text-lg mb-2 text-[var(--color-ink)]">
                {title}
              </h3>
              <p className="text-sm text-[var(--color-ink)]/75 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Presets ───────────────────────────────────────────────── */}
      <section className="relative border-y-[3px] border-[var(--color-ink)] bg-[var(--color-teal)]">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(45deg, var(--color-cyan) 1px, transparent 1px), linear-gradient(-45deg, var(--color-cyan) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              opacity: 0.15,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="mb-8 max-w-2xl">
            <span className="retro-banner mb-4 inline-block">— STAGE 02 —</span>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 mb-3 text-[var(--color-cream)]">
              Configs <span className="text-[var(--color-amber)] glow-amber">prêtes à play</span>
            </h2>
            <p className="text-[var(--color-cream)]/70">
              Un clic pour charger une config complète et équilibrée. Tu modifies après si tu veux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESETS.map((preset, i) => {
              const total = calculateTotal(preset.selection);
              const count = Object.keys(preset.selection).length;
              const accents = ["var(--color-mint)", "var(--color-cyan)", "var(--color-magenta)"];
              const accent = accents[i] ?? "var(--color-amber)";
              return (
                <Link
                  key={preset.name}
                  href="/configurateur"
                  className="retro-card p-6 block group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="retro-tag"
                      style={{ background: accent, color: "var(--color-ink)" }}
                    >
                      <Cpu className="w-3 h-3" />
                      {preset.target}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ink)]/50">
                      {count} parts
                    </span>
                  </div>

                  <h3 className="font-[var(--font-display)] font-extrabold text-xl mb-1 text-[var(--color-ink)]">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-[var(--color-ink)]/65 mb-4">{preset.description}</p>

                  <ul className="space-y-1 mb-5 border-t-2 border-dashed border-[var(--color-ink)]/20 pt-4">
                    {GROUPS.slice(0, 4).map((group) => {
                      const item = group.items.find((i) => i.id === preset.selection[group.key]);
                      if (!item) return null;
                      return (
                        <li key={group.key} className="flex items-center gap-2 text-xs text-[var(--color-ink)]/75">
                          <span className="w-2 h-2 rounded-sm" style={{ background: accent }} />
                          <span className="font-medium truncate">{item.name}</span>
                        </li>
                      );
                    })}
                    <li className="text-[11px] text-[var(--color-ink)]/40 pl-4 italic">
                      + {count - 4} autres pièces…
                    </li>
                  </ul>

                  <div className="flex items-center justify-between border-t-2 border-[var(--color-ink)] pt-4">
                    <span className="font-[var(--font-display)] text-2xl font-extrabold text-[var(--color-ink)] tabular-nums">
                      {total.toLocaleString("fr-FR")} €
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform"
                      style={{ color: "var(--color-ink)" }}
                    >
                      load <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA final ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative retro-card retro-card-dark overflow-hidden px-8 py-14 text-center">
          <div
            aria-hidden
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--color-cyan) 0, var(--color-cyan) 1px, transparent 1px, transparent 14px), repeating-linear-gradient(-45deg, var(--color-magenta) 0, var(--color-magenta) 1px, transparent 1px, transparent 14px)",
            }}
          />
          <div className="relative">
            <span className="retro-banner mb-5 inline-block">— FINAL BOSS —</span>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-5xl font-extrabold mb-4 mt-4 text-[var(--color-cream)]">
              Prêt à <span className="text-[var(--color-mint)] glow-mint">power up</span> ton PC ?
            </h2>
            <p className="text-[var(--color-cream)]/75 mb-8 max-w-md mx-auto">
              Configure chaque pièce, vérifie la compat, sauvegarde ta config. 5 minutes chrono.
            </p>
            <Link href="/configurateur" className="retro-btn retro-btn-cyan text-base px-7 py-3.5">
              <Sparkles className="w-4 h-4" />
              Press Start
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer ────────────────────────────────────────────────── */}
      <footer className="border-t-[3px] border-[var(--color-ink)] bg-[var(--color-deep)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-[var(--font-display)] text-sm font-extrabold text-[var(--color-cream)]">
            Oh<span className="text-[var(--color-cyan)] glow-cyan">My</span>Build
          </span>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-cream)]/50 text-center">
            ★ Benchmarks · TechPowerUp · Hardware Unboxed · Digital Foundry ★
          </p>
        </div>
      </footer>
    </main>
  );
}

/** Décor SVG du hero : "borne d'arcade" avec écran CRT et badges flottants. */
function HeroArtwork() {
  return (
    <div className="relative aspect-square max-w-md mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_20px_60px_rgba(0,212,255,0.25)]">
        <defs>
          <linearGradient id="crt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#102441" />
            <stop offset="60%" stopColor="#0d2a3a" />
            <stop offset="100%" stopColor="#0a0e27" />
          </linearGradient>
          <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d2a3a" />
            <stop offset="100%" stopColor="#0a0e27" />
          </linearGradient>
          <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd24d" />
            <stop offset="100%" stopColor="#d99700" />
          </linearGradient>
          <pattern id="scan" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="2" fill="rgba(0,212,255,0.0)" />
            <rect y="2" width="4" height="1" fill="rgba(0,212,255,0.18)" />
          </pattern>
        </defs>

        {/* Borne d'arcade — bord */}
        <rect x="20" y="20" width="360" height="360" rx="14" fill="url(#crt)" stroke="#0a0e27" strokeWidth="5" />

        {/* Écran CRT */}
        <rect x="50" y="60" width="300" height="220" rx="10" fill="url(#screen)" stroke="#0a0e27" strokeWidth="4" />
        {/* Glow autour de l'écran */}
        <rect x="50" y="60" width="300" height="220" rx="10" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.55" />

        {/* Grille perspective rétro à l'intérieur de l'écran */}
        <g clipPath="url(#screenClip)">
          {/* Horizon */}
          <line x1="50" y1="190" x2="350" y2="190" stroke="#00d4ff" strokeWidth="1.2" opacity="0.55" />
          {/* Soleil */}
          <circle cx="200" cy="185" r="42" fill="url(#amberGrad)" opacity="0.95" />
          <rect x="158" y="172" width="84" height="2.5" fill="#0a0e27" opacity="0.7" />
          <rect x="158" y="180" width="84" height="2" fill="#0a0e27" opacity="0.55" />
          <rect x="158" y="187" width="84" height="1.5" fill="#0a0e27" opacity="0.4" />

          {/* Grille au sol qui converge */}
          {Array.from({ length: 8 }).map((_, i) => {
            const y = 200 + (i + 1) * 12;
            return <line key={`h${i}`} x1="50" y1={y} x2="350" y2={y} stroke="#ff3d8a" strokeWidth="1" opacity={0.5 - i * 0.04} />;
          })}
          {Array.from({ length: 11 }).map((_, i) => {
            const x = 50 + (i * 30);
            return (
              <line
                key={`v${i}`}
                x1={x}
                y1="200"
                x2={200 + (x - 200) * 3.2}
                y2="280"
                stroke="#ff3d8a"
                strokeWidth="1"
                opacity="0.45"
              />
            );
          })}

          {/* Texte arcade "OMB" stylisé */}
          <text
            x="200"
            y="135"
            textAnchor="middle"
            fontFamily="'Bricolage Grotesque', sans-serif"
            fontWeight="900"
            fontSize="44"
            fill="#00d4ff"
            opacity="0.95"
          >
            OMB
          </text>
          <text
            x="200"
            y="158"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontWeight="700"
            fontSize="9"
            letterSpacing="3"
            fill="#fff4d6"
            opacity="0.55"
          >
            PRESS START
          </text>
        </g>

        {/* Scanlines overlay sur l'écran */}
        <rect x="50" y="60" width="300" height="220" rx="10" fill="url(#scan)" opacity="0.4" />

        {/* Panneau de contrôle (en bas) */}
        <rect x="50" y="298" width="300" height="60" rx="6" fill="#0d2a3a" stroke="#0a0e27" strokeWidth="3" />

        {/* Joystick */}
        <circle cx="100" cy="328" r="12" fill="#ff3d8a" stroke="#0a0e27" strokeWidth="3" />
        <line x1="100" y1="328" x2="100" y2="310" stroke="#0a0e27" strokeWidth="6" strokeLinecap="round" />
        <circle cx="100" cy="308" r="8" fill="#0a0e27" />

        {/* Boutons */}
        <circle cx="265" cy="328" r="11" fill="#00d4ff" stroke="#0a0e27" strokeWidth="3" />
        <circle cx="295" cy="328" r="11" fill="#00ff9d" stroke="#0a0e27" strokeWidth="3" />
        <circle cx="325" cy="328" r="11" fill="#ffb800" stroke="#0a0e27" strokeWidth="3" />

        {/* Coin slot */}
        <rect x="175" y="335" width="50" height="6" rx="2" fill="#0a0e27" />

        <clipPath id="screenClip">
          <rect x="50" y="60" width="300" height="220" rx="10" />
        </clipPath>
      </svg>
    </div>
  );
}
