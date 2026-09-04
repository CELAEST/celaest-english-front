import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { ToastProvider } from "./design-system/components/Toast";

export function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="w-full min-h-screen bg-[#000006] text-white">
          <AppRoutes />
          <ToastProvider position="bottom-right" />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
