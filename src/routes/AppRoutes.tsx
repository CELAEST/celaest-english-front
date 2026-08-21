import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { OnboardingView } from '../features/onboarding';
import { WorkspaceDashboardView } from '../features/workspace';
import { ROUTES } from './routes.config';

function WorkspaceWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (pathname: string) => {
    const clean = pathname.replace(/^\//, '');
    if (!clean) return 'workspace';
    return clean;
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleNavigate = (route: string) => {
    if (route === 'onboarding') {
      navigate(ROUTES.ONBOARDING);
    } else if (route === 'workspace') {
      navigate(ROUTES.HOME);
    } else {
      navigate(`/${route}`);
    }
  };

  return (
    <WorkspaceDashboardView
      userName="Esteban"
      userLevel="B1 Level"
      defaultTab={activeTab}
      onNavigate={handleNavigate}
    />
  );
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.ONBOARDING}
        element={<OnboardingView onFinish={() => (window.location.href = ROUTES.HOME)} />}
      />
      <Route path="/*" element={<WorkspaceWrapper />} />
    </Routes>
  );
};
