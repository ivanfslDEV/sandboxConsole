import { Progress } from "antd";

export default function StatusBars({
  ok,
  warn,
  err,
}: {
  ok: number;
  warn: number;
  err: number;
}) {
  const total = Math.max(1, ok + warn + err);
  const pOk = Math.round((ok * 100) / total);
  const pWarn = Math.round((warn * 100) / total);
  const pErr = 100 - pOk - pWarn;
  return (
    <div className="flex gap-2 items-center">
      <Progress percent={pOk} showInfo={false} size="small" />
      <Progress
        percent={pWarn}
        showInfo={false}
        size="small"
        status="exception"
      />
      <Progress percent={pErr} showInfo={false} size="small" type="line" />
    </div>
  );
}
