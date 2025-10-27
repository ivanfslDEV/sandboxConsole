import PageHeader from "../components/PageHeader";
import { Result, Button, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import UsageFilters from "../components/usage/UsageFilters";
import UsageChart from "../components/usage/UsageChart";
import UsageTable from "../components/usage/UsageTable";
import { useUsageData } from "../features/usage/useUsageData";

export default function Usage() {
  const { t } = useTranslation("usage");
  const { loading, error, data, keys, filters, setFilters, reload } =
    useUsageData("json"); // or 'csv'

  if (loading) {
    return (
      <>
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
        <Skeleton active />
        <div className="mt-4">
          <Skeleton active />
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
          title={t("error.title")}
          extra={<Button onClick={reload}>{t("error.retry")}</Button>}
        />
      </>
    );
  }

  const isEmpty = data.length === 0;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mb-4">
        <UsageFilters keys={keys} value={filters} onChange={setFilters} />
      </div>

      {isEmpty ? (
        <Result
          status="info"
          title={t("empty.title")}
          subTitle={t("empty.desc")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-2xl p-4">
            <UsageChart data={data} />
          </div>
          <div className="bg-white rounded-2xl p-4 overflow-auto">
            <UsageTable data={data} />
          </div>
        </div>
      )}
    </>
  );
}
