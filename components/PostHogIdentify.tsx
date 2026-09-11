"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";

// Links anonymous pre-login activity to a real person once they sign in, so
// "where did this customer go before checking out" is answerable — not just
// anonymous traffic counts.
export default function PostHogIdentify() {
  const { data: session, status } = useSession();
  const identifiedId = useRef<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    if (status === "authenticated" && session?.user?.id) {
      if (identifiedId.current !== session.user.id) {
        posthog.identify(session.user.id, {
          email: session.user.email ?? undefined,
          name: session.user.name ?? undefined,
        });
        identifiedId.current = session.user.id;
      }
    } else if (status === "unauthenticated" && identifiedId.current) {
      posthog.reset();
      identifiedId.current = null;
    }
  }, [status, session]);

  return null;
}
