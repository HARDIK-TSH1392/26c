"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

// Autocapture (clicks, form submits, etc.) and session recording are both
// on by default once initialized — no per-element tracking code needed to
// see "where people went and clicked."
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2026-05-30", // matches the config chosen in the PostHog onboarding wizard (autocapture, heatmaps, web vitals)
    person_profiles: "identified_only",
    capture_pageview: false, // handled manually below for App Router route changes
    capture_pageleave: true,
  });
}

function PageviewTracker() {
  const posthogClient = usePostHog();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || !posthogClient) return;
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    posthogClient.capture("$pageview", { $current_url: window.location.origin + url });
  }, [pathname, searchParams, posthogClient]);

  return null;
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
