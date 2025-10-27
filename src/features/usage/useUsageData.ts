import { useEffect, useMemo, useState, useCallback } from "react";
import type { UsageRow } from "./types";

function parseCSV(text: string): UsageRow[] {
  const [header, ...lines] = text.trim().split("\n");
  const cols = header.split(",").map((s) => s.trim());
  return lines.map((line) => {
    const vals = line.split(",").map((s) => s.trim());
    const obj: any = {};
    cols.forEach((c, i) => (obj[c] = vals[i]));
    return {
      date: obj.date,
      keyId: obj.keyId,
      requests: Number(obj.requests),
      status2xx: Number(obj.status2xx),
      status4xx: Number(obj.status4xx),
      status5xx: Number(obj.status5xx),
    };
  });
}

export type UsageFilters = {
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD (inclusive)
  keyId?: string; // undefined = all
};

export function useUsageData(source: "json" | "csv" = "json") {
  const [raw, setRaw] = useState<UsageRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UsageFilters>({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const path = source === "json" ? "/data/usage.json" : "/data/usage.csv";
      const res = await fetch(path);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data =
        source === "json"
          ? ((await res.json()) as UsageRow[])
          : parseCSV(await res.text());
      setRaw(data);
    } catch (e: any) {
      setError(e?.message || "load_failed");
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    load();
  }, [load]);

  const keys = useMemo(() => {
    return Array.from(new Set((raw ?? []).map((r) => r.keyId)));
  }, [raw]);

  const data = useMemo(() => {
    if (!raw) return [];
    return raw
      .filter((r) => {
        const okKey = !filters.keyId || r.keyId === filters.keyId;
        const okStart = !filters.start || r.date >= filters.start;
        const okEnd = !filters.end || r.date <= filters.end;
        return okKey && okStart && okEnd;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [raw, filters]);

  return { loading, error, data, keys, filters, setFilters, reload: load };
}
