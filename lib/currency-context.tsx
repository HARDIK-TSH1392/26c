"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CurrencyState = { isIndia: boolean };

// Defaults to India/INR on both server and first client render (no
// hydration mismatch), then flips after mount if the browser's own
// timezone doesn't look like India. This is a browsing-convenience signal
// only — the real, binding charge is always INR at checkout regardless.
const CurrencyContext = createContext<CurrencyState>({ isIndia: true });

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [isIndia, setIsIndia] = useState(true);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setIsIndia(tz === "Asia/Kolkata");
    } catch {
      setIsIndia(true);
    }
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
