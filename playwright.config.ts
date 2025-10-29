import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "http://localhost:5173", // <—
  },
  webServer: {
    command: "npm run dev -- --port 5173 --strictPort", // <— porta fixa
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
