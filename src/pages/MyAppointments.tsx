import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Search, Plus, Edit, Check, X, FileText, Phone, Mail, Loader2, AlertTriangle, Eye, Settings, Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { doctorAppointmentsService, DoctorAppointment } from '@/services/doctorAppointmentsService';
import AppointmentForm from '@/components/forms/AppointmentForm';

const MyAppointments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);
  const [consultationNote, setConsultationNote] = useState('');
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // États pour les données API
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les rendez-vous au montage du composant
  useEffect(() => {
    if (user?.role === 'doctor') {
      loadDoctorAppointments();
    } else {
      // Pour les patients, garder les données simulées pour l'instant
      setLoading(false);
    }
  }, [user?.role]);

  const loadDoctorAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const appointmentsData = await doctorAppointmentsService.getMyAppointments();
      setAppointments(appointmentsData);
    } catch (err) {
      setError('Erreur lors du chargement des rendez-vous');
      console.error('Erreur chargement rendez-vous:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirme': return 'bg-blue-100 text-blue-800';
      case 'realise': return 'bg-green-100 text-green-800';
      case 'assigne': return 'bg-orange-100 text-orange-800';
      case 'annule': return 'bg-red-100 text-red-800';
      case 'absent': return 'bg-gray-100 text-gray-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirme': return 'Confirmé';
      case 'realise': return 'Terminé';
      case 'assigne': return 'Assigné';
      case 'annule': return 'Annulé';
      case 'absent': return 'Absent';
      case 'en_attente': return 'En attente';
      default: return status;
    }
  };

  const handleMarkAsCompleted = async (appointmentId: number) => {
    try {
      await doctorAppointmentsService.markAsCompleted(appointmentId, {
        statut: 'realise',
        notes: consultationNote
      });
      
      toast({
        title: "Succès",
        description: "Rendez-vous marqué comme terminé",
      });
      
      // Recharger les rendez-vous
      await loadDoctorAppointments();
      setSelectedAppointment(null);
      setConsultationNote('');
    } catch (error) {
      console.error('Erreur lors du marquage comme terminé:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme terminé",
        variant: "destructive",
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await doctorAppointmentsService.cancelAppointment(appointmentId, 'Annulé par le docteur');
      
      toast({
        title: "Succès",
        description: "Rendez-vous annulé",
      });
      
      // Recharger les rendez-vous
      await loadDoctorAppointments();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler le rendez-vous",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsAbsent = async (appointmentId: number) => {
    try {
      await doctorAppointmentsService.markAsAbsent(appointmentId, 'Patient absent');
      
      toast({
        title: "Succès",
        description: "Patient marqué comme absent",
      });
      
      // Recharger les rendez-vous
      await loadDoctorAppointments();
    } catch (error) {
      console.error('Erreur lors du marquage comme absent:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme absent",
        variant: "destructive",
      });
    }
  };

  const handleCreateAppointment = (data: any) => {
    console.log('Nouveau rendez-vous patient:', data);
    setIsAppointmentFormOpen(false);
  };

  // Fonctions pour gérer les clics sur les cartes de statistiques
  const handleCardClick = (filterType: string) => {
    if (activeFilter === filterType) {
      // Si la même carte est cliquée, désactiver le filtre
      setActiveFilter(null);
      setShowCompletedOnly(false);
      setFilterStatus('all');
    } else {
      // Activer le filtre correspondant
      setActiveFilter(filterType);
      setShowCompletedOnly(false);
      
      switch (filterType) {
        case 'today':
          // Filtrer par date d'aujourd'hui
          const today = new Date().toISOString().split('T')[0];
          setFilterDate(today);
          setFilterStatus('all');
          break;
        case 'realise':
          setShowCompletedOnly(true);
          setFilterStatus('all');
          setFilterDate('');
          break;
        case 'annule':
          setFilterStatus('annule');
          setFilterDate('');
          break;
        default:
          setFilterStatus('all');
          setFilterDate('');
      }
    }
  };

  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === '' || 
      (appointment.patient?.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       appointment.patient?.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       appointment.client_nom?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || appointment.statut === filterStatus;
    
    const matchesDate = filterDate === '' || 
      (appointment.date_confirmee && appointment.date_confirmee.startsWith(filterDate));
    
    // Filtre pour les rendez-vous terminés seulement
    const matchesCompletedFilter = !showCompletedOnly || appointment.statut === 'realise';
    
    return matchesSearch && matchesStatus && matchesDate && matchesCompletedFilter;
  });

  const handleViewReport = (appointmentId: number) => {
    console.log('Voir le rapport de consultation:', appointmentId);
  };

  const handleExportPDF = async (appointment: DoctorAppointment) => {
    try {
      // Créer un élément temporaire pour le contenu PDF
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.padding = '20px';
      tempDiv.style.backgroundColor = 'white';
      
      tempDiv.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">RAPPORT DE CONSULTATION</h1>
          <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Clinique Yaye Aminata</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 18px;">Informations du Patient</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 15px;">
            <div style="flex: 1; min-width: 200px;">
              <strong>Nom complet:</strong><br>
              ${appointment.patient 
                ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                : appointment.client_nom || 'Patient non défini'
              }
            </div>
            <div style="flex: 1; min-width: 200px;">
              <strong>Date de consultation:</strong><br>
              ${appointment.date_confirmee 
                ? new Date(appointment.date_confirmee).toLocaleDateString('fr-FR')
                : 'Non définie'
              }
            </div>
            <div style="flex: 1; min-width: 200px;">
              <strong>Téléphone:</strong><br>
              ${appointment.patient?.user.phone || appointment.client_telephone || 'Non renseigné'}
            </div>
            <div style="flex: 1; min-width: 200px;">
              <strong>Email:</strong><br>
              ${appointment.patient?.user.email || appointment.client_email || 'Non renseigné'}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 18px;">Détails de la Consultation</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 15px;">
            <div style="flex: 1; min-width: 200px;">
              <strong>Service:</strong><br>
              ${appointment.service.nom}
            </div>
            <div style="flex: 1; min-width: 200px;">
              <strong>Prix:</strong><br>
              ${appointment.service.prix} FCFA
            </div>
            <div style="flex: 1; min-width: 200px;">
              <strong>Statut:</strong><br>
              ${getStatusText(appointment.statut)}
            </div>
            <div style="flex: 1; min-width: 200px;">
              <strong>Heure:</strong><br>
              ${appointment.date_confirmee 
                ? new Date(appointment.date_confirmee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                : 'Non définie'
              }
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 18px;">Compte-rendu Médical</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 15px; min-height: 150px; border: 1px solid #e9ecef;">
            <p style="margin: 0; line-height: 1.6; font-size: 14px;">
              ${appointment.notes || 'Aucun compte-rendu médical disponible pour cette consultation.'}
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
          <p style="font-size: 14px;">Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          <p style="font-size: 12px;">Clinique Yaye Aminata - Système de Gestion Médicale</p>
        </div>
      `;

      document.body.appendChild(tempDiv);

      // Convertir en canvas puis en PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
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

      // Nettoyer l'élément temporaire
      document.body.removeChild(tempDiv);

      // Télécharger le PDF
      const fileName = `Rapport_Consultation_${appointment.patient 
        ? `${appointment.patient.user.first_name}_${appointment.patient.user.last_name}`
        : appointment.client_nom || 'Patient'
      }_${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdf.save(fileName);

      toast({
        title: "Export PDF",
        description: "Le rapport PDF a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter le rapport en PDF",
        variant: "destructive",
      });
    }
  };

  const handlePrintReport = (appointment: DoctorAppointment) => {
    try {
      // Créer le contenu HTML pour l'impression
      const reportContent = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">RAPPORT DE CONSULTATION</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Clinique Yaye Aminata</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 18px;">Informations du Patient</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 15px;">
              <div style="flex: 1; min-width: 200px;">
                <strong>Nom complet:</strong><br>
                ${appointment.patient 
                  ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                  : appointment.client_nom || 'Patient non défini'
                }
              </div>
              <div style="flex: 1; min-width: 200px;">
                <strong>Date de consultation:</strong><br>
                ${appointment.date_confirmee 
                  ? new Date(appointment.date_confirmee).toLocaleDateString('fr-FR')
                  : 'Non définie'
                }
              </div>
              <div style="flex: 1; min-width: 200px;">
                <strong>Téléphone:</strong><br>
                ${appointment.patient?.user.phone || appointment.client_telephone || 'Non renseigné'}
              </div>
              <div style="flex: 1; min-width: 200px;">
                <strong>Email:</strong><br>
                ${appointment.patient?.user.email || appointment.client_email || 'Non renseigné'}
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 18px;">Détails de la Consultation</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 15px;">
              <div style="flex: 1; min-width: 200px;">
                <strong>Service:</strong><br>
                ${appointment.service.nom}
              </div>
              <div style="flex: 1; min-width: 200px;">
                <strong>Prix:</strong><br>
                ${appointment.service.prix} FCFA
              </div>
              <div style="flex: 1; min-width: 200px;">
                <strong>Statut:</strong><br>
                ${getStatusText(appointment.statut)}
              </div>
              <div style="flex: 1; min-width: 200px;">
                <strong>Heure:</strong><br>
                ${appointment.date_confirmee 
                  ? new Date(appointment.date_confirmee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                  : 'Non définie'
                }
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 18px;">Compte-rendu Médical</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 15px; min-height: 150px; border: 1px solid #e9ecef;">
              <p style="margin: 0; line-height: 1.6; font-size: 14px;">
                ${appointment.notes || 'Aucun compte-rendu médical disponible pour cette consultation.'}
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
            <p style="font-size: 14px;">Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            <p style="font-size: 12px;">Clinique Yaye Aminata - Système de Gestion Médicale</p>
          </div>
        </div>
      `;

      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Rapport de Consultation - ${appointment.patient 
                ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                : appointment.client_nom || 'Patient'
              }</title>
              <style>
                @media print {
                  body { margin: 0; }
                  @page { margin: 1cm; }
                }
                body { font-family: Arial, sans-serif; }
              </style>
            </head>
            <body>
              ${reportContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Attendre que le contenu soit chargé puis imprimer
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      toast({
        title: "Impression",
        description: "La fenêtre d'impression a été ouverte",
      });
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le rapport",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    // Afficher les détails dans un modal
    toast({
      title: "Détails du RDV",
      description: `Patient: ${appointment.patient 
        ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
        : appointment.client_nom || 'Patient non défini'
      } - Service: ${appointment.service.nom} - Statut: ${getStatusText(appointment.statut)}`,
    });
  };

  const handleEditAppointment = (appointment: DoctorAppointment) => {
    setSelectedAppointment(appointment);
    setEditingNotes(appointment.notes || '');
    setIsEditModalOpen(true);
  };

  const handleSaveAppointmentNotes = async (appointmentId: number, notes: string) => {
    try {
      await doctorAppointmentsService.updateAppointmentNotes(appointmentId, notes);
      
      toast({
        title: "Succès",
        description: "Notes du rendez-vous mises à jour",
      });
      
      // Recharger les rendez-vous
      await loadDoctorAppointments();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive",
      });
    }
  };

  const handleRealizeAppointment = async (appointmentId: number) => {
    try {
      await doctorAppointmentsService.markAsCompleted(appointmentId, {
        statut: 'realise',
        notes: 'Rendez-vous réalisé par le docteur'
      });
      
      toast({
        title: "Succès",
        description: "Rendez-vous marqué comme réalisé",
      });
      
      // Recharger les rendez-vous
      await loadDoctorAppointments();
    } catch (error) {
      console.error('Erreur lors du marquage comme réalisé:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme réalisé",
        variant: "destructive",
      });
    }
  };

  const DoctorView = () => {
    // Calculer les statistiques
    const todayAppointments = appointments.filter(apt => {
      const today = new Date().toISOString().split('T')[0];
      return apt.date_confirmee && apt.date_confirmee.startsWith(today);
    });
    
    const completedAppointments = appointments.filter(apt => apt.statut === 'realise');
    const cancelledAppointments = appointments.filter(apt => apt.statut === 'annule');

    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des rendez-vous...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-8">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-red-500">{error}</span>
        </div>
      );
    }

    return (
      <>
        {/* Statistiques du jour - Responsive amélioré */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Carte Aujourd'hui */}
          <Card 
            className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
              activeFilter === 'today' 
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => handleCardClick('today')}
          >
            <CardHeader className="pb-2 xs:pb-3 px-3 xs:px-4 sm:px-6">
              <CardTitle className="text-xs xs:text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 sm:px-6">
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{todayAppointments.length}</div>
              <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">rendez-vous</p>
            </CardContent>
          </Card>


          {/* Carte Terminés */}
          <Card 
            className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
              activeFilter === 'realise' 
                ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => handleCardClick('realise')}
          >
            <CardHeader className="pb-2 xs:pb-3 px-3 xs:px-4 sm:px-6">
              <CardTitle className="text-xs xs:text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Terminés</CardTitle>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 sm:px-6">
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{completedAppointments.length}</div>
              <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">réalisés</p>
            </CardContent>
          </Card>

          {/* Carte Annulés */}
          <Card 
            className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
              activeFilter === 'annule' 
                ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => handleCardClick('annule')}
          >
            <CardHeader className="pb-2 xs:pb-3 px-3 xs:px-4 sm:px-6">
              <CardTitle className="text-xs xs:text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">Annulés</CardTitle>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 sm:px-6">
              <div className="text-lg xs:text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">{cancelledAppointments.length}</div>
              <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">annulés</p>
            </CardContent>
          </Card>
        </div>

        {/* Bouton pour voir tous les terminés - Responsive */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <Button
            onClick={() => {
              setShowCompletedOnly(!showCompletedOnly);
              setActiveFilter(null);
              setFilterStatus('all');
              setFilterDate('');
            }}
            variant={showCompletedOnly ? "default" : "outline"}
            className={`transition-all duration-200 text-xs xs:text-sm sm:text-base px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 ${
              showCompletedOnly 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
            }`}
            disabled={activeFilter !== null && activeFilter !== 'realise'}
          >
            <Check className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
            <span className="hidden xs:inline">
              {showCompletedOnly ? "Voir tous les rendez-vous" : `Voir tous les terminés (${completedAppointments.length})`}
            </span>
            <span className="xs:hidden">
              {showCompletedOnly ? "Tous" : `Terminés (${completedAppointments.length})`}
            </span>
          </Button>
        </div>

      {/* Liste des rendez-vous - Responsive amélioré */}
      <Card className="card-responsive">
        <CardHeader className="pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
          <CardTitle className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white">
            {showCompletedOnly ? "Rendez-vous terminés" : "Mes rendez-vous"}
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {showCompletedOnly 
              ? "Liste de tous les rendez-vous terminés avec leurs rapports"
              : "Gérez vos consultations et ajoutez des comptes rendus"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 xs:p-3 sm:p-6">
          {/* Tableau responsive avec scroll horizontal sur mobile */}
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="min-w-[120px] text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Patient</TableHead>
                  <TableHead className="min-w-[140px] hidden xs:table-cell text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Contact</TableHead>
                  <TableHead className="min-w-[120px] text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Date & Heure</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Type</TableHead>
                  <TableHead className="min-w-[80px] text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</TableHead>
                  <TableHead className="min-w-[200px] text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm xs:text-base">
                    Aucun rendez-vous trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <TableCell className="py-2 xs:py-3 sm:py-4">
                      <div>
                        <div className="font-medium text-xs xs:text-sm sm:text-base text-gray-900 dark:text-white">
                          {appointment.patient 
                            ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                            : appointment.client_nom || 'Patient non défini'
                          }
                        </div>
                        {appointment.notes && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {appointment.notes}
                          </div>
                        )}
                        {/* Contact info visible sur mobile */}
                        <div className="xs:hidden mt-2 space-y-1">
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{appointment.patient?.user.phone || appointment.client_telephone || 'Non renseigné'}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{appointment.patient?.user.email || appointment.client_email || 'Non renseigné'}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xs:table-cell py-2 xs:py-3 sm:py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <Phone className="h-3 w-3 mr-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          <span className="truncate">{appointment.patient?.user.phone || appointment.client_telephone || 'Non renseigné'}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="h-3 w-3 mr-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          <span className="truncate">{appointment.patient?.user.email || appointment.client_email || 'Non renseigné'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 xs:py-3 sm:py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 xs:space-x-2">
                          <Calendar className="h-3 w-3 xs:h-4 xs:w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          <span className="text-xs xs:text-sm text-gray-900 dark:text-white">{appointment.date_confirmee ? new Date(appointment.date_confirmee).toLocaleDateString('fr-FR') : 'Non confirmé'}</span>
                        </div>
                        {appointment.date_confirmee && (
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            {new Date(appointment.date_confirmee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell py-2 xs:py-3 sm:py-4">
                      <div>
                        <div className="font-medium text-xs xs:text-sm text-gray-900 dark:text-white">{appointment.service.nom}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{appointment.service.prix} FCFA</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 xs:py-3 sm:py-4">
                      <Badge className={`${getStatusColor(appointment.statut)} text-xs px-2 py-1`}>
                        {getStatusText(appointment.statut)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 xs:py-3 sm:py-4">
                      <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2">
                        {/* Action Réaliser - pour les RDV assignés */}
                        {appointment.statut === 'assigne' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRealizeAppointment(appointment.id)}
                            className="text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 text-xs px-2 py-1 xs:px-3 xs:py-1.5"
                            title="Marquer comme réalisé"
                          >
                            <Check className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="hidden xs:inline">Réaliser</span>
                            <span className="xs:hidden">✓</span>
                          </Button>
                        )}

                        {/* Action Terminer avec modal - pour les RDV confirmés */}
                        {appointment.statut === 'confirme' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setSelectedAppointment(appointment)}
                                className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 text-xs px-2 py-1 xs:px-3 xs:py-1.5"
                              >
                                <Check className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="hidden xs:inline">Terminer</span>
                                <span className="xs:hidden">✓</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Terminer la consultation</DialogTitle>
                                <DialogDescription>
                                  Patient: {appointment.patient 
                                    ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                                    : appointment.client_nom || 'Patient non défini'
                                  }
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Compte rendu de consultation</label>
                                  <Textarea 
                                    placeholder="Saisissez le compte rendu de la consultation..."
                                    value={consultationNote}
                                    onChange={(e) => setConsultationNote(e.target.value)}
                                    rows={4}
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                                    Annuler
                                  </Button>
                                  <Button onClick={() => handleMarkAsCompleted(appointment.id)} className="bg-gradient-clinic">
                                    Valider
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Action Voir Détails */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 p-1 xs:p-1.5 sm:p-2"
                              title="Voir les détails"
                            >
                              <Eye className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Détails du Rendez-vous</DialogTitle>
                              <DialogDescription>
                                Informations complètes du rendez-vous
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Patient</label>
                                  <p className="text-sm">
                                    {appointment.patient 
                                      ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                                      : appointment.client_nom || 'Patient non défini'
                                    }
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Service</label>
                                  <p className="text-sm">{appointment.service.nom}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Prix</label>
                                  <p className="text-sm">{appointment.service.prix} FCFA</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Statut</label>
                                  <Badge className={getStatusColor(appointment.statut)}>
                                    {getStatusText(appointment.statut)}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Date confirmée</label>
                                  <p className="text-sm">
                                    {appointment.date_confirmee 
                                      ? new Date(appointment.date_confirmee).toLocaleDateString('fr-FR')
                                      : 'Non confirmé'
                                    }
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Heure</label>
                                  <p className="text-sm">
                                    {appointment.date_confirmee 
                                      ? new Date(appointment.date_confirmee).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                      : 'Non définie'
                                    }
                                  </p>
                                </div>
                              </div>
                              {appointment.notes && (
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Notes</label>
                                  <p className="text-sm bg-gray-50 p-3 rounded-md">{appointment.notes}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Action Modifier */}
                        <Dialog open={isEditModalOpen && selectedAppointment?.id === appointment.id} onOpenChange={(open) => {
                          if (!open) {
                            setIsEditModalOpen(false);
                            setEditingNotes('');
                            setSelectedAppointment(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 p-1 xs:p-1.5 sm:p-2"
                              title="Modifier le RDV"
                              onClick={() => handleEditAppointment(appointment)}
                            >
                              <Settings className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier le Rendez-vous</DialogTitle>
                              <DialogDescription>
                                Modifiez les informations du rendez-vous
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Notes du rendez-vous</label>
                                <Textarea 
                                  key={`edit-notes-${selectedAppointment?.id}`}
                                  placeholder="Ajoutez ou modifiez les notes..."
                                  value={editingNotes}
                                  onChange={(e) => setEditingNotes(e.target.value)}
                                  rows={4}
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    setIsEditModalOpen(false);
                                    setEditingNotes('');
                                    setSelectedAppointment(null);
                                  }}
                                >
                                  Annuler
                                </Button>
                                <Button 
                                  className="bg-gradient-clinic"
                                  onClick={() => {
                                    if (selectedAppointment) {
                                      handleSaveAppointmentNotes(selectedAppointment.id, editingNotes);
                                      setIsEditModalOpen(false);
                                      setEditingNotes('');
                                      setSelectedAppointment(null);
                                    }
                                  }}
                                >
                                  Sauvegarder
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Action Rapport - pour les RDV réalisés */}
                        {appointment.statut === 'realise' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 p-1 xs:p-1.5 sm:p-2"
                                title="Voir le rapport"
                              >
                                <FileText className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Rapport de Consultation</DialogTitle>
                                <DialogDescription>
                                  Rapport médical de la consultation
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Patient</label>
                                    <p className="text-sm">
                                      {appointment.patient 
                                        ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                                        : appointment.client_nom || 'Patient non défini'
                                      }
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Date de consultation</label>
                                    <p className="text-sm">
                                      {appointment.date_confirmee 
                                        ? new Date(appointment.date_confirmee).toLocaleDateString('fr-FR')
                                        : 'Non définie'
                                      }
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Compte-rendu médical</label>
                                  <div className="bg-gray-50 p-4 rounded-md min-h-[100px]">
                                    <p className="text-sm">
                                      {appointment.notes || 'Aucun compte-rendu disponible pour le moment.'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="outline"
                                    onClick={() => handleExportPDF(appointment)}
                                    className="hover:bg-blue-50"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Exporter PDF
                                  </Button>
                                  <Button 
                                    className="bg-gradient-clinic"
                                    onClick={() => handlePrintReport(appointment)}
                                  >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Imprimer
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Action Marquer Absent - pour les RDV confirmés */}
                        {appointment.statut === 'confirme' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleMarkAsAbsent(appointment.id)}
                            className="text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20 text-xs px-2 py-1 xs:px-3 xs:py-1.5"
                            title="Marquer comme absent"
                          >
                            <X className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="hidden xs:inline">Absent</span>
                            <span className="xs:hidden">✗</span>
                          </Button>
                        )}

                        {/* Action Annuler - pour tous les RDV non annulés */}
                        {appointment.statut !== 'annule' && appointment.statut !== 'realise' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 text-xs px-2 py-1 xs:px-3 xs:py-1.5"
                            title="Annuler le RDV"
                          >
                            <X className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="hidden xs:inline">Annuler</span>
                            <span className="xs:hidden">✗</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Filtres et recherche - Responsive amélioré */}
      <Card className="card-responsive mb-4 sm:mb-6">
        <CardHeader className="pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
          <CardTitle className="text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white">Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent className="px-3 xs:px-4 sm:px-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-4 xs:w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 xs:pl-10 h-8 xs:h-9 sm:h-10 text-xs xs:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            
            {/* Filtre par statut */}
            <div className="w-full">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 xs:h-9 sm:h-10 text-xs xs:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="all" className="text-xs xs:text-sm">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente" className="text-xs xs:text-sm">En attente</SelectItem>
                  <SelectItem value="confirme" className="text-xs xs:text-sm">Confirmé</SelectItem>
                  <SelectItem value="assigne" className="text-xs xs:text-sm">Assigné</SelectItem>
                  <SelectItem value="realise" className="text-xs xs:text-sm">Terminé</SelectItem>
                  <SelectItem value="annule" className="text-xs xs:text-sm">Annulé</SelectItem>
                  <SelectItem value="absent" className="text-xs xs:text-sm">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtre par date */}
            <div className="w-full xs:col-span-2 sm:col-span-2 lg:col-span-1">
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Filtrer par date"
                className="h-8 xs:h-9 sm:h-10 text-xs xs:text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
          
          {/* Bouton pour effacer les filtres */}
          {(searchTerm || filterStatus !== 'all' || filterDate) && (
            <div className="mt-3 xs:mt-4 sm:mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterDate('');
                }}
                className="text-xs xs:text-sm px-3 xs:px-4 py-1.5 xs:py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <X className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="hidden xs:inline">Effacer les filtres</span>
                <span className="xs:hidden">Effacer</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
  };

  const PatientView = () => {
    // Données simulées pour les patients
    const patientAppointments = [
      {
        id: 1,
        doctor: 'Dr. Fatou Diop',
        specialty: 'Cardiologie',
        date: '2024-01-15',
        time: '14:00',
        status: 'confirmed',
        location: 'Cabinet 2',
        notes: 'Apporter les derniers examens'
      },
      {
        id: 2,
        doctor: 'Dr. Aminata Fall',
        specialty: 'Médecine générale',
        date: '2024-01-22',
        time: '10:30',
        status: 'confirmed',
        location: 'Cabinet 1',
        notes: ''
      },
      {
        id: 3,
        doctor: 'Dr. Fatou Diop',
        specialty: 'Cardiologie',
        date: '2024-01-08',
        time: '09:00',
        status: 'completed',
        location: 'Cabinet 2',
        notes: 'Consultation de suivi',
        report: 'Tension stable, continuer le traitement actuel'
      }
    ];

    return (
    <>
      {/* Actions rapides - Responsive amélioré */}
      <Card className="bg-gradient-clinic text-white mb-4 xs:mb-6">
        <CardContent className="p-4 xs:p-6">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between space-y-4 xs:space-y-0">
            <div className="flex-1">
              <h3 className="text-lg xs:text-xl font-semibold mb-2">Besoin d'un rendez-vous ?</h3>
              <p className="opacity-90 text-sm xs:text-base">Réservez facilement votre prochaine consultation</p>
            </div>
            <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => setIsAppointmentFormOpen(true)}
                  className="w-full xs:w-auto text-sm xs:text-base px-4 xs:px-6 py-2 xs:py-3"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Prendre RDV
                </Button>
              </DialogTrigger>
              <AppointmentForm 
                onSubmit={handleCreateAppointment}
                onCancel={() => setIsAppointmentFormOpen(false)}
              />
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques personnelles - Responsive amélioré */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4 mb-4 xs:mb-6">
        <Card className="card-responsive-compact">
          <CardHeader className="pb-2 xs:pb-3 px-3 xs:px-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-600 dark:text-gray-400">Prochain RDV</CardTitle>
          </CardHeader>
          <CardContent className="px-3 xs:px-4">
            <div className="text-base xs:text-lg font-bold text-gray-900 dark:text-white">15 Jan</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Dr. Fatou Diop</p>
          </CardContent>
        </Card>
        <Card className="card-responsive-compact">
          <CardHeader className="pb-2 xs:pb-3 px-3 xs:px-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-600 dark:text-gray-400">Cette année</CardTitle>
          </CardHeader>
          <CardContent className="px-3 xs:px-4">
            <div className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">8</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">consultations</p>
          </CardContent>
        </Card>
        <Card className="card-responsive-compact xs:col-span-2 md:col-span-1">
          <CardHeader className="pb-2 xs:pb-3 px-3 xs:px-4">
            <CardTitle className="text-xs xs:text-sm font-medium text-gray-600 dark:text-gray-400">Dernière visite</CardTitle>
          </CardHeader>
          <CardContent className="px-3 xs:px-4">
            <div className="text-base xs:text-lg font-bold text-gray-900 dark:text-white">8 Jan</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cardiologie</p>
          </CardContent>
        </Card>
      </div>

      {/* Mes rendez-vous - Responsive amélioré */}
      <Card className="card-responsive">
        <CardHeader className="pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
          <CardTitle className="text-sm xs:text-base sm:text-lg text-gray-900 dark:text-white">Mes rendez-vous</CardTitle>
          <CardDescription className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">Consultez l'historique et gérez vos rendez-vous</CardDescription>
        </CardHeader>
        <CardContent className="p-0 xs:p-3 sm:p-6">
          <div className="table-responsive">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Médecin</TableHead>
                  <TableHead className="hidden xs:table-cell text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Spécialité</TableHead>
                  <TableHead className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Date & Heure</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Lieu</TableHead>
                  <TableHead className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</TableHead>
                  <TableHead className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {patientAppointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <TableCell className="py-2 xs:py-3">
                    <div className="font-medium text-xs xs:text-sm text-gray-900 dark:text-white">{appointment.doctor}</div>
                    <div className="xs:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">{appointment.specialty}</div>
                  </TableCell>
                  <TableCell className="hidden xs:table-cell py-2 xs:py-3">
                    <span className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">{appointment.specialty}</span>
                  </TableCell>
                  <TableCell className="py-2 xs:py-3">
                    <div className="flex items-center space-x-1 xs:space-x-2">
                      <Calendar className="h-3 w-3 xs:h-4 xs:w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-gray-900 dark:text-white">{appointment.date}</span>
                      <Clock className="h-3 w-3 xs:h-4 xs:w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-xs xs:text-sm text-gray-900 dark:text-white">{appointment.time}</span>
                    </div>
                    <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">{appointment.location}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell py-2 xs:py-3">
                    <span className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">{appointment.location}</span>
                  </TableCell>
                  <TableCell className="py-2 xs:py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 xs:py-3">
                    <div className="flex items-center space-x-1 xs:space-x-2">
                      {appointment.status === 'confirmed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 text-xs px-2 py-1"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <X className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="hidden xs:inline">Annuler</span>
                          <span className="xs:hidden">✗</span>
                        </Button>
                      )}
                      {appointment.status === 'completed' && appointment.report && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 text-xs px-2 py-1"
                          onClick={() => handleViewReport(appointment.id)}
                        >
                          <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="hidden xs:inline">Rapport</span>
                          <span className="xs:hidden">📄</span>
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 text-xs px-2 py-1"
                      >
                        <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="hidden xs:inline">Détails</span>
                        <span className="xs:hidden">👁</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </>
    );
  };

  return (
    <div className="space-y-4 xs:space-y-6">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center space-y-2 xs:space-y-0">
        <div className="flex-1">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {user?.role === 'doctor' ? 'Mes consultations' : 'Mes rendez-vous'}
          </h1>
          <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400 mt-1">
            {user?.role === 'doctor' 
              ? 'Gérez vos consultations et rédigez vos comptes rendus'
              : 'Consultez et gérez vos rendez-vous médicaux'
            }
          </p>
        </div>
      </div>

      {user?.role === 'doctor' ? <DoctorView /> : <PatientView />}
    </div>
  );
};

export default MyAppointments;

