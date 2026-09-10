import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Best-effort: Google's default OAuth scopes don't include birthday. This
// requires the extra `user.birthday.read` scope (requested below) AND the
// user to actually have a birthday set & shared on their Google account —
// many won't, so this can silently find nothing. That's fine, the onboarding
// dialog asks for DOB directly as a fallback.
async function fetchGoogleBirthday(accessToken: string): Promise<Date | null> {
  try {
    const res = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=birthdays",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const bday = data?.birthdays?.[0]?.date;
    if (!bday?.year || !bday?.month || !bday?.day) return null;
    return new Date(Date.UTC(bday.year, bday.month - 1, bday.day));
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/user.birthday.read",
        },
      },
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
  events: {
    async linkAccount({ user, account }) {
      if (!account.access_token) return;
      const dob = await fetchGoogleBirthday(account.access_token);
      if (dob) {
        await prisma.user.update({
          where: { id: user.id },
          data: { dob },
        });
      }
    },
  },
};
