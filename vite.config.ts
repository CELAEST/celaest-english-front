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
  const celaestBackOrigin = originOf(env.VITE_CELAEST_BACK_URL, "http://localhost:3101");
  const coreAiOrigin = originOf(env.VITE_CORE_AI_URL, "http://127.0.0.1:8085");
  const isDev = command === "serve";

  const connectSrc = [
    "'self'",
    apiOrigin,
    celaestBackOrigin,
    coreAiOrigin,
    "https://*.supabase.co",
    "https://api.groq.com",
    "https://generativelanguage.googleapis.com",
    "https://api.openai.com",
    "https://api.anthropic.com",
    "https://api.deepseek.com",
    "https://api.x.ai",
    "https://openrouter.ai",
    "https://api.perplexity.ai",
    "https://huggingface.co",
    "https://*.huggingface.co",
    "https://cdn-lfs.huggingface.co",
    "https://*.hf.co",
    "https://hf.co",
    "https://cdn.jsdelivr.net",
    "https://*.jsdelivr.net",
    "https://unpkg.com",
    "https://*.unpkg.com",
    "https://raw.githubusercontent.com",
    "https://*.githubusercontent.com",
  ];
  if (isDev) {
    // HMR websocket + local service discovery + AI model CDNs + local network mobile devices during development
    connectSrc.push("https:", "ws:", "wss:", "http://localhost:*", "http://127.0.0.1:*", "http:", "ws:");
  }

  return [
    "default-src 'self'",
    `script-src ${isDev ? "'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https:" : "'self' 'wasm-unsafe-eval' blob:"}`,
    "worker-src 'self' blob: data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
    "font-src 'self' https://fonts.gstatic.com https://api.fontshare.com https://cdn.fontshare.com data:",
    "img-src 'self' data: blob:",
    `media-src 'self' blob: data: http://localhost:* http://127.0.0.1:* ${isDev ? "http:" : ""} https://translate.google.com https:`,
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
    host: true,
    port: 3000,
    open: true,
    proxy: {
      "/api/v1": {
        target: "http://localhost:8080",
        changeOrigin: true,
        ws: true,
      },
      "/core-ai": {
        target: "http://127.0.0.1:8085",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/core-ai/, "/api/v1"),
      },
      "/celaest-back": {
        target: "http://localhost:3101",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/celaest-back/, "/api/v1"),
      },
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-icons": ["lucide-react"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-sentry": ["@sentry/react"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
  },
}));
