import { Button, DatePicker, Select } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { UsageFilters as UF } from "../../features/usage/useUsageData";

const { RangePicker } = DatePicker;

export default function UsageFilters({
  keys,
  value,
  onChange,
}: {
  keys: string[];
  value: UF;
  onChange: (v: UF) => void;
}) {
  const { t } = useTranslation("usage");

  const rangeValue: [Dayjs, Dayjs] | null =
    value.start && value.end ? [dayjs(value.start), dayjs(value.end)] : null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="block text-xs text-gray-500 mb-1">
          {t("filters.range")}
        </label>
        <RangePicker
          className="w-full"
          value={rangeValue as any}
          onChange={(v) =>
            onChange({
              ...value,
              start: v?.[0]?.format("YYYY-MM-DD"),
              end: v?.[1]?.format("YYYY-MM-DD"),
            })
          }
          allowEmpty={[true, true]}
        />
      </div>

      <div className="flex-1">
        <label className="block text-xs text-gray-500 mb-1">
          {t("filters.key")}
        </label>
        <Select
          className="w-full"
          value={value.keyId ?? ""}
          onChange={(val) => onChange({ ...value, keyId: val || undefined })}
          options={[
            { value: "", label: t("filters.all") },
            ...keys.map((k) => ({ value: k, label: k })),
          ]}
        />
      </div>

      <Button className="sm:ml-2" onClick={() => onChange({})}>
        {t("filters.apply")}
      </Button>
    </div>
  );
}
