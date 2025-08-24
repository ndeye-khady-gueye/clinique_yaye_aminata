import PatientAppointmentsDashboard from "@/components/dashboards/PatientAppointmentsDashboard";
import { Helmet } from "react-helmet";

const MyAppointments = () => {
  return (
    <>
      <Helmet>
        <title>Mes Rendez-vous - Espace Patient</title>
        <meta name="description" content="Consultez l'état de vos rendez-vous et leurs détails" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 p-6">
        <PatientAppointmentsDashboard />
      </div>
    </>
  );
};

export default MyAppointments;
