import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: 'admin' | 'user';
    }
  }
}

const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@example.com'];

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.OAUTH_GITHUB_ID ?? '',
      clientSecret: process.env.OAUTH_GITHUB_SECRET ?? '',
    }),
  ],
  callbacks: {
    // @ts-ignore
    async jwt(params) {
      if (params.user?.email) {
        params.token.role = adminEmails.includes(params.user.email) ? 'admin' : 'user';
      }
      return params.token;
    },
    // @ts-ignore
    async session(params) {
      if (params.session.user) {
        params.session.user.role = params.token.role;
      }
      return params.session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};
