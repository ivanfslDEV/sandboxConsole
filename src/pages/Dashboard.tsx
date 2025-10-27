import PageHeader from "../components/PageHeader";
import { Card, Statistic } from "antd";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation(["dashboard"]);
  return (
    <>
      <PageHeader
        title={t("dashboard:title")}
        subtitle={t("dashboard:subtitle")}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <Statistic title={t("dashboard:requests24h")} value={12840} />
        </Card>
        <Card className="rounded-2xl">
          <Statistic
            title={t("dashboard:latencyP95")}
            value={142}
            suffix={t("dashboard:ms")}
          />
        </Card>
        <Card className="rounded-2xl">
          <Statistic title={t("dashboard:errors")} value={3} />
        </Card>
      </div>
    </>
  );
}
