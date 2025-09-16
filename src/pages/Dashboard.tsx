
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import ResponsableCabinetDashboard from '@/components/dashboards/ResponsableCabinetDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import ReceptionistDashboard from '@/components/dashboards/ReceptionistDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger les patients vers leur tableau de bord dédié
    if (user?.role === 'patient') {
      navigate('/patient-dashboard');
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  // Si c'est un patient, ne pas afficher le contenu car il sera redirigé
  if (user.role === 'patient') {
    return <div>Redirection...</div>;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'responsable_cabinet':
      return <ResponsableCabinetDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'receptionist':
      return <ReceptionistDashboard />;
    default:
      return <div>Rôle non reconnu</div>;
  }
};

export default Dashboard;
