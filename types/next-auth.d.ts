/**
 * Augmente les types NextAuth pour exposer `session.user.id` (sinon `string` n'est
 * pas reconnu par TypeScript).
 */
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
