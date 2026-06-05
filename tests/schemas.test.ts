/**
 * Tests unitaires des schémas Zod (validation entrées API).
 */
import { describe, expect, it } from "vitest";

import {
  BuildCreateSchema,
  BuildListQuerySchema,
  RegisterSchema,
} from "@/lib/schemas";

describe("RegisterSchema", () => {
  it("accepte un payload valide", () => {
    const result = RegisterSchema.safeParse({
      email: "Ada@Example.COM",
      password: "S3cret!Pass99",
      name: "  Ada  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ada@example.com");
      expect(result.data.name).toBe("Ada");
    }
  });

  it("rejette un mot de passe trop court", () => {
    const r = RegisterSchema.safeParse({
      email: "a@b.com",
      password: "Short1!",
      name: "X",
    });
    expect(r.success).toBe(false);
  });

  it("rejette un mot de passe sans caractère spécial", () => {
    const r = RegisterSchema.safeParse({
      email: "a@b.com",
      password: "Abcdefgh1234",
      name: "X",
    });
    expect(r.success).toBe(false);
  });
});

describe("BuildCreateSchema", () => {
  it("accepte une sélection avec des ids connus", () => {
    const r = BuildCreateSchema.safeParse({
      name: "Mon build",
      selection: { cpu: "r5-5600", gpu: "rtx-4060ti" },
    });
    expect(r.success).toBe(true);
  });

  it("rejette une sélection avec un id inconnu", () => {
    const r = BuildCreateSchema.safeParse({
      name: "Mon build",
      selection: { cpu: "id-bidon" },
    });
    expect(r.success).toBe(false);
  });

  it("rejette un nom vide", () => {
    const r = BuildCreateSchema.safeParse({
      name: "   ",
      selection: { cpu: "r5-5600" },
    });
    expect(r.success).toBe(false);
  });

  it("rejette un champ inconnu (mass-assignment bloqué)", () => {
    const r = BuildCreateSchema.safeParse({
      name: "X",
      selection: { cpu: "r5-5600", malicious: "value" },
    });
    expect(r.success).toBe(false);
  });
});

describe("BuildListQuerySchema", () => {
  it("applique les défauts si aucune query param", () => {
    const r = BuildListQuerySchema.parse({});
    expect(r.page).toBe(1);
    expect(r.limit).toBe(20);
    expect(r.sort).toBe("-createdAt");
  });

  it("coerce les strings en numbers", () => {
    const r = BuildListQuerySchema.parse({ page: "3", limit: "10" });
    expect(r.page).toBe(3);
    expect(r.limit).toBe(10);
  });

  it("rejette un limit > 50", () => {
    expect(() => BuildListQuerySchema.parse({ limit: "200" })).toThrow();
  });
});
