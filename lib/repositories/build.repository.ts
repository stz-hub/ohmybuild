/**
 * Repository Build — accès direct à la BDD via Prisma.
 *
 * Seul point d'écriture/lecture pour la table Build dans l'app : aucun controller
 * n'appelle Prisma directement. Permet de tester le service métier en mockant
 * facilement ce repo.
 */
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type BuildSortKey = "createdAt" | "-createdAt" | "name" | "-name";

function toOrderBy(sort: BuildSortKey): Prisma.BuildOrderByWithRelationInput {
  switch (sort) {
    case "createdAt":
      return { createdAt: "asc" };
    case "-createdAt":
      return { createdAt: "desc" };
    case "name":
      return { name: "asc" };
    case "-name":
      return { name: "desc" };
  }
}

export const buildRepository = {
  async findByIdForUser(id: string, userId: string) {
    return prisma.build.findFirst({ where: { id, userId } });
  },

  async findById(id: string) {
    return prisma.build.findUnique({ where: { id } });
  },

  async listForUser(userId: string, page: number, limit: number, sort: BuildSortKey) {
    const [data, total] = await Promise.all([
      prisma.build.findMany({
        where: { userId },
        orderBy: toOrderBy(sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.build.count({ where: { userId } }),
    ]);
    return { data, total };
  },

  async create(userId: string, data: { name: string; selection: Prisma.InputJsonValue }) {
    return prisma.build.create({
      data: { userId, name: data.name, selection: data.selection },
    });
  },

  async update(
    id: string,
    data: { name?: string; selection?: Prisma.InputJsonValue },
  ) {
    return prisma.build.update({ where: { id }, data });
  },

  async delete(id: string) {
    await prisma.build.delete({ where: { id } });
  },
};
