import PageHeader from "../components/PageHeader";
import { Card, Result, Table } from "antd";
import { useTranslation } from "react-i18next";
import { useDashboard } from "../features/dashboard/useDashboard";
import KpiTile from "../components/dashboard/KpiTile";
import MiniArea from "../components/dashboard/MiniArea";
import StatusBars from "../components/dashboard/StatusBars";
import type { UsageRow } from "../features/usage/types";

export default function Dashboard() {
  const { t } = useTranslation("dashboard");
  const { loading, error, data, kpis, trend, breakdown, recent, reload } =
    useDashboard();

  if (loading) {
    return (
      <>
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
        <div className="grid grid-cols-1 gap-4">
          <Card className="rounded-2xl h-24 animate-pulse" />
          <Card className="rounded-2xl h-24 animate-pulse" />
          <Card className="rounded-2xl h-24 animate-pulse" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
        <Result
          status="error"
          title={error}
          subTitle={t("empty")}
          extra={
            <button className="btn" onClick={reload}>
              Retry
            </button>
          }
        />
      </>
    );
  }

  const isEmpty = data.length === 0;

  const columns = [
    { title: t("table.date"), dataIndex: "date" },
    { title: t("table.key"), dataIndex: "keyId" },
    { title: t("table.requests"), dataIndex: "requests" },
    { title: t("table.ok"), dataIndex: "status2xx" },
    { title: t("table.warn"), dataIndex: "status4xx" },
    { title: t("table.err"), dataIndex: "status5xx" },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {isEmpty ? (
        <Result status="info" title={t("empty")} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiTile
              title={t("tiles.requests24h")}
              value={kpis.req24h}
              extra={<MiniArea data={trend} dataKey="requests" />}
            />
            <KpiTile
              title={t("tiles.latencyP95")}
              value={kpis.p95}
              suffix={t("ms")}
            />
            <KpiTile title={t("tiles.errors24h")} value={kpis.err24h} />
          </div>

          {/* Status breakdown */}
          <Card className="rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold">
                {t("sections.statusBreakdown")}
              </h3>
            </div>
            <StatusBars
              ok={breakdown.ok}
              warn={breakdown.warn}
              err={breakdown.err}
            />
          </Card>

          {/* Traffic chart */}
          <Card className="rounded-2xl">
            <h3 className="text-base font-semibold mb-2">
              {t("sections.traffic")}
            </h3>
            <MiniArea data={trend} dataKey="requests" />
          </Card>

          {/* Recent activity table */}
          <Card className="rounded-2xl overflow-auto">
            <h3 className="text-base font-semibold mb-3">
              {t("sections.recent")}
            </h3>
            <Table<UsageRow>
              rowKey={(r) => `${r.date}_${r.keyId}`}
              size="small"
              columns={columns}
              dataSource={recent}
              pagination={false}
            />
          </Card>
        </div>
      )}
    </>
  );
}
