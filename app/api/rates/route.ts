/**
 * GET /api/rates — intégration externe : taux de change EUR -> devises.
 *
 * Source : api.frankfurter.app (données BCE, gratuit, sans clé).
 * Cache 1h (revalidate) : les taux ne bougent qu'une fois par jour ouvré,
 * inutile de taper l'API à chaque requête.
 */
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?base=EUR", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Upstream frankfurter ${res.status}`);
    const data = (await res.json()) as {
      base: string;
      date: string;
      rates: Record<string, number>;
    };
    return NextResponse.json({ base: data.base, date: data.date, rates: data.rates });
  } catch (err) {
    return handleApiError(err);
  }
}
