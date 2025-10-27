import { Modal, Button } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type Reveal = { label: string; full: string } | null;

type Props = {
  reveal: Reveal;
  onClose: () => void;
  onCopy: (value: string) => void;
};

export default function RevealKeyModal({ reveal, onClose, onCopy }: Props) {
  const { t } = useTranslation(["keys"]);
  return (
    <Modal
      title={t("keys:yourNewKey")}
      open={!!reveal}
      onOk={onClose}
      onCancel={onClose}
      okText={t("keys:savedIt")}
    >
      {reveal && (
        <div className="space-y-2">
          <div className="text-sm">
            {t("keys:label")}: <b>{reveal.label}</b>
          </div>
          <div className="text-sm text-gray-500">{t("keys:copyNow")}</div>
          <div className="p-2 rounded bg-gray-100 flex items-center gap-2 break-all">
            <KeyOutlined />
            <code className="text-xs">{reveal.full}</code>
            <Button size="small" onClick={() => onCopy(reveal.full)}>
              {t("keys:copy")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
