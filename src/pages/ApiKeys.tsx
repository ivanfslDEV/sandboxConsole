import PageHeader from "../components/PageHeader";
import { useApiKeys } from "../features/keys/useApiKeys";
import type { ApiKeyRow } from "../features/keys/types";
import { Grid, Card, Typography, Modal, message } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import CreateKeyForm from "../components/keys/CreateKeyForm";
import KeysTable from "../components/keys/KeysTable";
import MobileKeyCard from "../components/keys/MobileKeyCard";
import RevealKeyModal from "../components/keys/RevealKeyModal";

const { useBreakpoint } = Grid;
const { Text } = Typography;

export default function ApiKeys() {
  const { t } = useTranslation(["keys"]);
  const { rows, create, revoke, regenerate, remove } = useApiKeys();
  const [creating, setCreating] = useState(false);
  const [reveal, setReveal] = useState<{ label: string; full: string } | null>(
    null
  );
  const [msg, ctx] = message.useMessage();
  const screens = useBreakpoint();
  const isDesktop = !!screens.md;

  const onCreate = async (label: string) => {
    setCreating(true);
    try {
      const { row, full } = create(label);
      setReveal({ label: row.label, full });
    } finally {
      setCreating(false);
    }
  };

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      msg.success(t("keys:copiedSuccess"));
    } catch {
      msg.error(t("keys:copiedFailed"));
    }
  };

  const doRegenerate = (id: string) => {
    const full = regenerate(id);
    Modal.success({
      title: t("keys:newKeyTitle"),
      content: (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">{t("keys:new")}</div>
          <div className="p-2 rounded bg-gray-100 flex items-center gap-2 break-all">
            <KeyOutlined />
            <code className="text-xs">{full}</code>
            <button className="ant-btn ant-btn-sm" onClick={() => onCopy(full)}>
              {t("keys:copy")}
            </button>
          </div>
        </div>
      ),
      okText: t("keys:done"),
    });
  };

  return (
    <>
      {ctx}
      <PageHeader title={t("keys:title")} subtitle={t("keys:description")} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <CreateKeyForm loading={creating} onCreate={onCreate} />
        </div>

        <div className="md:col-span-2">
          {isDesktop ? (
            <KeysTable
              rows={rows}
              onCopy={onCopy}
              onRegenerate={doRegenerate}
              onRevoke={revoke}
              onRemove={remove}
            />
          ) : (
            <div>
              {rows.length === 0 && (
                <Card className="rounded-2xl">
                  <Text type="secondary">{t("keys:empty")}</Text>
                </Card>
              )}
              {rows.map((r: ApiKeyRow) => (
                <MobileKeyCard
                  key={r.id}
                  row={r}
                  onCopy={onCopy}
                  onRegenerate={doRegenerate}
                  onRevoke={revoke}
                  onRemove={remove}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <RevealKeyModal
        reveal={reveal}
        onClose={() => setReveal(null)}
        onCopy={onCopy}
      />
    </>
  );
}
