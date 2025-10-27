import { Alert } from "antd";
import { useTranslation } from "react-i18next";

export default function InlineTip() {
  const { t } = useTranslation("docs");
  return (
    <Alert
      type="info"
      showIcon
      message={t("quickstart.tipTitle")}
      description={t("quickstart.tipBody")}
      className="rounded-xl"
    />
  );
}
