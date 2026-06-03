import { Suspense } from "react";

import { PCBuilder } from "@/components/pc-builder/pc-builder";

export default function ConfigurateurPage() {
  return (
    <div className="content-layer">
      <Suspense
        fallback={
          <div className="p-8 text-[var(--color-ink)]/60 text-sm font-bold uppercase tracking-widest">
            Chargement…
          </div>
        }
      >
        <PCBuilder />
      </Suspense>
    </div>
  );
}
