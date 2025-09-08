
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Users, Calendar, UserCheck, Activity, Building, TrendingUp, Plus } from 'lucide-react';
import AppointmentForm from '@/components/forms/AppointmentForm';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const ResponsableCabinetDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [stats, setStats] = useState([
    {
      title: 'Total Patients',
      value: '0',
      description: 'Chargement...',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'RDV Aujourd\'hui',
      value: '0',
      description: 'Chargement...',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Équipe Médicale',
      value: '0',
      description: 'Chargement...',
      icon: UserCheck,
      color: 'text-purple-600'
    },
    {
      title: 'Revenus Mensuel',
      value: '0 CFA',
      description: 'Chargement...',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickActions = [
    'Nouveau patient inscrit - Aminata Diallo',
    'RDV confirmé avec Dr. Diop à 14h',
    'Rapport mensuel généré',
    'Paiement reçu - Consultation Mamadou Ba',
    'Matériel médical livré'
  ];

  // Charger les données depuis l'API
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques
      const statsData = await apiService.getStatistiques();
      
      // Charger les rendez-vous d'aujourd'hui
      const todayRdv = await apiService.getRendezVousAujourdHui();
      
      // Mettre à jour les statistiques
      setStats([
        {
          title: 'Total Patients',
          value: statsData.total_patients?.toString() || '0',
          description: 'Patients enregistrés',
          icon: Users,
          color: 'text-blue-600'
        },
        {
          title: 'RDV Aujourd\'hui',
          value: statsData.total_rdv_aujourd_hui?.toString() || '0',
          description: `${todayRdv.length} confirmés`,
          icon: Calendar,
          color: 'text-green-600'
        },
        {
          title: 'Équipe Médicale',
          value: statsData.total_docteurs?.toString() || '0',
          description: 'Médecins actifs',
          icon: UserCheck,
          color: 'text-purple-600'
        },
        {
          title: 'Revenus Mensuel',
          value: `${(statsData.revenus_mois || 0).toLocaleString()} CFA`,
          description: 'Ce mois',
          icon: TrendingUp,
          color: 'text-orange-600'
        }
      ]);
      
      // Mettre à jour les rendez-vous d'aujourd'hui
      setTodayAppointments(todayRdv.map(rdv => ({
        patient: rdv.patient?.user?.first_name + ' ' + rdv.patient?.user?.last_name || 'Patient',
        doctor: rdv.docteur ? `Dr. ${rdv.docteur.first_name} ${rdv.docteur.last_name}` : 'Non assigné',
        time: new Date(rdv.date_confirmee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: rdv.statut === 'confirme' ? 'Confirmé' : 'En attente'
      })));
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (data: any) => {
    try {
      console.log('Nouveau rendez-vous créé par le responsable:', data);
      toast({
        title: "Succès",
        description: "Rendez-vous créé avec succès !",
      });
      setIsAppointmentFormOpen(false);
      
      // Recharger les données du tableau de bord
      await loadDashboardData();
      
      // Rediriger vers la page des rendez-vous après 2 secondes
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création du rendez-vous.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-responsive">
      {/* En-tête - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-responsive-xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <Building className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <span className="break-words">Bienvenue, {user?.firstName} {user?.lastName}</span>
          </h1>
          <p className="text-responsive text-gray-600 mt-1">Tableau de bord - Responsable Cabinet</p>
        </div>
        
        {/* Bouton Nouveau RDV pour le Responsable - Responsive */}
        <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full sm:w-auto hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl btn-responsive" 
              style={{ background: 'linear-gradient(135deg, #6C2476 0%, #B0368B 100%)' }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau RDV
            </Button>
          </DialogTrigger>
          <AppointmentForm 
            onSubmit={handleCreateAppointment}
            onCancel={() => setIsAppointmentFormOpen(false)}
          />
        </Dialog>
      </div>

      {/* Statistiques - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-responsive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} flex-shrink-0`} />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1 break-words">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="card-responsive">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-responsive">Rendez-vous du jour</CardTitle>
            <CardDescription className="text-sm">Planification d'aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-sm">Chargement...</span>
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                Aucun rendez-vous aujourd'hui
              </div>
            ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{apt.patient}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{apt.doctor} - {apt.time}</p>
                  </div>
                  <span className={`text-xs sm:text-sm px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                    apt.status === 'Confirmé' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-responsive">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-responsive">Activités récentes</CardTitle>
            <CardDescription className="text-sm">Événements du cabinet</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {quickActions.map((activity, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <p className="text-sm break-words">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponsableCabinetDashboard;
