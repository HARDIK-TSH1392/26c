import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      const dbUser = user as typeof user & {
        onboarded: boolean;
        phone: string | null;
      };
      if (session.user) {
        session.user.id = dbUser.id;
        session.user.onboarded = dbUser.onboarded;
        session.user.phone = dbUser.phone;
      }
      return session;
    },
  },
};
