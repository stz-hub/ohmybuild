import { Suspense } from "react";

import { PCBuilder } from "@/components/pc-builder/pc-builder";

export default function ConfigurateurPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-400 text-sm">Chargement…</div>}>
      <PCBuilder />
    </Suspense>
  );
}
