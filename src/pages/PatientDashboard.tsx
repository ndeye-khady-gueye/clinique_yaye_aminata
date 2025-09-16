import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, FileText, TrendingUp, Activity, Heart, Stethoscope, Loader2, AlertTriangle, Eye, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import apiService from '@/services/api';
import jsPDF from 'jspdf';

interface PatientAppointment {
  id: number;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  date_confirmee: string;
  date_souhaitee: string;
  statut: string;
  message: string;
  prix_consultation: number;
  docteur: {
    id: number;
    first_name: string;
    last_name: string;
    speciality: string;
  };
  service: {
    id: number;
    nom: string;
    description: string;
    prix: number;
  };
  created_at: string;
}

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState({
    monthlyData: [],
    specialtyData: [],
    statusData: []
  });

  // Charger les données du patient
  const loadPatientData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer tous les rendez-vous et filtrer ceux du patient connecté
      const allAppointments = await apiService.getRendezVous();
      const appointmentsArray = Array.isArray(allAppointments) ? allAppointments : [];
      
      // Filtrer les rendez-vous du patient connecté
      const patientAppointments = appointmentsArray.filter(rdv => 
        rdv.client_email === user?.email || 
        rdv.patient?.user?.email === user?.email
      );

      setAppointments(patientAppointments);
      
      // Générer les données pour les graphiques
      generateChartData(patientAppointments);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement de vos données');
    } finally {
      setLoading(false);
    }
  };

  // Générer les données pour les graphiques
  const generateChartData = (appointments: PatientAppointment[]) => {
    // Données mensuelles (6 derniers mois)
    const monthlyData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      const monthAppointments = appointments.filter(rdv => {
        const rdvDate = new Date(rdv.date_confirmee || rdv.date_souhaitee || rdv.created_at);
        return rdvDate.getMonth() === date.getMonth() && 
               rdvDate.getFullYear() === date.getFullYear();
      });
      
      monthlyData.push({
        month: monthName,
        consultations: monthAppointments.length,
        revenus: monthAppointments.reduce((sum, rdv) => {
          const price = rdv.prix_consultation || rdv.service?.prix || 0;
          return sum + (typeof price === 'number' ? price : 0);
        }, 0)
      });
    }

    // Données par spécialité
    const specialtyCount: { [key: string]: number } = {};
    appointments.forEach(rdv => {
      const specialty = rdv.docteur?.speciality || rdv.service?.nom || 'Non spécifiée';
      specialtyCount[specialty] = (specialtyCount[specialty] || 0) + 1;
    });

    const specialtyData = Object.entries(specialtyCount).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / appointments.length) * 100)
    }));

    // Données par statut
    const statusCount: { [key: string]: number } = {};
    appointments.forEach(rdv => {
      const status = rdv.statut;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name: translateStatus(name),
      value,
      color: getStatusColor(name)
    }));

    setChartData({
      monthlyData,
      specialtyData,
      statusData
    });
  };

  // Charger les données au montage
  useEffect(() => {
    loadPatientData();
  }, [user?.email]);

  // Calculer les statistiques
  const stats = {
    totalAppointments: appointments.length,
    upcomingAppointments: appointments.filter(rdv => {
      const appointmentDate = new Date(rdv.date_confirmee || rdv.date_souhaitee);
      return appointmentDate > new Date() && rdv.statut === 'confirme';
    }).length,
    completedAppointments: appointments.filter(rdv => 
      rdv.statut === 'realise' || rdv.statut === 'termine'
    ).length,
    totalSpent: appointments.reduce((sum, rdv) => {
      const price = rdv.prix_consultation || rdv.service?.prix || 0;
      return sum + (typeof price === 'number' ? price : 0);
    }, 0)
  };

  // Obtenir les prochains rendez-vous
  const getUpcomingAppointments = () => {
    return appointments
      .filter(rdv => {
        const appointmentDate = new Date(rdv.date_confirmee || rdv.date_souhaitee);
        return appointmentDate > new Date() && rdv.statut === 'confirme';
      })
      .sort((a, b) => new Date(a.date_confirmee || a.date_souhaitee).getTime() - new Date(b.date_confirmee || b.date_souhaitee).getTime())
      .slice(0, 3);
  };

  // Obtenir l'historique récent
  const getRecentHistory = () => {
    return appointments
      .filter(rdv => rdv.statut === 'realise' || rdv.statut === 'termine')
      .sort((a, b) => new Date(b.date_confirmee || b.date_souhaitee).getTime() - new Date(a.date_confirmee || a.date_souhaitee).getTime())
      .slice(0, 3);
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formater l'heure
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Traduire le statut
  const translateStatus = (status: string) => {
    switch (status) {
      case 'confirme':
        return 'Confirmé';
      case 'realise':
        return 'Réalisé';
      case 'termine':
        return 'Terminé';
      case 'annule':
        return 'Annulé';
      case 'en_attente':
        return 'En attente';
      default:
        return status;
    }
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirme':
        return '#3B82F6';
      case 'realise':
      case 'termine':
        return '#10B981';
      case 'annule':
        return '#EF4444';
      case 'en_attente':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  // Exporter le rapport de consultation
  const handleExportReport = async (appointment: PatientAppointment) => {
    try {
      const { jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // En-tête
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Rapport de Consultation', pageWidth / 2, 20, { align: 'center' });
      
      // Informations du patient
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Informations du Patient', 20, 40);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nom: ${appointment.client_nom}`, 20, 50);
      pdf.text(`Email: ${appointment.client_email}`, 20, 60);
      pdf.text(`Téléphone: ${appointment.client_telephone}`, 20, 70);
      
      // Informations du rendez-vous
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Détails du Rendez-vous', 20, 90);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const appointmentDate = new Date(appointment.date_confirmee || appointment.date_souhaitee);
      pdf.text(`Date: ${appointmentDate.toLocaleDateString('fr-FR')}`, 20, 100);
      pdf.text(`Heure: ${appointmentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`, 20, 110);
      pdf.text(`Médecin: Dr. ${appointment.docteur?.first_name} ${appointment.docteur?.last_name}`, 20, 120);
      pdf.text(`Spécialité: ${appointment.docteur?.speciality || 'Non spécifiée'}`, 20, 130);
      pdf.text(`Service: ${appointment.service?.nom || 'Non spécifié'}`, 20, 140);
      pdf.text(`Statut: ${translateStatus(appointment.statut)}`, 20, 150);
      
      if (appointment.message) {
        pdf.text(`Message: ${appointment.message}`, 20, 160);
      }
      
      // Pied de page
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Généré par le système de gestion du Cabinet Yaye Aminata', pageWidth / 2, 280, { align: 'center' });
      
      const fileName = `rapport_consultation_${appointment.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success('Rapport exporté avec succès !');
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      toast.error('Erreur lors de l\'export du rapport');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={loadPatientData}>Réessayer</Button>
      </div>
    );
  }

  const upcomingAppointments = getUpcomingAppointments();
  const recentHistory = getRecentHistory();

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* En-tête - responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Bienvenue,</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Votre espace patient</p>
        </div>
        
        <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          Prendre un rendez-vous
        </Button>
      </div>

      {/* Statistiques - responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Consultations</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
                <p className="text-xs text-gray-500">consultations</p>
              </div>
              <Stethoscope className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">À venir</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
                <p className="text-xs text-gray-500">prochains RDV</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Terminées</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.completedAppointments}</p>
                <p className="text-xs text-gray-500">consultations</p>
              </div>
              <Activity className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total dépensé</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-all">{stats.totalSpent.toLocaleString()} FCFA</p>
                <p className="text-xs text-gray-500">ce mois</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-orange-600 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques - responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Évolution mensuelle */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Évolution des consultations
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Nombre de consultations par mois</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="h-48 sm:h-56 lg:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="consultations" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Répartition par spécialité */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-sm sm:text-base">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Répartition par spécialité
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Vos consultations par domaine médical</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="h-48 sm:h-56 lg:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.specialtyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.specialtyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prochains rendez-vous et Historique - responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Prochains rendez-vous */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-sm sm:text-base">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Vos prochains rendez-vous
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Consultations à venir</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">Aucun rendez-vous à venir</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm sm:text-base truncate">
                            Dr. {appointment.docteur?.first_name} {appointment.docteur?.last_name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {appointment.docteur?.speciality || 'Médecine générale'}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDate(appointment.date_confirmee || appointment.date_souhaitee)} à {formatTime(appointment.date_confirmee || appointment.date_souhaitee)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0 text-xs sm:text-sm">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Détails
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historique récent */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-sm sm:text-base">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Historique récent
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Vos dernières consultations</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {recentHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">Aucune consultation récente</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {recentHistory.map((appointment) => (
                  <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm sm:text-base truncate">
                            {appointment.service?.nom || 'Consultation générale'}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            Dr. {appointment.docteur?.first_name} {appointment.docteur?.last_name} - {formatDate(appointment.date_confirmee || appointment.date_souhaitee)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport(appointment)}
                      className="w-full sm:w-auto mt-2 sm:mt-0 text-xs sm:text-sm"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Voir rapport
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
