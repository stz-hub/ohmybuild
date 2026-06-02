/**
 * POST /api/auth/register — création d'un compte utilisateur.
 *
 * - Validation Zod du body.
 * - Rate limit 5/15min/IP.
 * - bcrypt cost 12 pour le hash.
 * - Renvoie 201 + user sans le hash, ou 400/409/429 selon le cas.
 */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/schemas";
import {
  ConflictError,
  RateLimitError,
  handleApiError,
} from "@/lib/errors";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const rl = await rateLimit({
      key: `register:${ip}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rl.ok) throw new RateLimitError();

    const body = await req.json().catch(() => ({}));
    const { email, password, name } = RegisterSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError("Un compte existe déjà avec cet email");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
