"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  isGreenLeavesSaleActive,
  secondsRemainingInSale,
} from "@/lib/green-leaves-sale";

type GreenLeavesState = {
  active: boolean;
  secondsRemaining: number;
};

const GreenLeavesContext = createContext<GreenLeavesState>({
  active: false,
  secondsRemaining: 0,
});

export function GreenLeavesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<GreenLeavesState>({
    active: false,
    secondsRemaining: 0,
  });

  useEffect(() => {
    const tick = () =>
      setState({
        active: isGreenLeavesSaleActive(),
        secondsRemaining: secondsRemainingInSale(),
      });
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <GreenLeavesContext.Provider value={state}>
      {children}
    </GreenLeavesContext.Provider>
  );
}

export function useGreenLeavesSale() {
  return useContext(GreenLeavesContext);
}
