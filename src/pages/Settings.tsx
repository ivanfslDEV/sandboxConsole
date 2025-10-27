import PageHeader from "../components/PageHeader";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation(["settings"]);
  return (
    <>
      <PageHeader
        title={t("settings:title")}
        subtitle={t("settings:description")}
      />
      <div className="flex flex-col">
        <div className="text-md mb-2 font-semibold">
          {t("settings:form.language")}
        </div>
        <div className="">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
