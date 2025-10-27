import { Select } from "antd";
import { useTranslation } from "react-i18next";

const options = [
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
  { value: "fr", label: "Français" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <Select
      size="large"
      value={i18n.language.split("-")[0]}
      onChange={(lng) => i18n.changeLanguage(lng)}
      options={options}
      style={{ width: "100%" }}
    />
  );
}
