import NextAuth from "next-auth";
import type { DefaultJWT } from "@auth/core/jwt";
import type { Session as NextAuthSession } from "next-auth";
import type { Account } from "@auth/core/types";
import AzureADB2C from "next-auth/providers/azure-ad-b2c";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
    expires: string;
  }
}

export const config = {
  providers: [
    AzureADB2C({
      clientId: process.env.AZURE_CLIENT_ID!,
      clientSecret: process.env.AZURE_CLIENT_SECRET!,
      issuer: `https://${process.env.AZURE_TENANT_NAME}.b2clogin.com/${process.env.AZURE_TENANT_ID}/v2.0/`,
      authorization: {
        params: {
          scope: "offline_access openid",
          p: process.env.AZURE_POLICY_NAME,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: DefaultJWT; account: Account | null }) {
      if (account?.access_token) {
        (token as DefaultJWT & { accessToken: string }).accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: NextAuthSession; token: DefaultJWT }) {
      const typedToken = token as DefaultJWT & { accessToken?: string };
      if (typedToken.accessToken) {
        session.accessToken = typedToken.accessToken;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
