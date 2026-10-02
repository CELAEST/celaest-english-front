import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { ToastProvider } from "./design-system/components/Toast";
import { StorageLifecycleService } from "./shared/services/storageLifecycleService";
import { orbVideoCacheService } from "./design-system/components/Orb/orbVideoCacheService";

export function App() {
  useEffect(() => {
    StorageLifecycleService.performMountHygiene();
    void orbVideoCacheService.preload("/assets/orve.mp4");
    void orbVideoCacheService.preload("/assets/orve.webm");
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
