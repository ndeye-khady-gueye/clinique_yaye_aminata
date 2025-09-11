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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Patients Enregistrés
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestion des patients temporaires enregistrés au cabinet
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
           <Button 
             variant="outline" 
             onClick={exportToPDF}
            className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 w-full sm:w-auto"
             disabled={patients.length === 0}
           >
             <Download className="mr-2 h-4 w-4" />
             Export PDF
           </Button>
           <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
             <DialogTrigger asChild>
              <Button className="w-full sm:w-auto hover:opacity-90" onClick={() => setFormData(null)}>
                 <Plus className="mr-2 h-4 w-4" />
                 {formData?.id ? 'Modifier le patient' : 'Enregistrer un patient'}
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
               <PatientEnregistreForm 
                 onSubmit={handleCreatePatient}
                 onCancel={() => setIsFormOpen(false)}
                 initialData={formData}
               />
             </DialogContent>
           </Dialog>
         </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-gray-500">enregistrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avec email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.email).length}
            </div>
            <p className="text-xs text-gray-500">avec email</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {patients.length > 0 ? Math.floor(patients.length * 3.5) : 0}
            </div>
            <p className="text-xs text-gray-500">estimées</p>
          </CardContent>
        </Card>
      </div>

             {/* Recherche et Filtres */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center">
             <Search className="mr-2 h-5 w-5" />
             Recherche et Filtres
           </CardTitle>
           <CardDescription>
             Recherchez et filtrez les patients enregistrés
           </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           {/* Barre de recherche principale */}
           <div className="relative max-w-md">
             <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
             <Input
               placeholder="Nom, prénom, email ou téléphone..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10"
             />
           </div>
           
           {/* Filtres avancés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <div>
               <Label htmlFor="filter-type" className="text-sm font-medium">Type consultation</Label>
               <Select value={filters.typeConsultation} onValueChange={(value) => setFilters(prev => ({ ...prev, typeConsultation: value }))}>
                 <SelectTrigger>
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
               <Label htmlFor="filter-statut" className="text-sm font-medium">Statut</Label>
               <Select value={filters.statut} onValueChange={(value) => setFilters(prev => ({ ...prev, statut: value }))}>
                 <SelectTrigger>
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
               <Label htmlFor="filter-prix-min" className="text-sm font-medium">Prix min (FCFA)</Label>
               <Input
                 type="number"
                 placeholder="0"
                 value={filters.prixMin}
                 onChange={(e) => setFilters(prev => ({ ...prev, prixMin: e.target.value }))}
               />
             </div>
             
             <div>
               <Label htmlFor="filter-prix-max" className="text-sm font-medium">Prix max (FCFA)</Label>
               <Input
                 type="number"
                 placeholder="10000"
                 value={filters.prixMax}
                 onChange={(e) => setFilters(prev => ({ ...prev, prixMax: e.target.value }))}
               />
             </div>
           </div>
           
                       {/* Boutons de filtres */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  Effacer les filtres
                </Button>
                <span className="text-sm text-gray-500">
                  {filteredPatients.length} patient(s) trouvé(s)
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportToPDF}
                  className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                  disabled={filteredPatients.length === 0}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export PDF
                </Button>
                <div className="text-sm text-gray-500">
                  Total: {patients.length} patient(s) enregistré(s)
                </div>
              </div>
            </div>
         </CardContent>
       </Card>

      {/* Liste des patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Liste des patients enregistrés
          </CardTitle>
          <CardDescription>
            {filteredPatients.length} patient(s) trouvé(s) sur {patients.length} enregistré(s)
            {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '') ? ' (avec filtres actifs)' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Âge</TableHead>
                  <TableHead>Motif visite</TableHead>
                  <TableHead>Type consultation</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Chargement des patients enregistrés...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-red-600">
                      <div className="flex items-center justify-center space-x-2">
                        <AlertTriangle className="h-6 w-6" />
                        <span>{error}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Aucun patient enregistré trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                            #{patient.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {patient.nom} {patient.prenom}
                          </div>
                          {patient.profession && (
                            <div className="text-sm text-gray-500 mt-1">
                              {patient.profession}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {patient.email || 'Non renseigné'}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {patient.telephone || 'Non renseigné'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.age ? `${patient.age} ans` : '-'}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{patient.motif_visite}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{patient.type_consultation}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          {patient.prix_consultation?.toLocaleString()} FCFA
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row gap-2">
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
                                className="w-full sm:w-auto"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                            </DialogTrigger>
                            <PatientEnregistreDetailsModal patient={patient} />
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPatient(patient)}
                            className="w-full sm:w-auto"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePatient(patient.id!)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Supprimer
                          </Button>
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
