
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Plus, Eye, Calendar, FileText, Phone, Mail } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Patients = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées des patients
  const mockPatients = [
    {
      id: 1,
      firstName: 'Aminata',
      lastName: 'Sy',
      email: 'aminata.sy@email.com',
      phone: '+221 77 123 45 67',
      birthDate: '1985-03-15',
      lastVisit: '2024-01-10',
      totalVisits: 12,
      status: 'active',
      notes: 'Suivi cardiologique régulier'
    },
    {
      id: 2,
      firstName: 'Moussa',
      lastName: 'Kane',
      email: 'moussa.kane@email.com',
      phone: '+221 77 234 56 78',
      birthDate: '1978-07-22',
      lastVisit: '2024-01-08',
      totalVisits: 8,
      status: 'active',
      notes: 'Diabète type 2'
    },
    {
      id: 3,
      firstName: 'Fatoumata',
      lastName: 'Diallo',
      email: 'fatoumata.diallo@email.com',
      phone: '+221 77 345 67 89',
      birthDate: '1992-11-03',
      lastVisit: '2023-12-20',
      totalVisits: 3,
      status: 'inactive',
      notes: 'Nouvelle patiente'
    }
  ];

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

  const filteredPatients = mockPatients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'doctor' ? 'Mes patients' : 'Patients'}
          </h1>
          <p className="text-gray-600">
            Gestion et suivi des patients de la clinique
          </p>
        </div>
        <Button className="bg-gradient-clinic hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau patient
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPatients.length}</div>
            <p className="text-xs text-gray-500">enregistrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockPatients.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500">ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-gray-500">ce mois</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">156</div>
            <p className="text-xs text-gray-500">ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher un patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Liste des patients
          </CardTitle>
          <CardDescription>
            {filteredPatients.length} patients trouvés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Dernière visite</TableHead>
                <TableHead>Visites totales</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </div>
                      {patient.notes && (
                        <div className="text-sm text-gray-500 mt-1">
                          {patient.notes}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {patient.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {patient.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{calculateAge(patient.birthDate)} ans</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>
                    <span className="font-medium">{patient.totalVisits}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(patient.status)}`}>
                      {patient.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        RDV
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        Dossier
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;
