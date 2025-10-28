import { Table, Tag, Space, Tooltip, Button, Popconfirm } from "antd";
import {
  CopyOutlined,
  ReloadOutlined,
  StopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ApiKeyRow } from "../../features/keys/types";
import { formatDate } from "../../features/keys/useApiKeys";
import { useTranslation } from "react-i18next";

type Props = {
  rows: ApiKeyRow[];
  onCopy: (value: string) => void;
  onRegenerate: (id: string) => void;
  onRevoke: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function KeysTable({
  rows,
  onCopy,
  onRegenerate,
  onRevoke,
  onRemove,
}: Props) {
  const { t } = useTranslation(["keys"]);

  const columns = [
    { title: t("keys:label"), dataIndex: "label", ellipsis: true },
    {
      title: t("keys:key"),
      dataIndex: "masked",
      render: (m: string) => <code className="text-xs">{m}</code>,
      ellipsis: true,
    },
    {
      title: t("keys:status"),
      dataIndex: "status",
      render: (s: ApiKeyRow["status"]) => (
        <Tag color={s === "active" ? "green" : "red"}>{s.toUpperCase()}</Tag>
      ),
      width: 120,
    },
    {
      title: t("keys:created"),
      dataIndex: "createdAt",
      render: (t0: number) => formatDate(t0),
      responsive: ["lg"] as const,
    },
    {
      title: t("keys:updated"),
      dataIndex: "updatedAt",
      render: (t0: number) => formatDate(t0),
      responsive: ["lg"] as const,
    },
    {
      title: t("keys:actions"),
      width: 320,
      render: (_: unknown, r: ApiKeyRow) => (
        <Space wrap>
          <Tooltip title={t("keys:actionCopy")}>
            <Button
              data-testid={`keys-copy-btn-${r.id}`}
              icon={<CopyOutlined />}
              onClick={() => onCopy(r.masked)}
            />
          </Tooltip>

          <Tooltip title={t("keys:actionRegenerate")}>
            <Button
              data-testid={`keys-regenerate-btn-${r.id}`}
              icon={<ReloadOutlined />}
              onClick={() => onRegenerate(r.id)}
            />
          </Tooltip>

          {r.status === "active" ? (
            <Popconfirm
              title={t("keys:actionRevoke")}
              okText={t("keys:revoke")}
              okButtonProps={
                {
                  danger: true,
                  // botão de confirmar dentro do Popconfirm:
                  "data-testid": `keys-revoke-confirm-${r.id}`,
                } as any
              }
            >
              <Button
                data-testid={`keys-revoke-btn-${r.id}`}
                danger
                icon={<StopOutlined />}
              >
                {t("keys:revoke")}
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title={t("keys:actionDelete")}
              okButtonProps={
                {
                  "data-testid": `keys-delete-confirm-${r.id}`,
                } as any
              }
              onConfirm={() => onRemove(r.id)}
            >
              <Button
                data-testid={`keys-delete-btn-${r.id}`}
                icon={<DeleteOutlined />}
              >
                {t("keys:delete")}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      data-testid="keys-table"
      size="middle"
      rowKey="id"
      columns={columns as any}
      dataSource={rows}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      scroll={{ x: 720 }}
    />
  );
}
