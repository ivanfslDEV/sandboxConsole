import { useCallback, useState } from "react";
import type { ApiKeyRow } from "./types";
import { loadKeys, saveKeys, generateFullKey, maskKey } from "./storage";

export function useApiKeys() {
  const [rows, setRows] = useState<ApiKeyRow[]>(() => loadKeys());

  const persist = useCallback(
    (next: ApiKeyRow[] | ((r: ApiKeyRow[]) => ApiKeyRow[])) => {
      setRows((prev) => {
        const resolved =
          typeof next === "function" ? (next as any)(prev) : next;
        saveKeys(resolved);
        return resolved;
      });
    },
    []
  );

  const create = useCallback(
    (label: string) => {
      const full = generateFullKey();
      const now = Date.now();
      const row: ApiKeyRow = {
        id: crypto.randomUUID(),
        label,
        createdAt: now,
        updatedAt: now,
        status: "active",
        masked: maskKey(full),
      };
      persist((prev) => [row, ...prev]);
      // return the full key ONLY NOW (caller must show & allow copy)
      return { row, full };
    },
    [persist]
  );

  const revoke = useCallback(
    (id: string) => {
      persist((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "revoked", updatedAt: Date.now() } : r
        )
      );
    },
    [persist]
  );

  const regenerate = useCallback(
    (id: string) => {
      const full = generateFullKey();
      const masked = maskKey(full);
      persist((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, masked, status: "active", updatedAt: Date.now() }
            : r
        )
      );
      return full; // show once
    },
    [persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist((prev) => prev.filter((r) => r.id !== id));
    },
    [persist]
  );

  return { rows, create, revoke, regenerate, remove };
}

export function formatDate(ts: number, locale = navigator.language) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(ts);
}
