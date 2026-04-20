// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      issuer: "https://github.com/login/oauth",
      authorization: {
        params: { scope: "read:user user:email" },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.providerId = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Ne pas mettre accessToken sur session : il serait renvoyé par /api/auth/session (client).
      // Le jeton reste uniquement dans le JWT ; côté serveur : getToken() ou getGitHubAccessToken().
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  pages: {
    signIn: "/",
    error: "/",
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
