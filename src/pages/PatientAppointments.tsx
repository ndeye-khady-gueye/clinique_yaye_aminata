import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, Search, Plus, Eye, X, FileText, Phone, Mail, Loader2, AlertTriangle, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

const PatientAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Charger les rendez-vous du patient
  const loadPatientAppointments = async () => {
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
    } catch (err) {
      console.error('Erreur lors du chargement des rendez-vous:', err);
      setError('Erreur lors du chargement de vos rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadPatientAppointments();
  }, [user?.email]);

  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.docteur?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.docteur?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || appointment.statut === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculer les statistiques
  const stats = {
    totalAppointments: appointments.length,
    confirmedAppointments: appointments.filter(rdv => rdv.statut === 'confirme').length,
    completedAppointments: appointments.filter(rdv => rdv.statut === 'realise' || rdv.statut === 'termine').length,
    upcomingAppointments: appointments.filter(rdv => {
      const appointmentDate = new Date(rdv.date_confirmee || rdv.date_souhaitee);
      return appointmentDate > new Date() && rdv.statut === 'confirme';
    }).length
  };

  // Obtenir le prochain rendez-vous
  const getNextAppointment = () => {
    const upcoming = appointments
      .filter(rdv => {
        const appointmentDate = new Date(rdv.date_confirmee || rdv.date_souhaitee);
        return appointmentDate > new Date() && rdv.statut === 'confirme';
      })
      .sort((a, b) => new Date(a.date_confirmee || a.date_souhaitee).getTime() - new Date(b.date_confirmee || b.date_souhaitee).getTime());
    
    return upcoming[0] || null;
  };

  // Obtenir la dernière visite
  const getLastVisit = () => {
    const completed = appointments
      .filter(rdv => rdv.statut === 'realise' || rdv.statut === 'termine')
      .sort((a, b) => new Date(b.date_confirmee || b.date_souhaitee).getTime() - new Date(a.date_confirmee || a.date_souhaitee).getTime());
    
    return completed[0] || null;
  };

  // Annuler un rendez-vous
  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      // Ici, vous pouvez implémenter l'API pour annuler un rendez-vous
      toast.success('Rendez-vous annulé avec succès');
      loadPatientAppointments();
    } catch (err) {
      toast.error('Erreur lors de l\'annulation du rendez-vous');
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
      pdf.text(`Statut: ${appointment.statut}`, 20, 150);
      
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

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
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

  // Obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirme':
        return 'bg-blue-100 text-blue-800';
      case 'realise':
      case 'termine':
        return 'bg-green-100 text-green-800';
      case 'annule':
        return 'bg-red-100 text-red-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos rendez-vous...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={loadPatientAppointments}>Réessayer</Button>
      </div>
    );
  }

  const nextAppointment = getNextAppointment();
  const lastVisit = getLastVisit();

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes rendez-vous</h1>
          <p className="text-gray-600 mt-2">Consultez et gérez vos rendez-vous médicaux</p>
        </div>
        
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Prendre RDV
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
                <p className="text-xs text-gray-500">consultations</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmedAppointments}</p>
                <p className="text-xs text-gray-500">en attente</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Réalisés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedAppointments}</p>
                <p className="text-xs text-gray-500">terminés</p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">À venir</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
                <p className="text-xs text-gray-500">prochains</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prochain RDV et Dernière visite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prochain RDV */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Prochain RDV
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {formatDate(nextAppointment.date_confirmee || nextAppointment.date_souhaitee)}
                  </span>
                  <Badge className={getStatusColor(nextAppointment.statut)}>
                    {translateStatus(nextAppointment.statut)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Dr. {nextAppointment.docteur?.first_name} {nextAppointment.docteur?.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  {nextAppointment.docteur?.speciality || 'Médecine générale'}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime(nextAppointment.date_confirmee || nextAppointment.date_souhaitee)}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Aucun rendez-vous à venir</p>
            )}
          </CardContent>
        </Card>

        {/* Dernière visite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Dernière visite
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastVisit ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {formatDate(lastVisit.date_confirmee || lastVisit.date_souhaitee)}
                  </span>
                  <Badge className={getStatusColor(lastVisit.statut)}>
                    {translateStatus(lastVisit.statut)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Dr. {lastVisit.docteur?.first_name} {lastVisit.docteur?.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  {lastVisit.docteur?.speciality || 'Médecine générale'}
                </p>
                <p className="text-sm text-gray-500">
                  {lastVisit.service?.nom || 'Service non spécifié'}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Aucune visite récente</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Mes rendez-vous</CardTitle>
          <CardDescription>Consultez l'historique et gérez vos rendez-vous</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par médecin ou service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="confirme">Confirmé</SelectItem>
                <SelectItem value="realise">Réalisé</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="annule">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des rendez-vous */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Médecin</TableHead>
                  <TableHead>Spécialité</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Aucun rendez-vous trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            Dr. {appointment.docteur?.first_name} {appointment.docteur?.last_name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.docteur?.speciality || 'Non spécifiée'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatDate(appointment.date_confirmee || appointment.date_souhaitee)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTime(appointment.date_confirmee || appointment.date_souhaitee)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.service?.nom || 'Non spécifié'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.statut)}>
                          {translateStatus(appointment.statut)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {(appointment.statut === 'realise' || appointment.statut === 'termine') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExportReport(appointment)}
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {appointment.statut === 'confirme' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
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

      {/* Modal de détails */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
            <DialogDescription>
              Informations complètes sur votre rendez-vous
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Informations du patient */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Informations du Patient</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nom</p>
                    <p className="font-medium">{selectedAppointment.client_nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedAppointment.client_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium">{selectedAppointment.client_telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <Badge className={getStatusColor(selectedAppointment.statut)}>
                      {translateStatus(selectedAppointment.statut)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Informations du rendez-vous */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Détails du Rendez-vous</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {formatDate(selectedAppointment.date_confirmee || selectedAppointment.date_souhaitee)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Heure</p>
                    <p className="font-medium">
                      {formatTime(selectedAppointment.date_confirmee || selectedAppointment.date_souhaitee)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Médecin</p>
                    <p className="font-medium">
                      Dr. {selectedAppointment.docteur?.first_name} {selectedAppointment.docteur?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Spécialité</p>
                    <p className="font-medium">
                      {selectedAppointment.docteur?.speciality || 'Non spécifiée'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service</p>
                    <p className="font-medium">
                      {selectedAppointment.service?.nom || 'Non spécifié'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prix</p>
                    <p className="font-medium">
                      {selectedAppointment.prix_consultation || selectedAppointment.service?.prix || 0} FCFA
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedAppointment.message && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Message</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedAppointment.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                {(selectedAppointment.statut === 'realise' || selectedAppointment.statut === 'termine') && (
                  <Button onClick={() => handleExportReport(selectedAppointment)}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter Rapport
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientAppointments;
