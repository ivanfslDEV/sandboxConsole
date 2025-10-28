import enUS from "antd/locale/en_US";
import ptPT from "antd/locale/pt_PT";
import frFR from "antd/locale/fr_FR";
import dayjs from "dayjs";
import "dayjs/locale/pt";
import "dayjs/locale/en";

export function getAntdLocale(lng: string) {
  const base = lng.split("-")[0];
  switch (base) {
    case "pt":
      dayjs.locale("pt");
      return ptPT;
    case "fr":
      dayjs.locale("fr");
      return frFR;
    default:
      dayjs.locale("en");
      return enUS;
  }
}
