import AppointmentManagementDashboard from "@/components/dashboards/AppointmentManagementDashboard";
import { Helmet } from "react-helmet";

const AppointmentManagement = () => {
  return (
    <>
      <Helmet>
        <title>Gestion des Rendez-vous - Administration</title>
        <meta name="description" content="Gérez les demandes de rendez-vous et confirmez les créneaux" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 p-6">
        <AppointmentManagementDashboard />
      </div>
    </>
  );
};

export default AppointmentManagement;
