
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import RendezVousManagement from "./pages/admin/RendezVousManagement";
import Users from "./pages/Users";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import MyAppointments from "./pages/MyAppointments";
import PatientDashboard from "./pages/PatientDashboard";
import Patients from "./pages/Patients";
import Profile from "./pages/Profile";
import SystemConfig from "./pages/admin/SystemConfig";
import UserManagement from "./pages/admin/UserManagement";
import SystemReports from "./pages/admin/SystemReports";
import ContactManagement from "./pages/admin/ContactManagement";
import TeamManagement from "./pages/TeamManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Routes protégées avec layout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Routes admin système uniquement */}
                <Route path="system-config" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SystemConfig />
                  </ProtectedRoute>
                } />

                <Route path="user-management" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="system-reports" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SystemReports />
                  </ProtectedRoute>
                } />
                
                <Route path="admin/contacts" element={
                  <ProtectedRoute allowedRoles={['admin', 'responsable_cabinet']}>
                    <ContactManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="admin/rendez-vous" element={
                  <ProtectedRoute allowedRoles={['admin', 'responsable_cabinet']}>
                    <RendezVousManagement />
                  </ProtectedRoute>
                } />
                
                {/* Routes responsable cabinet uniquement */}
                <Route path="appointments" element={
                  <ProtectedRoute allowedRoles={['responsable_cabinet', 'admin']}>
                    <RendezVousManagement />
                  </ProtectedRoute>
                } />
                <Route path="users" element={
                  <ProtectedRoute allowedRoles={['responsable_cabinet']}>
                    <TeamManagement />
                  </ProtectedRoute>
                } />
                <Route path="reports" element={
                  <ProtectedRoute allowedRoles={['responsable_cabinet', 'admin']}>
                    <ReportsAnalytics />
                  </ProtectedRoute>
                } />
                <Route path="cabinet-settings" element={
                  <ProtectedRoute allowedRoles={['responsable_cabinet']}>
                    <div>Paramètres Cabinet</div>
                  </ProtectedRoute>
                } />
                
                {/* Routes docteur et patient */}
                <Route path="my-appointments" element={
                  <ProtectedRoute allowedRoles={['doctor', 'patient']}>
                    <MyAppointments />
                  </ProtectedRoute>
                } />
                <Route path="patient-dashboard" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                } />
                <Route path="patients" element={
                  <ProtectedRoute allowedRoles={['receptionist']}>
                    <Patients />
                  </ProtectedRoute>
                } />
                
                {/* Route patient */}
                <Route path="profile" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
