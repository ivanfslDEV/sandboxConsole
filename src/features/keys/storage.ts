import type { ApiKeyRow } from "./types";

const LS_KEY = "api_keys_v1";

export function loadKeys(): ApiKeyRow[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]") as ApiKeyRow[];
  } catch {
    return [];
  }
}
export function saveKeys(rows: ApiKeyRow[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows));
}

// util: “sk_live_” + 32 hex
export function generateFullKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `sk_live_${hex}`;
}
export function maskKey(full: string): string {
  return full.slice(0, 10) + "••••••••" + full.slice(-4);
}
