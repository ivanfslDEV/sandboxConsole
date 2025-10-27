import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function MiniArea({
  data,
  dataKey,
}: {
  data: any[];
  dataKey: string;
}) {
  return (
    <div className="h-28">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={dataKey}
            strokeOpacity={1}
            fillOpacity={0.1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
