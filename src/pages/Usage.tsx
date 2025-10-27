import PageHeader from "../components/PageHeader";
import { Table, Tag } from "antd";

export default function Usage() {
  const data = [
    { date: "2025-10-20", requests: 4300, status: "ok" },
    { date: "2025-10-21", requests: 5120, status: "ok" },
    { date: "2025-10-22", requests: 4800, status: "warn" },
  ];
  const columns = [
    { title: "Date", dataIndex: "date" },
    { title: "Requests", dataIndex: "requests" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <Tag color={s === "ok" ? "green" : "orange"}>{s.toUpperCase()}</Tag>
      ),
    },
  ];
  return (
    <>
      <PageHeader title="Usage" subtitle="Daily request volumes and status" />
      <Table
        rowKey="date"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </>
  );
}
