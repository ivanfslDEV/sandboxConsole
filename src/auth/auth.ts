export type AuthUser = { id: string; email: string; name: string };
export type AuthToken = { accessToken: string; exp: number; user: AuthUser };

const KEY = "auth_token_v1";

export function getToken(): AuthToken | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const t = JSON.parse(raw) as AuthToken;
    return t && !isExpired(t.exp) ? t : null;
  } catch {
    return null;
  }
}

export function isExpired(exp: number) {
  return Date.now() >= exp;
}

export function signInMock(email: string): AuthToken {
  const oneHour = 60 * 60 * 1000;
  const token: AuthToken = {
    accessToken: crypto.randomUUID(),
    exp: Date.now() + oneHour,
    user: { id: "u_" + crypto.randomUUID(), email, name: email.split("@")[0] },
  };
  localStorage.setItem(KEY, JSON.stringify(token));
  window.dispatchEvent(new StorageEvent("storage", { key: KEY })); // notify listeners (same tab)
  return token;
}

export function signOut() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
}
