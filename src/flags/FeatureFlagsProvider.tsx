import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { FeatureFlags, Brand, Radius } from "./types";

const KEY = "feature_flags_v1";

const DEFAULT_FLAGS: FeatureFlags = {
  compact: false,
  brand: "emerald",
  radius: "lg",
};

type Ctx = {
  flags: FeatureFlags;
  setCompact: (v: boolean) => void;
  setBrand: (v: Brand) => void;
  setRadius: (v: Radius) => void;
};
const FlagsCtx = createContext<Ctx>({
  flags: DEFAULT_FLAGS,
  setCompact: () => {},
  setBrand: () => {},
  setRadius: () => {},
});

export function FeatureFlagsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    try {
      return {
        ...DEFAULT_FLAGS,
        ...JSON.parse(localStorage.getItem(KEY) || "{}"),
      };
    } catch {
      return DEFAULT_FLAGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(flags));
  }, [flags]);

  const api = useMemo<Ctx>(
    () => ({
      flags,
      setCompact: (v) => setFlags((f) => ({ ...f, compact: v })),
      setBrand: (v) => setFlags((f) => ({ ...f, brand: v })),
      setRadius: (v) => setFlags((f) => ({ ...f, radius: v })),
    }),
    [flags]
  );

  return <FlagsCtx.Provider value={api}>{children}</FlagsCtx.Provider>;
}

export const useFeatureFlags = () => useContext(FlagsCtx);
