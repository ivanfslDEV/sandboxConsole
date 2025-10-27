import PageHeader from "../components/PageHeader";
import { Button, Form, Input, Table, Popconfirm } from "antd";
import { useState } from "react";

type KeyRow = { id: string; label: string; masked: string };

export default function ApiKeys() {
  const [data, setData] = useState<KeyRow[]>([
    { id: "1", label: "Server Key", masked: "sk_live_••••••••abcd" },
  ]);

  const columns = [
    { title: "Label", dataIndex: "label" },
    { title: "Key", dataIndex: "masked" },
    {
      title: "Actions",
      render: (_: unknown, row: KeyRow) => (
        <Popconfirm
          title="Delete key?"
          onConfirm={() => setData((d) => d.filter((x) => x.id !== row.id))}
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  const onCreate = (v: { label: string }) => {
    const id = String(Date.now());
    setData((d) => [
      { id, label: v.label, masked: "sk_live_••••••••" + id.slice(-4) },
      ...d,
    ]);
  };

  return (
    <>
      <PageHeader
        title="API Keys"
        subtitle="Create and manage your credentials"
      />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Form layout="vertical" onFinish={onCreate}>
            <Form.Item name="label" label="Label" rules={[{ required: true }]}>
              <Input placeholder="e.g., Backend service" />
            </Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Create Key
            </Button>
          </Form>
        </div>
        <div className="md:col-span-2">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
}
