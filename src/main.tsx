import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryProvider } from "./shared/providers/QueryProvider";
import { initSentry } from "./infrastructure/monitoring/sentry";
import { MobileAudioUnlocker } from "./features/conversation/services/speechSynthesisService";

initSentry();
MobileAudioUnlocker.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>,
);
