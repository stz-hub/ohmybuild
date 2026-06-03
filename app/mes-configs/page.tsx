import type { Metadata } from "next";

import { auth } from "@/auth";
import { buildService } from "@/lib/services/build.service";
import { MyBuildsList } from "@/components/builds/my-builds-list";
import type { Selection } from "@/lib/pc-data";
import { Gamepad2 } from "lucide-react";

export const metadata: Metadata = {
  title: "My Builds - OhMyBuild",
};

export const dynamic = "force-dynamic";

export default async function MyBuildsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const { data } = await buildService.listForUser(session.user.id, {
    page: 1,
    limit: 50,
    sort: "-createdAt",
  });

  const builds = data.map((b) => ({
    id: b.id,
    name: b.name,
    selection: (b.selection ?? {}) as Selection,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-[#0d0d1a] pixel-grid-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-[#1a1a2e] border-4 border-[#ff00aa] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,170,0.4)]">
              <Gamepad2 className="w-6 h-6 text-[#ff00aa]" />
            </div>
            <div>
              <h1 className="font-[var(--font-pixel)] text-xl text-[#e8e8ff]">
                MY BUILDS
              </h1>
              <p className="text-sm text-[#9090c0]">
                {builds.length === 0
                  ? "No saved builds yet."
                  : `${builds.length} saved build${builds.length > 1 ? "s" : ""}.`}
              </p>
            </div>
          </div>
        </header>

        <MyBuildsList initialBuilds={builds} />
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-[#2d2d5a] py-6 bg-[#1a1a2e] mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-[var(--font-pixel)] text-xs">
            <span className="text-[#e8e8ff]">Oh</span>
            <span className="text-[#00d4ff]">My</span>
            <span className="text-[#ff00aa]">Build</span>
          </span>
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
