import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const workspaceDir = path.dirname(fileURLToPath(import.meta.url));

const BE_TARGET = "https://personal-finance-management-api.onrender.com";

const proxyConfig = {
  target: BE_TARGET,
  changeOrigin: true,
  secure: true,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(workspaceDir, "./src") },
  },
  server: {
    proxy: {
      "/api": proxyConfig,
      "/User": proxyConfig,
      "/user": proxyConfig,
      "/Jar": proxyConfig,
      "/Transactions": proxyConfig,
      "/Onboarding": proxyConfig,
      "/FinancialAccount": proxyConfig,
      "/health": proxyConfig,
      "/admin": proxyConfig,
      "/change-role": proxyConfig,
    },
  },
});
