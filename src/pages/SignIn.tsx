import { Button, Card, Form, Input, Typography, Alert } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInMock } from "../auth/auth";

export default function SignIn() {
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc.state?.from?.pathname ?? "/";

  const onFinish = (v: { email: string; password: string }) => {
    try {
      // password is ignored in the mock
      signInMock(v.email);
      nav(from, { replace: true });
    } catch (e) {
      setErr("Failed to sign in (mock).");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-2xl">
        <Typography.Title level={3} style={{ marginBottom: 8 }}>
          Sign in
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Use any email — token is mocked and expires in 1 hour.
        </Typography.Paragraph>
        {err && (
          <Alert type="error" message={err} style={{ marginBottom: 12 }} />
        )}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input
              data-testid="signin-email"
              placeholder="you@example.com"
              autoFocus
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password
              data-testid="signin-password"
              placeholder="••••••••"
            />
          </Form.Item>
          <Button
            data-testid="signin-submit"
            type="primary"
            htmlType="submit"
            block
          >
            Continue
          </Button>
        </Form>
      </Card>
    </div>
  );
}
