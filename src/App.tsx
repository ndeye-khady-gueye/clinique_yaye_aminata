
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
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import MyAppointments from "./pages/MyAppointments";
import Patients from "./pages/Patients";
import Profile from "./pages/Profile";

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
                    <div>Configuration Système (Admin)</div>
                  </ProtectedRoute>
                } />
                <Route path="all-users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <div>Tous les utilisateurs (Admin)</div>
                  </ProtectedRoute>
                } />
                <Route path="system-reports" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <div>Rapports Système (Admin)</div>
                  </ProtectedRoute>
                } />
                
                {/* Routes responsable cabinet et réceptionniste */}
                <Route path="appointments" element={
                  <ProtectedRoute allowedRoles={['responsable_cabinet', 'receptionist']}>
                    <Appointments />
                  </ProtectedRoute>
                } />
                
                {/* Routes responsable cabinet uniquement */}
                <Route path="users" element={
                  <ProtectedRoute allowedRoles={['responsable_cabinet']}>
                    <Users />
                  </ProtectedRoute>
                } />
                <Route path="reports" element={
                  <ProtectedRoute allowedRoles={['responsable_cabinet']}>
                    <Reports />
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
                <Route path="patients" element={
                  <ProtectedRoute allowedRoles={['doctor', 'receptionist']}>
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
