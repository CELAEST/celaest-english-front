import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-[#000006] text-white">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
