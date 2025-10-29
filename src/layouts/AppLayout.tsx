import { useMemo, useState, useEffect } from "react";
import { Layout, Menu, Grid, Drawer, Button, Avatar, Dropdown } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  KeyOutlined,
  BarChartOutlined,
  BookOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useTranslation } from "react-i18next";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function AppLayout() {
  const { pathname } = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const { token } = useAuth();

  const { t, i18n } = useTranslation(["common", "dashboard"]);

  const items = useMemo(
    () => [
      {
        key: "/",
        icon: <DashboardOutlined />,
        label: <Link to="/">{t("nav.dashboard")}</Link>,
      },
      {
        key: "/api-keys",
        icon: <KeyOutlined />,
        label: <Link to="/api-keys">{t("nav.apiKeys")}</Link>,
      },
      {
        key: "/usage",
        icon: <BarChartOutlined />,
        label: <Link to="/usage">{t("nav.usage")}</Link>,
      },
      {
        key: "/docs",
        icon: <BookOutlined />,
        label: <Link to="/docs">{t("nav.docs")}</Link>,
      },
      {
        key: "/settings",
        icon: <SettingOutlined />,
        label: <Link to="/settings">{t("nav.settings")}</Link>,
      },
    ],
    [i18n.language, t]
  );

  // desktop sidebar state
  const [collapsed, setCollapsed] = useState(true);
  // mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) setDrawerOpen(false); // close drawer when going to desktop
  }, [isMobile]);

  const selectedKey = useMemo(() => {
    const match = items
      .map((i) => i.key)
      .sort((a, b) => b.length - a.length)
      .find((k) => pathname === k || pathname.startsWith(`${k}/`));
    return match ?? "/";
  }, [pathname]);

  const MenuContent = (
    <>
      <div className="h-16 flex items-center justify-center text-white font-semibold text-lg">
        {isMobile ? "ZAMA" : collapsed ? "ZAMA" : "ZAMA Sandbox"}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        onClick={() => isMobile && setDrawerOpen(false)} // close on navigate (mobile)
      />
    </>
  );

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider
          width={220}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          {MenuContent}
        </Sider>
      )}

      <Layout>
        <Header
          className="!text-white flex items-center justify-between gap-3 shadow-sm"
          style={isMobile ? { paddingInline: 8 } : undefined}
        >
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                type="text"
                aria-label="Open menu"
                icon={<MenuOutlined style={{ fontSize: 20 }} />}
                onClick={() => setDrawerOpen(true)}
                className="!text-white"
              />
            )}
            <div className="text-xl font-semibold">{t("controlPanel")}</div>
          </div>

          {/* Right side: user dropdown */}
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "email",
                  label: (
                    <span className="text-gray-500">{token?.user.email}</span>
                  ),
                  disabled: true,
                },
                { type: "divider" as const },
                { key: "signout", label: <Link to="/signout">Sign out</Link> },
              ],
            }}
            className="!bg-blue-500 md:h-10"
          >
            <button
              className="flex items-center gap-2 rounded-full"
              aria-label="Account"
            >
              <Avatar size="small">
                {(
                  token?.user.name?.[0] ||
                  token?.user.email?.[0] ||
                  "?"
                ).toUpperCase()}
              </Avatar>
              <span className="hidden md:inline">
                {token?.user.name || "Account"}
              </span>
            </button>
          </Dropdown>
        </Header>
        <Content style={{ padding: 24, minWidth: 0 }}>
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-sm p-6 w-full">
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>

      {isMobile && (
        <Drawer
          placement="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={220}
          zIndex={2000}
          maskClosable
          getContainer={() => document.body} // ensure top-level portal
          styles={{
            mask: { backdropFilter: "blur(2px)" },
            body: { padding: 0, background: "#001529" },
            header: { display: "none" }, // matches Ant dark sider
          }}
        >
          {MenuContent}
        </Drawer>
      )}
    </Layout>
  );
}
