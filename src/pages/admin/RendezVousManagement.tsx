import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppointmentForm from '@/components/forms/AppointmentForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { rdvResponsableApi, apiService } from '@/services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Edit, Check, Trash2, UserPlus, Search, Eye, CalendarDays, Plus, List, Download } from 'lucide-react';

interface DemandeRDV {
  id: number;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  service: {
    id: number;
    nom: string;
  };
  message: string;
  date_souhaitee: string;
  date_confirmee: string | null;
  docteur: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;
  statut: string;
  notes: string;
  created_at: string;
}

interface Docteur {
  id: number;
  first_name: string;
  last_name: string;
  speciality: string;
}

const RendezVousManagement: React.FC = () => {
  const [demandesRDV, setDemandesRDV] = useState<DemandeRDV[]>([]);
  const [docteurs, setDocteurs] = useState<Docteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemande, setSelectedDemande] = useState<DemandeRDV | null>(null);
  const [statistiques, setStatistiques] = useState({
    total_rdv: 0,
    en_attente: 0,
    confirmes: 0,
    realises: 0,
    annules: 0,
  });

  // États pour les modals
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [modificationModal, setModificationModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    docteur_id: '',
    date_confirmee: '',
    notes: '',
  });
  const [modificationData, setModificationData] = useState({
    date_confirmee: '',
    docteur_id: '',
    notes: '',
    raison_modification: '',
  });

  // États pour la liste complète des rendez-vous
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rdvData, statsData] = await Promise.all([
        rdvResponsableApi.getDemandesEnAttente(),
        rdvResponsableApi.getStatistiques(),
      ]);
      setDemandesRDV(rdvData);
      setStatistiques(statsData);
      
      // Charger les docteurs
      try {
        const docteursData = await apiService.getDoctors();
        console.log('🔍 Docteurs récupérés depuis API:', docteursData);
        
        const docteursConvertis = docteursData.map(user => ({
          id: parseInt(user.id),
          first_name: user.firstName,
          last_name: user.lastName,
          speciality: user.speciality || 'Généraliste'
        }));
        
        console.log('👨‍⚕️ Docteurs convertis:', docteursConvertis);
        setDocteurs(docteursConvertis);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des docteurs:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des docteurs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 1. Confirmer une demande de RDV
  const handleConfirmer = async () => {
    if (!selectedDemande) return;

    try {
      await rdvResponsableApi.confirmerRendezVous({
        rendez_vous_id: selectedDemande.id,
        docteur_id: confirmationData.docteur_id ? parseInt(confirmationData.docteur_id) : undefined,
        date_confirmee: confirmationData.date_confirmee || undefined,
        notes: confirmationData.notes,
        envoyer_notification: true, // Envoyer notification automatiquement
      });

      toast({
        title: "✅ Rendez-vous confirmé !",
        description: "Le client a été notifié par email",
      });

      setConfirmationModal(false);
      setConfirmationData({ docteur_id: '', date_confirmee: '', notes: '' });
      loadData(); // Recharger les données
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // 2. Modifier une demande de RDV
  const handleModifier = async () => {
    if (!selectedDemande) return;

    try {
      await rdvResponsableApi.modifierRendezVous({
        rendez_vous_id: selectedDemande.id,
        date_confirmee: modificationData.date_confirmee,
        docteur_id: modificationData.docteur_id ? parseInt(modificationData.docteur_id) : undefined,
        notes: modificationData.notes,
        raison_modification: modificationData.raison_modification,
      });

      toast({
        title: "✅ Rendez-vous modifié !",
        description: "Le client a été notifié de la modification",
      });

      setModificationModal(false);
      setModificationData({ date_confirmee: '', docteur_id: '', notes: '', raison_modification: '' });
      loadData();
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // 3. Supprimer une demande de RDV
  const handleSupprimer = async (rdvId: number) => {
    try {
      await rdvResponsableApi.supprimerRendezVous(rdvId);
      toast({
        title: "✅ Demande supprimée",
        description: "La demande de rendez-vous a été supprimée",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "❌ Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // 4. Voir les détails d'une demande
  const handleVoirDetails = (demande: DemandeRDV) => {
    setSelectedDemande(demande);
    setDetailsModal(true);
  };

  // 5. Charger tous les rendez-vous
  const loadAllAppointments = async () => {
    try {
      setListLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/rendez-vous/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des rendez-vous');
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      
      if (Array.isArray(data)) {
        setAllAppointments(data);
      } else if (data.results && Array.isArray(data.results)) {
        setAllAppointments(data.results);
      } else if (data.data && Array.isArray(data.data)) {
        setAllAppointments(data.data);
      } else {
        console.error('Format de données inattendu:', data);
        setAllAppointments([]);
        toast({
          title: "Erreur",
          description: "Format de données inattendu",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setAllAppointments([]);
      toast({
        title: "Erreur",
        description: "Impossible de charger tous les rendez-vous",
        variant: "destructive",
      });
    } finally {
      setListLoading(false);
    }
  };

  // 6. Générer et télécharger le PDF
  const generatePDF = () => {
    if (!Array.isArray(allAppointments) || allAppointments.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucun rendez-vous à exporter",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF('landscape');
    
    doc.setFontSize(20);
    doc.text('Liste des Rendez-vous - Cabinet Yaye Aminata', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 20, 30);
    
    const tableData = allAppointments.map((appointment) => {
      const clientName = appointment.patient?.user?.first_name 
        ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
        : appointment.client_nom || 'N/A';
      const clientType = appointment.patient ? 'Patient' : 'Client';
      
      return [
        appointment.id.toString(),
        `${clientName} (${clientType})`,
        appointment.service?.nom || 'N/A',
        appointment.date_souhaitee 
          ? new Date(appointment.date_souhaitee).toLocaleString('fr-FR')
          : 'Non spécifiée',
        appointment.date_confirmee 
          ? new Date(appointment.date_confirmee).toLocaleString('fr-FR')
          : 'Non confirmée',
        appointment.docteur 
          ? `Dr. ${appointment.docteur.first_name} ${appointment.docteur.last_name}`
          : 'Non assigné',
        appointment.statut,
        appointment.prix_consultation 
          ? `${appointment.prix_consultation} FCFA`
          : 'Non défini'
      ];
    });
    
    autoTable(doc, {
      head: [['ID', 'Client/Patient', 'Service', 'Date souhaitée', 'Date confirmée', 'Médecin', 'Statut', 'Prix']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 12,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [108, 36, 118],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 13,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 45 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 40 },
        6: { cellWidth: 20 },
        7: { cellWidth: 25 },
      },
      margin: { top: 40, right: 20, bottom: 60, left: 20 },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    doc.setFontSize(14);
    doc.text('Statistiques:', 20, finalY + 20);
    doc.setFontSize(12);
    doc.text(`Total: ${allAppointments.length}`, 30, finalY + 30);
    doc.text(`En attente: ${allAppointments.filter(a => a.statut === 'en_attente').length}`, 30, finalY + 40);
    doc.text(`Confirmés: ${allAppointments.filter(a => a.statut === 'confirme').length}`, 30, finalY + 50);
    doc.text(`Réalisés: ${allAppointments.filter(a => a.statut === 'realise').length}`, 30, finalY + 60);
    
    const fileName = `rendez-vous-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "Succès",
      description: "PDF généré et téléchargé avec succès",
    });
  };

  // 7. Créer un nouveau rendez-vous
  const handleCreateAppointment = async (data: any) => {
    try {
      console.log('Nouveau rendez-vous créé par le responsable:', data);
      toast({
        title: "✅ Succès",
        description: "Rendez-vous créé avec succès !",
      });
      setIsAppointmentFormOpen(false);
      
      // Recharger les données
      await loadData();
      
    } catch (error: any) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast({
        title: "❌ Erreur",
        description: error.message || "Erreur lors de la création du rendez-vous.",
        variant: "destructive",
      });
    }
  };

  const getStatutBadge = (statut: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'en_attente': 'outline',
      'confirme': 'default',
      'realise': 'secondary',
      'annule': 'destructive',
    };

    const labels: Record<string, string> = {
      'en_attente': 'En attente',
      'confirme': 'Confirmé',
      'realise': 'Réalisé',
      'annule': 'Annulé',
    };

    return <Badge variant={variants[statut] || 'outline'}>{labels[statut] || statut}</Badge>;
  };

  const filteredDemandes = demandesRDV.filter(demande =>
    demande.client_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.service.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des demandes de rendez-vous...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Demandes de Rendez-vous</h1>
          <p className="text-gray-600 mt-2">Gérez les demandes de rendez-vous des clients/visiteurs</p>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex space-x-2">
          {/* Bouton Liste des Rendez-vous */}
          <Dialog open={isListModalOpen} onOpenChange={setIsListModalOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsListModalOpen(true);
                  loadAllAppointments();
                }}
                className="hover:opacity-90 transition-all duration-300"
              >
                <List className="mr-2 h-4 w-4" />
                Liste des Rendez-vous
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Liste Complète des Rendez-vous</span>
                  <Button 
                    onClick={generatePDF}
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    disabled={!Array.isArray(allAppointments) || allAppointments.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </DialogTitle>
              </DialogHeader>
              {listLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-lg">Chargement des rendez-vous...</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Client/Patient</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Service</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Date souhaitée</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Date confirmée</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Médecin</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Statut</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Prix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(allAppointments) && allAppointments.map((appointment) => {
                        const clientName = appointment.patient?.user?.first_name 
                          ? `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`
                          : appointment.client_nom || 'N/A';
                        const clientType = appointment.patient ? 'Patient' : 'Client';
                        
                        return (
                          <tr key={appointment.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2">{appointment.id}</td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div>
                                <div className="font-medium">{clientName}</div>
                                <div className="text-sm text-gray-500">{clientType}</div>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div>
                                <div className="font-medium">{appointment.service?.nom || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{appointment.service?.prix || 'N/A'} FCFA</div>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {appointment.date_souhaitee 
                                ? new Date(appointment.date_souhaitee).toLocaleString('fr-FR')
                                : 'Non spécifiée'
                              }
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {appointment.date_confirmee 
                                ? new Date(appointment.date_confirmee).toLocaleString('fr-FR')
                                : 'Non confirmée'
                              }
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {appointment.docteur 
                                ? `Dr. ${appointment.docteur.first_name} ${appointment.docteur.last_name}`
                                : 'Non assigné'
                              }
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {getStatutBadge(appointment.statut)}
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {appointment.prix_consultation 
                                ? `${appointment.prix_consultation} FCFA`
                                : 'Non défini'
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Bouton Nouveau RDV */}
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
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{statistiques.total_rdv}</div>
            <div className="text-sm text-gray-600">Total demandes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{statistiques.en_attente}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statistiques.confirmes}</div>
            <div className="text-sm text-gray-600">Confirmés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{statistiques.realises}</div>
            <div className="text-sm text-gray-600">Réalisés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statistiques.annules}</div>
            <div className="text-sm text-gray-600">Annulés</div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400" />
            <Input
              placeholder="Rechercher par nom, email ou service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes de RDV */}
      <div className="space-y-4">
        {filteredDemandes.map((demande) => (
          <Card key={demande.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* En-tête avec nom client et statut */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="text-gray-400" />
                      <span className="font-semibold text-lg">{demande.client_nom}</span>
                    </div>
                    {getStatutBadge(demande.statut)}
                  </div>

                  {/* Informations principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="text-gray-400 w-4 h-4" />
                        <span className="text-sm">{demande.client_email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="text-gray-400 w-4 h-4" />
                        <span className="text-sm">{demande.client_telephone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="text-gray-400 w-4 h-4" />
                        <span className="text-sm">
                          Date souhaitée: {new Date(demande.date_souhaitee).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Service demandé:</span> {demande.service.nom}
                      </div>
                      {demande.docteur && (
                        <div className="text-sm">
                          <span className="font-medium">Médecin assigné:</span> {demande.docteur.first_name} {demande.docteur.last_name}
                        </div>
                      )}
                      {demande.date_confirmee && (
                        <div className="flex items-center space-x-2">
                          <Clock className="text-gray-400 w-4 h-4" />
                          <span className="text-sm">
                            Date confirmée: {new Date(demande.date_confirmee).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message du client */}
                  {demande.message && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="text-gray-400 w-4 h-4" />
                        <span className="font-medium text-sm">Message du client:</span>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {demande.message}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {demande.notes && (
                    <div className="mb-4">
                      <span className="font-medium text-sm">Notes:</span>
                      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg mt-1">
                        {demande.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col space-y-2 ml-4">
                  {/* Bouton Voir détails */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVoirDetails(demande)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir détails
                  </Button>

                  {/* Bouton Confirmer */}
                  <Dialog open={confirmationModal && selectedDemande?.id === demande.id} onOpenChange={setConfirmationModal}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedDemande(demande)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Confirmer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmer le rendez-vous</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Médecin (optionnel)</label>
                          <Select value={confirmationData.docteur_id} onValueChange={(value) => setConfirmationData(prev => ({ ...prev, docteur_id: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un médecin" />
                            </SelectTrigger>
                            <SelectContent>
                              {docteurs.map((docteur) => (
                                <SelectItem key={docteur.id} value={docteur.id.toString()}>
                                  {docteur.first_name} {docteur.last_name} - {docteur.speciality}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Date confirmée (optionnel)</label>
                          <Input
                            type="datetime-local"
                            value={confirmationData.date_confirmee}
                            onChange={(e) => setConfirmationData(prev => ({ ...prev, date_confirmee: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Notes</label>
                          <Textarea
                            value={confirmationData.notes}
                            onChange={(e) => setConfirmationData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Notes optionnelles..."
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setConfirmationModal(false)}>
                            Annuler
                          </Button>
                          <Button onClick={handleConfirmer} className="bg-green-600 hover:bg-green-700">
                            Confirmer et notifier
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Bouton Modifier */}
                  <Dialog open={modificationModal && selectedDemande?.id === demande.id} onOpenChange={setModificationModal}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDemande(demande)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Modifier le rendez-vous</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Nouvelle date *</label>
                          <Input
                            type="datetime-local"
                            value={modificationData.date_confirmee}
                            onChange={(e) => setModificationData(prev => ({ ...prev, date_confirmee: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Médecin (optionnel)</label>
                          <Select value={modificationData.docteur_id} onValueChange={(value) => setModificationData(prev => ({ ...prev, docteur_id: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un médecin" />
                            </SelectTrigger>
                            <SelectContent>
                              {docteurs.map((docteur) => (
                                <SelectItem key={docteur.id} value={docteur.id.toString()}>
                                  {docteur.first_name} {docteur.last_name} - {docteur.speciality}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Raison de la modification</label>
                          <Textarea
                            value={modificationData.raison_modification}
                            onChange={(e) => setModificationData(prev => ({ ...prev, raison_modification: e.target.value }))}
                            placeholder="Expliquez la raison de la modification..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Notes</label>
                          <Textarea
                            value={modificationData.notes}
                            onChange={(e) => setModificationData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Notes optionnelles..."
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setModificationModal(false)}>
                            Annuler
                          </Button>
                          <Button onClick={handleModifier} className="bg-blue-600 hover:bg-blue-700">
                            Modifier et notifier
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Bouton Supprimer */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. La demande de rendez-vous sera définitivement supprimée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleSupprimer(demande.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de détails */}
      <Dialog open={detailsModal} onOpenChange={setDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande de rendez-vous</DialogTitle>
          </DialogHeader>
          {selectedDemande && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nom du client</label>
                  <p className="text-sm">{selectedDemande.client_nom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm">{selectedDemande.client_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Téléphone</label>
                  <p className="text-sm">{selectedDemande.client_telephone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Service demandé</label>
                  <p className="text-sm">{selectedDemande.service.nom}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date souhaitée</label>
                  <p className="text-sm">{new Date(selectedDemande.date_souhaitee).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Statut</label>
                  <div className="mt-1">{getStatutBadge(selectedDemande.statut)}</div>
                </div>
              </div>
              
              {selectedDemande.message && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Message du client</label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{selectedDemande.message}</p>
                </div>
              )}
              
              {selectedDemande.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-sm bg-blue-50 p-3 rounded-lg mt-1">{selectedDemande.notes}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-600">Date de création</label>
                <p className="text-sm">{new Date(selectedDemande.created_at).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message si aucune demande */}
      {filteredDemandes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              {searchTerm ? 'Aucune demande trouvée pour cette recherche.' : 'Aucune demande de rendez-vous en attente.'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RendezVousManagement;
