import Link from "next/link";
import Image from "next/image";
import { PRESETS, GROUPS, calculateTotal } from "@/lib/pc-data";

const features = [
  {
    icon: "/xp-icons/System Properties.ico",
    title: "Compatibility Check",
    description: "CPU socket, RAM generation, PSU power - everything is verified before you confirm your build.",
  },
  {
    icon: "/xp-icons/Monitor.ico",
    title: "Real FPS Data",
    description: "Performance data from real benchmarks on Cyberpunk 2077 Ultra settings.",
  },
  {
    icon: "/xp-icons/Internet Properties.ico",
    title: "Best Prices",
    description: "Each component links directly to Idealo for real-time price comparison.",
  },
];

export function HomePage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Desktop Icons */}
      <div className="fixed left-4 top-20 flex flex-col gap-4 z-10 hidden lg:flex">
        <Link href="/configurateur" className="xp-desktop-icon">
          <Image src="/xp-icons/My Computer.ico" alt="" width={48} height={48} />
          <span>PC Builder</span>
        </Link>
        <Link href="/mes-configs" className="xp-desktop-icon">
          <Image src="/xp-icons/Folder Closed.ico" alt="" width={48} height={48} />
          <span>My Builds</span>
        </Link>
        <div className="xp-desktop-icon">
          <Image src="/xp-icons/My Network Places.ico" alt="" width={48} height={48} />
          <span>Network</span>
        </div>
      </div>

      {/* Main Window */}
      <div className="max-w-5xl mx-auto">
        {/* Welcome Window */}
        <div className="xp-window mb-6">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-logo.png" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>Welcome to OhMyBuild - PC Configuration Wizard</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content">
            {/* Hero Content */}
            <div className="flex flex-col md:flex-row gap-6 p-4">
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <Image 
                  src="/xp-logo.png" 
                  alt="OhMyBuild Logo" 
                  width={96} 
                  height={96}
                  className="drop-shadow-lg"
                />
                <div className="text-center">
                  <span className="text-[18px] font-bold text-[#003399]">OhMyBuild</span>
                  <div className="text-[10px] text-[#808080]">Version 2.0 XP Edition</div>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-[24px] font-bold text-[#003399] mb-2">
                  Build Your Dream PC
                </h1>
                <p className="text-[12px] text-[#000] leading-relaxed mb-4">
                  Welcome to the OhMyBuild PC Configuration Wizard! This wizard will help you 
                  select compatible components for your gaming PC with real-time compatibility 
                  verification, performance estimates by resolution, and best Idealo prices.
                </p>
                
                {/* Info Box */}
                <div className="xp-info-box mb-4">
                  <Image src="/xp-icons/Activate Windows.ico" alt="" width={32} height={32} />
                  <div className="text-[11px]">
                    <strong>Did you know?</strong> No account required to configure your PC. 
                    Create an account to save and share your builds!
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href="/configurateur" className="xp-button xp-button-primary text-[12px] px-4 py-2 flex items-center gap-2">
                    <Image src="/xp-icons/My Computer.ico" alt="" width={16} height={16} />
                    Start Configuration Wizard
                  </Link>
                  <Link href="/register" className="xp-button text-[12px] px-4 py-2 flex items-center gap-2">
                    <Image src="/xp-icons/User Accounts.ico" alt="" width={16} height={16} />
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="xp-window mb-6">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/Display.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>System Information</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content">
            <div className="grid grid-cols-3 gap-4 p-2">
              {[
                { icon: "/xp-icons/System Properties.ico", value: "8", label: "Component Categories" },
                { icon: "/xp-icons/Activate Windows.ico", value: "100%", label: "Compatibility Check" },
                { icon: "/xp-icons/User Support.ico", value: "0 EUR", label: "Usage Cost" },
              ].map(({ icon, value, label }) => (
                <div key={label} className="xp-panel text-center p-3">
                  <Image src={icon} alt="" width={32} height={32} className="mx-auto mb-2" />
                  <div className="text-[18px] font-bold text-[#003399]">{value}</div>
                  <div className="text-[10px] text-[#808080] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Window */}
        <div className="xp-window mb-6">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/Manage your Server.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>Why OhMyBuild?</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content">
            <p className="text-[11px] text-[#808080] p-2 mb-2">
              Other configurators drown you in options. Here, it&apos;s simple, fast, and honest!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
              {features.map(({ icon, title, description }) => (
                <div key={title} className="xp-panel p-4 flex flex-col items-center text-center">
                  <Image src={icon} alt="" width={48} height={48} className="mb-3" />
                  <h3 className="text-[12px] font-bold text-[#003399] mb-2">{title}</h3>
                  <p className="text-[11px] text-[#000] leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Presets Window */}
        <div className="xp-window mb-6">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/Game Controller.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>Choose Your Build - Quick Start Configurations</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content">
            <p className="text-[11px] text-[#808080] p-2 mb-2">
              Select a preset configuration to get started quickly. Click &quot;Load Configuration&quot; to customize.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
              {PRESETS.map((preset, index) => {
                const total = calculateTotal(preset.selection);
                const count = Object.keys(preset.selection).length;
                const icons = [
                  "/xp-icons/Laptop.ico",
                  "/xp-icons/My Computer.ico",
                  "/xp-icons/Network Computers.ico",
                ];

                return (
                  <div key={preset.name} className="xp-panel p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Image src={icons[index]} alt="" width={32} height={32} />
                      <div>
                        <div className="text-[10px] font-bold text-white bg-[#316AC5] px-2 py-0.5 rounded-sm inline-block mb-1">
                          {preset.target}
                        </div>
                        <h3 className="text-[12px] font-bold text-[#003399]">{preset.name}</h3>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#000] mb-3">{preset.description}</p>
                    
                    <div className="xp-listview mb-3">
                      {GROUPS.slice(0, 3).map(group => {
                        const item = group.items.find(i => i.id === preset.selection[group.key]);
                        if (!item) return null;
                        return (
                          <div key={group.key} className="xp-listview-item text-[10px] flex items-center gap-2">
                            <span className="text-[#008000]">&#10003;</span>
                            <span className="truncate">{item.name}</span>
                          </div>
                        );
                      })}
                      <div className="xp-listview-item text-[10px] text-[#808080]">
                        + {count - 3} more components...
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#919B9C] pt-3">
                      <span className="text-[14px] font-bold text-[#003399]">
                        {total.toLocaleString("fr-FR")} EUR
                      </span>
                      <Link href="/configurateur" className="xp-button text-[11px] px-3 py-1">
                        Load Configuration &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Window */}
        <div className="xp-window mb-6">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/Activate Windows.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>Ready to Build?</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content">
            <div className="p-6 text-center">
              <Image src="/xp-icons/My Computer.ico" alt="" width={64} height={64} className="mx-auto mb-4" />
              <h2 className="text-[18px] font-bold text-[#003399] mb-2">
                Ready to Level Up?
              </h2>
              <p className="text-[11px] text-[#808080] mb-6 max-w-md mx-auto">
                Configure each component, verify compatibility, export the list. In just 5 minutes!
              </p>
              <Link
                href="/configurateur"
                className="xp-button xp-button-primary text-[14px] px-6 py-2 inline-flex items-center gap-2"
              >
                <Image src="/xp-icons/Game Controller.ico" alt="" width={16} height={16} />
                Launch Configuration Wizard
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="xp-window">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/Earth (fixed).ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>About OhMyBuild</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 text-[11px]">
              <div className="flex items-center gap-2">
                <Image src="/xp-logo.png" alt="" width={24} height={24} />
                <span className="font-bold text-[#003399]">OhMyBuild</span>
                <span className="text-[#808080]">XP Edition</span>
              </div>
              <p className="text-[#808080] text-center">
                Benchmarks: TechPowerUp - Hardware Unboxed - Digital Foundry | Prices via Idealo
              </p>
              <div className="flex gap-1">
                {["#0054E3", "#3C9A40", "#FF6600", "#FF0000"].map((c, i) => (
                  <div key={i} className="w-3 h-3 border border-[#808080]" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
