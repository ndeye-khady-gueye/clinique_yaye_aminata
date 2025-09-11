import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, FileText, Eye, FileCheck, Loader2, AlertTriangle, BarChart3, TrendingUp, PieChart, RefreshCw, Star, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import PatientDetailsModal from '@/components/modals/PatientDetailsModal';
import PrescriptionModal from '@/components/modals/PrescriptionModal';
import MedicalReportModal from '@/components/modals/MedicalReportModal';
import { apiService } from '@/services/api';
import { doctorAppointmentsService } from '@/services/doctorAppointmentsService';
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import '../../styles/animations.css';
import '../../styles/dashboard.css';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showMedicalReport, setShowMedicalReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total_rdv_aujourd_hui: 0,
    total_patients: 0,
    total_docteurs: 0,
    total_consultations_mois: 0,
    revenus_mois: 0
  });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [recentConsultations, setRecentConsultations] = useState<any[]>([]);
  
  // États pour les graphiques interactifs
  const [chartData, setChartData] = useState({
    weeklyData: [],
    monthlyData: [],
    statusDistribution: [],
    appointmentTrend: [],
    doctorStats: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Générer les données des graphiques interactifs
  const generateChartData = (appointments: any[]) => {
    console.log('🔍 Génération des données de graphiques avec', appointments.length, 'RDV');
    console.log('📊 Répartition des statuts:', appointments.reduce((acc, apt) => {
      acc[apt.statut] = (acc[apt.statut] || 0) + 1;
      return acc;
    }, {}));
    
    const now = new Date();
    const weeklyData = [];
    const monthlyData = [];
    const statusCounts = {
      confirme: 0,
      assigne: 0,
      realise: 0,
      annule: 0,
      absent: 0,
      en_attente: 0
    };

    // Données hebdomadaires (7 derniers jours)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date_confirmee || apt.date_demande);
        return aptDate.toDateString() === date.toDateString();
      });

      const dayData = {
        day: dayName,
        rdv: dayAppointments.length,
        realises: dayAppointments.filter(apt => apt.statut === 'realise').length,
        assignes: dayAppointments.filter(apt => apt.statut === 'assigne').length,
        annules: dayAppointments.filter(apt => apt.statut === 'annule').length,
        confirmes: dayAppointments.filter(apt => apt.statut === 'confirme').length
      };

      weeklyData.push(dayData);
      console.log(`📅 ${dayName}:`, dayData);
    }

    // Données mensuelles (12 derniers mois)
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      const monthAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date_confirmee || apt.date_demande);
        return aptDate.getMonth() === date.getMonth() && aptDate.getFullYear() === date.getFullYear();
      });

      monthlyData.push({
        month: monthName,
        consultations: monthAppointments.filter(apt => apt.statut === 'realise').length,
        assignes: monthAppointments.filter(apt => apt.statut === 'assigne').length,
        total: monthAppointments.length
      });
    }

    // Distribution par statut
    appointments.forEach(apt => {
      if (statusCounts.hasOwnProperty(apt.statut)) {
        statusCounts[apt.statut]++;
      }
    });

    const statusDistribution = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status === 'confirme' ? 'Confirmés' :
              status === 'assigne' ? 'Assignés' :
              status === 'realise' ? 'Réalisés' :
              status === 'annule' ? 'Annulés' :
              status === 'absent' ? 'Absents' : 'En attente',
        value: count,
        color: status === 'confirme' ? '#6C2476' :
               status === 'assigne' ? '#B0368B' :
               status === 'realise' ? '#10B981' :
               status === 'annule' ? '#EF4444' :
               status === 'absent' ? '#6B7280' : '#F59E0B'
      }));

    // Tendance des rendez-vous (30 derniers jours)
    const appointmentTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date_confirmee || apt.date_demande);
        return aptDate.toDateString() === date.toDateString();
      });

      const trendData = {
        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        total: dayAppointments.length,
        realises: dayAppointments.filter(apt => apt.statut === 'realise').length,
        assignes: dayAppointments.filter(apt => apt.statut === 'assigne').length,
        confirmes: dayAppointments.filter(apt => apt.statut === 'confirme').length,
        annules: dayAppointments.filter(apt => apt.statut === 'annule').length
      };

      appointmentTrend.push(trendData);
      
      // Log seulement les jours avec des RDV pour éviter le spam
      if (dayAppointments.length > 0) {
        console.log(`📈 ${trendData.date}:`, trendData);
      }
    }

    // Statistiques du docteur
    const doctorStats = [
      { name: 'RDV Aujourd\'hui', value: todayAppointments.length, color: '#6C2476' },
      { name: 'RDV Assignés', value: appointments.filter(apt => apt.statut === 'assigne').length, color: '#B0368B' },
      { name: 'RDV Réalisés', value: appointments.filter(apt => apt.statut === 'realise').length, color: '#10B981' },
      { name: 'RDV Annulés', value: appointments.filter(apt => apt.statut === 'annule').length, color: '#EF4444' }
    ];

    console.log('📊 Données hebdomadaires générées:', weeklyData);
    console.log('📈 Données de tendance générées:', appointmentTrend.slice(-7)); // Derniers 7 jours
    console.log('📋 Distribution par statut:', statusDistribution);

    return {
      weeklyData,
      monthlyData,
      statusDistribution,
      appointmentTrend,
      doctorStats
    };
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les statistiques générales
      try {
        const stats = await apiService.getStatistiques();
        setStatistics(stats);
      } catch (statsError) {
        console.warn('Erreur lors du chargement des statistiques:', statsError);
        // Continuer même si les statistiques échouent
      }

      // Charger les rendez-vous d'aujourd'hui
      try {
        const todayRdv = await doctorAppointmentsService.getTodayAppointments();
        setTodayAppointments(Array.isArray(todayRdv) ? todayRdv : []);
      } catch (todayError) {
        console.warn('Erreur lors du chargement des rendez-vous du jour:', todayError);
        setTodayAppointments([]);
      }

      // Charger tous les rendez-vous pour les graphiques
      try {
        const allAppointments = await doctorAppointmentsService.getMyAppointments();
        console.log('🔄 RDV chargés depuis le backend:', allAppointments.length);
        console.log('📋 Détail des RDV:', allAppointments.map(apt => ({
          id: apt.id,
          statut: apt.statut,
          date: apt.date_confirmee || apt.date_demande,
          patient: apt.patient?.nom || 'N/A'
        })));
        
        // Filtrer seulement les rendez-vous terminés/réalisés
        const rendezVousTermines = allAppointments.filter(appointment => 
          appointment.statut === 'realise'
        );
        
        setRecentConsultations(rendezVousTermines.slice(0, 5));

        // Générer les données des graphiques interactifs
        const chartData = generateChartData(allAppointments);
        setChartData(chartData);
      } catch (appointmentError) {
        console.warn('Erreur lors du chargement des rendez-vous:', appointmentError);
        setRecentConsultations([]);
        setChartData({
          weeklyData: [],
          monthlyData: [],
          statusDistribution: [],
          appointmentTrend: [],
          doctorStats: []
        });
      }

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données du tableau de bord';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePatientAction = (patient: any, action: string) => {
    setSelectedPatient(patient);
    switch (action) {
      case 'details':
        setShowPatientDetails(true);
        break;
      case 'prescription':
        setShowPrescription(true);
        break;
      case 'report':
        setShowMedicalReport(true);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#6C2476' }} />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData} style={{ backgroundColor: '#6C2476' }}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="space-y-8 p-6">
        {/* Header avec animations */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
          <div className="space-y-2">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: '#6C2476' }}>
                Bienvenue, Dr. {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600 text-lg flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                {user?.speciality} - Tableau de bord médical
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Cartes de statistiques modernes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Carte RDV Aujourd'hui */}
          <Card className="group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50 opacity-50"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl shadow-md" style={{ backgroundColor: '#6C2476' }}>
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Rendez-vous Aujourd'hui</h3>
                    <p className="text-sm text-gray-500">Prévus pour la journée</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold mb-1" style={{ color: '#6C2476' }}>
                    {statistics.total_rdv_aujourd_hui}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">RDV</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6C2476' }}></div>
                  <span>En cours de traitement</span>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>
          </Card>

          {/* Carte Patients ce mois */}
          <Card className="group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-slide-up animate-delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50 opacity-50"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl shadow-md" style={{ backgroundColor: '#6C2476' }}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Nouveaux Patients</h3>
                    <p className="text-sm text-gray-500">Ce mois-ci</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold mb-1" style={{ color: '#6C2476' }}>
                    {statistics.total_patients}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">PATIENTS</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6C2476' }}></div>
                  <span>Croissance continue</span>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Graphiques interactifs modernes */}
        <div className="space-y-8">
          {/* Graphique en barres - Évolution hebdomadaire */}
          <Card className="group relative overflow-hidden border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg shadow-md" style={{ backgroundColor: '#6C2476' }}>
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-800">Évolution Hebdomadaire</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">Rendez-vous des 7 derniers jours</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6C2476' }}></div>
                    <span>Données en temps réel</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-96 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="rdvGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6C2476" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#6C2476" stopOpacity={0.6}/>
                        </linearGradient>
                        <linearGradient id="realisesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0.6}/>
                        </linearGradient>
                        <linearGradient id="assignesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#B0368B" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#B0368B" stopOpacity={0.6}/>
                        </linearGradient>
                        <linearGradient id="confirmesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6}/>
                        </linearGradient>
                        <linearGradient id="annulesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#EF4444" stopOpacity={0.6}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                      <XAxis 
                        dataKey="day" 
                        className="text-sm font-medium text-gray-600"
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <YAxis 
                        className="text-sm font-medium text-gray-600"
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          fontSize: '14px',
                          padding: '16px'
                        }}
                        labelStyle={{ 
                          color: '#374151', 
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ 
                          paddingTop: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      />
                      <Bar dataKey="realises" stackId="a" fill="url(#realisesGradient)" radius={[0, 0, 0, 0]} name="Réalisés" />
                      <Bar dataKey="confirmes" stackId="a" fill="url(#confirmesGradient)" radius={[0, 0, 0, 0]} name="Confirmés" />
                      <Bar dataKey="assignes" stackId="a" fill="url(#assignesGradient)" radius={[0, 0, 0, 0]} name="Assignés" />
                      <Bar dataKey="annules" stackId="a" fill="url(#annulesGradient)" radius={[8, 8, 0, 0]} name="Annulés" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Graphique en courbe - Tendance des RDV */}
          <Card className="group relative overflow-hidden border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1 animate-fade-in animate-delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg shadow-md" style={{ backgroundColor: '#6C2476' }}>
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-800">Tendance des RDV</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">Évolution sur 30 derniers jours</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Tendance positive</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-96 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.appointmentTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6C2476" stopOpacity={0.3}/>
                          <stop offset="100%" stopColor="#6C2476" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="realisesGradientLine" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="assignesGradientLine" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#B0368B" stopOpacity={0.3}/>
                          <stop offset="100%" stopColor="#B0368B" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        className="text-sm font-medium text-gray-600"
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <YAxis 
                        className="text-sm font-medium text-gray-600"
                        tick={{ fill: '#6B7280' }}
                        axisLine={{ stroke: '#E5E7EB' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          fontSize: '14px',
                          padding: '16px'
                        }}
                        labelStyle={{ 
                          color: '#374151', 
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#6C2476" 
                        strokeWidth={4}
                        dot={{ fill: '#6C2476', strokeWidth: 3, r: 6, stroke: 'white' }}
                        activeDot={{ r: 8, fill: '#6C2476', stroke: 'white', strokeWidth: 3 }}
                        name="Total RDV"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="realises" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4, stroke: 'white' }}
                        activeDot={{ r: 6, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
                        name="Réalisés"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="assignes" 
                        stroke="#B0368B" 
                        strokeWidth={3}
                        dot={{ fill: '#B0368B', strokeWidth: 2, r: 4, stroke: 'white' }}
                        activeDot={{ r: 6, fill: '#B0368B', stroke: 'white', strokeWidth: 2 }}
                        name="Assignés"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Graphique en secteurs - Distribution par statut */}
          <Card className="group relative overflow-hidden border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1 animate-fade-in animate-delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg shadow-md" style={{ backgroundColor: '#6C2476' }}>
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-800">Distribution par Statut</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">Répartition des rendez-vous</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6C2476' }}></div>
                    <span>Données actualisées</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-96 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={chartData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {chartData.statusDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke="white"
                            strokeWidth={3}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          fontSize: '14px',
                          padding: '16px'
                        }}
                        labelStyle={{ 
                          color: '#374151', 
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ 
                          paddingTop: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Section des rendez-vous */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Mes Rendez-vous du jour */}
          <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm animate-fade-in animate-delay-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <Calendar className="h-6 w-6 mr-3" style={{ color: '#6C2476' }} />
                Mes Rendez-vous du jour
              </CardTitle>
              <CardDescription className="text-gray-600">Vos rendez-vous de la journée</CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Aucun rendez-vous prévu aujourd'hui</p>
                  <p className="text-sm">Profitez de votre journée libre !</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment, index) => (
                    <div 
                      key={appointment.id} 
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 hover:from-purple-50 hover:to-pink-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:shadow-lg"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {appointment.patient?.user ? 
                            `${appointment.patient.user.first_name?.[0]}${appointment.patient.user.last_name?.[0]}` :
                            (appointment.client_nom?.[0] || 'P')
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-purple-700">
                            {appointment.patient?.user ? 
                              `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}` :
                              appointment.client_nom || 'Patient'
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.service?.nom || 'Consultation'}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.date_confirmee ? 
                              new Date(appointment.date_confirmee).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) : 
                              'Heure non définie'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          className={`px-3 py-1 text-xs font-medium ${
                            appointment.statut === 'confirme' ? 
                              'bg-green-100 text-green-800 border-green-200' : 
                              appointment.statut === 'assigne' ?
                              'bg-blue-100 text-blue-800 border-blue-200' :
                              appointment.statut === 'realise' ?
                              'bg-purple-100 text-purple-800 border-purple-200' :
                              appointment.statut === 'annule' ?
                              'bg-red-100 text-red-800 border-red-200' :
                              appointment.statut === 'absent' ?
                              'bg-gray-100 text-gray-800 border-gray-200' :
                              'bg-orange-100 text-orange-800 border-orange-200'
                          }`}
                        >
                          {appointment.statut === 'confirme' ? 'Confirmé' : 
                           appointment.statut === 'assigne' ? 'Assigné' : 
                           appointment.statut === 'realise' ? 'Réalisé' :
                           appointment.statut === 'annule' ? 'Annulé' :
                           appointment.statut === 'absent' ? 'Absent' :
                           'En attente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rendez-vous terminés */}
          <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm animate-fade-in animate-delay-400">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <FileText className="h-6 w-6 mr-3" style={{ color: '#6C2476' }} />
                Rendez-vous Terminés
              </CardTitle>
              <CardDescription className="text-gray-600">Historique des consultations réalisées</CardDescription>
            </CardHeader>
            <CardContent>
              {recentConsultations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Aucun rendez-vous terminé récemment</p>
                  <p className="text-sm">Les consultations apparaîtront ici une fois terminées</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Patient</TableHead>
                        <TableHead className="font-semibold text-gray-700 hidden sm:table-cell">Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Service</TableHead>
                        <TableHead className="font-semibold text-gray-700 hidden md:table-cell">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentConsultations.map((appointment) => (
                        <TableRow key={appointment.id} className="hover:bg-purple-50 transition-colors duration-200">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {appointment.patient?.user ? 
                                  `${appointment.patient.user.first_name?.[0]}${appointment.patient.user.last_name?.[0]}` :
                                  (appointment.client_nom?.[0] || 'P')
                                }
                              </div>
                              <span>
                                {appointment.patient?.user ? 
                                  `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}` :
                                  appointment.client_nom || 'Patient'
                                }
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-gray-600">
                            {appointment.date_confirmee ? 
                              new Date(appointment.date_confirmee).toLocaleDateString('fr-FR') : 
                              'Date non définie'
                            }
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {appointment.service?.nom || 'Consultation'}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Terminé
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
          <PatientDetailsModal 
            patient={selectedPatient}
          />
        </Dialog>

        <Dialog open={showPrescription} onOpenChange={setShowPrescription}>
          <PrescriptionModal patient={selectedPatient} />
        </Dialog>

        <Dialog open={showMedicalReport} onOpenChange={setShowMedicalReport}>
          <MedicalReportModal patient={selectedPatient} />
        </Dialog>
      </div>
    </div>
  );
};

export default DoctorDashboard;