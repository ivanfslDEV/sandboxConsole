import { Card, Button, Dropdown, Modal, Tag, Typography } from "antd";
import {
  CopyOutlined,
  ReloadOutlined,
  StopOutlined,
  DeleteOutlined,
  MoreOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import type { ApiKeyRow } from "../../features/keys/types";
import { formatDate } from "../../features/keys/useApiKeys";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

type Props = {
  row: ApiKeyRow;
  onCopy: (value: string) => void;
  onRegenerate: (id: string) => void;
  onRevoke: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function MobileKeyCard({
  row: r,
  onCopy,
  onRegenerate,
  onRevoke,
  onRemove,
}: Props) {
  const { t } = useTranslation(["keys"]);

  const menuItems = [
    {
      key: "copy",
      label: t("keys:copyMasked"),
      icon: <CopyOutlined />,
      onClick: () => onCopy(r.masked),
    },
    {
      key: "regen",
      label: t("keys:regenerate"),
      icon: <ReloadOutlined />,
      onClick: () => onRegenerate(r.id),
    },
    r.status === "active"
      ? {
          key: "revoke",
          label: <span className="text-red-600">{t("keys:revoke")}</span>,
          icon: <StopOutlined />,
          onClick: () =>
            Modal.confirm({
              title: t("keys:actionRevoke"),
              okText: t("keys:revoke"),
              okButtonProps: { danger: true },
              onOk: () => onRevoke(r.id),
            }),
        }
      : {
          key: "delete",
          label: t("keys:delete"),
          icon: <DeleteOutlined />,
          onClick: () =>
            Modal.confirm({
              title: t("keys:actionDelete"),
              onOk: () => onRemove(r.id),
            }),
        },
  ];

  return (
    <Card className="rounded-2xl mb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium truncate">{r.label}</div>
          <div className="text-xs text-gray-500">
            {t("keys:created")} {formatDate(r.createdAt)}
          </div>
        </div>
        <Dropdown menu={{ items: menuItems }}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>

      <div className="mt-3">
        <Text type="secondary" className="text-xs">
          {t("keys:key")}
        </Text>
        <div className="p-2 rounded bg-gray-50 flex items-center gap-2 break-all">
          <KeyOutlined />
          <code className="text-xs">{r.masked}</code>
          <Button
            size="small"
            onClick={() => onCopy(r.masked)}
            icon={<CopyOutlined />}
          >
            {t("keys:copy")}
          </Button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <Text type="secondary" className="text-xs">
            {t("keys:status")}
          </Text>
          <div>
            <Tag color={r.status === "active" ? "green" : "red"}>
              {r.status.toUpperCase()}
            </Tag>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {t("keys:updated")} {formatDate(r.updatedAt)}
        </div>
      </div>
    </Card>
  );
}
