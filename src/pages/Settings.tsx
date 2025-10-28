import PageHeader from "../components/PageHeader";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useFeatureFlags } from "../flags/FeatureFlagsProvider";
import { useTranslation } from "react-i18next";
import {
  Card,
  Segmented,
  Switch,
  Tooltip,
  Typography,
  Divider,
  Space,
  Button,
  Tag,
  Input,
  theme,
} from "antd";
import {
  InfoCircleOutlined,
  BgColorsOutlined,
  CompressOutlined,
  GlobalOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useMemo } from "react";

const { Text } = Typography;

export default function Settings() {
  const { t } = useTranslation(["settings"]);
  const { flags, setCompact, setBrand } = useFeatureFlags();
  const { token } = theme.useToken();

  const BrandDot = ({ color }: { color: string }) => (
    <span
      aria-hidden
      className="inline-block h-3 w-3 rounded-full"
      style={{ backgroundColor: color }}
    />
  );

  const brandOptions = useMemo(
    () => [
      {
        label: (
          <Space size={6}>
            <BrandDot color="#10b981" />
            <span>{t("brands.emerald")}</span>
          </Space>
        ),
        value: "emerald",
      },
      {
        label: (
          <Space size={6}>
            <BrandDot color="#6366f1" />
            <span>{t("brands.indigo")}</span>
          </Space>
        ),
        value: "indigo",
      },
    ],
    [t]
  );

  return (
    <>
      <PageHeader
        title={t("settings:title")}
        subtitle={t("settings:description")}
      />

      {/* Language */}
      <Card className="rounded-2xl mb-4" bodyStyle={{ padding: 16 }}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Space align="center">
            <GlobalOutlined />
            <div className="font-medium">{t("settings:form.language")}</div>
            <Tooltip title={t("settings:form.language")}>
              <InfoCircleOutlined className="text-gray-400" />
            </Tooltip>
          </Space>
          <LanguageSwitcher />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 mt-4">
        {/* Compact density */}
        <Card className="rounded-2xl" bodyStyle={{ padding: 16 }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Space align="center">
                <CompressOutlined />
                <div className="font-medium">{t("toggles.compact")}</div>
                <Tooltip title={t("toggles.compact")}>
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </Space>
              <Text type="secondary" className="block mt-1 text-sm">
                {t("settings:hint.compact", {
                  defaultValue:
                    "Reduces paddings and table row height for dense admin views.",
                })}
              </Text>
            </div>
            <Switch
              aria-label={t("toggles.compact")}
              checked={flags.compact}
              onChange={setCompact}
            />
          </div>
        </Card>

        {/* Brand color */}
        <Card className="rounded-2xl" bodyStyle={{ padding: 16 }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Space align="center">
                <BgColorsOutlined />
                <div className="font-medium">{t("toggles.brand")}</div>
                <Tooltip
                  title={t("settings:hint.brand", {
                    defaultValue:
                      "Switch the primary color token used across buttons and links.",
                  })}
                >
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </Space>
              <Text type="secondary" className="block mt-1 text-sm">
                {t("settings:hint.brandNote", {
                  defaultValue:
                    "Applied instantly via Ant Design theme tokens.",
                })}
              </Text>
            </div>

            <Segmented
              aria-label={t("toggles.brand")}
              value={flags.brand}
              onChange={(v) => setBrand(v as any)}
              options={brandOptions}
            />
          </div>
        </Card>

        {/* Live preview */}
        <Card className="rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="text-base font-semibold">
              {t("settings:preview.title", { defaultValue: "Live preview" })}
            </div>
            <Tag
              icon={<CheckCircleFilled />}
              color="success"
              className="rounded-full"
            >
              {t("settings:preview.appliesInstantly", {
                defaultValue: "Applies instantly",
              })}
            </Tag>
          </div>
          <Text type="secondary" className="text-sm">
            {t("settings:preview.desc", {
              defaultValue:
                "This preview reflects the current brand color and density.",
            })}
          </Text>

          <Divider className="my-4" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-3">
              <Space wrap>
                <Button type="primary">
                  {t("settings:preview.primary", { defaultValue: "Primary" })}
                </Button>
                <Button>
                  {t("settings:preview.default", { defaultValue: "Default" })}
                </Button>
                <Button type="dashed">
                  {t("settings:preview.dashed", { defaultValue: "Dashed" })}
                </Button>
                <Button danger>
                  {t("settings:preview.danger", { defaultValue: "Danger" })}
                </Button>
              </Space>
              <Input
                placeholder={t("settings:preview.input", {
                  defaultValue: "Input example",
                })}
              />
              <Space size="small">
                <Tag color={token.colorPrimary}>
                  {t("settings:preview.tagPrimary", {
                    defaultValue: "Primary tag",
                  })}
                </Tag>
                <Tag color="green">
                  {t("settings:preview.tagOk", { defaultValue: "OK" })}
                </Tag>
                <Tag color="orange">
                  {t("settings:preview.tagWarn", { defaultValue: "Warn" })}
                </Tag>
              </Space>
            </div>

            <div
              className="rounded-2xl border p-3"
              style={{ borderColor: token.colorBorder }}
            >
              <div className="font-medium mb-2">
                {t("settings:preview.cardTitle", {
                  defaultValue: "Card sample",
                })}
              </div>
              <Text type="secondary" className="text-sm">
                {t("settings:preview.cardText", {
                  defaultValue:
                    "Notice radius & spacing respond to your settings.",
                })}
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
