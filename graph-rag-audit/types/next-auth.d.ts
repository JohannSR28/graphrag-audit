import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Session exposée au client (useSession) : pas de jeton GitHub.
   */
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Étend le token JWT pour inclure nos champs personnalisés */
  interface JWT {
    accessToken?: string;
    providerId?: string;
  }
}