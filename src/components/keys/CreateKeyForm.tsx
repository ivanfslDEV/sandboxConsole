import { Button, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type Props = {
  loading?: boolean;
  onCreate: (label: string) => void;
};

export default function CreateKeyForm({ loading, onCreate }: Props) {
  const { t } = useTranslation(["keys"]);
  return (
    <Form
      layout="vertical"
      onFinish={(v: { label: string }) => onCreate(v.label.trim())}
    >
      <Form.Item
        name="label"
        label={t("keys:label")}
        rules={[{ required: true, message: t("keys:labelRequired") }]}
      >
        <Input
          data-testid="keys-label-input"
          placeholder="e.g., Backend service"
        />
      </Form.Item>
      <Button
        data-testid="keys-create-btn"
        type="primary"
        htmlType="submit"
        loading={loading}
        icon={<PlusOutlined />}
        className="w-full"
      >
        {t("keys:createKey")}
      </Button>
      <p className="text-xs text-gray-500 mt-3">
        {t("keys:createKeyDescription")}
      </p>
    </Form>
  );
}
