import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { ToastProvider } from "./design-system/components/Toast";
import { StorageLifecycleService } from "./shared/services/storageLifecycleService";

export function App() {
  useEffect(() => {
    StorageLifecycleService.performMountHygiene();
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <div className="w-full min-h-screen bg-[#000003] text-white">
          <AppRoutes />
          <ToastProvider position="bottom-right" />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
