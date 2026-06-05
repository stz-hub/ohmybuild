/**
 * Schémas Zod partagés client/serveur.
 *
 * Les types sont inférés à partir des schémas avec `z.infer<typeof X>`.
 * Aucun champ non whitelisté ne passe (mass-assignment bloqué).
 */
import { z } from "zod";
import { ALL_COMPONENT_IDS } from "@/lib/pc-data";

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email invalide").max(120),
  password: z
    .string()
    .min(12, "12 caractères minimum")
    .max(72, "72 caractères maximum (limite bcrypt)")
    .regex(/[A-Z]/, "Au moins 1 majuscule")
    .regex(/[a-z]/, "Au moins 1 minuscule")
    .regex(/[0-9]/, "Au moins 1 chiffre")
    .regex(/[^A-Za-z0-9]/, "Au moins 1 caractère spécial"),
  name: z.string().trim().min(1, "Nom requis").max(60, "60 caractères maximum"),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Builds (configs sauvegardées)
// ─────────────────────────────────────────────────────────────────────────────

const componentId = z
  .string()
  .refine((v) => ALL_COMPONENT_IDS.has(v), "Composant inconnu dans le catalogue")
  .optional();

/**
 * Sélection : clé composant -> id. Chaque id doit exister dans le catalogue
 * pour rejeter les payloads forgés. `.strict()` bloque tout champ inconnu.
 */
export const SelectionSchema = z
  .object({
    cpu: componentId,
    mobo: componentId,
    ram: componentId,
    gpu: componentId,
    storage: componentId,
    psu: componentId,
    case: componentId,
    cooling: componentId,
  })
  .strict();
export type SelectionInput = z.infer<typeof SelectionSchema>;

export const BuildCreateSchema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(80, "80 caractères maximum"),
  selection: SelectionSchema,
});
export type BuildCreateInput = z.infer<typeof BuildCreateSchema>;

export const BuildUpdateSchema = BuildCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "Au moins un champ doit être fourni" },
);
export type BuildUpdateInput = z.infer<typeof BuildUpdateSchema>;

export const BuildListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z
    .enum(["createdAt", "-createdAt", "name", "-name"])
    .default("-createdAt"),
});
export type BuildListQuery = z.infer<typeof BuildListQuerySchema>;
