import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Plus, Eye, Calendar, FileText, Phone, Mail, Loader2, AlertTriangle, X, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PatientEnregistreForm from '@/components/forms/PatientEnregistreForm';
import PatientEnregistreDetailsModal from '@/components/modals/PatientEnregistreDetailsModal';
import { patientEnregistreService, PatientEnregistre } from '@/services/patientEnregistreService';
import { toast } from '@/components/ui/use-toast';



const Patients = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientEnregistre | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [patients, setPatients] = useState<PatientEnregistre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    typeConsultation: 'all',
    statut: 'all',
    prixMin: '',
    prixMax: ''
  });

  // Charger les patients depuis le backend
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const patientsData = await patientEnregistreService.getAllPatientsEnregistres();
      setPatients(patientsData);
    } catch (err) {
      setError('Erreur lors du chargement des patients enregistrés');
      console.error('Erreur chargement patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const filteredPatients = patients.filter(patient => {
    // Filtre de recherche textuelle
    const searchMatch = !searchTerm || 
      `${patient.nom} ${patient.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.telephone && patient.telephone.includes(searchTerm));

         // Filtre par type de consultation
     const typeMatch = filters.typeConsultation === 'all' || patient.type_consultation === filters.typeConsultation;

     // Filtre par statut
     const statutMatch = filters.statut === 'all' || patient.statut === filters.statut;

    // Filtre par prix minimum
    const prixMinMatch = !filters.prixMin || (patient.prix_consultation && patient.prix_consultation >= parseFloat(filters.prixMin));

    // Filtre par prix maximum
    const prixMaxMatch = !filters.prixMax || (patient.prix_consultation && patient.prix_consultation <= parseFloat(filters.prixMax));

    return searchMatch && typeMatch && statutMatch && prixMinMatch && prixMaxMatch;
  });

  const handleCreatePatient = async (data: any) => {
    try {
      if (formData?.id) {
        // Mise à jour d'un patient existant
        await patientEnregistreService.updatePatientEnregistre(formData.id, data);
        toast({
          title: "Succès",
          description: "Patient modifié avec succès !",
          variant: "success",
        });
      } else {
        // Création d'un nouveau patient
        await patientEnregistreService.createPatientEnregistre(data);
        toast({
          title: "Succès",
          description: "Patient enregistré avec succès !",
          variant: "success",
        });
      }

      setIsFormOpen(false);
      setFormData(null);
      // Recharger la liste des patients
      await loadPatients();
    } catch (error) {
      console.error('Erreur lors de la création/modification du patient:', error);
      toast({
        title: "Erreur",
        description: formData?.id ? "Erreur lors de la modification du patient" : "Erreur lors de l'enregistrement du patient",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (patient: PatientEnregistre) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
  };

  const handleCreateAppointment = (patientId: number) => {
    console.log('Créer RDV pour patient:', patientId);
    // Rediriger vers la page de création de RDV ou ouvrir une modal
  };

  const handleViewMedicalRecord = (patientId: number) => {
    console.log('Voir dossier médical:', patientId);
    // Ouvrir le dossier médical du patient
  };

  const handleEditPatient = (patient: PatientEnregistre) => {
    setFormData(patient);
    setIsFormOpen(true);
  };

  const handleDeletePatient = async (patientId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        await patientEnregistreService.deletePatientEnregistre(patientId);
        toast({
          title: "Succès",
          description: "Patient supprimé avec succès !",
          variant: "success",
        });
        await loadPatients();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression du patient",
          variant: "destructive",
        });
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      typeConsultation: 'all',
      statut: 'all',
      prixMin: '',
      prixMax: ''
    });
  };

  const exportToPDF = () => {
    // Import dynamique de jsPDF pour éviter les erreurs SSR
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(({ default: autoTable }) => {
        const doc = new jsPDF();
        
        // Titre principal
        doc.setFontSize(20);
        doc.setTextColor(108, 36, 118); // Couleur #6C2476
        doc.text('CABINET YAYE AMINATA', 105, 20, { align: 'center' });
        
        // Sous-titre
        doc.setFontSize(14);
        doc.setTextColor(75, 85, 99); // Couleur gray-600
        doc.text('Liste des Patients Enregistrés', 105, 35, { align: 'center' });
        
        // Informations du cabinet
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128); // Couleur gray-500
        doc.text('Tél: +221 33 893 47 89 / +221 78 437 01 01', 105, 45, { align: 'center' });
        doc.text('Email: cabinetyayeaminata25@gmail.com', 105, 52, { align: 'center' });
        doc.text('Adresse: Rufisque Nord, Quartier Jaraaf Nord Parcelle n°99, District Sanitaire de Sangalkam', 105, 59, { align: 'center' });
        doc.text('Dakar - Sénégal', 105, 66, { align: 'center' });
        
        // Date d'export
        const now = new Date();
        doc.text(`Exporté le: ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`, 105, 73, { align: 'center' });
        
        // Statistiques
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55); // Couleur gray-800
        doc.text(`Total: ${patients.length} patient(s) | Trouvé(s): ${filteredPatients.length} patient(s)`, 105, 85, { align: 'center' });
        
        // Filtres actifs
        const activeFilters = [];
        if (searchTerm) activeFilters.push(`Recherche: "${searchTerm}"`);
        if (filters.typeConsultation !== 'all') activeFilters.push(`Type: ${filters.typeConsultation}`);
        if (filters.statut !== 'all') activeFilters.push(`Statut: ${filters.statut}`);
        if (filters.prixMin) activeFilters.push(`Prix min: ${filters.prixMin} FCFA`);
        if (filters.prixMax) activeFilters.push(`Prix max: ${filters.prixMax} FCFA`);
        
        if (activeFilters.length > 0) {
          doc.setFontSize(10);
          doc.setTextColor(107, 114, 128);
          doc.text(`Filtres actifs: ${activeFilters.join(' | ')}`, 105, 92, { align: 'center' });
        }
        
        // Préparation des données pour le tableau
        const tableData = filteredPatients.map(patient => [
          `#${patient.id}`,
          `${patient.nom} ${patient.prenom}`,
          patient.profession || '-',
          patient.email || 'Non renseigné',
          patient.telephone || 'Non renseigné',
          patient.age ? `${patient.age} ans` : '-',
          patient.motif_visite,
          patient.type_consultation,
          patient.prix_consultation ? `${patient.prix_consultation.toLocaleString()} FCFA` : '-',
          patient.statut
        ]);
        
        // Configuration du tableau
        autoTable(doc, {
          head: [['ID', 'Nom complet', 'Profession', 'Email', 'Téléphone', 'Âge', 'Motif visite', 'Type consultation', 'Prix', 'Statut']],
          body: tableData,
          startY: 100,
          styles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [108, 36, 118],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [108, 36, 118],
            textColor: 255,
            fontSize: 9,
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252],
          },
          columnStyles: {
            0: { cellWidth: 15 }, // ID
            1: { cellWidth: 35 }, // Nom complet
            2: { cellWidth: 25 }, // Profession
            3: { cellWidth: 35 }, // Email
            4: { cellWidth: 25 }, // Téléphone
            5: { cellWidth: 15 }, // Âge
            6: { cellWidth: 30 }, // Motif visite
            7: { cellWidth: 25 }, // Type consultation
            8: { cellWidth: 25 }, // Prix
            9: { cellWidth: 20 }, // Statut
          },
          margin: { top: 100, right: 10, left: 10 },
        });
        
        // Pied de page
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(107, 114, 128);
          doc.text(`Page ${i} sur ${pageCount}`, 105, (doc as any).internal.pageSize.height - 10, { align: 'center' });
        }
        
        // Sauvegarde du PDF
        const fileName = `patients_enregistres_${now.toISOString().split('T')[0]}_${now.getHours()}-${now.getMinutes()}.pdf`;
        doc.save(fileName);
      });
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header responsive */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Patients Enregistrés
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
            Gestion des patients temporaires enregistrés au cabinet
          </p>
        </div>
        
        {/* Boutons d'action - responsive */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={exportToPDF}
            className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 w-full xs:w-auto text-xs sm:text-sm"
            disabled={patients.length === 0}
          >
            <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Export PDF</span>
            <span className="xs:hidden">PDF</span>
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="w-full xs:w-auto hover:opacity-90 text-xs sm:text-sm" onClick={() => setFormData(null)}>
                <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">
                  {formData?.id ? 'Modifier le patient' : 'Enregistrer un patient'}
                </span>
                <span className="xs:hidden">
                  {formData?.id ? 'Modifier' : 'Nouveau'}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 mx-2 sm:mx-0">
              <PatientEnregistreForm 
                onSubmit={handleCreatePatient}
                onCancel={() => setIsFormOpen(false)}
                initialData={formData}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques - responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total patients</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-gray-500">enregistrés</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Avec email</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
              {patients.filter(p => p.email).length}
            </div>
            <p className="text-xs text-gray-500">avec email</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
              {patients.filter(p => {
                const createdDate = new Date(p.created_at || '');
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                return createdDate > oneMonthAgo;
              }).length}
            </div>
            <p className="text-xs text-gray-500">ce mois</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Consultations</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
              {patients.length > 0 ? Math.floor(patients.length * 3.5) : 0}
            </div>
            <p className="text-xs text-gray-500">estimées</p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et Filtres - responsive */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-sm sm:text-base">
            <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Recherche et Filtres
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Recherchez et filtrez les patients enregistrés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-3 sm:px-6">
          {/* Barre de recherche principale */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nom, prénom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          
          {/* Filtres avancés - responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="filter-type" className="text-xs sm:text-sm font-medium">Type consultation</Label>
              <Select value={filters.typeConsultation} onValueChange={(value) => setFilters(prev => ({ ...prev, typeConsultation: value }))}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="MEDECIN">Médecin</SelectItem>
                  <SelectItem value="GYNECO">Gynécologie</SelectItem>
                  <SelectItem value="PEDIATRIE">Pédiatrie</SelectItem>
                  <SelectItem value="SAGE_FEMME">Sage-femme</SelectItem>
                  <SelectItem value="ENFANT">Enfant</SelectItem>
                  <SelectItem value="AUTRE">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filter-statut" className="text-xs sm:text-sm font-medium">Statut</Label>
              <Select value={filters.statut} onValueChange={(value) => setFilters(prev => ({ ...prev, statut: value }))}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="enregistre">Enregistré</SelectItem>
                  <SelectItem value="en_consultation">En consultation</SelectItem>
                  <SelectItem value="termine">Terminé</SelectItem>
                  <SelectItem value="annule">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filter-prix-min" className="text-xs sm:text-sm font-medium">Prix min (FCFA)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.prixMin}
                onChange={(e) => setFilters(prev => ({ ...prev, prixMin: e.target.value }))}
                className="text-xs sm:text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="filter-prix-max" className="text-xs sm:text-sm font-medium">Prix max (FCFA)</Label>
              <Input
                type="number"
                placeholder="10000"
                value={filters.prixMax}
                onChange={(e) => setFilters(prev => ({ ...prev, prixMax: e.target.value }))}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
          
          {/* Boutons de filtres - responsive */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
                className="text-gray-600 text-xs sm:text-sm w-full xs:w-auto"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Effacer les filtres
              </Button>
              <span className="text-xs sm:text-sm text-gray-500 text-center xs:text-left">
                {filteredPatients.length} patient(s) trouvé(s)
              </span>
            </div>
            
            <div className="flex flex-col xs:flex-row xs:items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportToPDF}
                className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 text-xs sm:text-sm w-full xs:w-auto"
                disabled={filteredPatients.length === 0}
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Export PDF
              </Button>
              <div className="text-xs sm:text-sm text-gray-500 text-center xs:text-left">
                Total: {patients.length} patient(s) enregistré(s)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des patients - responsive */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-sm sm:text-base">
            <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Liste des patients enregistrés
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {filteredPatients.length} patient(s) trouvé(s) sur {patients.length} enregistré(s)
            {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '') ? ' (avec filtres actifs)' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {/* Version mobile - Cartes */}
          <div className="block lg:hidden space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Chargement des patients enregistrés...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle className="h-6 w-6" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-sm">Aucun patient enregistré trouvé</span>
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          #{patient.id}
                        </span>
                        <div>
                          <div className="font-medium text-sm">
                            {patient.nom} {patient.prenom}
                          </div>
                          {patient.profession && (
                            <div className="text-xs text-gray-500">
                              {patient.profession}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs">
                        <Mail className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="truncate">{patient.email || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Phone className="h-3 w-3 mr-2 text-gray-400" />
                        <span>{patient.telephone || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Âge: {patient.age ? `${patient.age} ans` : '-'}</span>
                        <span className="font-medium text-green-600">
                          {patient.prix_consultation?.toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Motif:</span> {patient.motif_visite}
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Type:</span> {patient.type_consultation}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Dialog open={isDetailsOpen && selectedPatient?.id === patient.id} onOpenChange={(open) => {
                        if (!open) {
                          setIsDetailsOpen(false);
                          setSelectedPatient(null);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(patient)}
                            className="w-full text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir détails
                          </Button>
                        </DialogTrigger>
                        <PatientEnregistreDetailsModal patient={patient} />
                      </Dialog>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPatient(patient)}
                          className="flex-1 text-xs"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePatient(patient.id!)}
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Version desktop - Tableau */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">ID</TableHead>
                  <TableHead className="text-xs">Nom complet</TableHead>
                  <TableHead className="text-xs">Contact</TableHead>
                  <TableHead className="text-xs">Âge</TableHead>
                  <TableHead className="text-xs">Motif visite</TableHead>
                  <TableHead className="text-xs">Type consultation</TableHead>
                  <TableHead className="text-xs">Prix</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-sm">Chargement des patients enregistrés...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-red-600">
                      <div className="flex items-center justify-center space-x-2">
                        <AlertTriangle className="h-6 w-6" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <span className="text-sm">Aucun patient enregistré trouvé</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                            #{patient.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {patient.nom} {patient.prenom}
                          </div>
                          {patient.profession && (
                            <div className="text-xs text-gray-500 mt-1">
                              {patient.profession}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="truncate max-w-[150px]">{patient.email || 'Non renseigné'}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{patient.telephone || 'Non renseigné'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{patient.age ? `${patient.age} ans` : '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">{patient.motif_visite}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">{patient.type_consultation}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600 text-sm">
                          {patient.prix_consultation?.toLocaleString()} FCFA
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Dialog open={isDetailsOpen && selectedPatient?.id === patient.id} onOpenChange={(open) => {
                            if (!open) {
                              setIsDetailsOpen(false);
                              setSelectedPatient(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDetails(patient)}
                                className="w-full text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                            </DialogTrigger>
                            <PatientEnregistreDetailsModal patient={patient} />
                          </Dialog>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPatient(patient)}
                              className="flex-1 text-xs"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Modifier
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeletePatient(patient.id!)}
                              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          </div>
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
    </div>
  );
};

export default Patients;
