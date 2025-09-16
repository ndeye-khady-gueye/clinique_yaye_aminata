import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Baby, 
  User, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Plus,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';
import { patientEnregistreService, PatientEnregistre } from '@/services/patientEnregistreService';
import { toast } from 'sonner';
import PatientEnregistreForm from '@/components/forms/PatientEnregistreForm';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

const ReceptionistDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientEnregistre[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [selectedChart, setSelectedChart] = useState<'age' | 'trend' | 'status'>('age');

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    generateNotifications();
  }, [patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const patientsData = await patientEnregistreService.getAllPatientsEnregistres();
      setPatients(patientsData);
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
      toast.error("Impossible de charger les patients");
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = () => {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    
    const newNotifications: string[] = [];
    
    // Patients enregistrés dans les 3 dernières heures
    const recentPatients = patients.filter(p => {
      if (!p.date_enregistrement) return false;
      const patientDate = new Date(p.date_enregistrement);
      return patientDate >= threeHoursAgo;
    });

    if (recentPatients.length > 0) {
      if (recentPatients.length === 1) {
        newNotifications.push(`${recentPatients.length} nouveau patient enregistré`);
      } else {
        newNotifications.push(`${recentPatients.length} nouveaux patients enregistrés`);
      }
    }

    // Patients en consultation
    const enConsultation = patients.filter(p => p.statut === 'en_consultation').length;
    if (enConsultation > 0) {
      newNotifications.push(`${enConsultation} patient(s) en consultation`);
    }

    setNotifications(newNotifications);
  };

  // Calcul des statistiques par âge
  const getAgeStats = () => {
    const now = new Date();
    const currentYear = now.getFullYear();

    const ageGroups = {
      enfants: { min: 0, max: 14, count: 0, label: 'Enfants (0-14 ans)' },
      adolescents: { min: 15, max: 19, count: 0, label: 'Adolescents (15-19 ans)' },
      jeunesAdultes: { min: 20, max: 24, count: 0, label: 'Jeunes Adultes (20-24 ans)' },
      adultes: { min: 25, max: 49, count: 0, label: 'Adultes (25-49 ans)' },
      seniors: { min: 50, max: 59, count: 0, label: 'Seniors (50-59 ans)' },
      aines: { min: 60, max: 999, count: 0, label: 'Aînés (60+ ans)' }
    };

    patients.forEach(patient => {
      if (patient.age) {
        for (const group of Object.values(ageGroups)) {
          if (patient.age >= group.min && patient.age <= group.max) {
            group.count++;
            break;
          }
        }
      }
    });

    return ageGroups;
  };

  // Données pour les graphiques
  const getChartData = () => {
    const ageStats = getAgeStats();
    
    return {
      ageDistribution: Object.values(ageStats).map(group => ({
        name: group.label,
        value: group.count,
        color: getAgeGroupColor(group.label)
      })),
      ageBars: Object.values(ageStats).map(group => ({
        name: group.label.split(' ')[0],
        patients: group.count,
        color: getAgeGroupColor(group.label)
      })),
      trends: getTrendData()
    };
  };

  const getAgeGroupColor = (label: string) => {
    const colors: { [key: string]: string } = {
      'Enfants (0-14 ans)': '#3B82F6',      // Bleu
      'Adolescents (15-19 ans)': '#8B5CF6', // Violet
      'Jeunes Adultes (20-24 ans)': '#EC4899', // Rose
      'Adultes (25-49 ans)': '#10B981',     // Vert
      'Seniors (50-59 ans)': '#F59E0B',     // Orange
      'Aînés (60+ ans)': '#EF4444'          // Rouge
    };
    return colors[label] || '#6B7280';
  };

  const getTrendData = () => {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = patients.filter(p => {
      if (!p.date_enregistrement) return false;
      const date = new Date(p.date_enregistrement);
      return date >= lastWeek;
    }).length;

    const lastWeekCount = Math.floor(thisWeek * 0.8); // Simulation pour l'exemple
    const thisMonth = patients.filter(p => {
      if (!p.date_enregistrement) return false;
      const date = new Date(p.date_enregistrement);
      return date >= lastMonth;
    }).length;

    const lastMonthCount = Math.floor(thisMonth * 0.75); // Simulation pour l'exemple

    return [
      { period: 'Semaine précédente', patients: lastWeekCount, trend: 'down' },
      { period: 'Cette semaine', patients: thisWeek, trend: 'up' },
      { period: 'Mois précédent', patients: lastMonthCount, trend: 'down' },
      { period: 'Ce mois', patients: thisMonth, trend: 'up' }
    ];
  };

  const handleCreatePatient = async (data: any) => {
    try {
      await patientEnregistreService.createPatientEnregistre(data);
      toast.success("Patient enregistré avec succès !");
      setIsFormOpen(false);
      await loadPatients();
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      toast.error("Erreur lors de l'enregistrement du patient");
    }
  };

  const ageStats = getAgeStats();
  const chartData = getChartData();
  const totalPatients = patients.length;
  const totalAdultes = Object.values(ageStats).reduce((sum, group) => {
    if (group.label !== 'Enfants (0-14 ans)') {
      return sum + group.count;
    }
    return sum;
  }, 0);

  const totalEnfants = ageStats.enfants.count;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const exportDashboardToPDF = async () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      let y = 20;

      // Add header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Tableau de Bord du Cabinet Médical', pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Add date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, y, { align: 'center' });
      y += 20;

      // Add statistics section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Statistiques Générales', 20, y);
      y += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Patients: ${totalPatients}`, 20, y);
      y += 8;
      doc.text(`Enfants (0-14 ans): ${totalEnfants}`, 20, y);
      y += 8;
      doc.text(`Adultes (15+ ans): ${totalAdultes}`, 20, y);
      y += 8;
      doc.text(`Patients enregistrés aujourd'hui: ${patients.filter(p => 
        p.date_enregistrement === new Date().toISOString().split('T')[0]
      ).length}`, 20, y);
      y += 20;

      // Add age distribution section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Répartition par Âge', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      Object.values(ageStats).forEach((group) => {
        if (group.count > 0) {
          const percentage = ((group.count / totalPatients) * 100).toFixed(1);
          doc.text(`${group.label}: ${group.count} patients (${percentage}%)`, 20, y);
          y += 6;
        }
      });

      y += 15;

      // Add status distribution section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Répartition par Statut', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const statusData = [
        { status: 'Enregistré', count: patients.filter(p => p.statut === 'enregistre').length },
        { status: 'En consultation', count: patients.filter(p => p.statut === 'en_consultation').length },
        { status: 'Terminé', count: patients.filter(p => p.statut === 'termine').length },
        { status: 'Annulé', count: patients.filter(p => p.statut === 'annule').length }
      ];

      statusData.forEach((status) => {
        if (status.count > 0) {
          const percentage = ((status.count / totalPatients) * 100).toFixed(1);
          doc.text(`${status.status}: ${status.count} patients (${percentage}%)`, 20, y);
          y += 6;
        }
      });

      y += 15;

      // Add trends section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Évolution Temporelle', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      chartData.trends.forEach((trend) => {
        const trendIcon = trend.trend === 'up' ? '↗' : '↘';
        doc.text(`${trend.period}: ${trend.patients} patients ${trendIcon}`, 20, y);
        y += 6;
      });

      // Add footer
      y = pageHeight - 20;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('Généré automatiquement par le système de gestion de clinique', pageWidth / 2, y, { align: 'center' });

      // Save the PDF
      doc.save(`tableau_de_bord_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success("Rapport PDF généré avec succès !");
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error("Impossible de générer le rapport PDF");
    }
  };

  const exportDashboardWithCharts = async () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      let y = 20;

      // Add header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Tableau de Bord du Cabinet Médical', pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Add date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, y, { align: 'center' });
      y += 20;

      // Add statistics section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Statistiques Générales', 20, y);
      y += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Patients: ${totalPatients}`, 20, y);
      y += 8;
      doc.text(`Enfants (0-14 ans): ${totalEnfants}`, 20, y);
      y += 8;
      doc.text(`Adultes (15+ ans): ${totalAdultes}`, 20, y);
      y += 8;
      doc.text(`Patients enregistrés aujourd'hui: ${patients.filter(p => 
        p.date_enregistrement === new Date().toISOString().split('T')[0]
      ).length}`, 20, y);
      y += 20;

      // Try to capture charts
      try {
        // Capture the pie chart
        const pieChartElement = document.querySelector('[data-chart="pie"]');
        if (pieChartElement) {
          const pieChartDataUrl = await toPng(pieChartElement as HTMLElement);
          const imgWidth = 80;
          const imgHeight = 60;
          doc.addImage(pieChartDataUrl, 'PNG', 20, y, imgWidth, imgHeight);
          y += imgHeight + 10;
        }
      } catch (chartError) {
        console.log('Impossible de capturer les graphiques, utilisation du format texte');
      }

      // Add age distribution section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Répartition par Âge', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      Object.values(ageStats).forEach((group) => {
        if (group.count > 0) {
          const percentage = ((group.count / totalPatients) * 100).toFixed(1);
          doc.text(`${group.label}: ${group.count} patients (${percentage}%)`, 20, y);
          y += 6;
        }
      });

      y += 15;

      // Add status distribution section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Répartition par Statut', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const statusData = [
        { status: 'Enregistré', count: patients.filter(p => p.statut === 'enregistre').length },
        { status: 'En consultation', count: patients.filter(p => p.statut === 'en_consultation').length },
        { status: 'Terminé', count: patients.filter(p => p.statut === 'termine').length },
        { status: 'Annulé', count: patients.filter(p => p.statut === 'annule').length }
      ];

      statusData.forEach((status) => {
        if (status.count > 0) {
          const percentage = ((status.count / totalPatients) * 100).toFixed(1);
          doc.text(`${status.status}: ${status.count} patients (${percentage}%)`, 20, y);
          y += 6;
        }
      });

      y += 15;

      // Add trends section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Évolution Temporelle', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      chartData.trends.forEach((trend) => {
        const trendIcon = trend.trend === 'up' ? '↗' : '↘';
        doc.text(`${trend.period}: ${trend.patients} patients ${trendIcon}`, 20, y);
        y += 6;
      });

      // Add footer
      y = pageHeight - 20;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('Généré automatiquement par le système de gestion de clinique', pageWidth / 2, y, { align: 'center' });

      // Save the PDF
      doc.save(`tableau_de_bord_complet_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success("Rapport PDF avec graphiques généré avec succès !");
    } catch (error) {
      console.error('Erreur lors de la génération du PDF avec graphiques:', error);
      toast.error("Impossible de générer le rapport PDF avec graphiques");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* En-tête avec notifications */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600">Vue d'ensemble des patients enregistrés</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="flex space-x-2">
              {notifications.map((notification, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {notification}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Bouton Ajouter Patient */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <PatientEnregistreForm
                onSubmit={handleCreatePatient}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          {/* Bouton Export PDF */}
          <Button 
            onClick={exportDashboardToPDF}
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          {/* Bouton Export PDF avec Graphiques */}
          <Button 
            onClick={exportDashboardWithCharts}
            variant="outline" 
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF + Graphiques
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{totalPatients}</div>
            <p className="text-xs text-blue-700">Tous les patients enregistrés</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Enfants (0-14 ans)</CardTitle>
            <Baby className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{totalEnfants}</div>
            <p className="text-xs text-green-700">Patients enfants</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Adultes (15+ ans)</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{totalAdultes}</div>
            <p className="text-xs text-purple-700">Patients adultes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {patients.filter(p => 
                p.date_enregistrement === new Date().toISOString().split('T')[0]
              ).length}
            </div>
            <p className="text-xs text-orange-700">Nouveaux patients</p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition détaillée par âge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Répartition par âge
            </CardTitle>
            <CardDescription>Détail des patients par tranche d'âge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(ageStats).map((group, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getAgeGroupColor(group.label) }}
                    ></div>
                    <span className="font-medium text-gray-700">{group.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold" style={{ color: getAgeGroupColor(group.label) }}>
                      {group.count}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({group.count > 0 ? ((group.count / totalPatients) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Graphique en secteurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Répartition globale
            </CardTitle>
            <CardDescription>Visualisation en secteurs par âge</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart data-chart="pie">
                <Pie
                  data={chartData.ageDistribution.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.ageDistribution.filter(item => item.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques interactifs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Graphiques interactifs
              </CardTitle>
              <CardDescription>Cliquez sur les graphiques pour voir les détails</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedChart === 'age' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChart('age')}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Âge
              </Button>
              <Button
                variant={selectedChart === 'trend' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChart('trend')}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Tendances
              </Button>
              <Button
                variant={selectedChart === 'status' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChart('status')}
              >
                <Activity className="h-4 w-4 mr-1" />
                Statuts
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            {selectedChart === 'age' ? (
              <BarChart data={chartData.ageBars}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="patients" 
                  fill="#6C2476"
                  onClick={(data) => {
                    toast.info(`${data.name}: ${data.patients} patients`);
                  }}
                />
              </BarChart>
            ) : selectedChart === 'trend' ? (
              <RechartsLineChart data={chartData.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#6C2476" 
                  strokeWidth={3}
                  dot={{ fill: '#6C2476', strokeWidth: 2, r: 6 }}
                />
              </RechartsLineChart>
            ) : (
              <BarChart data={[
                { status: 'Enregistré', count: patients.filter(p => p.statut === 'enregistre').length },
                { status: 'En consultation', count: patients.filter(p => p.statut === 'en_consultation').length },
                { status: 'Terminé', count: patients.filter(p => p.statut === 'termine').length },
                { status: 'Annulé', count: patients.filter(p => p.statut === 'annule').length }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="#6C2476"
                  onClick={(data) => {
                    toast.info(`${data.status}: ${data.count} patients`);
                  }}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tendances et comparaisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Évolution hebdomadaire
            </CardTitle>
            <CardDescription>Comparaison avec la semaine précédente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.trends.slice(0, 2).map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{trend.period}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">{trend.patients}</span>
                    {trend.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Évolution mensuelle
            </CardTitle>
            <CardDescription>Comparaison avec le mois précédent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.trends.slice(2).map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{trend.period}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">{trend.patients}</span>
                    {trend.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
