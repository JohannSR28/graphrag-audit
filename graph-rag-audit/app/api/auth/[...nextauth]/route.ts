// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      id: "github",
      name: "GitHub",
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: { params: { scope: "read:user user:email public_repo" } },
    }),
    GithubProvider({
      id: "github-private",
      name: "GitHub (Privé)",
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: { 
        params: { 
          scope: "read:user user:email repo",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`, // ← même callback que le provider principal
        } 
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
      session.accessToken = token.accessToken;
      session.providerId = token.providerId;
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
