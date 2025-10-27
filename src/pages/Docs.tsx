import PageHeader from "../components/PageHeader";
import { Card, Descriptions, Tabs, Typography } from "antd";
import { useTranslation } from "react-i18next";
import CodeSnippet from "../components/CodeSnippet";
import InlineTip from "../components/InlineTip";

const BASE_URL = "https://api.yourapp.dev/v1";
const ENDPOINT = "/echo"; // toy endpoint

export default function Docs() {
  const { t } = useTranslation("docs");

  // Strings localizadas usadas dentro do código de exemplo
  const sampleMsg = t("quickstart.sampleMessage"); // "hello"/"olá"
  const sampleKey = t("quickstart.sampleKeyPlaceholder"); // "sk_live_..."

  const buildCurl = (apiKey = sampleKey) =>
    `curl -X POST '${BASE_URL}${ENDPOINT}' \\
  -H 'Authorization: Bearer ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{"message":"${sampleMsg}"}'`;

  const buildNode = (apiKey = "process.env.YOUR_API_KEY") =>
    `import fetch from 'node-fetch'

const res = await fetch('${BASE_URL}${ENDPOINT}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message: '${sampleMsg}' })
})

if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
const data = await res.json()
console.log(data)`;

  const buildPython = (apiKey = 'os.environ["YOUR_API_KEY"]') =>
    `import os, requests

res = requests.post(
  '${BASE_URL}${ENDPOINT}',
  headers={
    'Authorization': f'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  json={ 'message': '${sampleMsg}' }
)

res.raise_for_status()
print(res.json())`;

  const items = [
    {
      key: "curl",
      label: t("quickstart.curl"),
      children: <CodeSnippet lang="bash" code={buildCurl()} />,
    },
    {
      key: "node",
      label: t("quickstart.node"),
      children: <CodeSnippet lang="javascript" code={buildNode()} />,
    },
    {
      key: "python",
      label: t("quickstart.python"),
      children: <CodeSnippet lang="python" code={buildPython()} />,
    },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <Card className="rounded-2xl">
        <Typography.Paragraph className="text-gray-600 mb-4">
          {t("quickstart.intro")}
        </Typography.Paragraph>

        <Descriptions
          size="small"
          column={{ xs: 1, sm: 1, md: 2 }}
          items={[
            {
              key: "base",
              label: t("quickstart.baseUrl"),
              children: <code>{BASE_URL}</code>,
            },
            {
              key: "ep",
              label: t("quickstart.endpoint"),
              children: <code>{ENDPOINT}</code>,
            },
          ]}
        />

        <div className="mt-4">
          <InlineTip />
        </div>

        <div className="mt-6">
          <Tabs items={items} size="large" tabBarGutter={8} />
        </div>
      </Card>
    </>
  );
}
