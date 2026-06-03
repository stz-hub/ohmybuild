import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, ShieldCheck, TrendingUp, Gamepad2, Cpu, Monitor, Star, Sparkles } from "lucide-react";
import { PRESETS, GROUPS, calculateTotal } from "@/lib/pc-data";

const features = [
  {
    icon: ShieldCheck,
    title: "Compatibility Check",
    description: "CPU socket, RAM generation, PSU power - everything is verified before you confirm your build.",
    color: "#32cd32",
    bgColor: "#e8f5e9",
  },
  {
    icon: TrendingUp,
    title: "Real FPS Data",
    description: "Performance data from real benchmarks on Cyberpunk 2077 Ultra settings.",
    color: "#1e90ff",
    bgColor: "#e3f2fd",
  },
  {
    icon: Zap,
    title: "Best Prices",
    description: "Each component links directly to Idealo for real-time price comparison.",
    color: "#ff8c00",
    bgColor: "#fff3e0",
  },
];

export function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Sky gradient background with clouds */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1e90ff] via-[#87ceeb] to-[#32cd32] -z-10" />
      <div className="fixed inset-0 clouds-bg -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="max-w-3xl">
          {/* Fun badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-4 border-[#ffd700] rounded-full mb-6 shadow-lg">
            <Star className="w-5 h-5 text-[#ffd700] fill-[#ffd700]" />
            <span className="text-sm font-bold text-[#2d3436]">
              Free PC Builder - France
            </span>
            <Star className="w-5 h-5 text-[#ffd700] fill-[#ffd700]" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            <span className="block text-white drop-shadow-[3px_3px_0_#0066cc]">Build Your</span>
            <span className="block text-[#ffd700] drop-shadow-[3px_3px_0_#b8860b]">Dream PC</span>
            <span className="block text-[#32cd32] drop-shadow-[3px_3px_0_#006400]">Piece by Piece!</span>
          </h1>

          <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-xl drop-shadow-md">
            Real-time compatibility verification, performance estimates by resolution, best Idealo prices. No signup required!
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/configurateur"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-b from-[#ffd700] to-[#ff8c00] border-4 border-[#b8860b] text-[#2d3436] font-bold text-lg rounded-2xl shadow-[0_6px_0_#8b6914] hover:translate-y-[-2px] hover:shadow-[0_8px_0_#8b6914] active:translate-y-[2px] active:shadow-[0_4px_0_#8b6914] transition-all"
            >
              <Gamepad2 className="w-6 h-6" />
              Start Building!
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-sm text-white flex items-center gap-2 drop-shadow-md">
              <Sparkles className="w-5 h-5 text-[#ffd700]" />
              100% Free - No Account Needed
            </span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white/90 backdrop-blur-sm border-y-4 border-[#c0c0c0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 gap-4">
          {[
            { value: "8", label: "Component Categories", icon: Cpu, color: "#e52521" },
            { value: "100%", label: "Compatibility Check", icon: ShieldCheck, color: "#32cd32" },
            { value: "0 EUR", label: "Usage Cost", icon: Monitor, color: "#1e90ff" },
          ].map(({ value, label, icon: Icon, color }) => (
            <div key={label} className="text-center px-4 py-3 bg-gradient-to-b from-[#f8f8f0] to-[#e8e8e0] border-4 border-[#c0c0c0] rounded-2xl shadow-[0_4px_0_#808080]">
              <div 
                className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center border-4"
                style={{ backgroundColor: `${color}20`, borderColor: color }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs text-[#4a5568] mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white drop-shadow-[2px_2px_0_#0066cc] mb-2">
            Why OhMyBuild?
          </h2>
          <p className="text-white/80 max-w-md mx-auto drop-shadow-md">
            Other configurators drown you in options. Here, it&apos;s simple, fast, and honest!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bgColor }) => (
            <div
              key={title}
              className="bg-white border-4 border-[#c0c0c0] p-6 rounded-2xl shadow-[0_6px_0_#808080] hover:translate-y-[-4px] hover:shadow-[0_10px_0_#808080] transition-all"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border-4"
                style={{ backgroundColor: bgColor, borderColor: color }}
              >
                <Icon className="w-8 h-8" style={{ color }} />
              </div>
              <h3 className="text-lg font-bold text-[#2d3436] mb-2">{title}</h3>
              <p className="text-sm text-[#4a5568] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Presets Section */}
      <section className="bg-gradient-to-b from-[#32cd32] to-[#228b22] border-t-4 border-[#006400]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white drop-shadow-[2px_2px_0_#006400] mb-2">
              Choose Your Build!
            </h2>
            <p className="text-white/90 drop-shadow-md">One click to load a complete, balanced configuration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESETS.map((preset, index) => {
              const total = calculateTotal(preset.selection);
              const count = Object.keys(preset.selection).length;
              const colors = [
                { bg: "from-[#e8f5e9] to-[#c8e6c9]", border: "#32cd32", badge: "#32cd32" },
                { bg: "from-[#e3f2fd] to-[#bbdefb]", border: "#1e90ff", badge: "#1e90ff" },
                { bg: "from-[#fce4ec] to-[#f8bbd9]", border: "#e91e63", badge: "#e91e63" },
              ];
              const style = colors[index % colors.length];

              return (
                <Link
                  key={preset.name}
                  href="/configurateur"
                  className="group bg-white border-4 rounded-2xl p-6 shadow-[0_6px_0_#808080] hover:translate-y-[-4px] hover:shadow-[0_10px_0_#808080] transition-all"
                  style={{ borderColor: style.border }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-3 py-1 text-xs font-bold text-white rounded-full"
                      style={{ backgroundColor: style.badge }}
                    >
                      {preset.target}
                    </span>
                    <span className="text-xs text-[#4a5568] font-medium">{count} parts</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#2d3436] mb-2">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-[#4a5568] mb-4">{preset.description}</p>

                  <div className="space-y-2 mb-4">
                    {GROUPS.slice(0, 3).map(group => {
                      const item = group.items.find(i => i.id === preset.selection[group.key]);
                      if (!item) return null;
                      return (
                        <div key={group.key} className="flex items-center gap-2 text-xs text-[#4a5568]">
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: style.badge }} />
                          <span className="truncate">{item.name}</span>
                        </div>
                      );
                    })}
                    <div className="text-xs text-[#808080] pl-6">+ {count - 3} more parts</div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-[#e0e0e0]">
                    <span className="text-xl font-bold" style={{ color: style.badge }}>
                      {total.toLocaleString("fr-FR")} EUR
                    </span>
                    <span className="text-sm font-semibold text-[#4a5568] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Select
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white border-4 border-[#ffd700] p-10 rounded-3xl text-center shadow-[0_8px_0_#b8860b]">
          <div className="flex justify-center gap-2 mb-4">
            {[1,2,3].map(i => (
              <Star key={i} className="w-8 h-8 text-[#ffd700] fill-[#ffd700]" />
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2d3436] mb-4">
            Ready to Level Up?
          </h2>
          <p className="text-[#4a5568] mb-8 max-w-md mx-auto">
            Configure each part, verify compatibility, export the list. In just 5 minutes!
          </p>
          <Link
            href="/configurateur"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-b from-[#32cd32] to-[#228b22] border-4 border-[#006400] text-white font-bold text-lg rounded-2xl shadow-[0_6px_0_#004d00] hover:translate-y-[-2px] hover:shadow-[0_8px_0_#004d00] active:translate-y-[2px] active:shadow-[0_4px_0_#004d00] transition-all"
          >
            <Gamepad2 className="w-6 h-6" />
            Launch Builder!
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer - Grass strip */}
      <footer className="grass-strip py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold">
            <span className="text-white drop-shadow-[1px_1px_0_#006400]">Oh</span>
            <span className="text-[#ffd700] drop-shadow-[1px_1px_0_#b8860b]">My</span>
            <span className="text-[#87ceeb] drop-shadow-[1px_1px_0_#0066cc]">Build</span>
          </span>
          <p className="text-xs text-white/80 text-center">
            Benchmarks: TechPowerUp - Hardware Unboxed - Digital Foundry | Prices via Idealo
          </p>
          <div className="flex gap-2">
            {["#e52521", "#ffd700", "#32cd32", "#1e90ff"].map((c, i) => (
              <div key={i} className="w-4 h-4 rounded-full border-2 border-white/50" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
