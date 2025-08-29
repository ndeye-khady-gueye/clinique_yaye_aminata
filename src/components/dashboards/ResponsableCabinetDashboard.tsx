
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Building className="h-8 w-8 text-primary" />
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600">Tableau de bord - Responsable Cabinet</p>
        </div>
        
        {/* Bouton Nouveau RDV pour le Responsable */}
        <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
          <DialogTrigger asChild>
            <Button 
              className="hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" 
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous du jour</CardTitle>
            <CardDescription>Planification d'aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="ml-2">Chargement...</span>
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Aucun rendez-vous aujourd'hui
              </div>
            ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{apt.patient}</p>
                    <p className="text-sm text-gray-600">{apt.doctor} - {apt.time}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
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

        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Événements du cabinet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quickActions.map((activity, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p className="text-sm">{activity}</p>
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
