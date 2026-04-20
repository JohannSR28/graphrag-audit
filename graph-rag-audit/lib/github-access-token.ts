import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

/**
 * Lit le jeton OAuth GitHub depuis le JWT (cookie), sans passer par la session
 * exposée au navigateur. À utiliser uniquement dans les Route Handlers et
 * Server Components.
 */
export async function getGitHubAccessToken(req?: Request): Promise<string | undefined> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return undefined;

  if (req) {
    const token = await getToken({ req: req as Parameters<typeof getToken>[0]["req"], secret });
    return token?.accessToken as string | undefined;
  }

  const h = await headers();
  const cookie = h.get("cookie") ?? "";
  const token = await getToken({
    secret,
    req: {
      headers: { cookie },
    } as Parameters<typeof getToken>[0]["req"],
  });
  return token?.accessToken as string | undefined;
}
