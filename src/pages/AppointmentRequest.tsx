import AppointmentRequestForm from "@/components/AppointmentRequestForm";
import { Helmet } from "react-helmet";

const AppointmentRequest = () => {
  return (
    <>
      <Helmet>
        <title>Demande de Rendez-vous - Cabinet Médical</title>
        <meta name="description" content="Demandez un rendez-vous en ligne avec nos médecins spécialisés. Formulaire simple et rapide." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <AppointmentRequestForm />
      </div>
    </>
  );
};

export default AppointmentRequest;
