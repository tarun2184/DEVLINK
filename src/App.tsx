
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStoreProvider } from './store/AppStore';
import { AuthGate } from './components/AuthGate';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { PortalChooser } from './pages/PortalChooser';
import { BrowseProjects } from './pages/BrowseProjects';
import { ProjectDetail } from './pages/ProjectDetail';
import { DeveloperProfile } from './pages/DeveloperProfile';
import { ClientInbox } from './pages/ClientInbox';
import { DeveloperDashboard } from './pages/DeveloperDashboard';
import { DeveloperInbox } from './pages/DeveloperInbox';
import { UploadProject } from './pages/UploadProject';
export function App() {
  return (
    <AppStoreProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AuthGate />}>
            <Route path="/" element={<PortalChooser />} />

            {/* Client portal */}
            <Route path="/client" element={<Layout requiredRole="client" />}>
              <Route index element={<BrowseProjects />} />
              <Route path="project/:id" element={<ProjectDetail />} />
              <Route path="developer/:id" element={<DeveloperProfile />} />
              <Route path="inbox" element={<ClientInbox />} />
            </Route>

            {/* Developer portal */}
            <Route
              path="/developer"
              element={<Layout requiredRole="developer" />}>
              
              <Route index element={<DeveloperDashboard />} />
              <Route path="inbox" element={<DeveloperInbox />} />
              <Route path="upload" element={<UploadProject />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppStoreProvider>);

}