
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              
              {/* Routes admin */}
              <Route path="appointments" element={
                <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                  <div>Page des rendez-vous</div>
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div>Gestion des utilisateurs</div>
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div>Rapports</div>
                </ProtectedRoute>
              } />
              
              {/* Routes docteur */}
              <Route path="my-appointments" element={
                <ProtectedRoute allowedRoles={['doctor', 'patient']}>
                  <div>Mes rendez-vous</div>
                </ProtectedRoute>
              } />
              <Route path="patients" element={
                <ProtectedRoute allowedRoles={['doctor', 'receptionist']}>
                  <div>Patients</div>
                </ProtectedRoute>
              } />
              
              {/* Route patient */}
              <Route path="profile" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <div>Mon profil</div>
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
