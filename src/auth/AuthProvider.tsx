import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type AuthToken, getToken, signOut } from "./auth";

type AuthCtx = {
  token: AuthToken | null;
  isAuthed: boolean;
};
const Ctx = createContext<AuthCtx>({ token: null, isAuthed: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<AuthToken | null>(() => getToken());

  // Keep state in sync if storage changes (even in same tab — we fire an event)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth_token_v1") setToken(getToken());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Auto signout when exp hits
  useEffect(() => {
    if (!token) return;
    const ms = Math.max(0, token.exp - Date.now());
    const t = setTimeout(() => signOut(), ms);
    return () => clearTimeout(t);
  }, [token]);

  const value = useMemo(() => ({ token, isAuthed: !!token }), [token]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
