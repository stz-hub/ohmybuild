import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Gauge, Sparkles } from "lucide-react";

import { PRESETS, GROUPS, calculateTotal } from "@/lib/pc-data";

const features = [
  {
    icon: ShieldCheck,
    color: "var(--color-grass)",
    title: "Compat-Check temps réel",
    description:
      "Socket CPU, génération RAM, watts PSU — chaque pièce est validée pendant que tu joues avec le configurateur. Plus jamais le mauvais combo.",
  },
  {
    icon: TrendingUp,
    color: "var(--color-sky)",
    title: "FPS réels benchmarkés",
    description:
      "Les performances affichées viennent de TechPowerUp, Hardware Unboxed et Digital Foundry. Cyberpunk Ultra, natif, sans bluff.",
  },
  {
    icon: Zap,
    color: "var(--color-cherry)",
    title: "Best Price Idealo",
    description:
      "Chaque composant te renvoie sur sa page Idealo. Tu compares les prix en un clic, tu commandes où c'est le moins cher.",
  },
];

const stats = [
  { value: "8", label: "catégories", color: "var(--color-grass)" },
  { value: "100%", label: "compat-checks", color: "var(--color-sky)" },
  { value: "0 €", label: "coût", color: "var(--color-cherry)" },
  { value: "1 clic", label: "preset", color: "var(--color-violet)" },
];

export function HomePage() {
  return (
    <main className="content-layer relative overflow-hidden">
      {/* Hero ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <span className="retro-tag mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cherry)]" />
              CONFIGURATEUR PC · MADE IN FRANCE
            </span>

            <h1 className="font-[var(--font-display)] text-5xl sm:text-7xl font-extrabold leading-[0.95] tracking-tight mb-5">
              Compose ton PC
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-[var(--color-sky)]">pièce par pièce</span>
                <span
                  aria-hidden
                  className="absolute left-0 bottom-1 h-3 w-full bg-[var(--color-ring)] -z-0"
                />
              </span>
              <span className="text-[var(--color-cherry)]">.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--color-ink)]/75 leading-relaxed mb-8 max-w-xl font-medium">
              Compat-check temps réel, FPS benchmarkés, prix Idealo.{" "}
              <span className="bg-[var(--color-ring)]/60 px-1.5 rounded">Sans inscription</span>, sans bullshit.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/configurateur" className="retro-btn retro-btn-cherry text-base px-6 py-3">
                <Sparkles className="w-4 h-4" />
                Lancer ma config
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="retro-btn retro-btn-white text-base px-6 py-3"
              >
                Créer un compte
              </Link>
            </div>
          </div>

          {/* Hero artwork : niveau pixel rétro stylisé */}
          <div className="hidden lg:block relative">
            <HeroArtwork />
          </div>
        </div>
      </section>

      {/* Stats bar ───────────────────────────────────────────────────── */}
      <section className="border-y-[3px] border-[var(--color-ink)] bg-[var(--color-ink)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ value, label, color }) => (
            <div key={label} className="text-center">
              <div
                className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold"
                style={{ color }}
              >
                {value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <span className="retro-banner mb-4">FEATURES</span>
          <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 mt-3">
            Pourquoi <span className="text-[var(--color-sky)]">OhMyBuild</span> ?
          </h2>
          <p className="text-[var(--color-ink)]/70">
            Les autres configurateurs te noient dans 1000 options. Ici : simple, rapide, honnête, et tu gardes ton historique si tu te connectes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="retro-card p-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border-2 border-[var(--color-ink)] shadow-[3px_3px_0_var(--color-ink)]"
                style={{ background: color }}
              >
                <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-[var(--font-display)] font-extrabold text-lg mb-2">{title}</h3>
              <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Presets ─────────────────────────────────────────────────────── */}
      <section className="relative border-y-[3px] border-[var(--color-ink)] bg-[var(--color-sky-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="mb-8 max-w-2xl">
            <span className="retro-banner mb-4">PRESETS</span>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 mt-3">
              Configs prêtes à l&apos;emploi
            </h2>
            <p className="text-[var(--color-ink)]/70">
              Un clic pour charger une config complète et équilibrée. Tu peux la modifier ensuite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESETS.map((preset, i) => {
              const total = calculateTotal(preset.selection);
              const count = Object.keys(preset.selection).length;
              const accent = ["var(--color-grass)", "var(--color-sky)", "var(--color-cherry)"][i] ?? "var(--color-ring)";
              return (
                <Link
                  key={preset.name}
                  href="/configurateur"
                  className="retro-card p-6 block group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="retro-tag"
                      style={{ background: accent, color: "white", borderColor: "var(--color-ink)" }}
                    >
                      <Gauge className="w-3 h-3" />
                      {preset.target}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/50">
                      {count} composants
                    </span>
                  </div>

                  <h3 className="font-[var(--font-display)] font-extrabold text-xl mb-1">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-[var(--color-ink)]/70 mb-4">{preset.description}</p>

                  <div className="space-y-1.5 mb-5 border-t-2 border-dashed border-[var(--color-ink)]/15 pt-4">
                    {GROUPS.slice(0, 4).map((group) => {
                      const item = group.items.find((i) => i.id === preset.selection[group.key]);
                      if (!item) return null;
                      return (
                        <div
                          key={group.key}
                          className="flex items-center gap-2 text-xs text-[var(--color-ink)]/75"
                        >
                          <span
                            className="w-2 h-2 rounded-sm"
                            style={{ background: accent }}
                          />
                          <span className="font-medium truncate">{item.name}</span>
                        </div>
                      );
                    })}
                    <div className="text-[11px] text-[var(--color-ink)]/40 pl-4 italic">
                      + {count - 4} autres composants…
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-[var(--color-ink)] pt-4">
                    <span className="font-[var(--font-display)] text-2xl font-extrabold">
                      {total.toLocaleString("fr-FR")} €
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                      style={{ color: accent }}
                    >
                      Voir <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative retro-card overflow-hidden bg-[var(--color-ink)] text-white px-8 py-14 text-center">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(45deg, var(--color-ring) 25%, transparent 25%, transparent 75%, var(--color-ring) 75%), linear-gradient(45deg, var(--color-ring) 25%, transparent 25%, transparent 75%, var(--color-ring) 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 8px 8px",
            }}
          />
          <div className="relative">
            <h2 className="font-[var(--font-display)] text-3xl sm:text-5xl font-extrabold mb-4">
              Prêt à <span className="text-[var(--color-ring)]">power up</span> ton PC ?
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto font-medium">
              Configure chaque pièce, vérifie la compat, sauvegarde ta config. En 5 minutes chrono.
            </p>
            <Link href="/configurateur" className="retro-btn retro-btn-cherry text-base px-7 py-3.5">
              <Sparkles className="w-4 h-4" />
              Go ! Lancer le configurateur
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t-[3px] border-[var(--color-ink)] bg-[var(--color-ring)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-extrabold font-[var(--font-display)]">
            Oh<span className="text-[var(--color-sky-dark)]">My</span>Build
          </span>
          <p className="text-xs text-[var(--color-ink)]/70 text-center font-medium">
            Benchmarks · TechPowerUp · Hardware Unboxed · Digital Foundry · Prix indicatifs via Idealo
          </p>
        </div>
      </footer>
    </main>
  );
}

/** Décor SVG du hero : niveau rétro avec collines, soleil, anneaux flottants. */
function HeroArtwork() {
  return (
    <div className="relative aspect-square max-w-md mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2dadff" />
            <stop offset="100%" stopColor="#9fd9ff" />
          </linearGradient>
          <pattern id="checker" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#1eb053" />
            <rect x="16" y="16" width="16" height="16" fill="#1eb053" />
            <rect x="16" width="16" height="16" fill="#149242" />
            <rect y="16" width="16" height="16" fill="#149242" />
          </pattern>
        </defs>

        {/* Cadre rétro */}
        <rect
          x="6"
          y="6"
          width="388"
          height="388"
          rx="20"
          fill="url(#sky)"
          stroke="#0b1020"
          strokeWidth="6"
        />

        {/* Soleil */}
        <circle cx="320" cy="90" r="38" fill="#ffcc00" stroke="#0b1020" strokeWidth="5" />
        <circle cx="320" cy="90" r="22" fill="#fff" opacity="0.5" />

        {/* Nuages stylisés */}
        <g fill="#fff" stroke="#0b1020" strokeWidth="4">
          <ellipse cx="80" cy="70" rx="36" ry="14" />
          <ellipse cx="170" cy="50" rx="30" ry="12" />
        </g>

        {/* Collines arrière */}
        <path
          d="M0 280 Q100 230 200 270 T400 270 L400 400 L0 400 Z"
          fill="#149242"
          stroke="#0b1020"
          strokeWidth="5"
        />

        {/* Damier au sol (effet niveau jeu) */}
        <path
          d="M0 310 Q100 260 200 300 T400 300 L400 400 L0 400 Z"
          fill="url(#checker)"
          stroke="#0b1020"
          strokeWidth="5"
        />

        {/* Anneaux flottants (clins d'œil rétro, propres) */}
        <g>
          <Ring cx={70} cy={210} />
          <Ring cx={140} cy={170} />
          <Ring cx={220} cy={200} />
          <Ring cx={300} cy={185} />
        </g>

        {/* Boitier PC stylisé au premier plan */}
        <g transform="translate(140 250)">
          <rect x="0" y="0" width="120" height="120" rx="10" fill="#0b1020" stroke="#0b1020" strokeWidth="4" />
          <rect x="10" y="10" width="100" height="40" rx="5" fill="#ff3868" />
          <circle cx="60" cy="80" r="20" fill="#ffcc00" stroke="#0b1020" strokeWidth="3" />
          <circle cx="60" cy="80" r="8" fill="#0b1020" />
          <rect x="20" y="105" width="80" height="6" rx="2" fill="#2dadff" />
        </g>
      </svg>
    </div>
  );
}

function Ring({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse
        cx={cx}
        cy={cy}
        rx="13"
        ry="14"
        fill="none"
        stroke="#0b1020"
        strokeWidth="5"
      />
      <ellipse cx={cx} cy={cy} rx="11" ry="12" fill="none" stroke="#ffcc00" strokeWidth="5" />
    </g>
  );
}
