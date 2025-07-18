import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users as UsersIcon, Plus, Search, Edit, Trash2, UserCheck, UserX, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import UserForm from '@/components/forms/UserForm';
import DetailsModal from '@/components/modals/DetailsModal';

const Users = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // Données simulées des utilisateurs
  const mockUsers = [
    {
      id: 1,
      firstName: 'Admin',
      lastName: 'Système',
      email: 'admin@clinique.sn',
      role: 'admin',
      isActive: true,
      createdAt: '2023-12-01'
    },
    {
      id: 2,
      firstName: 'Dr. Fatou',
      lastName: 'Diop',
      email: 'dr.diop@clinique.sn',
      role: 'doctor',
      speciality: 'Cardiologie',
      isActive: true,
      createdAt: '2023-12-05'
    },
    {
      id: 3,
      firstName: 'Aïssatou',
      lastName: 'Fall',
      email: 'reception@clinique.sn',
      role: 'receptionist',
      isActive: true,
      createdAt: '2023-12-10'
    },
    {
      id: 4,
      firstName: 'Mamadou',
      lastName: 'Ba',
      email: 'patient@example.com',
      role: 'patient',
      phone: '+221 77 123 45 67',
      isActive: false,
      createdAt: '2023-12-15'
    }
  ];

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      doctor: 'bg-blue-100 text-blue-800',
      receptionist: 'bg-green-100 text-green-800',
      patient: 'bg-orange-100 text-orange-800'
    };
    
    const labels = {
      admin: 'Administrateur',
      doctor: 'Docteur',
      receptionist: 'Réceptionniste',
      patient: 'Patient'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[role as keyof typeof styles]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const getStats = () => {
    const stats: { total: number; active: number; admin?: number; doctor?: number; receptionist?: number; patient?: number } = {
      total: mockUsers.length,
      active: mockUsers.filter(u => u.isActive).length,
    };
    
    mockUsers.forEach(user => {
      const role = user.role as keyof typeof stats;
      if (role !== 'total' && role !== 'active') {
        stats[role] = (stats[role] || 0) + 1;
      }
    });
    
    return stats;
  };

  const stats = getStats();

  const handleCreateUser = (data: any) => {
    console.log('Nouvel utilisateur:', data);
    setIsFormOpen(false);
    // Ici, vous ajouteriez la logique pour sauvegarder en base
  };

  const handleEditUser = (user: any) => {
    setFormData(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      console.log('Suppression de l\'utilisateur:', id);
      // Ici, vous ajouteriez la logique pour supprimer en base
    }
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleExportCSV = () => {
    console.log('Export CSV des utilisateurs');
    // Logique d'export CSV
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Créer, modifier et gérer les comptes utilisateurs</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className=" hover:opacity-90" onClick={() => setFormData(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <UserForm 
            onSubmit={handleCreateUser}
            onCancel={() => setIsFormOpen(false)}
            initialData={formData}
          />
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Docteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.doctor || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Réceptionnistes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.receptionist || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.patient || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="doctor">Docteur</SelectItem>
                <SelectItem value="receptionist">Réceptionniste</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportCSV}>
              Exporter CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>{mockUsers.length} utilisateurs enregistrés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Spécialité/Téléphone</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((userData) => (
                <TableRow key={userData.id}>
                  <TableCell>
                    <div className="font-medium">
                      {userData.firstName} {userData.lastName}
                    </div>
                  </TableCell>
                  <TableCell>{userData.email}</TableCell>
                  <TableCell>{getRoleBadge(userData.role)}</TableCell>
                  <TableCell>
                    {userData.speciality && (
                      <span className="text-blue-600">{userData.speciality}</span>
                    )}
                    {userData.phone && (
                      <span className="text-gray-600">{userData.phone}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {userData.isActive ? (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-600" />
                      )}
                      <span className={userData.isActive ? 'text-green-600' : 'text-red-600'}>
                        {userData.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{userData.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(userData)}>
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                        </DialogTrigger>
                        {selectedUser && (
                          <DetailsModal type="user" data={selectedUser} />
                        )}
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditUser(userData)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteUser(userData.id)}
                      >
                        <Trash2 className="h-3 w-3" />
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

export default Users;
