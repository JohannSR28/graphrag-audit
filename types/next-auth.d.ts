import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Étend l'objet session renvoyé par useSession et getServerSession
   */
  interface Session {
    accessToken?: string;
    providerId?: string;
    user: {
      /** L'id de l'utilisateur si besoin */
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