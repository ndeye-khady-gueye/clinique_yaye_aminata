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
  Stethoscope,
  User,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminApi, User as UserType } from '@/services/adminApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserForm from '@/components/forms/UserForm';

type User = UserType;

const TeamManagement = () => {
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

  // Charger les utilisateurs depuis l'API (sauf les admins)
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['team-users'],
    queryFn: adminApi.getAllUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Filtrer les utilisateurs pour exclure les admins (Responsable Cabinet ne peut pas gérer les admins)
  const teamUsers = users.filter(user => user.role !== 'admin');

  // Debug: Afficher les informations de débogage
  console.log('TeamManagement - teamUsers:', teamUsers);
  console.log('TeamManagement - isLoading:', isLoading);
  console.log('TeamManagement - error:', error);

  // Mutation pour supprimer un utilisateur
  const deleteUserMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé de l'équipe avec succès.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['team-users'] });
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
      queryClient.invalidateQueries({ queryKey: ['team-users'] });
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
        description: "L'utilisateur a été ajouté à l'équipe avec succès.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['team-users'] });
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
      queryClient.invalidateQueries({ queryKey: ['team-users'] });
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
    let filtered = teamUsers;

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
  }, [teamUsers, searchTerm, roleFilter, statusFilter]);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur de l\'équipe ?')) {
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
    total: teamUsers.length,
    active: teamUsers.filter(u => u.is_active).length,
    inactive: teamUsers.filter(u => !u.is_active).length,
    byRole: {
      doctor: teamUsers.filter(u => u.role === 'doctor').length,
      receptionist: teamUsers.filter(u => u.role === 'receptionist').length,
      patient: teamUsers.filter(u => u.role === 'patient').length,
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
            Impossible de charger les utilisateurs de l'équipe. Veuillez vérifier votre connexion.
          </p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Gestion de l'Équipe</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez les membres de votre équipe médicale et les patients
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Nouveau Membre</span>
              <span className="xs:hidden">Nouveau</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau membre à l'équipe</DialogTitle>
              <DialogDescription>
                Créez un nouveau compte pour un membre de votre équipe
              </DialogDescription>
            </DialogHeader>
            <UserForm
              onSubmit={handleCreateUser}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createUserMutation.isPending}
              allowedRoles={['doctor', 'receptionist', 'patient']} // Responsable ne peut pas créer d'admins
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Équipe</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Docteurs</CardTitle>
            <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.byRole.doctor}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Réceptionnistes</CardTitle>
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{stats.byRole.receptionist}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{stats.byRole.patient}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-xs sm:text-sm">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, email, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-filter" className="text-xs sm:text-sm">Rôle</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="doctor">Docteur</SelectItem>
                  <SelectItem value="receptionist">Réceptionniste</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter" className="text-xs sm:text-sm">Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-sm">
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
                className="w-full text-sm"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">Réinitialiser</span>
                <span className="xs:hidden">Reset</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des utilisateurs */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Liste des Membres de l'Équipe</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {filteredUsers.length} membre(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">ID</TableHead>
                  <TableHead className="text-xs sm:text-sm">Membre</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Rôle</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Contact</TableHead>
                  <TableHead className="text-xs sm:text-sm">Statut</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Dernière Connexion</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-xs sm:text-sm">
                    <div className="font-mono font-medium text-center">
                      {user.user_id || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.first_name, user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs sm:text-sm truncate">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          @{user.username}
                        </div>
                        {/* Afficher le rôle sur mobile */}
                        <div className="sm:hidden mt-1">
                          {getRoleBadge(user.role)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs sm:text-sm">
                        <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Switch
                        checked={user.is_active}
                        onCheckedChange={() => handleToggleStatus(user.id)}
                        disabled={toggleUserStatusMutation.isPending}
                        className="scale-75 sm:scale-100"
                      />
                      <Badge variant={user.is_active ? 'default' : 'secondary'} className="text-xs">
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Jamais'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                          <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs sm:text-sm">Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsViewDialogOpen(true);
                          }}
                          className="text-xs sm:text-sm"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditDialogOpen(true);
                          }}
                          className="text-xs sm:text-sm"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le membre</DialogTitle>
            <DialogDescription>
              Modifiez les informations du membre sélectionné
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
              allowedRoles={['doctor', 'receptionist', 'patient']}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de détails */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Détails du membre</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Informations complètes sur le membre sélectionné
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-sm sm:text-lg">
                    {getInitials(selectedUser.first_name, selectedUser.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">@{selectedUser.username}</p>
                  <div className="mt-2">
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm">ID Membre</Label>
                  <p className="text-xs sm:text-sm font-mono">{selectedUser.user_id || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Email</Label>
                  <p className="text-xs sm:text-sm break-all">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Téléphone</Label>
                  <p className="text-xs sm:text-sm">{selectedUser.phone || 'Non renseigné'}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm">Statut</Label>
                  <Badge variant={selectedUser.is_active ? 'default' : 'secondary'} className="text-xs">
                    {selectedUser.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs sm:text-sm">Date de création</Label>
                  <p className="text-xs sm:text-sm">{new Date(selectedUser.date_joined).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
