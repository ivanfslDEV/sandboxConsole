import { Button, Tooltip, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function CodeSnippet({
  code,
}: {
  code: string;
  lang: "bash" | "javascript" | "python";
}) {
  const { t } = useTranslation("docs");
  const [loading, setLoading] = useState(false);
  const [msgApi, ctx] = message.useMessage();

  const onCopy = async () => {
    try {
      setLoading(true);
      await navigator.clipboard.writeText(code);
      msgApi.success(t("quickstart.copied"));
    } catch {
      msgApi.error(t("quickstart.copyError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {ctx}
      <pre className="p-4 bg-gray-900 text-gray-100 rounded-xl overflow-auto text-sm">
        <code>{code}</code>
      </pre>
      <div className="absolute top-2 right-2">
        <Tooltip title={t("quickstart.copy")}>
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={onCopy}
            loading={loading}
          >
            {t("quickstart.copy")}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
