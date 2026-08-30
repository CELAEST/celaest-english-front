/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Extracts scheme://host:port from a URL for use inside CSP connect-src.
 */
function originOf(url: string | undefined, fallback: string): string {
  try {
    return new URL(url && url.trim() !== "" ? url : fallback).origin;
  } catch {
    return fallback;
  }
}

/**
 * Injects a Content-Security-Policy meta tag into every served/built page.
 *
 * - Production build: scripts restricted to the app bundle ('self').
 * - Dev server: allows the React Refresh inline preamble and the HMR socket.
 * - connect-src is derived from the actual VITE_API_URL / VITE_CORE_AI_URL
 *   values so the policy can never drift from the configured backends.
 *
 * Note: frame-ancestors cannot be expressed via <meta>; serve
 * `X-Frame-Options: DENY` / CSP frame-ancestors from your hosting layer.
 */
function createSecurityPolicy(mode: string, command: string): string {
  const env = loadEnv(mode, process.cwd(), "");
  const apiOrigin = originOf(env.VITE_API_URL, "http://localhost:8080");
  const coreAiOrigin = originOf(env.VITE_CORE_AI_URL, "http://127.0.0.1:8085");
  const isDev = command === "serve";

  const connectSrc = ["'self'", apiOrigin, coreAiOrigin];
  if (isDev) {
    // HMR websocket + local service discovery during development only.
    connectSrc.push("ws:", "wss:", "http://localhost:*", "http://127.0.0.1:*");
  }

  return [
    "default-src 'self'",
    `script-src ${isDev ? "'self' 'unsafe-inline'" : "'self'"}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    `connect-src ${connectSrc.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join("; ");
}

function contentSecurityPolicyPlugin(mode: string, command: string): Plugin {
  const policy = createSecurityPolicy(mode, command);
  return {
    name: "celaest:content-security-policy",
    transformIndexHtml() {
      return [
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: policy },
          injectTo: "head",
        },
      ];
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react(), contentSecurityPolicyPlugin(mode, command)],
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "./src/domain"),
      "@application": path.resolve(__dirname, "./src/application"),
      "@infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@design-system": path.resolve(__dirname, "./src/design-system"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
  },
}));
