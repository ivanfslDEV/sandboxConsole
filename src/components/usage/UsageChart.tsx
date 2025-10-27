import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { UsageRow } from "../../features/usage/types";
import { useTranslation } from "react-i18next";

export default function UsageChart({ data }: { data: UsageRow[] }) {
  const { t } = useTranslation("usage");
  return (
    <div className="h-64 sm:h-80 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="req" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopOpacity={0.4} />
              <stop offset="100%" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(v: any) => [v, t("chart.requests")]} />
          <Area
            type="monotone"
            dataKey="requests"
            strokeOpacity={1}
            fill="url(#req)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
