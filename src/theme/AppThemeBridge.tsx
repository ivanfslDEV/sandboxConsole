import { ConfigProvider, theme } from "antd";
import { type PropsWithChildren, useEffect } from "react";
import { useFeatureFlags } from "../flags/FeatureFlagsProvider";

const emerald = {
  primary: "#10b981",
  primaryHover: "#059669",
};
const indigo = {
  primary: "#6366f1",
  primaryHover: "#4f46e5",
};

function radiusValue(r: "sm" | "md" | "lg") {
  switch (r) {
    case "sm":
      return 8;
    case "md":
      return 12;
    default:
      return 16;
  }
}

export default function AppThemeBridge({ children }: PropsWithChildren) {
  const { flags } = useFeatureFlags();
  const brand = flags.brand === "emerald" ? emerald : indigo;
  const radius = radiusValue(flags.radius);

  useEffect(() => {
    document.documentElement.style.setProperty("--radius-card", `${radius}px`);
  }, [radius]);

  return (
    <ConfigProvider
      theme={{
        algorithm: flags.compact
          ? [theme.defaultAlgorithm, theme.compactAlgorithm]
          : theme.defaultAlgorithm,
        token: {
          colorPrimary: brand.primary,
          colorPrimaryHover: brand.primaryHover,
          borderRadius: radius,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
