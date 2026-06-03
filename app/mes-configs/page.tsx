import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { buildService } from "@/lib/services/build.service";
import { MyBuildsList } from "@/components/builds/my-builds-list";
import type { Selection } from "@/lib/pc-data";

export const metadata: Metadata = {
  title: "My Configurations - OhMyBuild",
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
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Window */}
        <div className="xp-window mb-4">
          <div className="xp-titlebar">
            <div className="xp-titlebar-text">
              <Image src="/xp-icons/Folder Closed.ico" alt="" width={16} height={16} className="xp-titlebar-icon" />
              <span>My Saved Configurations</span>
            </div>
            <div className="xp-window-controls">
              <button className="xp-control-btn xp-minimize-btn" aria-label="Minimize">_</button>
              <button className="xp-control-btn xp-maximize-btn" aria-label="Maximize">[ ]</button>
              <button className="xp-control-btn xp-close-btn" aria-label="Close">X</button>
            </div>
          </div>
          <div className="xp-window-content p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src="/xp-icons/My Profile Folder.ico" alt="" width={48} height={48} />
                <div>
                  <h1 className="text-[16px] font-bold text-[#003399]">
                    My Configurations
                  </h1>
                  <p className="text-[11px] text-[#808080]">
                    {builds.length === 0
                      ? "No saved configurations yet."
                      : `${builds.length} saved configuration${builds.length > 1 ? "s" : ""}.`}
                  </p>
                </div>
              </div>
              <Link href="/configurateur" className="xp-button text-[11px] px-3 py-1 flex items-center gap-1">
                <span>+</span>
                New Configuration
              </Link>
            </div>
          </div>
        </div>

        <MyBuildsList initialBuilds={builds} />

        {/* Footer */}
        <footer className="xp-window mt-6">
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
          <div className="xp-window-content p-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-2">
                <Image src="/xp-logo.png" alt="" width={20} height={20} />
                <span className="font-bold text-[#003399]">OhMyBuild</span>
                <span className="text-[#808080]">XP Edition</span>
              </div>
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
