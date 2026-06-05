/**
 * Seed Prisma — données de démonstration.
 *
 * - Idempotent : upsert par email pour le user, deleteMany + createMany pour les builds.
 * - Crée le compte démo `demo@demo.local` / `Demo1234!`.
 * - Crée 2 builds de démonstration (Budget Gaming, Performance) au catalogue
 *   actuel — ils servent à valider visuellement la liste `/mes-configs`.
 *
 * Lancer : `npm run db:seed` (configuré via le champ `prisma.seed` dans package.json).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@demo.local";
const DEMO_PASSWORD = "Demo1234!";
const DEMO_NAME = "Ada Démo";

async function main() {
  // ── User démo ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: DEMO_NAME, passwordHash },
    create: { email: DEMO_EMAIL, name: DEMO_NAME, passwordHash },
  });
  console.log(`✓ user demo prêt : ${user.email}`);

  // ── Reset des builds démo et recréation ───────────────────────────────────
  await prisma.build.deleteMany({ where: { userId: user.id } });

  await prisma.build.createMany({
    data: [
      {
        userId: user.id,
        name: "Mon build Budget 1080p",
        selection: {
          cpu: "r5-5600",
          mobo: "b550-msi",
          ram: "16-ddr4",
          gpu: "rtx-4060ti",
          storage: "ssd-500",
          psu: "psu-650",
          case: "case-focus",
          cooling: "cooler-air",
        },
      },
      {
        userId: user.id,
        name: "Build perf 1440p",
        selection: {
          cpu: "r7-5800x3d",
          mobo: "b550-asus",
          ram: "32-ddr4",
          gpu: "rtx-4070s",
          storage: "ssd-1t",
          psu: "psu-750",
          case: "case-h510",
          cooling: "cooler-240",
        },
      },
    ],
  });
  console.log("✓ 2 builds de démonstration créés");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
