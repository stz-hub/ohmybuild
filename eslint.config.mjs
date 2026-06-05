/**
 * ESLint 9 flat config — minimaliste mais fonctionnel.
 *
 * Pourquoi minimaliste : `eslint-config-next@16` (`next/core-web-vitals`)
 * déclenche une erreur "Converting circular structure to JSON" au load via
 * @eslint/eslintrc (issue Vercel #64409). En attendant le fix amont, on garde
 * juste un parser TypeScript pour ne pas crasher, et `tsc --noEmit` couvre
 * la majeure partie du contrôle qualité.
 *
 * Quand le bug Next sera fix : rebrancher `compat.config({extends: ["next/core-web-vitals"]})`.
 */
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "coverage/",
      "prisma/migrations/",
      "next-env.d.ts",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {},
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {},
  },
];
