/**
 * GET /api/health — healthcheck simple. Tente une requête `SELECT 1` pour
 * confirmer que la BDD répond. Utile pour les checks de déploiement Vercel/Neon.
 */
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, time: new Date().toISOString(), db: "up" });
  } catch (err) {
    return NextResponse.json(
      { ok: false, time: new Date().toISOString(), db: "down", error: String(err) },
      { status: 503 },
    );
  }
}
