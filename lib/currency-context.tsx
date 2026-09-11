"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CurrencyState = { isIndia: boolean };

// Defaults to India/INR on both server and first client render (no
// hydration mismatch), then updates after a same-origin lookup against
// /api/geo — the actual visitor's IP, resolved server-side, not a guess
// based on the browser's own (often wrong/misconfigured) timezone setting.
// This is a browsing-convenience signal only — the real, binding charge is
// always INR at checkout regardless.
const CurrencyContext = createContext<CurrencyState>({ isIndia: true });

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [isIndia, setIsIndia] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && typeof d.isIndia === "boolean") setIsIndia(d.isIndia);
      })
      .catch(() => {
        // network hiccup — stay on the India/INR default, the safe choice
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CurrencyContext.Provider value={{ isIndia }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
