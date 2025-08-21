import React, { useState, useEffect } from 'react';
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
  DialogFooter,
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
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminApi, User as UserType } from '@/services/adminApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type User = UserType;

const AllUsers = () => {
  const { toast } = useToast();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // État pour le formulaire de création
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'patient',
    password: '',
    password_confirm: '',
    is_active: true
  });

  const queryClient = useQueryClient();

  // Charger les utilisateurs depuis l'API
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: adminApi.getAllUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

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
      setIsCreateDialogOpen(false);
      // Réinitialiser le formulaire
      setNewUser({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: 'patient',
        password: '',
        password_confirm: '',
        is_active: true
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'utilisateur.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    let filtered = users;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.is_active === isActive);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Administrateur', variant: 'destructive' as const },
      responsable_cabinet: { label: 'Responsable', variant: 'default' as const },
      doctor: { label: 'Docteur', variant: 'secondary' as const },
      receptionist: { label: 'Réceptionniste', variant: 'outline' as const },
      patient: { label: 'Patient', variant: 'secondary' as const }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleToggleStatus = async (userId: number) => {
    toggleUserStatusMutation.mutate(userId);
  };

  const handleDeleteUser = async (userId: number) => {
    deleteUserMutation.mutate(userId);
  };

  const handleCreateUser = async () => {
    if (newUser.password !== newUser.password_confirm) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (newUser.password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      username: newUser.username,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      phone: newUser.phone,
      role: newUser.role,
      password: newUser.password,
      password_confirm: newUser.password_confirm,
      is_active: newUser.is_active
    };

    createUserMutation.mutate(userData);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez tous les utilisateurs du système
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Ajoutez un nouvel utilisateur au système
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="nom_utilisateur"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom *</Label>
                  <Input
                    id="first_name"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input
                    id="last_name"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="+221 77 123 45 67"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle *</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur Système</SelectItem>
                      <SelectItem value="responsable_cabinet">Responsable Cabinet</SelectItem>
                      <SelectItem value="doctor">Docteur</SelectItem>
                      <SelectItem value="receptionist">Réceptionniste</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Mot de passe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_confirm">Confirmer le mot de passe *</Label>
                  <Input
                    id="password_confirm"
                    type="password"
                    value={newUser.password_confirm}
                    onChange={(e) => setNewUser({...newUser, password_confirm: e.target.value})}
                    placeholder="Confirmer le mot de passe"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={newUser.is_active}
                  onCheckedChange={(checked) => setNewUser({...newUser, is_active: checked})}
                />
                <Label htmlFor="is_active">Utilisateur actif</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleCreateUser}
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
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
              <Button variant="outline" className="w-full">
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
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
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

      {/* Dialog de détails utilisateur */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
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

export default AllUsers;
