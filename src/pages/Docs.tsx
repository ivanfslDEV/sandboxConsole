import PageHeader from "../components/PageHeader";
import { Typography } from "antd";
const { Paragraph, Text, Title } = Typography;

export default function Docs() {
  return (
    <>
      <PageHeader title="Docs" subtitle="Quick start & references" />
      <div className="p-4 bg-gray-50 rounded-xl overflow-auto w-full">
        <Title level={4}>Quick Start</Title>
        <Paragraph>
          Install the SDK: <Text code>npm i @your/sdk</Text>
        </Paragraph>
        <Paragraph>
          Initialize:
          <pre className="p-4 bg-gray-50 rounded-xl overflow-auto">
            {`import { Client } from '@your/sdk'
const client = new Client({ apiKey: process.env.YOUR_API_KEY })`}
          </pre>
        </Paragraph>
      </div>
    </>
  );
}
