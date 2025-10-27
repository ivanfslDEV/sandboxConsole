// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import "./i18n"; // <— must be imported before App
import { useTranslation, I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from "./App";
import "./index.css";
import { getAntdLocale } from "./locale/antd";
import { AuthProvider } from "./auth/AuthProvider";

function AppWithLocale() {
  const { i18n } = useTranslation();
  return (
    <ConfigProvider locale={getAntdLocale(i18n.language)}>
      <App />
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <AppWithLocale />
        </AuthProvider>
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
