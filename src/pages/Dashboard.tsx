
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import ResponsableCabinetDashboard from '@/components/dashboards/ResponsableCabinetDashboard';
import DoctorDashboard from '@/components/dashboards/DoctorDashboard';
import ReceptionistDashboard from '@/components/dashboards/ReceptionistDashboard';
import PatientDashboard from '@/components/dashboards/PatientDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Chargement...</div>;
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
    case 'patient':
      return <PatientDashboard />;
    default:
      return <div>Rôle non reconnu</div>;
  }
};

export default Dashboard;
