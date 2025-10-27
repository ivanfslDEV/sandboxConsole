// src/features/usage/UsageTable.tsx
import { Table, Tag } from "antd";
import type { UsageRow } from "../../features/usage/types";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function UsageTable({ data }: { data: UsageRow[] }) {
  const { t } = useTranslation("usage");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Quando os filtros mudam (data muda), volta para a página 1
  useEffect(() => {
    setPage(1);
  }, [data]);

  const columns = [
    { title: t("table.date"), dataIndex: "date" },
    { title: t("table.key"), dataIndex: "keyId" },
    { title: t("table.requests"), dataIndex: "requests" },
    {
      title: t("table.ok"),
      dataIndex: "status2xx",
      render: (v: number) => <Tag color="green">{v}</Tag>,
    },
    {
      title: t("table.warn"),
      dataIndex: "status4xx",
      render: (v: number) => <Tag color="orange">{v}</Tag>,
    },
    {
      title: t("table.err"),
      dataIndex: "status5xx",
      render: (v: number) => <Tag color="red">{v}</Tag>,
    },
  ];

  return (
    <Table
      rowKey={(r: UsageRow) => `${r.date}_${r.keyId}`}
      columns={columns}
      dataSource={data}
      size="small" // melhor em mobile
      pagination={{
        current: page,
        pageSize,
        total: data.length,
        responsive: true,
        showSizeChanger: true,
        pageSizeOptions: ["5", "8", "10", "20", "50"],
        onChange: (p, ps) => {
          setPage(p);
          setPageSize(ps);
        },
        showTotal: (total, [start, end]) =>
          t("table.total", { total, start, end }), // i18n
      }}
    />
  );
}
