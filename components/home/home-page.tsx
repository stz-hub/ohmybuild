import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { PRESETS, GROUPS, calculateTotal } from "@/lib/pc-data";

const features = [
  {
    icon: ShieldCheck,
    title: "Compatibilité vérifiée",
    description: "Socket CPU, génération RAM, puissance PSU — tout est vérifié automatiquement avant que tu confirmes ta config.",
  },
  {
    icon: TrendingUp,
    title: "FPS réels benchmarkés",
    description: "Les performances affichées viennent de vrais benchmarks (TechPowerUp, Hardware Unboxed, Digital Foundry) sur Cyberpunk 2077 Ultra.",
  },
  {
    icon: Zap,
    title: "Meilleurs prix Idealo",
    description: "Chaque composant sélectionné renvoie directement vers sa page Idealo pour comparer les prix en temps réel.",
  },
];

export function HomePage() {
  return (
    <main>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold text-blue-600 tracking-wide">
              Configurateur PC gratuit · France
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
            Composez votre PC
            <span className="text-blue-600"> pièce par pièce.</span>
          </h1>

          <p className="text-lg text-zinc-500 leading-relaxed mb-8 max-w-xl">
            Compatibilité vérifiée en temps réel, performances estimées par résolution,
            meilleurs prix Idealo. Sans inscription, sans bullshit.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/configurateur"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Commencer ma config
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-sm text-zinc-400">Gratuit · Aucun compte requis</span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-[#e8e8e4] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-3 divide-x divide-[#e8e8e4]">
          {[
            { value: "8",      label: "catégories de composants" },
            { value: "100%",   label: "vérification de compatibilité" },
            { value: "0 €",    label: "coût d'utilisation" },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 text-center first:pl-0 last:pr-0">
              <div className="text-2xl font-bold text-blue-600">{value}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl font-bold tracking-tight mb-3">Pourquoi OhMyBuild ?</h2>
        <p className="text-zinc-500 mb-10 max-w-xl">
          Les autres configurateurs te noient dans les options. Ici, c'est simple, rapide, et honnête.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white rounded-xl border border-[#e8e8e4] p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Presets ── */}
      <section className="border-t border-[#e8e8e4] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Configurations prêtes à l&apos;emploi</h2>
          <p className="text-zinc-500 mb-8">Un clic pour charger une config complète et équilibrée.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRESETS.map(preset => {
              const total = calculateTotal(preset.selection);
              const count = Object.keys(preset.selection).length;
              return (
                <Link
                  key={preset.name}
                  href="/configurateur"
                  className="group bg-[#f9f9f7] hover:bg-blue-50 border border-[#e8e8e4] hover:border-blue-200 rounded-xl p-6 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {preset.target}
                    </span>
                    <span className="text-xs text-zinc-400">{count} composants</span>
                  </div>

                  <h3 className="font-bold text-zinc-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-zinc-500 mb-4">{preset.description}</p>

                  <div className="space-y-1 mb-5">
                    {GROUPS.slice(0, 4).map(group => {
                      const item = group.items.find(i => i.id === preset.selection[group.key]);
                      if (!item) return null;
                      return (
                        <div key={group.key} className="flex items-center gap-2 text-xs text-zinc-500">
                          <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                          {item.name}
                        </div>
                      );
                    })}
                    <div className="text-xs text-zinc-400 pl-5">+ {count - 4} autres composants</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-zinc-900">
                      {total.toLocaleString("fr-FR")} €
                    </span>
                    <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      Voir la config →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-2xl bg-blue-600 px-8 py-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Prêt à composer votre machine ?
          </h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Configurez chaque pièce, vérifiez la compatibilité, exportez la liste. En 5 minutes.
          </p>
          <Link
            href="/configurateur"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
          >
            Lancer le configurateur
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#e8e8e4] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-bold">
            Oh<span className="text-blue-600">My</span>Build
          </span>
          <p className="text-xs text-zinc-400 text-center">
            Benchmarks : TechPowerUp · Hardware Unboxed · Digital Foundry · Prix indicatifs via Idealo
          </p>
        </div>
      </footer>

    </main>
  );
}
