import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, TrendingUp, Users, Clock, DollarSign, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import apiService from '@/services/api';
import { toast } from 'sonner';

interface ReportData {
  period: string;
  totalAppointments: number;
  newPatients: number;
  revenue: number;
  averageTime: number;
  growthAppointments: number;
  growthPatients: number;
  growthRevenue: number;
  growthTime: number;
}

interface DoctorPerformance {
  id: number;
  name: string;
  patients: number;
  appointments: number;
  rating: number;
  specialty: string;
}

interface ChartData {
  dailyData: Array<{
    day: string;
    appointments: number;
  }>;
  monthlyData: Array<{
    month: string;
    appointments: number;
  }>;
  specialtyData: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
}

const ReportsAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [doctorPerformance, setDoctorPerformance] = useState<DoctorPerformance[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    dailyData: [],
    monthlyData: [],
    specialtyData: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReportData, setNewReportData] = useState({
    title: '',
    description: '',
    period: '30d',
    includeCharts: true,
    includeRecommendations: true
  });

  // Charger les données des rapports
  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les statistiques générales
      const stats = await apiService.getStatistiques();
      
      // Charger tous les rendez-vous pour les analyses
      const allAppointments = await apiService.getRendezVous();
      const appointmentsArray = Array.isArray(allAppointments) ? allAppointments : [];
      
      // Charger les médecins pour les performances
      const doctors = await apiService.getDoctors();
      const doctorsArray = Array.isArray(doctors) ? doctors : [];

      // Calculer les données du rapport
      const now = new Date();
      const periodDays = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));
      
      const periodAppointments = appointmentsArray.filter(rdv => {
        // Utiliser date_confirmee en priorité, sinon date_souhaitee, sinon date de création
        const rdvDate = new Date(rdv.date_confirmee || rdv.date_souhaitee || rdv.created_at || new Date());
        return rdvDate >= startDate;
      });

      const previousPeriodStart = new Date(startDate.getTime() - (periodDays * 24 * 60 * 60 * 1000));
      const previousPeriodAppointments = appointmentsArray.filter(rdv => {
        const rdvDate = new Date(rdv.date_confirmee || rdv.date_souhaitee || rdv.created_at || new Date());
        return rdvDate >= previousPeriodStart && rdvDate < startDate;
      });
      

      // Calculer les métriques
      const totalAppointments = periodAppointments.length;
      const newPatients = new Set(periodAppointments.map(rdv => rdv.patient?.id || rdv.client_nom)).size;
      const revenue = periodAppointments.reduce((sum, rdv) => {
        const price = rdv.prix_consultation || rdv.service?.prix || 0;
        return sum + (typeof price === 'number' ? price : 0);
      }, 0);
      
      // Calculer le temps moyen basé sur les données réelles
      const completedAppointments = periodAppointments.filter(rdv => rdv.statut === 'realise' || rdv.statut === 'termine');
      const averageTime = completedAppointments.length > 0 ? 
        Math.round(completedAppointments.reduce((sum, rdv) => sum + (rdv.duree_consultation || 30), 0) / completedAppointments.length) : 
        30; // Valeur par défaut si pas de données

      // Calculer les croissances
      const prevTotalAppointments = previousPeriodAppointments.length;
      const prevNewPatients = new Set(previousPeriodAppointments.map(rdv => rdv.patient?.id || rdv.client_nom)).size;
      const prevRevenue = previousPeriodAppointments.reduce((sum, rdv) => {
        const price = rdv.prix_consultation || rdv.service?.prix || 0;
        return sum + (typeof price === 'number' ? price : 0);
      }, 0);
      
      // Calculer le temps moyen de la période précédente
      const prevCompletedAppointments = previousPeriodAppointments.filter(rdv => rdv.statut === 'realise' || rdv.statut === 'termine');
      const prevAverageTime = prevCompletedAppointments.length > 0 ? 
        Math.round(prevCompletedAppointments.reduce((sum, rdv) => sum + (rdv.duree_consultation || 30), 0) / prevCompletedAppointments.length) : 
        30;

      const growthAppointments = prevTotalAppointments > 0 ? 
        Math.round(((totalAppointments - prevTotalAppointments) / prevTotalAppointments) * 100) : 0;
      const growthPatients = prevNewPatients > 0 ? 
        Math.round(((newPatients - prevNewPatients) / prevNewPatients) * 100) : 0;
      const growthRevenue = prevRevenue > 0 ? 
        Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : 0;
      const growthTime = prevAverageTime > 0 ? 
        Math.round(averageTime - prevAverageTime) : 0;

      setReportData({
        period: selectedPeriod,
        totalAppointments,
        newPatients,
        revenue,
        averageTime,
        growthAppointments,
        growthPatients,
        growthRevenue,
        growthTime
      });

      // Générer les données des graphiques avec TOUTES les données
      generateChartData(appointmentsArray, doctorsArray);

      // Calculer les performances des médecins
      calculateDoctorPerformance(appointmentsArray, doctorsArray);

    } catch (err) {
      console.error('Erreur lors du chargement des rapports:', err);
      setError('Erreur lors du chargement des données des rapports');
    } finally {
      setLoading(false);
    }
  };

  // Générer les données des graphiques
  const generateChartData = (appointments: any[], doctors: any[]) => {
    const now = new Date();
    
    // Données quotidiennes (7 derniers jours)
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      
      const dayAppointments = appointments.filter(rdv => {
        const rdvDate = new Date(rdv.date_confirmee || rdv.date_souhaitee || rdv.created_at || new Date());
        return rdvDate.toDateString() === date.toDateString();
      });
      
      dailyData.push({
        day: dayName,
        appointments: dayAppointments.length
      });
    }

    // Données mensuelles (6 derniers mois)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      const monthAppointments = appointments.filter(rdv => {
        const rdvDate = new Date(rdv.date_confirmee || rdv.date_souhaitee || rdv.created_at || new Date());
        return rdvDate.getMonth() === date.getMonth() && rdvDate.getFullYear() === date.getFullYear();
      });
      
      monthlyData.push({
        month: monthName,
        appointments: monthAppointments.length
      });
    }

    // Données par spécialité
    const specialtyCount: { [key: string]: number } = {};
    appointments.forEach(rdv => {
      const specialty = rdv.docteur?.speciality || rdv.service?.nom || 'Généraliste';
      specialtyCount[specialty] = (specialtyCount[specialty] || 0) + 1;
    });

    const totalSpecialtyAppointments = Object.values(specialtyCount).reduce((sum, count) => sum + count, 0);
    const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
    
    const specialtyData = Object.entries(specialtyCount).map(([name, value], index) => ({
      name,
      value,
      percentage: Math.round((value / totalSpecialtyAppointments) * 100),
      color: colors[index % colors.length]
    }));

    setChartData({
      dailyData,
      monthlyData,
      specialtyData
    });
  };

  // Calculer les performances des médecins
  const calculateDoctorPerformance = (appointments: any[], doctors: any[]) => {
    const doctorStats: { [key: number]: { 
      patients: Set<string>, 
      appointments: number, 
      completedAppointments: number,
      totalRevenue: number,
      averageRating: number 
    } } = {};
    
    appointments.forEach(rdv => {
      const doctorId = rdv.docteur?.id;
      if (doctorId) {
        if (!doctorStats[doctorId]) {
          doctorStats[doctorId] = {
            patients: new Set(),
            appointments: 0,
            completedAppointments: 0,
            totalRevenue: 0,
            averageRating: 4.5 // Note de base
          };
        }
        
        doctorStats[doctorId].appointments++;
        const price = rdv.prix_consultation || rdv.service?.prix || 0;
        doctorStats[doctorId].totalRevenue += typeof price === 'number' ? price : 0;
        
        if (rdv.statut === 'realise' || rdv.statut === 'termine') {
          doctorStats[doctorId].completedAppointments++;
        }
        
        if (rdv.patient?.id) {
          doctorStats[doctorId].patients.add(rdv.patient.id.toString());
        } else if (rdv.client_nom) {
          doctorStats[doctorId].patients.add(rdv.client_nom);
        }
      }
    });

    const performance = doctors.map(doctor => {
      const stats = doctorStats[doctor.id] || { 
        patients: new Set(), 
        appointments: 0, 
        completedAppointments: 0,
        totalRevenue: 0,
        averageRating: 4.5 
      };
      
      // Calculer la note basée sur les performances réelles
      let rating = 4.5; // Note de base
      if (stats.completedAppointments > 0) {
        const completionRate = stats.completedAppointments / stats.appointments;
        rating = 4.0 + (completionRate * 1.0); // Entre 4.0 et 5.0
      }
      
      return {
        id: doctor.id,
        name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        patients: stats.patients.size,
        appointments: stats.appointments,
        rating: Math.round(rating * 10) / 10,
        specialty: doctor.speciality || 'Généraliste'
      };
    }).sort((a, b) => b.appointments - a.appointments);

    setDoctorPerformance(performance);
  };

  // Générer un PDF personnalisé pour le nouveau rapport
  const generateCustomPDF = async () => {
    try {
      // Importer les dépendances nécessaires
      const { jsPDF } = await import('jspdf');
      
      // Créer le PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Titre personnalisé
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(newReportData.title, pageWidth / 2, 20, { align: 'center' });
      
      // Description si fournie
      if (newReportData.description.trim()) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'italic');
        const descriptionLines = pdf.splitTextToSize(newReportData.description, pageWidth - 40);
        pdf.text(descriptionLines, pageWidth / 2, 30, { align: 'center' });
      }
      
      // Date du rapport
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const reportDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Rapport généré le ${reportDate}`, pageWidth / 2, newReportData.description.trim() ? 40 : 30, { align: 'center' });
      
      // Période d'analyse
      const periodText = newReportData.period === '7d' ? '7 derniers jours' : 
                        newReportData.period === '30d' ? '30 derniers jours' : '90 derniers jours';
      pdf.text(`Période d'analyse: ${periodText}`, pageWidth / 2, newReportData.description.trim() ? 50 : 40, { align: 'center' });
      
      // Métriques principales
      let yPosition = newReportData.description.trim() ? 70 : 60;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Métriques Principales', 20, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      if (reportData) {
        pdf.text(`• Rendez-vous: ${reportData.totalAppointments}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`• Nouveaux patients: ${reportData.newPatients}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`• Revenus: ${reportData.revenue.toLocaleString()} FCFA`, 20, yPosition);
        yPosition += 8;
        pdf.text(`• Temps moyen: ${reportData.averageTime} minutes`, 20, yPosition);
        yPosition += 8;
        
        // Croissances
        if (reportData.growthAppointments !== 0) {
          const growthText = reportData.growthAppointments > 0 ? '+' : '';
          pdf.text(`• Croissance RDV: ${growthText}${reportData.growthAppointments}%`, 20, yPosition);
          yPosition += 8;
        }
      }
      
      // Performance des médecins (si inclus)
      if (newReportData.includeCharts && doctorPerformance.length > 0) {
        yPosition += 10;
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Performance des Médecins', 20, yPosition);
        
        yPosition += 15;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        
        doctorPerformance.forEach((doctor, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.text(`${index + 1}. ${doctor.name}`, 20, yPosition);
          yPosition += 6;
          pdf.text(`   Patients: ${doctor.patients} | RDV: ${doctor.appointments} | Note: ${doctor.rating}/5`, 25, yPosition);
          yPosition += 8;
        });
      }
      
      // Recommandations (si incluses)
      if (newReportData.includeRecommendations) {
        yPosition += 10;
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Recommandations', 20, yPosition);
        
        yPosition += 15;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        
        const recommendations = [];
        if (reportData) {
          if (reportData.growthAppointments > 0) {
            recommendations.push(`• Croissance positive de ${reportData.growthAppointments}% - Considérez l'ajout de créneaux`);
          }
          if (reportData.growthTime > 0) {
            recommendations.push(`• Temps de consultation en hausse de ${reportData.growthTime} min - Vérifiez la charge de travail`);
          }
          if (reportData.revenue > 0) {
            recommendations.push(`• Revenus générés: ${reportData.revenue.toLocaleString()} FCFA`);
          }
        }
        
        if (recommendations.length === 0) {
          recommendations.push('• Continuez sur cette lancée avec les performances actuelles');
        }
        
        recommendations.forEach(rec => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(rec, 20, yPosition);
          yPosition += 8;
        });
      }
      
      // Pied de page
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Généré par le système de gestion du Cabinet Yaye Aminata', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Télécharger le PDF avec le nom personnalisé
      const fileName = `${newReportData.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (err) {
      console.error('Erreur lors de la génération du PDF personnalisé:', err);
      throw err;
    }
  };

  // Exporter en PDF
  const handleExportPDF = async () => {
    try {
      toast.success('Génération du PDF en cours...');
      
      // Importer les dépendances nécessaires
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      // Créer le PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Titre principal
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Rapport d\'Analyse - Cabinet Yaye Aminata', pageWidth / 2, 20, { align: 'center' });
      
      // Date du rapport
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const reportDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Rapport généré le ${reportDate}`, pageWidth / 2, 30, { align: 'center' });
      
      // Métriques principales
      let yPosition = 50;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Métriques Principales', 20, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      if (reportData) {
        pdf.text(`• Rendez-vous: ${reportData.totalAppointments}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`• Nouveaux patients: ${reportData.newPatients}`, 20, yPosition);
        yPosition += 8;
        pdf.text(`• Revenus: ${reportData.revenue.toLocaleString()} FCFA`, 20, yPosition);
        yPosition += 8;
        pdf.text(`• Temps moyen: ${reportData.averageTime} minutes`, 20, yPosition);
        yPosition += 8;
        
        // Croissances
        if (reportData.growthAppointments !== 0) {
          const growthText = reportData.growthAppointments > 0 ? '+' : '';
          pdf.text(`• Croissance RDV: ${growthText}${reportData.growthAppointments}%`, 20, yPosition);
          yPosition += 8;
        }
      }
      
      // Performance des médecins
      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Performance des Médecins', 20, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      doctorPerformance.forEach((doctor, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(`${index + 1}. ${doctor.name}`, 20, yPosition);
        yPosition += 6;
        pdf.text(`   Patients: ${doctor.patients} | RDV: ${doctor.appointments} | Note: ${doctor.rating}/5`, 25, yPosition);
        yPosition += 8;
      });
      
      // Recommandations
      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Recommandations', 20, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const recommendations = [];
      if (reportData) {
        if (reportData.growthAppointments > 0) {
          recommendations.push(`• Croissance positive de ${reportData.growthAppointments}% - Considérez l'ajout de créneaux`);
        }
        if (reportData.growthTime > 0) {
          recommendations.push(`• Temps de consultation en hausse de ${reportData.growthTime} min - Vérifiez la charge de travail`);
        }
        if (reportData.revenue > 0) {
          recommendations.push(`• Revenus générés: ${reportData.revenue.toLocaleString()} FCFA`);
        }
      }
      
      if (recommendations.length === 0) {
        recommendations.push('• Continuez sur cette lancée avec les performances actuelles');
      }
      
      recommendations.forEach(rec => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(rec, 20, yPosition);
        yPosition += 8;
      });
      
      // Pied de page
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Généré par le système de gestion du Cabinet Yaye Aminata', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Télécharger le PDF
      const fileName = `rapport_analyse_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF exporté avec succès !');
    } catch (err) {
      console.error('Erreur lors de l\'export PDF:', err);
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  // Gérer le nouveau rapport
  const handleNewReport = () => {
    setShowNewReportModal(true);
  };

  const handleCreateReport = async () => {
    try {
      if (!newReportData.title.trim()) {
        toast.error('Veuillez saisir un titre pour le rapport');
        return;
      }

      toast.success('Génération du rapport PDF en cours...');
      
      // Mettre à jour la période si nécessaire
      if (newReportData.period !== selectedPeriod) {
        setSelectedPeriod(newReportData.period);
      }
      
      // Recharger les données avec les nouveaux paramètres
      await loadReportData();
      
      // Attendre un peu pour que les données se chargent
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Générer le PDF avec le titre personnalisé
      await generateCustomPDF();
      
      // Fermer le modal
      setShowNewReportModal(false);
      
      // Réinitialiser les données du formulaire
      setNewReportData({
        title: '',
        description: '',
        period: '30d',
        includeCharts: true,
        includeRecommendations: true
      });
      
      toast.success('Rapport PDF généré et téléchargé !');
    } catch (err) {
      console.error('Erreur lors de la création du rapport:', err);
      toast.error('Erreur lors de la création du rapport');
    }
  };

  const handleCancelReport = () => {
    setShowNewReportModal(false);
    setNewReportData({
      title: '',
      description: '',
      period: '30d',
      includeCharts: true,
      includeRecommendations: true
    });
  };

  // Charger les données au montage et quand la période change
  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des rapports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={loadReportData}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            Rapports et Analyses
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Statistiques détaillées et analyses de performance
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={handleExportPDF} 
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden xs:inline">Exporter PDF</span>
            <span className="xs:hidden">PDF</span>
          </Button>
          <Button 
            onClick={handleNewReport} 
            variant="outline"
            className="w-full sm:w-auto"
            size="sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden xs:inline">Nouveau rapport</span>
            <span className="xs:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Filtres et paramètres</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium">Période</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                  <SelectItem value="90d">90 derniers jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium">Date de début</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium">Date de fin</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Rendez-vous</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{reportData?.totalAppointments || 0}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 w-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-green-600 truncate">+{reportData?.growthAppointments || 0}% vs période précédente</span>
                </div>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Nouveaux patients</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{reportData?.newPatients || 0}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 w-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-green-600 truncate">+{reportData?.growthPatients || 0}% vs période précédente</span>
                </div>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{reportData?.revenue?.toLocaleString() || 0} FCFA</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 w-3 sm:w-4 sm:h-4 text-green-500 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-green-600 truncate">+{reportData?.growthRevenue || 0}% vs période précédente</span>
                </div>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Temps moyen</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{reportData?.averageTime || 0} min</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 w-3 sm:w-4 sm:h-4 text-orange-500 mr-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-orange-600 truncate">+{reportData?.growthTime || 0} min vs période précédente</span>
                </div>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Rendez-vous par jour */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Rendez-vous par jour (cette semaine)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="appointments" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Évolution mensuelle */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Évolution mensuelle</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par spécialité */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Répartition par spécialité</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.specialtyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.specialtyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {chartData.specialtyData.map((specialty, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 flex-shrink-0" 
                      style={{ backgroundColor: specialty.color }}
                    ></div>
                    <span className="text-xs sm:text-sm font-medium truncate">{specialty.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">{specialty.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance des médecins */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Performance des médecins</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {doctorPerformance.map((doctor) => (
              <div key={doctor.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{doctor.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{doctor.specialty}</p>
                  <div className="flex items-center mt-1 sm:mt-2">
                    <span className="text-xs sm:text-sm text-gray-600">{doctor.patients} patients • {doctor.appointments} RDV</span>
                  </div>
                </div>
                <div className="flex items-center justify-end sm:justify-start">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 font-semibold text-sm sm:text-base">{doctor.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Rapport détaillé - Actions recommandées</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {reportData && reportData.growthAppointments > 0 && (
              <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-green-800 text-sm sm:text-base">📈 Croissance positive</h4>
                  <p className="text-green-700 text-xs sm:text-sm">
                    Le nombre de rendez-vous a augmenté de {reportData.growthAppointments}% cette période. 
                    Considérez l'ajout de créneaux supplémentaires.
                  </p>
                </div>
              </div>
            )}
            
            {reportData && reportData.growthAppointments < 0 && (
              <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-red-800 text-sm sm:text-base">📉 Baisse d'activité</h4>
                  <p className="text-red-700 text-xs sm:text-sm">
                    Le nombre de rendez-vous a diminué de {Math.abs(reportData.growthAppointments)}% cette période. 
                    Analysez les causes et mettez en place des actions correctives.
                  </p>
                </div>
              </div>
            )}
            
            {reportData && reportData.growthTime > 0 && (
              <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-orange-800 text-sm sm:text-base">⚠️ Attention nécessaire</h4>
                  <p className="text-orange-700 text-xs sm:text-sm">
                    Le temps moyen de consultation a augmenté de {reportData.growthTime} minutes. 
                    Vérifiez la charge de travail des médecins.
                  </p>
                </div>
              </div>
            )}
            
            {reportData && reportData.growthTime < 0 && (
              <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-green-800 text-sm sm:text-base">✅ Amélioration de l'efficacité</h4>
                  <p className="text-green-700 text-xs sm:text-sm">
                    Le temps moyen de consultation a diminué de {Math.abs(reportData.growthTime)} minutes. 
                    Excellente optimisation des processus !
                  </p>
                </div>
              </div>
            )}
            
            {reportData && reportData.revenue > 0 && (
              <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-blue-800 text-sm sm:text-base">💰 Revenus générés</h4>
                  <p className="text-blue-700 text-xs sm:text-sm">
                    {reportData.revenue.toLocaleString()} FCFA générés cette période. 
                    {reportData.growthRevenue > 0 ? ` +${reportData.growthRevenue}% vs période précédente` : ''}
                  </p>
                </div>
              </div>
            )}
            
            {doctorPerformance.length > 0 && (
              <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-purple-50 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-purple-800 text-sm sm:text-base">👨‍⚕️ Performance de l'équipe</h4>
                  <p className="text-purple-700 text-xs sm:text-sm">
                    {doctorPerformance.length} médecin(s) actif(s) avec une note moyenne de {
                      (doctorPerformance.reduce((sum, doc) => sum + doc.rating, 0) / doctorPerformance.length).toFixed(1)
                    }/5. {doctorPerformance[0]?.name} est le plus performant avec {doctorPerformance[0]?.appointments} RDV.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Nouveau Rapport */}
      {showNewReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Générer un rapport PDF personnalisé</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Titre du rapport *</label>
                <input
                  type="text"
                  value={newReportData.title}
                  onChange={(e) => setNewReportData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="Ex: Rapport mensuel de performance"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Description</label>
                <textarea
                  value={newReportData.description}
                  onChange={(e) => setNewReportData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  rows={3}
                  placeholder="Description du rapport..."
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Période d'analyse</label>
                <Select value={newReportData.period} onValueChange={(value) => setNewReportData(prev => ({ ...prev, period: value }))}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 derniers jours</SelectItem>
                    <SelectItem value="30d">30 derniers jours</SelectItem>
                    <SelectItem value="90d">90 derniers jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newReportData.includeCharts}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, includeCharts: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-xs sm:text-sm">Inclure les graphiques</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newReportData.includeRecommendations}
                    onChange={(e) => setNewReportData(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-xs sm:text-sm">Inclure les recommandations</span>
                </label>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
              <Button onClick={handleCancelReport} variant="outline" className="w-full sm:w-auto" size="sm">
                Annuler
              </Button>
              <Button onClick={handleCreateReport} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto" size="sm">
                <span className="hidden xs:inline">Générer et télécharger PDF</span>
                <span className="xs:hidden">Générer PDF</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
