/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend REST API, e.g. https://api.example.com/api/v1 */
  readonly VITE_API_URL?: string;
  /** Base URL of the CELAEST-CORE IA-Mesh service, e.g. http://127.0.0.1:8085/api/v1 */
  readonly VITE_CORE_AI_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv & { DEV: boolean; PROD: boolean; MODE: string };
}

declare const logger: {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};
