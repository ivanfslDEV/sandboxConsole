import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./auth/AuthProvider";
import { FeatureFlagsProvider } from "./flags/FeatureFlagsProvider";
import AppThemeBridge from "./theme/AppThemeBridge";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <FeatureFlagsProvider>
            <AppThemeBridge>
              <App />
            </AppThemeBridge>
          </FeatureFlagsProvider>
        </AuthProvider>
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
