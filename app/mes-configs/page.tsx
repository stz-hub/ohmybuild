import type { Metadata } from "next";

import { auth } from "@/auth";
import { buildService } from "@/lib/services/build.service";
import { MyBuildsList } from "@/components/builds/my-builds-list";
import type { Selection } from "@/lib/pc-data";

export const metadata: Metadata = {
  title: "Mes configurations — OhMyBuild",
};

export const dynamic = "force-dynamic";

export default async function MyBuildsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    // Le middleware a normalement déjà redirigé, garde-fou serveur.
    return null;
  }

  const { data } = await buildService.listForUser(session.user.id, {
    page: 1,
    limit: 50,
    sort: "-createdAt",
  });

  // Le champ `selection` est typé `JsonValue` par Prisma (Json en base).
  // On le restreint au type métier `Selection` validé par Zod à l'écriture.
  const builds = data.map((b) => ({
    id: b.id,
    name: b.name,
    selection: (b.selection ?? {}) as Selection,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Mes configurations</h1>
        <p className="text-sm text-zinc-500">
          {builds.length === 0
            ? "Aucune configuration sauvegardée pour l'instant."
            : `${builds.length} configuration${builds.length > 1 ? "s" : ""} sauvegardée${builds.length > 1 ? "s" : ""}.`}
        </p>
      </header>

      <MyBuildsList initialBuilds={builds} />
    </main>
  );
}
