import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, UserCheck, Activity, Building, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import apiService from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const ResponsableCabinetDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // États pour les données API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total_patients: 0,
    total_rdv_aujourd_hui: 0,
    total_docteurs: 0,
    total_consultations_mois: 0,
    revenus_mois: 0
  });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  
  // États pour les graphiques
  const [chartData, setChartData] = useState({
    weeklyData: [],
    statusDistribution: [],
    appointmentTrend: []
  });
  
  // États pour l'interactivité
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Charger les données depuis l'API
  useEffect(() => {
    loadDashboardData();
    
    // Rafraîchir les données toutes les 30 secondes pour voir les nouvelles demandes
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Mettre à jour les graphiques quand les données changent
  useEffect(() => {
    if (allAppointments && allAppointments.length > 0) {
      const chartData = generateChartData(allAppointments, selectedPeriod);
      setChartData(chartData);
    } else {
      // Données par défaut pour les graphiques vides
      setChartData({
        weeklyData: [],
        statusDistribution: [],
        appointmentTrend: []
      });
    }
  }, [allAppointments, selectedPeriod]);

  // Générer les données des graphiques
  const generateChartData = (appointments: any[], period: string) => {
    const now = new Date();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);

    // Données hebdomadaires
    const weeklyData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date_confirmee || apt.created_at);
        return aptDate.toDateString() === date.toDateString();
      });

      weeklyData.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        rdv: dayAppointments.length,
        confirmes: dayAppointments.filter(apt => apt.statut === 'confirme').length,
        realises: dayAppointments.filter(apt => apt.statut === 'realise').length
      });
    }

    // Distribution des statuts
    const statusCounts = appointments.reduce((acc, apt) => {
      acc[apt.statut] = (acc[apt.statut] || 0) + 1;
      return acc;
    }, {});

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      name: status === 'en_attente' ? 'En attente' : 
            status === 'confirme' ? 'Confirmés' :
            status === 'realise' ? 'Réalisés' :
            status === 'annule' ? 'Annulés' : status,
      value: count,
      color: status === 'en_attente' ? '#F59E0B' :
             status === 'confirme' ? '#10B981' :
             status === 'realise' ? '#8B5CF6' :
             status === 'annule' ? '#EF4444' : '#6B7280'
    }));

    // Tendance des rendez-vous
    const appointmentTrend = weeklyData.map((day, index) => ({
      jour: day.date,
      total: weeklyData.slice(0, index + 1).reduce((sum, d) => sum + d.rdv, 0),
      confirmes: weeklyData.slice(0, index + 1).reduce((sum, d) => sum + d.confirmes, 0)
    }));

    return {
      weeklyData,
      statusDistribution,
      appointmentTrend
    };
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les statistiques
      try {
        const statsData = await apiService.getStatistiques();
        setStatistics(statsData);
      } catch (statsError) {
        console.warn('Erreur lors du chargement des statistiques:', statsError);
        // Utiliser des valeurs par défaut
        setStatistics({
          total_patients: 0,
          total_rdv_aujourd_hui: 0,
          total_docteurs: 0,
          total_consultations_mois: 0,
          revenus_mois: 0
        });
      }

      // Charger les rendez-vous d'aujourd'hui
      try {
        const todayRdv = await apiService.getRendezVousAujourdHui();
        setTodayAppointments(Array.isArray(todayRdv) ? todayRdv : []);
      } catch (todayError) {
        console.warn('Erreur lors du chargement des RDV du jour:', todayError);
        setTodayAppointments([]);
      }

      // Charger tous les rendez-vous
      try {
        const allRdv = await apiService.getRendezVous();
        console.log('🔍 Données brutes des rendez-vous:', allRdv);
        console.log('🔍 Type de allRdv:', typeof allRdv);
        console.log('🔍 Est-ce un tableau?', Array.isArray(allRdv));
        
        const appointmentsArray = Array.isArray(allRdv) ? allRdv : [];
        setAllAppointments(appointmentsArray);
        
        // Filtrer les demandes en attente
        const pendingRdv = appointmentsArray.filter(rdv => rdv.statut === 'en_attente');
        setPendingRequests(pendingRdv);
        
        console.log('🔍 Rendez-vous chargés:', appointmentsArray.length);
        console.log('🔍 Demandes en attente:', pendingRdv.length);
      } catch (rdvError) {
        console.warn('Erreur lors du chargement des rendez-vous:', rdvError);
        setAllAppointments([]);
        setPendingRequests([]);
      }

    } catch (err) {
      console.error('Erreur générale lors du chargement des données:', err);
      setError('Erreur lors du chargement des données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  // Fonction de rafraîchissement des données
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement du tableau de bord...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">Erreur de chargement</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            Tableau de bord - Responsable Cabinet
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Bienvenue, {user?.firstName} {user?.lastName}
          </p>
        </div>
        
        {/* Actions rapides */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
            className="hover:opacity-90 transition-all duration-300 w-full sm:w-auto"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">Actualiser</span>
            <span className="xs:hidden">Actualiser</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/appointments')}
            className="hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto" 
            style={{ background: 'linear-gradient(135deg, #6C2476 0%, #B0368B 100%)' }}
            size="sm"
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Gérer les RDV</span>
            <span className="xs:hidden">RDV</span>
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Patients</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{statistics.total_patients}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">RDV Aujourd'hui</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{statistics.total_rdv_aujourd_hui}</p>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Demandes en attente</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
              </div>
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Équipe Médicale</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{statistics.total_docteurs}</p>
              </div>
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Évolution des RDV */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg">Évolution des Rendez-vous</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Rendez-vous des {selectedPeriod === '7d' ? '7 derniers jours' : selectedPeriod === '30d' ? '30 derniers jours' : '90 derniers jours'}
                </CardDescription>
              </div>
              <div className="flex space-x-1 sm:space-x-2">
                <Button
                  size="sm"
                  variant={selectedPeriod === '7d' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('7d')}
                  className="text-xs px-2 sm:px-3"
                >
                  7j
                </Button>
                <Button
                  size="sm"
                  variant={selectedPeriod === '30d' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('30d')}
                  className="text-xs px-2 sm:px-3"
                >
                  30j
                </Button>
                <Button
                  size="sm"
                  variant={selectedPeriod === '90d' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('90d')}
                  className="text-xs px-2 sm:px-3"
                >
                  90j
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {chartData.weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rdv" stroke="#8B5CF6" strokeWidth={2} name="Total RDV" />
                  <Line type="monotone" dataKey="confirmes" stroke="#10B981" strokeWidth={2} name="Confirmés" />
                  <Line type="monotone" dataKey="realises" stroke="#F59E0B" strokeWidth={2} name="Réalisés" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                <div className="text-center px-4">
                  <div className="text-sm sm:text-base mb-2">Aucune donnée disponible</div>
                  <div className="text-xs sm:text-sm">Les graphiques s'afficheront quand des rendez-vous seront créés</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribution des statuts */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Distribution des Statuts</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Répartition des rendez-vous par statut</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {chartData.statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-500">
                <div className="text-center px-4">
                  <div className="text-sm sm:text-base mb-2">Aucune donnée disponible</div>
                  <div className="text-xs sm:text-sm">La distribution des statuts s'affichera quand des rendez-vous seront créés</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rendez-vous du jour et Demandes en attente */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Rendez-vous du jour */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Rendez-vous du jour</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Planification d'aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <div className="text-sm sm:text-base">Aucun rendez-vous aujourd'hui</div>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {todayAppointments.map((apt, i) => (
                  <div key={i} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium text-xs sm:text-sm truncate">
                        {apt.patient?.user ? 
                          `${apt.patient.user.first_name} ${apt.patient.user.last_name}` :
                          apt.client_nom || 'Patient'
                        }
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {apt.service?.nom || 'Consultation'} - {apt.docteur ? `Dr. ${apt.docteur.first_name} ${apt.docteur.last_name}` : 'Non assigné'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      apt.statut === 'confirme' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {apt.statut === 'confirme' ? 'Confirmé' : 'En attente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demandes en attente */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Demandes en attente</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Nouvelles demandes de rendez-vous</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <div className="text-sm sm:text-base">Aucune demande en attente</div>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {pendingRequests.slice(0, 5).map((request, i) => (
                  <div key={i} className="flex items-center justify-between p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium text-xs sm:text-sm truncate">
                        {request.client_nom || 'Client anonyme'}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {request.service?.nom || 'Service non spécifié'}
                      </p>
                      {request.message && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          "{request.message.substring(0, 30)}..."
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        En attente
                      </span>
                      {request.date_souhaitee && (
                        <span className="text-xs text-gray-500 mt-1">
                          {new Date(request.date_souhaitee).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {pendingRequests.length > 5 && (
                  <div className="text-center pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/appointments')}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50 text-xs sm:text-sm"
                    >
                      Voir toutes les demandes ({pendingRequests.length})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponsableCabinetDashboard;