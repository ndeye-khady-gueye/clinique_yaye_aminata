import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Plus, 
  Edit, 
  Check, 
  X, 
  FileText, 
  Phone, 
  Mail, 
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  FileCheck,
  Printer,
  Download,
  RefreshCw
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { doctorAppointmentsService } from '@/services/doctorAppointmentsService';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DoctorAppointment {
  id: number;
  patient?: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
  };
  client_nom?: string;
  client_email?: string;
  client_telephone?: string;
  date_confirmee?: string;
  date_demande?: string;
  heure_confirmee?: string;
  statut: 'confirme' | 'assigne' | 'realise' | 'annule' | 'absent' | 'en_attente';
  service?: {
    nom: string;
    prix: number;
  };
  notes?: string;
  type_consultation?: string;
}

const MyAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // États pour les données
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // États pour les modales
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // États pour les statistiques
  const [statistics, setStatistics] = useState({
    today: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  // Charger les rendez-vous au montage du composant
  useEffect(() => {
    loadDoctorAppointments();
  }, []);

  // Mettre à jour les statistiques quand les rendez-vous changent
  useEffect(() => {
    updateStatistics();
  }, [appointments]);

  const loadDoctorAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorAppointmentsService.getMyAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement rendez-vous:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des rendez-vous';
      setError(errorMessage);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatistics = () => {
    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date_confirmee || apt.date_demande);
      return aptDate.toDateString() === today;
    });

    setStatistics({
      today: todayAppointments.length,
      confirmed: appointments.filter(apt => apt.statut === 'confirme').length,
      completed: appointments.filter(apt => apt.statut === 'realise').length,
      cancelled: appointments.filter(apt => apt.statut === 'annule').length
    });
  };

  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      (appointment.patient?.user ? 
        `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}` :
        appointment.client_nom || ''
      ).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.client_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.client_telephone || '').includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || appointment.statut === filterStatus;
    const matchesCompleted = !showCompletedOnly || appointment.statut === 'realise';

    return matchesSearch && matchesStatus && matchesCompleted;
  });

  // Actions sur les rendez-vous
  const handleRealizeAppointment = async (appointmentId: number) => {
    try {
      await doctorAppointmentsService.markAsCompleted(appointmentId);
      toast({
        title: "Succès",
        description: "Rendez-vous marqué comme réalisé",
      });
      loadDoctorAppointments();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer le rendez-vous comme réalisé",
        variant: "destructive",
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await doctorAppointmentsService.cancelAppointment(appointmentId);
      toast({
        title: "Succès",
        description: "Rendez-vous annulé",
      });
      loadDoctorAppointments();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler le rendez-vous",
        variant: "destructive",
      });
    }
  };

  const handleMarkAbsent = async (appointmentId: number) => {
    try {
      await doctorAppointmentsService.markAsAbsent(appointmentId);
      toast({
        title: "Succès",
        description: "Patient marqué comme absent",
      });
      loadDoctorAppointments();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer le patient comme absent",
        variant: "destructive",
      });
    }
  };

  const handleSaveAppointmentNotes = async () => {
    if (!selectedAppointment) return;
    
    try {
      await doctorAppointmentsService.updateAppointmentNotes(selectedAppointment.id, editingNotes);
      toast({
        title: "Succès",
        description: "Notes mises à jour avec succès",
      });
      setIsEditModalOpen(false);
      setEditingNotes('');
      loadDoctorAppointments();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive",
      });
    }
  };

  // Actions des cartes de statistiques
  const handleCardClick = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      setFilterStatus('all');
    } else {
      setActiveFilter(filter);
      setFilterStatus(filter);
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    if (!selectedAppointment) return;
    
    try {
      const element = document.getElementById('appointment-report');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`rapport-rdv-${selectedAppointment.id}.pdf`);
      
      toast({
        title: "Succès",
        description: "Rapport exporté en PDF",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter le rapport",
        variant: "destructive",
      });
    }
  };

  // Imprimer
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const element = document.getElementById('appointment-report');
    if (!element) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Rapport de Rendez-vous</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #6C2476; }
            .value { margin-left: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirme: { label: 'Confirmé', className: 'bg-green-100 text-green-800' },
      assigne: { label: 'Assigné', className: 'bg-blue-100 text-blue-800' },
      realise: { label: 'Réalisé', className: 'bg-purple-100 text-purple-800' },
      annule: { label: 'Annulé', className: 'bg-red-100 text-red-800' },
      absent: { label: 'Absent', className: 'bg-gray-100 text-gray-800' },
      en_attente: { label: 'En attente', className: 'bg-orange-100 text-orange-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.en_attente;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  // Si erreur d'authentification, afficher un message spécial
  if (error && error.includes('Token d\'authentification manquant')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session expirée</h2>
          <p className="text-gray-600 mb-4">
            Votre session a expiré. Veuillez vous reconnecter pour accéder à vos rendez-vous.
          </p>
          <Button 
            onClick={() => window.location.href = '/login'}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Se reconnecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#6C2476' }}>
            {showCompletedOnly ? 'Rendez-vous Terminés' : 'Mes Rendez-vous'}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {showCompletedOnly 
              ? 'Historique des consultations réalisées' 
              : 'Tous vos rendez-vous assignés par le responsable de cabinet - Gérez vos consultations et rédigez vos comptes rendus'
            }
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!showCompletedOnly && (
            <Button 
              onClick={() => setShowCompletedOnly(true)}
              variant="outline"
              className="text-xs sm:text-sm"
            >
              <FileCheck className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Voir tous les terminés</span>
              <span className="xs:hidden">Terminés</span>
            </Button>
          )}
          {showCompletedOnly && (
            <Button 
              onClick={() => setShowCompletedOnly(false)}
              variant="outline"
              className="text-xs sm:text-sm"
            >
              <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Voir tous les rendez-vous</span>
              <span className="xs:hidden">Tous</span>
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
            activeFilter === 'today' ? 'ring-2 ring-purple-500 shadow-lg' : ''
          }`}
          onClick={() => handleCardClick('today')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Aujourd'hui
            </CardTitle>
            <Calendar className="h-4 w-4" style={{ color: '#6C2476' }} />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{statistics.today}</div>
            <p className="text-xs text-gray-500">rendez-vous</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
            activeFilter === 'realise' ? 'ring-2 ring-green-500 shadow-lg' : ''
          }`}
          onClick={() => handleCardClick('realise')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Terminés
            </CardTitle>
            <CheckCircle className="h-4 w-4" style={{ color: '#10B981' }} />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{statistics.completed}</div>
            <p className="text-xs text-gray-500">réalisés</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
            activeFilter === 'annule' ? 'ring-2 ring-red-500 shadow-lg' : ''
          }`}
          onClick={() => handleCardClick('annule')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
              Annulés
            </CardTitle>
            <XCircle className="h-4 w-4" style={{ color: '#EF4444' }} />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{statistics.cancelled}</div>
            <p className="text-xs text-gray-500">annulés</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche - Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl" style={{ color: '#6C2476' }}>
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-xs sm:text-sm"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="text-xs sm:text-sm">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="confirme">Confirmé</SelectItem>
                <SelectItem value="assigne">Assigné</SelectItem>
                <SelectItem value="realise">Réalisé</SelectItem>
                <SelectItem value="annule">Annulé</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={loadDoctorAppointments}
              variant="outline"
              className="text-xs sm:text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des rendez-vous - Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl" style={{ color: '#6C2476' }}>
            {showCompletedOnly ? 'Rendez-vous Terminés' : 'Mes rendez-vous'}
          </CardTitle>
          <CardDescription>
            {showCompletedOnly 
              ? 'Historique des consultations réalisées' 
              : 'Liste complète de tous vos rendez-vous assignés par le responsable de cabinet - Vous pouvez voir, modifier, réaliser ou annuler selon le statut'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Patient</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Contact</TableHead>
                  <TableHead className="text-xs sm:text-sm">Date & Heure</TableHead>
                  <TableHead className="text-xs sm:text-sm">Type</TableHead>
                  <TableHead className="text-xs sm:text-sm">Statut</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Aucun rendez-vous trouvé</p>
                      <p className="text-sm">Ajustez vos filtres ou créez un nouveau rendez-vous</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => {
                    // Debug: afficher le statut du RDV
                    console.log('RDV ID:', appointment.id, 'Statut:', appointment.statut);
                    return (
                    <TableRow key={appointment.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {appointment.patient?.user ? 
                              `${appointment.patient.user.first_name?.[0]}${appointment.patient.user.last_name?.[0]}` :
                              (appointment.client_nom?.[0] || 'P')
                            }
                          </div>
                          <div>
                            <p className="font-medium">
                              {appointment.patient?.user ? 
                                `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}` :
                                appointment.client_nom || 'Patient'
                              }
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span>
                              {appointment.patient?.user?.phone || 
                               appointment.client_telephone || 
                               'Non renseigné'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span>
                              {appointment.patient?.user?.email || 
                               appointment.client_email || 
                               'Non renseigné'}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div>
                          <p className="font-medium">
                            {appointment.date_confirmee ? 
                              new Date(appointment.date_confirmee).toLocaleDateString('fr-FR') : 
                              'Date non définie'
                            }
                          </p>
                          <p className="text-gray-500">
                            {appointment.heure_confirmee || 'Heure non définie'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div>
                          <p className="font-medium">
                            {appointment.service?.nom || appointment.type_consultation || 'Consultation'}
                          </p>
                          {appointment.service?.prix && (
                            <p className="text-gray-500">
                              {appointment.service.prix.toLocaleString()} FCFA
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {getStatusBadge(appointment.statut)}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          {/* Action Réaliser - pour les RDV non terminés */}
                          {(appointment.statut === 'assigne' || appointment.statut === 'confirme') && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRealizeAppointment(appointment.id)}
                              className="text-green-600 hover:bg-green-50 text-xs sm:text-sm px-2 sm:px-3"
                              title="Marquer comme réalisé"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              <span className="hidden xs:inline">Réaliser</span>
                              <span className="xs:hidden">✓</span>
                            </Button>
                          )}
                          
                          {/* Action Voir Détails */}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-3"
                            title="Voir les détails"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            <span className="hidden xs:inline">Voir détails</span>
                            <span className="xs:hidden">👁</span>
                          </Button>
                          
                          {/* Action Modifier */}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setEditingNotes(appointment.notes || '');
                              setIsEditModalOpen(true);
                            }}
                            className="text-orange-600 hover:bg-orange-50 text-xs sm:text-sm px-2 sm:px-3"
                            title="Modifier les notes"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            <span className="hidden xs:inline">Modifier</span>
                            <span className="xs:hidden">✏</span>
                          </Button>
                          
                          {/* Action Rapport - pour les RDV réalisés */}
                          {appointment.statut === 'realise' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowReportModal(true);
                              }}
                              className="text-purple-600 hover:bg-purple-50 text-xs sm:text-sm px-2 sm:px-3"
                              title="Générer rapport"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              <span className="hidden xs:inline">Rapport</span>
                              <span className="xs:hidden">📄</span>
                            </Button>
                          )}
                          
                          {/* Action Annuler - pour les RDV confirmés/assignés */}
                          {(appointment.statut === 'confirme' || appointment.statut === 'assigne') && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-red-600 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
                              title="Annuler le rendez-vous"
                            >
                              <X className="h-3 w-3 mr-1" />
                              <span className="hidden xs:inline">Annuler</span>
                              <span className="xs:hidden">✕</span>
                            </Button>
                          )}
                          
                          {/* Action Marquer Absent - pour les RDV confirmés/assignés */}
                          {(appointment.statut === 'confirme' || appointment.statut === 'assigne') && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleMarkAbsent(appointment.id)}
                              className="text-gray-600 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3"
                              title="Marquer comme absent"
                            >
                              <UserX className="h-3 w-3 mr-1" />
                              <span className="hidden xs:inline">Absent</span>
                              <span className="xs:hidden">👤✕</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Voir Détails */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du Rendez-vous</DialogTitle>
            <DialogDescription>
              Informations complètes du rendez-vous
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Informations Patient</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nom:</span> {
                      selectedAppointment.patient?.user ? 
                        `${selectedAppointment.patient.user.first_name} ${selectedAppointment.patient.user.last_name}` :
                        selectedAppointment.client_nom || 'Non renseigné'
                    }</p>
                    <p><span className="font-medium">Email:</span> {
                      selectedAppointment.patient?.user?.email || 
                      selectedAppointment.client_email || 
                      'Non renseigné'
                    }</p>
                    <p><span className="font-medium">Téléphone:</span> {
                      selectedAppointment.patient?.user?.phone || 
                      selectedAppointment.client_telephone || 
                      'Non renseigné'
                    }</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Informations Rendez-vous</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Date:</span> {
                      selectedAppointment.date_confirmee ? 
                        new Date(selectedAppointment.date_confirmee).toLocaleDateString('fr-FR') : 
                        'Non définie'
                    }</p>
                    <p><span className="font-medium">Heure:</span> {
                      selectedAppointment.heure_confirmee || 'Non définie'
                    }</p>
                    <p><span className="font-medium">Service:</span> {
                      selectedAppointment.service?.nom || selectedAppointment.type_consultation || 'Consultation'
                    }</p>
                    <p><span className="font-medium">Prix:</span> {
                      selectedAppointment.service?.prix ? 
                        `${selectedAppointment.service.prix.toLocaleString()} FCFA` : 
                        'Non renseigné'
                    }</p>
                    <p><span className="font-medium">Statut:</span> {getStatusBadge(selectedAppointment.statut)}</p>
                  </div>
                </div>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Modifier */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le Rendez-vous</DialogTitle>
            <DialogDescription>
              Modifiez les informations du rendez-vous
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes du rendez-vous
              </label>
              <Textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Ajoutez des notes sur ce rendez-vous..."
                className="min-h-[100px]"
                key={selectedAppointment?.id} // Force re-render
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveAppointmentNotes}
                style={{ backgroundColor: '#6C2476' }}
              >
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Rapport */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Rapport de Rendez-vous</DialogTitle>
            <DialogDescription>
              Rapport médical du rendez-vous
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div id="appointment-report" className="bg-white p-6 border rounded-lg">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#6C2476' }}>
                    RAPPORT MÉDICAL
                  </h2>
                  <p className="text-gray-600">Clinique Yaye Aminata</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Informations Patient</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Nom:</span> {
                        selectedAppointment.patient?.user ? 
                          `${selectedAppointment.patient.user.first_name} ${selectedAppointment.patient.user.last_name}` :
                          selectedAppointment.client_nom || 'Non renseigné'
                      }</p>
                      <p><span className="font-medium">Email:</span> {
                        selectedAppointment.patient?.user?.email || 
                        selectedAppointment.client_email || 
                        'Non renseigné'
                      }</p>
                      <p><span className="font-medium">Téléphone:</span> {
                        selectedAppointment.patient?.user?.phone || 
                        selectedAppointment.client_telephone || 
                        'Non renseigné'
                      }</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Informations Rendez-vous</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Date:</span> {
                        selectedAppointment.date_confirmee ? 
                          new Date(selectedAppointment.date_confirmee).toLocaleDateString('fr-FR') : 
                          'Non définie'
                      }</p>
                      <p><span className="font-medium">Heure:</span> {
                        selectedAppointment.heure_confirmee || 'Non définie'
                      }</p>
                      <p><span className="font-medium">Service:</span> {
                        selectedAppointment.service?.nom || selectedAppointment.type_consultation || 'Consultation'
                      }</p>
                      <p><span className="font-medium">Médecin:</span> Dr. {user?.firstName} {user?.lastName}</p>
                    </div>
                  </div>
                </div>
                
                {selectedAppointment.notes && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Notes Médicales</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">{selectedAppointment.notes}</p>
                    </div>
                  </div>
                )}
                
                <div className="text-center text-sm text-gray-500">
                  <p>Rapport généré le {new Date().toLocaleDateString('fr-FR')}</p>
                  <p>Signature et cachet du médecin</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={handleExportPDF}
                  style={{ backgroundColor: '#B0368B' }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter PDF
                </Button>
                <Button 
                  onClick={handlePrintReport}
                  style={{ backgroundColor: '#6C2476' }}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAppointments;
