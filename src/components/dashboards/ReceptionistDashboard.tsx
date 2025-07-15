import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Phone, Plus, Search, DollarSign, FileText, Clock, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import AppointmentForm from '@/components/forms/AppointmentForm';
import PatientRegistrationForm from '@/components/forms/PatientRegistrationForm';
import PaymentForm from '@/components/forms/PaymentForm';
import ConsultationReceiptForm from '@/components/forms/ConsultationReceiptForm';
import PatientStatusTracker from '@/components/PatientStatusTracker';
import ReportsGenerator from '@/components/ReportsGenerator';
import ClientRegistrationTable from '@/components/ClientRegistrationTable';
import FinancialReportsModal from '@/components/FinancialReportsModal';

const ReceptionistDashboard = () => {
  const { user } = useAuth();
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [isReceiptFormOpen, setIsReceiptFormOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isFinancialReportsOpen, setIsFinancialReportsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées pour les statistiques du jour
  const todayStats = {
    totalPatients: 45,
    appointmentsToday: 23,
    waitingPatients: 8,
    consultationsCompleted: 15,
    totalRevenue: 285000,
    pendingPayments: 3
  };

  // Données simulées pour les rendez-vous du jour
  const todayAppointments = [
    {
      id: 1,
      time: '09:00',
      patient: 'Aminata Sy',
      doctor: 'Dr. Fatou Diop',
      specialty: 'Cardiologie',
      status: 'waiting',
      priority: 'normal'
    },
    {
      id: 2,
      time: '09:30',
      patient: 'Moussa Kane',
      doctor: 'Dr. Aminata Fall',
      specialty: 'Médecine générale',
      status: 'in-consultation',
      priority: 'normal'
    },
    {
      id: 3,
      time: '10:00',
      patient: 'Fatoumata Diallo',
      doctor: 'Dr. Fatou Diop',
      specialty: 'Cardiologie',
      status: 'completed',
      priority: 'urgent'
    },
    {
      id: 4,
      time: '10:30',
      patient: 'Ibrahima Sarr',
      doctor: 'Dr. Moussa Kane',
      specialty: 'Pédiatrie',
      status: 'confirmed',
      priority: 'normal'
    },
    {
      id: 5,
      time: '11:00',
      patient: 'Mame Diarra',
      doctor: 'Dr. Aminata Fall',
      specialty: 'Gynécologie',
      status: 'cancelled',
      priority: 'normal'
    }
  ];

  // Alertes du jour
  const alerts = [
    { type: 'urgent', message: '3 patients en attente depuis plus de 30 min' },
    { type: 'warning', message: '2 paiements en retard' },
    { type: 'info', message: 'Livraison matériel médical prévue à 14h' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-consultation': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return <Clock className="h-3 w-3" />;
      case 'in-consultation': return <Activity className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'confirmed': return <Calendar className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'En attente';
      case 'in-consultation': return 'En consultation';
      case 'completed': return 'Terminé';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'border-l-4 border-red-500' : '';
  };

  const handleCreateAppointment = (data: any) => {
    console.log('Nouveau rendez-vous:', data);
    setIsAppointmentFormOpen(false);
  };

  const handleCreatePatient = (data: any) => {
    console.log('Nouveau patient:', data);
    setIsPatientFormOpen(false);
  };

  const handleProcessPayment = (data: any) => {
    console.log('Paiement traité:', data);
    setIsPaymentFormOpen(false);
  };

  const handleGenerateReceipt = (data: any) => {
    console.log('Reçu généré:', data);
    setIsReceiptFormOpen(false);
  };

  const handleSearchPatient = () => {
    console.log('Recherche patient:', searchTerm);
  };

  const handleCallsQueue = () => {
    console.log('Gestion des appels en attente');
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec informations utilisateur */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600">Accueil et gestion des patients - {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Alertes importantes */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-3 rounded-lg flex items-center space-x-2 ${
              alert.type === 'urgent' ? 'bg-red-50 border border-red-200' :
              alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <AlertTriangle className={`h-4 w-4 ${
                alert.type === 'urgent' ? 'text-red-600' :
                alert.type === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <span className="text-sm font-medium">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayStats.totalPatients}</div>
            <p className="text-xs text-gray-500">Total aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              RDV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayStats.appointmentsToday}</div>
            <p className="text-xs text-gray-500">Programmés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{todayStats.waitingPatients}</div>
            <p className="text-xs text-gray-500">Salle d'attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{todayStats.consultationsCompleted}</div>
            <p className="text-xs text-gray-500">Consultations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Recettes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{todayStats.totalRevenue.toLocaleString()} F</div>
            <p className="text-xs text-gray-500">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Impayés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todayStats.pendingPayments}</div>
            <p className="text-xs text-gray-500">À relancer</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides avec styles améliorés */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
          <DialogTrigger asChild>
            <Button className="h-24 flex flex-col hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #6C2476 0%, #B0368B 100%)' }}>
              <div className="bg-white/20 rounded-full p-2 mb-2">
                <Plus className="h-6 w-6" />
              </div>
              <span className="font-semibold">Nouveau RDV</span>
              <span className="text-xs opacity-90">Programmation</span>
            </Button>
          </DialogTrigger>
          <AppointmentForm 
            onSubmit={handleCreateAppointment}
            onCancel={() => setIsAppointmentFormOpen(false)}
          />
        </Dialog>

        <Dialog open={isPatientFormOpen} onOpenChange={setIsPatientFormOpen}>
          <DialogTrigger asChild>
            <Button className="h-24 flex flex-col transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2" 
                    style={{ 
                      background: 'linear-gradient(135deg, #B0368B 0%, #6C2476 100%)',
                      borderColor: '#6C2476'
                    }}>
              <div className="bg-white/20 rounded-full p-2 mb-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="font-semibold text-white">Enregistrer Client</span>
              <span className="text-xs text-white/90">Nouveau patient</span>
            </Button>
          </DialogTrigger>
          <PatientRegistrationForm 
            onSubmit={handleCreatePatient}
            onCancel={() => setIsPatientFormOpen(false)}
          />
        </Dialog>

        <Dialog open={isPaymentFormOpen} onOpenChange={setIsPaymentFormOpen}>
          <DialogTrigger asChild>
            <Button className="h-24 flex flex-col transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 bg-white hover:bg-gray-50" 
                    style={{ borderColor: '#6C2476' }}>
              <div className="rounded-full p-2 mb-2" style={{ backgroundColor: '#F4E6F7' }}>
                <DollarSign className="h-6 w-6" style={{ color: '#6C2476' }} />
              </div>
              <span className="font-semibold" style={{ color: '#6C2476' }}>Paiement</span>
              <span className="text-xs" style={{ color: '#B0368B' }}>Encaissement</span>
            </Button>
          </DialogTrigger>
          <PaymentForm 
            onSubmit={handleProcessPayment}
            onCancel={() => setIsPaymentFormOpen(false)}
          />
        </Dialog>

        <Dialog open={isReceiptFormOpen} onOpenChange={setIsReceiptFormOpen}>
          <DialogTrigger asChild>
            <Button className="h-24 flex flex-col transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 bg-white hover:bg-gray-50" 
                    style={{ borderColor: '#B0368B' }}>
              <div className="rounded-full p-2 mb-2" style={{ backgroundColor: '#F9E8F4' }}>
                <FileText className="h-6 w-6" style={{ color: '#B0368B' }} />
              </div>
              <span className="font-semibold" style={{ color: '#B0368B' }}>Reçu Consultation</span>
              <span className="text-xs" style={{ color: '#6C2476' }}>Génération</span>
            </Button>
          </DialogTrigger>
          <ConsultationReceiptForm 
            onSubmit={handleGenerateReceipt}
            onCancel={() => setIsReceiptFormOpen(false)}
          />
        </Dialog>

        <Button 
          className="h-24 flex flex-col transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 bg-white hover:bg-gray-50 relative" 
          style={{ borderColor: '#6C2476' }}
          onClick={handleCallsQueue}
        >
          <div className="rounded-full p-2 mb-2" style={{ backgroundColor: '#F4E6F7' }}>
            <Phone className="h-6 w-6" style={{ color: '#6C2476' }} />
          </div>
          <span className="font-semibold" style={{ color: '#6C2476' }}>Appels</span>
          <span className="text-xs" style={{ color: '#B0368B' }}>En attente</span>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            3
          </div>
        </Button>

        <Dialog open={isFinancialReportsOpen} onOpenChange={setIsFinancialReportsOpen}>
          <DialogTrigger asChild>
            <Button className="h-24 flex flex-col transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 bg-white hover:bg-gray-50" 
                    style={{ borderColor: '#6C2476' }}>
              <div className="rounded-full p-2 mb-2" style={{ backgroundColor: '#F4E6F7' }}>
                <DollarSign className="h-6 w-6" style={{ color: '#6C2476' }} />
              </div>
              <span className="font-semibold" style={{ color: '#6C2476' }}>Rapport Financier</span>
              <span className="text-xs" style={{ color: '#B0368B' }}>Prix & RDV</span>
            </Button>
          </DialogTrigger>
          <FinancialReportsModal 
            onClose={() => setIsFinancialReportsOpen(false)}
          />
        </Dialog>
      </div>

      {/* Recherche rapide */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche rapide</CardTitle>
          <CardDescription>Trouvez rapidement un patient ou un rendez-vous</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nom du patient, téléphone, ou numéro de dossier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearchPatient}>
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suivi des patients en temps réel */}
      <PatientStatusTracker appointments={todayAppointments} />

      {/* Nouveau tableau d'enregistrement des clients */}
      <ClientRegistrationTable />

      {/* Rendez-vous du jour détaillés */}
      <Card>
        <CardHeader>
          <CardTitle>Planning d'aujourd'hui</CardTitle>
          <CardDescription>Tous les rendez-vous programmés - {todayAppointments.length} au total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${getPriorityColor(appointment.priority)}`}>
                <div className="flex items-center space-x-4">
                  <div className="text-center min-w-[60px]">
                    <p className="font-bold text-lg">{appointment.time}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">{appointment.patient}</p>
                      {appointment.priority === 'urgent' && (
                        <Badge variant="destructive" className="text-xs">URGENT</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{appointment.doctor} - {appointment.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs flex items-center space-x-1 ${getStatusColor(appointment.status)}`}>
                    {getStatusIcon(appointment.status)}
                    <span>{getStatusText(appointment.status)}</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceptionistDashboard;
