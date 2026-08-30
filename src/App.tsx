import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";

export function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="w-full min-h-screen bg-[#000006] text-white">
          <AppRoutes />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
