import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './hooks/useTheme';
import { useAuthStore } from './store/authStore';
import ErrorBoundary from './components/ErrorBoundary';

// Layout Components
import MainLayout from './components/Layout/MainLayout';
import LoginForm from './components/Auth/LoginForm';

// Pages
import Dashboard from './pages/Dashboard';
import CRMDashboard from './pages/CRM/CRMDashboard';
import PropertiesPage from './pages/Properties/PropertiesPage';
import AccountingPage from './pages/Accounting/AccountingPage';
import ChequesPage from './pages/Cheques/ChequesPage';
import ContractsPage from './pages/Contracts/ContractsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import TasksPage from './pages/Tasks/TasksPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import UsersPage from './pages/Users/UsersPage';
import SettingsPage from './pages/Settings/SettingsPage';
import HRDashboard from './pages/HR/HRDashboard';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProcurementPage from './pages/Procurement/ProcurementPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import MarketingPage from './pages/Marketing/MarketingPage';
import InvoicesPage from './pages/Invoices/InvoicesPage';
import AppointmentsPage from './pages/Appointments/AppointmentsPage';
import AssetsPage from './pages/Assets/AssetsPage';
import MaintenancePage from './pages/Maintenance/MaintenancePage';
import CommunicationsPage from './pages/Communications/CommunicationsPage';
import WorkflowsPage from './pages/Workflows/WorkflowsPage';
import AuditPage from './pages/Audit/AuditPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { theme } = useTheme();

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="crm" element={<CRMDashboard />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="accounting" element={<AccountingPage />} />
              <Route path="cheques" element={<ChequesPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="hr" element={<HRDashboard />} />
              <Route path="procurement" element={<ProcurementPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="marketing" element={<MarketingPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="assets" element={<AssetsPage />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="communications" element={<CommunicationsPage />} />
              <Route path="workflows" element={<WorkflowsPage />} />
              <Route path="audit" element={<AuditPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
            },
          }}
        />
    </ErrorBoundary>
  );
}

export default App;