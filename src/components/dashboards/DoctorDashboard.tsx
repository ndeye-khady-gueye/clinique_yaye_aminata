import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, FileText, Eye, FileCheck, Loader2, AlertTriangle, BarChart3, TrendingUp, PieChart, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Legend
} from 'recharts';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showMedicalReport, setShowMedicalReport] = useState(false);
  
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
  const [recentConsultations, setRecentConsultations] = useState<any[]>([]);
  
  // États pour les graphiques
  const [chartData, setChartData] = useState({
    weeklyData: [],
    statusDistribution: [],
    appointmentTrend: []
  });
  
  // États pour l'interactivité
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Mettre à jour les graphiques quand les filtres changent
  useEffect(() => {
    if (filteredAppointments.length > 0) {
      const chartData = generateChartData(filteredAppointments, selectedPeriod, selectedStatus);
      setChartData(chartData);
    }
  }, [selectedPeriod, selectedStatus, filteredAppointments]);

  // Générer les données des graphiques avec filtres
  const generateChartData = (appointments: any[], period: string = '7d', status: string = 'all') => {
    const now = new Date();
    const weeklyData = [];
    const statusCounts = {
      confirme: 0,
      assigne: 0,
      realise: 0,
      annule: 0,
      absent: 0,
      en_attente: 0
    };

    // Filtrer par statut si nécessaire
    let filteredAppointments = appointments;
    if (status !== 'all') {
      filteredAppointments = appointments.filter(apt => apt.statut === status);
    }

    // Déterminer le nombre de jours selon la période
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;

    // Données hebdomadaires/mensuelles
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      if (period === '7d') {
        date.setDate(date.getDate() - i);
      } else if (period === '30d') {
        date.setDate(date.getDate() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      const dayName = period === '7d' 
        ? date.toLocaleDateString('fr-FR', { weekday: 'short' })
        : date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
      
      const dayAppointments = filteredAppointments.filter(apt => {
        const aptDate = new Date(apt.date_confirmee || apt.date_demande);
        return aptDate.toDateString() === date.toDateString();
      });

      weeklyData.push({
        day: dayName,
        rdv: dayAppointments.length,
        realises: dayAppointments.filter(apt => apt.statut === 'realise').length,
        assignes: dayAppointments.filter(apt => apt.statut === 'assigne').length,
        annules: dayAppointments.filter(apt => apt.statut === 'annule').length,
        confirmes: dayAppointments.filter(apt => apt.statut === 'confirme').length,
        absents: dayAppointments.filter(apt => apt.statut === 'absent').length,
        en_attente: dayAppointments.filter(apt => apt.statut === 'en_attente').length
      });
    }

    // Distribution par statut
    filteredAppointments.forEach(apt => {
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

    // Tendance des rendez-vous
    const appointmentTrend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      if (period === '7d') {
        date.setDate(date.getDate() - i);
      } else if (period === '30d') {
        date.setDate(date.getDate() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      const dayAppointments = filteredAppointments.filter(apt => {
        const aptDate = new Date(apt.date_confirmee || apt.date_demande);
        return aptDate.toDateString() === date.toDateString();
      });

      appointmentTrend.push({
        date: period === '7d' 
          ? date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
          : date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        total: dayAppointments.length,
        realises: dayAppointments.filter(apt => apt.statut === 'realise').length,
        assignes: dayAppointments.filter(apt => apt.statut === 'assigne').length,
        confirmes: dayAppointments.filter(apt => apt.statut === 'confirme').length
      });
    }

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
      const statsData = await apiService.getStatistiques();
      setStatistics(statsData);

      // Charger les rendez-vous d'aujourd'hui
      const todayRdv = await doctorAppointmentsService.getTodayAppointments();
      setTodayAppointments(Array.isArray(todayRdv) ? todayRdv : []);

      // Charger les rendez-vous terminés (dernières 5)
      try {
        const allAppointments = await doctorAppointmentsService.getMyAppointments();
        
        // Filtrer seulement les rendez-vous terminés/réalisés
        const rendezVousTermines = allAppointments.filter(appointment => 
          appointment.statut === 'realise'
        );
        
        setRecentConsultations(rendezVousTermines.slice(0, 5));

        // Générer les données des graphiques
        const chartData = generateChartData(allAppointments, selectedPeriod, selectedStatus);
        setChartData(chartData);
        setFilteredAppointments(allAppointments);
      } catch (appointmentError) {
        console.warn('Erreur lors du chargement des rendez-vous terminés:', appointmentError);
        setRecentConsultations([]);
      }

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
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

  // Fonction pour changer la période
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (filteredAppointments.length > 0) {
      const chartData = generateChartData(filteredAppointments, period, selectedStatus);
      setChartData(chartData);
    }
  };

  // Fonction pour changer le statut
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (filteredAppointments.length > 0) {
      const chartData = generateChartData(filteredAppointments, selectedPeriod, status);
      setChartData(chartData);
    }
  };

  // Fonction pour gérer les clics sur les graphiques
  const handleChartClick = (data: any, chartType: string) => {
    console.log(`Clic sur ${chartType}:`, data);
    // Ici vous pouvez ajouter des actions spécifiques selon le type de graphique
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

  // Affichage de chargement
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

  // Affichage d'erreur
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
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header - Largeur fixe */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#6C2476' }}>
                Bienvenue, Dr. {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {user?.speciality} - Tableau de bord médical
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="text-xs sm:text-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden xs:inline">Actualiser</span>
                <span className="xs:hidden">Refresh</span>
              </Button>
              <Button 
                onClick={() => handlePatientAction(null, 'prescription')} 
                style={{ backgroundColor: '#B0368B' }}
                className="text-xs sm:text-sm"
              >
                <FileCheck className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Nouvelle Ordonnance</span>
                <span className="xs:hidden">Ordonnance</span>
              </Button>
            </div>
          </div>

          {/* Statistiques du jour - Largeur fixe */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  RDV Aujourd'hui
                </CardTitle>
                <Calendar className="h-4 w-4" style={{ color: '#6C2476' }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.total_rdv_aujourd_hui}</div>
                <p className="text-sm text-gray-500">rendez-vous</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Patients ce mois
                </CardTitle>
                <Users className="h-4 w-4" style={{ color: '#6C2476' }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.total_patients}</div>
                <p className="text-sm text-gray-500">patients</p>
              </CardContent>
            </Card>
          </div>

      {/* Contrôles interactifs pour les graphiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg" style={{ color: '#6C2476' }}>
            <Filter className="h-5 w-5 mr-2" />
            Filtres des Graphiques
          </CardTitle>
          <CardDescription>Personnalisez l'affichage des données selon vos besoins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Période</label>
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">90 derniers jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Statut</label>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="confirme">Confirmés</SelectItem>
                  <SelectItem value="assigne">Assignés</SelectItem>
                  <SelectItem value="realise">Réalisés</SelectItem>
                  <SelectItem value="annule">Annulés</SelectItem>
                  <SelectItem value="absent">Absents</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

          {/* Graphiques interactifs pour les RDV - Largeur fixe */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Graphique en barres - Évolution hebdomadaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg" style={{ color: '#6C2476' }}>
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Évolution Hebdomadaire
                </CardTitle>
                <CardDescription>Rendez-vous des 7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData.weeklyData}
                  onClick={(data) => handleChartClick(data, 'bar')}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Jour: ${label}`}
                  />
                  <Bar 
                    dataKey="rdv" 
                    fill="#6C2476" 
                    radius={[4, 4, 0, 0]} 
                    name="Total RDV"
                    onClick={(data) => handleChartClick(data, 'total-rdv')}
                    style={{ cursor: 'pointer' }}
                  />
                  <Bar 
                    dataKey="realises" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]} 
                    name="Réalisés"
                    onClick={(data) => handleChartClick(data, 'realises')}
                    style={{ cursor: 'pointer' }}
                  />
                  <Bar 
                    dataKey="assignes" 
                    fill="#B0368B" 
                    radius={[4, 4, 0, 0]} 
                    name="Assignés"
                    onClick={(data) => handleChartClick(data, 'assignes')}
                    style={{ cursor: 'pointer' }}
                  />
                  <Bar 
                    dataKey="confirmes" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]} 
                    name="Confirmés"
                    onClick={(data) => handleChartClick(data, 'confirmes')}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique en courbe - Tendance des RDV */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg" style={{ color: '#6C2476' }}>
              <TrendingUp className="h-5 w-5 mr-2" />
              Tendance des RDV
            </CardTitle>
            <CardDescription>Évolution sur 7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData.appointmentTrend}
                  onClick={(data) => handleChartClick(data, 'line')}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#6C2476" 
                    strokeWidth={3}
                    dot={{ fill: '#6C2476', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#6C2476' }}
                    name="Total RDV"
                    onClick={(data) => handleChartClick(data, 'total-trend')}
                    style={{ cursor: 'pointer' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="realises" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: '#10B981' }}
                    name="Réalisés"
                    onClick={(data) => handleChartClick(data, 'realises-trend')}
                    style={{ cursor: 'pointer' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="assignes" 
                    stroke="#B0368B" 
                    strokeWidth={2}
                    dot={{ fill: '#B0368B', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: '#B0368B' }}
                    name="Assignés"
                    onClick={(data) => handleChartClick(data, 'assignes-trend')}
                    style={{ cursor: 'pointer' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confirmes" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: '#3B82F6' }}
                    name="Confirmés"
                    onClick={(data) => handleChartClick(data, 'confirmes-trend')}
                    style={{ cursor: 'pointer' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique en secteurs - Distribution par statut */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg" style={{ color: '#6C2476' }}>
            <PieChart className="h-5 w-5 mr-2" />
            Distribution par Statut
          </CardTitle>
          <CardDescription>Répartition des rendez-vous par statut</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data) => handleChartClick(data, 'pie')}
                >
                  {chartData.statusDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      onClick={(data) => handleChartClick(data, `pie-${entry.name}`)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px'
                  }}
                  formatter={(value, name) => [value, name]}
                />
                <Legend 
                  onClick={(data) => handleChartClick(data, 'legend')}
                  style={{ cursor: 'pointer' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

          {/* Mes Rendez-vous du jour - Largeur fixe */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#6C2476' }} className="text-lg">Mes Rendez-vous du jour</CardTitle>
              <CardDescription>Vos rendez-vous de la journée</CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun rendez-vous prévu aujourd'hui</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="font-medium text-base">
                            {appointment.date_confirmee ? 
                              new Date(appointment.date_confirmee).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              }) : 
                              'Heure non définie'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-base">
                            {appointment.patient?.user ? 
                              `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}` :
                              appointment.client_nom || 'Patient'
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.service?.nom || 'Consultation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={
                            appointment.statut === 'confirme' ? 
                              'bg-green-100 text-green-800' : 
                              appointment.statut === 'assigne' ?
                              'bg-blue-100 text-blue-800' :
                              appointment.statut === 'realise' ?
                              'bg-purple-100 text-purple-800' :
                              appointment.statut === 'annule' ?
                              'bg-red-100 text-red-800' :
                              appointment.statut === 'absent' ?
                              'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                          }
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

          {/* Rendez-vous terminés - Largeur fixe */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#6C2476' }} className="text-lg">Rendez-vous terminés</CardTitle>
              <CardDescription>Historique des consultations réalisées</CardDescription>
            </CardHeader>
            <CardContent>
              {recentConsultations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun rendez-vous terminé récemment</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm">Patient</TableHead>
                        <TableHead className="text-sm">Date</TableHead>
                        <TableHead className="text-sm">Service</TableHead>
                        <TableHead className="text-sm">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentConsultations.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium text-sm">
                            {appointment.patient?.user ? 
                              `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}` :
                              appointment.client_nom || 'Patient'
                            }
                          </TableCell>
                          <TableCell className="text-sm">
                            {appointment.date_confirmee ? 
                              new Date(appointment.date_confirmee).toLocaleDateString('fr-FR') : 
                              'Date non définie'
                            }
                          </TableCell>
                          <TableCell className="text-sm">
                            {appointment.service?.nom || 'Consultation'}
                          </TableCell>
                          <TableCell className="text-sm">
                            <Badge className="bg-green-100 text-green-800">
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

          {/* Modals */}
          <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
            <PatientDetailsModal patient={selectedPatient} />
          </Dialog>

          <Dialog open={showPrescription} onOpenChange={setShowPrescription}>
            <PrescriptionModal patient={selectedPatient} />
          </Dialog>

          <Dialog open={showMedicalReport} onOpenChange={setShowMedicalReport}>
            <MedicalReportModal patient={selectedPatient} />
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
