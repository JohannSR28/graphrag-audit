import { withAuth } from "next-auth/middleware";

// Utilise withAuth pour garantir que l'export est bien une fonction reconnue par Next.js
export default withAuth({
  pages: {
    signIn: "/", // Redirige vers l'accueil si non connecté
  },
});

export const config = { 
  // Protège toutes les routes sous /dashboard et /audit
  matcher: ["/dashboard/:path*", "/audit/:path*"] 
};