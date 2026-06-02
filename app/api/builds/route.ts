/**
 * /api/builds — collection des configurations PC d'un utilisateur.
 *   - GET  : liste paginée
 *   - POST : création
 *
 * Auth : session requise pour les deux. L'identité vient de la session côté
 * serveur, jamais du body (pas de mass-assignment de userId).
 */
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { AuthenticationError, handleApiError } from "@/lib/errors";
import { BuildCreateSchema, BuildListQuerySchema } from "@/lib/schemas";
import { buildService } from "@/lib/services/build.service";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const { searchParams } = new URL(req.url);
    const query = BuildListQuerySchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });

    const result = await buildService.listForUser(session.user.id, query);
    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const body = await req.json().catch(() => ({}));
    const input = BuildCreateSchema.parse(body);

    const build = await buildService.create(session.user.id, input);
    return NextResponse.json({ data: build }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
