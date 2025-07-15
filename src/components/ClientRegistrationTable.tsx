
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Users, Calendar, Search, Plus, Clock, AlertTriangle, Eye } from 'lucide-react';
import PatientRegistrationForm from './forms/PatientRegistrationForm'

const ClientRegistrationTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Données simulées basées sur le registre manuel du cabinet
  const [clientsData, setClientsData] = useState([
    {
      id: 1,
      date: '30/06/25',
      nom: 'BA',
      prenom: 'DIAMY',
      age: 65,
      motifVisite: 'DIASE',
      observationsNotes: 'BEOUGOUMA BINGER, BEGYATNE B12, FRAMAFOLE PLUS, SURVEILLANCE',
      telephone: '',
      typeConsultation: 'MEDECIN',
      prix: 5000,
      status: 'enregistré',
      heure: '09:30'
    },
    {
      id: 2,
      date: '30/06/25',
      nom: 'DIALLO',
      prenom: 'COUMBA',
      age: 44,
      motifVisite: 'CG',
      observationsNotes: 'PERGALGAN + TRAMADOL',
      telephone: '775797986',
      typeConsultation: 'GYNECO',
      prix: 7500,
      status: 'en-attente',
      heure: '10:15'
    },
    {
      id: 3,
      date: '30/05/25',
      nom: 'MBENGU',
      prenom: 'FATIGUINE',
      age: null,
      motifVisite: 'CSF',
      observationsNotes: 'RV DEMAIN AVEC LAME, BILAN CHEZ AFAIRE, PV AVEC RESULTAT',
      telephone: '',
      typeConsultation: 'SAGE_FEMME',
      prix: 5000,
      status: 'terminé',
      heure: '11:00'
    },
    {
      id: 4,
      date: '30/05/25',
      nom: 'DIALLO',
      prenom: 'KADIATOU',
      age: 12,
      motifVisite: 'PANEW',
      observationsNotes: '',
      telephone: '',
      typeConsultation: 'ENFANT',
      prix: 3000,
      status: 'en-consultation',
      heure: '14:30'
    },
    {
      id: 5,
      date: '30/05/25',
      nom: 'DIALLO',
      prenom: 'MOUHAMED',
      age: 25,
      motifVisite: 'CG',
      observationsNotes: 'DIASE',
      telephone: '',
      typeConsultation: 'MEDECIN',
      prix: 5000,
      status: 'enregistré',
      heure: '15:45'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enregistré': return 'bg-blue-100 text-blue-800';
      case 'en-attente': return 'bg-yellow-100 text-yellow-800';
      case 'en-consultation': return 'bg-green-100 text-green-800';
      case 'terminé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enregistré': return <Users className="h-3 w-3" />;
      case 'en-attente': return <Clock className="h-3 w-3" />;
      case 'en-consultation': return <AlertTriangle className="h-3 w-3" />;
      case 'terminé': return <Eye className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enregistré': return 'Enregistré';
      case 'en-attente': return 'En attente';
      case 'en-consultation': return 'En consultation';
      case 'terminé': return 'Terminé';
      default: return status;
    }
  };

  const filteredClients = clientsData.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.motifVisite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (data: any) => {
    const newClient = {
      id: clientsData.length + 1,
      date: new Date(data.date).toLocaleDateString('fr-FR').slice(0, 8) + '25',
      nom: data.nom.toUpperCase(),
      prenom: data.prenom.toUpperCase(),
      age: parseInt(data.age) || null,
      motifVisite: data.typeConsultation,
      observationsNotes: data.observationsNotes,
      telephone: data.telephone,
      typeConsultation: data.typeConsultation,
      prix: data.consultationPrice,
      status: 'enregistré',
      heure: data.registrationTime
    };
    
    setClientsData([...clientsData, newClient]);
    setIsFormOpen(false);
    console.log('Nouveau client enregistré:', newClient);
  };

  const todayClients = filteredClients.filter(client => 
    client.date === new Date().toLocaleDateString('fr-FR').slice(0, 8) + '25'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Tableau d'Enregistrement des Clients - Cabinet Yaye Aminata</span>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Client
              </Button>
            </DialogTrigger>
            <PatientRegistrationForm 
              onSubmit={handleAddClient}
              onCancel={() => setIsFormOpen(false)}
            />
          </Dialog>
        </CardTitle>
        <CardDescription>
          Registre électronique basé sur le système manuel du cabinet - {todayClients.length} clients aujourd'hui
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, prénom ou motif..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>

        {/* Tableau des clients - réplique du registre manuel */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Nom</TableHead>
                <TableHead className="font-bold">Prénom</TableHead>
                <TableHead className="font-bold">Âge</TableHead>
                <TableHead className="font-bold">Motif de la visite</TableHead>
                <TableHead className="font-bold">Observations / Notes</TableHead>
                <TableHead className="font-bold">Statut</TableHead>
                <TableHead className="font-bold">Prix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className={client.status === 'en-consultation' ? 'bg-green-50' : ''}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{client.date}</div>
                      <div className="text-xs text-gray-500">{client.heure}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{client.nom}</TableCell>
                  <TableCell className="font-semibold">{client.prenom}</TableCell>
                  <TableCell className="text-center">
                    {client.age || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {client.motifVisite}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-gray-700 truncate" title={client.observationsNotes}>
                      {client.observationsNotes || '-'}
                    </div>
                    {client.telephone && (
                      <div className="text-xs text-blue-600">{client.telephone}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs flex items-center space-x-1 w-fit ${getStatusColor(client.status)}`}>
                      {getStatusIcon(client.status)}
                      <span>{getStatusText(client.status)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {client.prix?.toLocaleString()} F
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun client trouvé pour les critères de recherche
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientRegistrationTable;
