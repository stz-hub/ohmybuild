/**
 * Service métier Build — règles métier autour des configs sauvegardées.
 *
 * - Vérifie l'ownership (pas d'IDOR).
 * - Sépare lecture (queries) et écriture (commands).
 * - Lève les erreurs métier de `lib/errors`, jamais des erreurs Prisma brutes.
 */
import type { Prisma } from "@prisma/client";

import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { buildRepository, type BuildSortKey } from "@/lib/repositories/build.repository";
import type { BuildCreateInput, BuildUpdateInput } from "@/lib/schemas";

export const buildService = {
  // ── Queries ───────────────────────────────────────────────────────────────
  async listForUser(
    userId: string,
    opts: { page: number; limit: number; sort: BuildSortKey },
  ) {
    const { data, total } = await buildRepository.listForUser(
      userId,
      opts.page,
      opts.limit,
      opts.sort,
    );
    return {
      data,
      meta: { page: opts.page, limit: opts.limit, total },
    };
  },

  async getForUser(buildId: string, userId: string) {
    // On lit d'abord sans filtre d'ownership pour distinguer 404 vs 403.
    const build = await buildRepository.findById(buildId);
    if (!build) throw new NotFoundError("Configuration introuvable");
    if (build.userId !== userId) throw new AuthorizationError();
    return build;
  },

  // ── Commands ──────────────────────────────────────────────────────────────
  async create(userId: string, input: BuildCreateInput) {
    return buildRepository.create(userId, {
      name: input.name,
      selection: input.selection as Prisma.InputJsonValue,
    });
  },

  async update(buildId: string, userId: string, input: BuildUpdateInput) {
    await this.getForUser(buildId, userId); // garde-fou ownership/404
    return buildRepository.update(buildId, {
      name: input.name,
      selection: input.selection as Prisma.InputJsonValue | undefined,
    });
  },

  async delete(buildId: string, userId: string) {
    await this.getForUser(buildId, userId); // garde-fou ownership/404
    await buildRepository.delete(buildId);
  },
};
