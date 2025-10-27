import { useMemo } from "react";
import { useUsageData } from "../usage/useUsageData";
import type { UsageRow } from "../usage/types";

// crude latency mock per day — replace with real metric when available
const mockLatencyP95 = (rows: UsageRow[]) => {
  if (!rows.length) return 0;
  // pretend latency inversely correlates with 2xx ratio
  const last = rows[rows.length - 1];
  const ratio = last.status2xx / Math.max(1, last.requests);
  return Math.round(80 + (1 - ratio) * 140); // 80–220ms range
};

export function useDashboard() {
  // load JSON by default; switch to 'csv' if you prefer
  const usage = useUsageData("json");

  const trend = useMemo(
    () => usage.data.map((d) => ({ date: d.date, requests: d.requests })),
    [usage.data]
  );

  const kpis = useMemo(() => {
    if (!usage.data.length) return { req24h: 0, err24h: 0, p95: 0 };
    const lastDate = usage.data[usage.data.length - 1].date;
    const lastDay = usage.data.filter((d) => d.date === lastDate);
    const req24h = lastDay.reduce((s, r) => s + r.requests, 0);
    const err24h = lastDay.reduce((s, r) => s + r.status5xx, 0);
    const p95 = mockLatencyP95(lastDay);
    return { req24h, err24h, p95 };
  }, [usage.data]);

  const breakdown = useMemo(() => {
    const ok = usage.data.reduce((s, r) => s + r.status2xx, 0);
    const warn = usage.data.reduce((s, r) => s + r.status4xx, 0);
    const err = usage.data.reduce((s, r) => s + r.status5xx, 0);
    return { ok, warn, err };
  }, [usage.data]);

  const recent = useMemo(() => {
    const grouped: Record<
      string,
      {
        date: string;
        requests: number;
        status2xx: number;
        status4xx: number;
        status5xx: number;
        keyId: string;
      }[]
    > = {};
    for (const r of usage.data) {
      const key = `${r.date}_${r.keyId}`;
      grouped[key] = [{ ...r, keyId: r.keyId }];
    }
    // flatten & take last 6 rows by date then key
    const rows = Object.values(grouped).map((g) => g[0]);
    rows.sort(
      (a, b) => a.date.localeCompare(b.date) || a.keyId.localeCompare(b.keyId)
    );
    return rows.slice(-6);
  }, [usage.data]);

  return { ...usage, kpis, trend, breakdown, recent };
}
