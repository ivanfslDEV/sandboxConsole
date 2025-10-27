import { Card, Statistic, Tooltip } from "antd";
import type { ReactNode } from "react";

export default function KpiTile({
  title,
  value,
  suffix,
  extra,
}: {
  title: string;
  value: number | string;
  suffix?: string;
  extra?: ReactNode;
}) {
  return (
    <Card className="rounded-2xl">
      <div className="flex items-start justify-between">
        <Statistic title={title} value={value} suffix={suffix} />
        {extra ? <Tooltip title={title}>{extra}</Tooltip> : null}
      </div>
    </Card>
  );
}
