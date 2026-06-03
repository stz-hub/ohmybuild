import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, ShieldCheck, TrendingUp, Gamepad2, Cpu, Monitor } from "lucide-react";
import { PRESETS, GROUPS, calculateTotal } from "@/lib/pc-data";

const features = [
  {
    icon: ShieldCheck,
    title: "COMPATIBILITY CHECK",
    description: "CPU socket, RAM generation, PSU power - everything is verified before you confirm your build.",
    color: "#00ff88",
  },
  {
    icon: TrendingUp,
    title: "REAL FPS DATA",
    description: "Performance data from real benchmarks (TechPowerUp, Hardware Unboxed, Digital Foundry) on Cyberpunk 2077 Ultra.",
    color: "#00d4ff",
  },
  {
    icon: Zap,
    title: "BEST PRICES",
    description: "Each component links directly to Idealo for real-time price comparison across retailers.",
    color: "#ffdd00",
  },
];

export function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d0d1a] pixel-grid-bg">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="max-w-3xl">
          {/* Retro badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] border-4 border-[#ff00aa] mb-8 shadow-[0_0_20px_rgba(255,0,170,0.3)]">
            <div className="w-3 h-3 bg-[#ff00aa] animate-pulse" />
            <span className="text-sm text-[#ff00aa] tracking-wider">
              FREE PC BUILDER - FRANCE
            </span>
          </div>

          <h1 className="font-[var(--font-pixel)] text-2xl sm:text-3xl md:text-4xl leading-relaxed mb-6 text-[#e8e8ff]">
            <span className="block">BUILD YOUR</span>
            <span className="block text-[#00d4ff] drop-shadow-[0_0_20px_rgba(0,212,255,0.8)]">DREAM PC</span>
            <span className="block text-[#ff00aa] drop-shadow-[0_0_20px_rgba(255,0,170,0.8)]">PIECE BY PIECE</span>
          </h1>

          <p className="text-xl text-[#9090c0] leading-relaxed mb-10 max-w-xl">
            Real-time compatibility verification, performance estimates by resolution, best Idealo prices. No signup, no BS.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/configurateur"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#00d4ff] border-4 border-[#00d4ff] text-[#0d0d1a] font-bold text-lg hover:bg-[#00ffcc] hover:border-[#00ffcc] hover:shadow-[0_0_30px_rgba(0,255,204,0.6)] transition-all shadow-[4px_4px_0_0_#006688]"
            >
              <Gamepad2 className="w-6 h-6" />
              START BUILDING
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-sm text-[#6060a0] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00ff88] animate-pulse" />
              FREE - NO ACCOUNT REQUIRED
            </span>
          </div>
        </div>

        {/* Decorative pixel art elements */}
        <div className="hidden lg:block absolute top-32 right-20 opacity-20">
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2"
                style={{
                  backgroundColor: Math.random() > 0.7 ? '#00d4ff' : 'transparent',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y-4 border-[#2d2d5a] bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 gap-4">
          {[
            { value: "8", label: "COMPONENT CATEGORIES", icon: Cpu },
            { value: "100%", label: "COMPATIBILITY CHECK", icon: ShieldCheck },
            { value: "0 EUR", label: "USAGE COST", icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center px-4 py-2 bg-[#0d0d1a] border-4 border-[#2d2d5a]">
              <Icon className="w-6 h-6 text-[#00d4ff] mx-auto mb-2" />
              <div className="font-[var(--font-pixel)] text-lg text-[#00d4ff] drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">{value}</div>
              <div className="text-xs text-[#6060a0] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <h2 className="font-[var(--font-pixel)] text-xl text-[#e8e8ff] mb-3">
            WHY <span className="text-[#00d4ff]">OHMYBUILD</span>?
          </h2>
          <p className="text-[#9090c0] max-w-xl">
            Other configurators drown you in options. Here, it&apos;s simple, fast, and honest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="bg-[#1a1a2e] border-4 border-[#2d2d5a] p-6 hover:border-current transition-colors group"
              style={{ '--hover-color': color } as React.CSSProperties}
            >
              <div
                className="w-14 h-14 bg-[#0d0d1a] border-4 flex items-center justify-center mb-5"
                style={{ borderColor: color, boxShadow: `0 0 20px ${color}40` }}
              >
                <Icon className="w-7 h-7" style={{ color }} />
              </div>
              <h3 className="font-[var(--font-pixel)] text-sm text-[#e8e8ff] mb-3">{title}</h3>
              <p className="text-sm text-[#9090c0] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Presets Section */}
      <section className="border-t-4 border-[#2d2d5a] bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="mb-10">
            <h2 className="font-[var(--font-pixel)] text-xl text-[#e8e8ff] mb-3">
              SELECT YOUR <span className="text-[#ff00aa]">CLASS</span>
            </h2>
            <p className="text-[#9090c0]">One click to load a complete, balanced configuration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESETS.map((preset, index) => {
              const total = calculateTotal(preset.selection);
              const count = Object.keys(preset.selection).length;
              const colors = ["#00ff88", "#00d4ff", "#ff00aa"];
              const color = colors[index % colors.length];

              return (
                <Link
                  key={preset.name}
                  href="/configurateur"
                  className="group bg-[#0d0d1a] border-4 border-[#2d2d5a] p-6 hover:border-current transition-all"
                  style={{ '--card-color': color } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="px-3 py-1 text-xs font-bold border-4 text-[#0d0d1a]"
                      style={{ backgroundColor: color, borderColor: color }}
                    >
                      {preset.target}
                    </span>
                    <span className="text-xs text-[#6060a0]">{count} PARTS</span>
                  </div>

                  <h3 className="font-[var(--font-pixel)] text-sm text-[#e8e8ff] mb-2 group-hover:drop-shadow-[0_0_10px_currentColor] transition-all" style={{ color: 'inherit' }}>
                    {preset.name}
                  </h3>
                  <p className="text-sm text-[#9090c0] mb-5">{preset.description}</p>

                  <div className="space-y-2 mb-6">
                    {GROUPS.slice(0, 4).map(group => {
                      const item = group.items.find(i => i.id === preset.selection[group.key]);
                      if (!item) return null;
                      return (
                        <div key={group.key} className="flex items-center gap-2 text-xs text-[#6060a0]">
                          <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color }} />
                          <span className="truncate">{item.name}</span>
                        </div>
                      );
                    })}
                    <div className="text-xs text-[#4a4a8a] pl-5">+ {count - 4} more parts</div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-4 border-[#2d2d5a]">
                    <span className="font-[var(--font-pixel)] text-xl" style={{ color }}>
                      {total.toLocaleString("fr-FR")} EUR
                    </span>
                    <span className="text-sm text-[#9090c0] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      SELECT
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-[#1a1a2e] border-4 border-[#00d4ff] p-10 text-center shadow-[0_0_40px_rgba(0,212,255,0.3)]">
          <h2 className="font-[var(--font-pixel)] text-xl md:text-2xl text-[#e8e8ff] mb-4">
            READY TO <span className="text-[#00d4ff]">LEVEL UP</span>?
          </h2>
          <p className="text-[#9090c0] mb-8 max-w-md mx-auto">
            Configure each part, verify compatibility, export the list. In 5 minutes.
          </p>
          <Link
            href="/configurateur"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#ff00aa] border-4 border-[#ff00aa] text-[#e8e8ff] font-bold text-lg hover:bg-[#ff33bb] hover:shadow-[0_0_30px_rgba(255,0,170,0.6)] transition-all shadow-[4px_4px_0_0_#990066]"
          >
            <Gamepad2 className="w-6 h-6" />
            LAUNCH BUILDER
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-[#2d2d5a] py-8 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-[var(--font-pixel)] text-xs">
            <span className="text-[#e8e8ff]">Oh</span>
            <span className="text-[#00d4ff]">My</span>
            <span className="text-[#ff00aa]">Build</span>
          </span>
          <p className="text-xs text-[#6060a0] text-center">
            Benchmarks: TechPowerUp - Hardware Unboxed - Digital Foundry | Prices via Idealo
          </p>
          <div className="flex gap-2">
            {["#00d4ff", "#ff00aa", "#ffdd00", "#00ff88"].map((c, i) => (
              <div key={i} className="w-3 h-3" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
