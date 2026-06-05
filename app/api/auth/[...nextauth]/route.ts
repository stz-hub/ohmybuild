/**
 * Route handler NextAuth — délègue à `handlers` exporté par `auth.ts`.
 * URL : /api/auth/* (signin, callback, signout, session, csrf, providers).
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// Force l'exécution en runtime Node : bcryptjs + Prisma ne tournent pas sur Edge.
export const runtime = "nodejs";
