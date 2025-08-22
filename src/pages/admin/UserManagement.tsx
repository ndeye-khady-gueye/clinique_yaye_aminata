import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminApi, User as UserType } from '@/services/adminApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserForm from '@/components/forms/UserForm';

type User = UserType;

const UserManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Charger les utilisateurs depuis l'API
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: adminApi.getAllUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Debug: Afficher les informations de débogage
  console.log('UserManagement - users:', users);
  console.log('UserManagement - isLoading:', isLoading);
  console.log('UserManagement - error:', error);

  // Mutation pour supprimer un utilisateur
  const deleteUserMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour activer/désactiver un utilisateur
  const toggleUserStatusMutation = useMutation({
    mutationFn: adminApi.toggleUserStatus,
    onSuccess: () => {
      toast({
        title: "Statut mis à jour",
        description: "Le statut de l'utilisateur a été modifié.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour créer un utilisateur
  const createUserMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé avec succès.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de créer l'utilisateur.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour mettre à jour un utilisateur
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      toast({
        title: "Utilisateur mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de mettre à jour l'utilisateur.",
        variant: "destructive",
      });
    }
  });

  // Filtrer les utilisateurs
  React.useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.is_active === isActive);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Administrateur', variant: 'destructive' as const, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      responsable_cabinet: { label: 'Responsable', variant: 'default' as const, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      doctor: { label: 'Docteur', variant: 'secondary' as const, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      receptionist: { label: 'Réceptionniste', variant: 'outline' as const, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      patient: { label: 'Patient', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleToggleStatus = async (userId: number) => {
    toggleUserStatusMutation.mutate(userId);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleCreateUser = async (data: any) => {
    await createUserMutation.mutateAsync(data);
  };

  const handleUpdateUser = async (data: any) => {
    if (selectedUser) {
      await updateUserMutation.mutateAsync({ id: selectedUser.id, data });
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    byRole: {
      admin: users.filter(u => u.role === 'admin').length,
      responsable: users.filter(u => u.role === 'responsable_cabinet').length,
      doctor: users.filter(u => u.role === 'doctor').length,
      receptionist: users.filter(u => u.role === 'receptionist').length,
      patient: users.filter(u => u.role === 'patient').length,
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Erreur lors du chargement</h3>
          <p className="text-muted-foreground mb-4">
            Impossible de charger les utilisateurs. Veuillez vérifier votre connexion.
          </p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
          <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
            <strong>Détails de l'erreur:</strong>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground">
              Gérez tous les utilisateurs du système avec une interface moderne
            </p>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Ajoutez un nouvel utilisateur au système avec toutes les informations nécessaires
              </DialogDescription>
            </DialogHeader>
            <UserForm
              onSubmit={handleCreateUser}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createUserMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Inactifs</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byRole.admin}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, email, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-filter">Rôle</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="responsable_cabinet">Responsable</SelectItem>
                  <SelectItem value="doctor">Docteur</SelectItem>
                  <SelectItem value="receptionist">Réceptionniste</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter">Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière Connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-mono font-medium text-center">
                      {user.user_id || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {getInitials(user.first_name, user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.is_active}
                        onCheckedChange={() => handleToggleStatus(user.id)}
                        disabled={toggleUserStatusMutation.isPending}
                      />
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Jamais'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setIsViewDialogOpen(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur sélectionné
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onSubmit={handleUpdateUser}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedUser(null);
              }}
              isLoading={updateUserMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de détails */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'utilisateur sélectionné
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedUser.first_name, selectedUser.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <p className="text-muted-foreground">@{selectedUser.username}</p>
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID Utilisateur</Label>
                  <p className="text-sm font-mono">{selectedUser.user_id || 'N/A'}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <p className="text-sm">{selectedUser.phone || 'Non renseigné'}</p>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Badge variant={selectedUser.is_active ? 'default' : 'secondary'}>
                    {selectedUser.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div>
                  <Label>Date de création</Label>
                  <p className="text-sm">{new Date(selectedUser.date_joined).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
