/**
 * /api/builds/[id] — ressource configuration PC unique.
 *   - GET    : lecture
 *   - PUT    : mise à jour (name et/ou selection)
 *   - DELETE : suppression définitive
 *
 * Auth : session requise. Ownership vérifié à chaque action (404 si inconnu,
 * 403 si appartient à un autre user).
 */
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { AuthenticationError, handleApiError } from "@/lib/errors";
import { BuildUpdateSchema } from "@/lib/schemas";
import { buildService } from "@/lib/services/build.service";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();
    const { id } = await ctx.params;
    const build = await buildService.getForUser(id, session.user.id);
    return NextResponse.json({ data: build });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();

    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const input = BuildUpdateSchema.parse(body);

    const build = await buildService.update(id, session.user.id, input);
    return NextResponse.json({ data: build });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new AuthenticationError();
    const { id } = await ctx.params;
    await buildService.delete(id, session.user.id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleApiError(err);
  }
}
