import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryProvider } from "./shared/providers/QueryProvider";
import { initSentry } from "./infrastructure/monitoring/sentry";
import { MobileAudioUnlocker } from "./features/conversation/services/speechSynthesisService";
import { ENV } from "./shared/constants/env";

initSentry();
MobileAudioUnlocker.init();

// Non-blocking background pre-warm pings: ensures TCP/TLS handshakes are warm
if (typeof window !== "undefined") {
  fetch(`${ENV.celaestBackUrl}/health`, { method: "GET" }).catch(() => {});
  fetch(`${ENV.apiUrl}/health`, { method: "GET" }).catch(() => {});
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>,
);
