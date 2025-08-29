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
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Edit, Check, Trash2, UserPlus, Search, Eye, CalendarDays, Plus } from 'lucide-react';

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
        const docteursConvertis = docteursData.map(user => ({
          id: parseInt(user.id),
          first_name: user.firstName,
          last_name: user.lastName,
          speciality: user.speciality || 'Généraliste'
        }));
        setDocteurs(docteursConvertis);
      } catch (error) {
        console.error('Erreur lors du chargement des docteurs:', error);
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

  // 5. Créer un nouveau rendez-vous
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
