import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Database, 
  Shield, 
  Users, 
  Activity, 
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Server,
  Bell,
  Filter,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminApi, Notification, NotificationResponse } from '@/services/adminApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SystemConfig = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // États pour les notifications
  const [notificationFilters, setNotificationFilters] = useState({
    type: '',
    is_read: undefined as boolean | undefined,
    priority: '',
    page: 1,
    page_size: 20
  });

  // Charger la configuration depuis l'API
  const { data: config, isLoading, error } = useQuery({
    queryKey: ['systemConfig'],
    queryFn: adminApi.getSystemConfig,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Charger les notifications
  const { data: notificationsData, isLoading: notificationsLoading, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications', notificationFilters],
    queryFn: () => adminApi.getNotifications(notificationFilters),
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    onSuccess: (data) => {
      console.log('📱 Notifications chargées:', data);
      if (data?.notifications) {
        console.log('📱 Première notification:', data.notifications[0]);
      }
    }
  });

  // Mutation pour sauvegarder la configuration
  const saveConfigMutation = useMutation({
    mutationFn: adminApi.updateSystemConfig,
    onSuccess: () => {
      toast({
        title: "Configuration sauvegardée",
        description: "Les paramètres système ont été mis à jour avec succès.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['systemConfig'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration.",
        variant: "destructive",
      });
    }
  });

  // Mutation pour tester la connexion
  const testConnectionMutation = useMutation({
    mutationFn: adminApi.testDatabaseConnection,
    onSuccess: (data) => {
      toast({
        title: "Connexion réussie",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à la base de données.",
        variant: "destructive",
      });
    }
  });

  // Mutations pour les notifications
  const markNotificationReadMutation = useMutation({
    mutationFn: adminApi.markNotificationRead,
    onSuccess: (data) => {
      console.log('✅ Notification marquée comme lue:', data);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('❌ Erreur lors du marquage comme lu:', error);
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: adminApi.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notifications marquées comme lues",
        description: "Toutes les notifications ont été marquées comme lues.",
        variant: "default",
      });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: adminApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès.",
        variant: "default",
      });
    }
  });

  const [localConfig, setLocalConfig] = useState(config);

  // Synchroniser la configuration locale avec les données de l'API
  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !localConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Erreur lors du chargement de la configuration</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (localConfig) {
      saveConfigMutation.mutate(localConfig);
    }
  };

  const handleTestConnection = async () => {
    testConnectionMutation.mutate();
  };

  // Fonctions pour les notifications
  const handleMarkAsRead = (notificationId: number) => {
    console.log('🔍 Tentative de marquage comme lu:', notificationId);
    markNotificationReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const handleDeleteNotification = (notificationId: number) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const handleFilterChange = (key: string, value: any) => {
    setNotificationFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset à la première page lors du changement de filtre
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login': return '🔐';
      case 'logout': return '🚪';
      case 'appointment_request': return '📅';
      case 'appointment_created': return '✅';
      case 'appointment_updated': return '✏️';
      case 'appointment_cancelled': return '❌';
      case 'patient_created': return '👤';
      case 'patient_updated': return '✏️';
      case 'user_created': return '👥';
      case 'user_updated': return '✏️';
      case 'system_alert': return '⚠️';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">Configuration Système</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gérez les paramètres système et la configuration de l'application
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={handleTestConnection} 
            disabled={testConnectionMutation.isPending}
            className="w-full sm:w-auto text-xs md:text-sm"
          >
            <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Tester Connexion</span>
            <span className="sm:hidden">Tester</span>
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saveConfigMutation.isPending}
            className="w-full sm:w-auto text-xs md:text-sm"
          >
            <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            {saveConfigMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="notifications" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
            <Bell className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Notif</span>
            {notificationsData?.unread_count > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {notificationsData.unread_count}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
            <Database className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Base de Données</span>
            <span className="sm:hidden">DB</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
            <Shield className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Sécurité</span>
            <span className="sm:hidden">Sec</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
            <Activity className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Performance</span>
            <span className="sm:hidden">Perf</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
            <Server className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Maintenance</span>
            <span className="sm:hidden">Maint</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">Centre de Notifications</span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={markAllReadMutation.isPending || !notificationsData?.unread_count}
                    className="w-full sm:w-auto text-xs"
                  >
                    <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Marquer tout comme lu</span>
                    <span className="sm:hidden">Marquer tout</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchNotifications()}
                    disabled={notificationsLoading}
                    className="w-full sm:w-auto text-xs"
                  >
                    <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 ${notificationsLoading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Surveillez toutes les activités de votre système en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtres */}
              <div className="flex flex-col space-y-4 mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Filter className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm font-medium">Filtres:</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="type-filter" className="text-xs">Type:</Label>
                    <select
                      id="type-filter"
                      value={notificationFilters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="px-2 py-1 border rounded-md text-xs"
                    >
                      <option value="">Tous les types</option>
                      <option value="login">Connexions</option>
                      <option value="logout">Déconnexions</option>
                      <option value="appointment_request">Demandes RDV</option>
                      <option value="appointment_created">RDV créés</option>
                      <option value="appointment_updated">RDV modifiés</option>
                      <option value="appointment_cancelled">RDV annulés</option>
                      <option value="patient_created">Patients créés</option>
                      <option value="patient_updated">Patients modifiés</option>
                      <option value="user_created">Utilisateurs créés</option>
                      <option value="user_updated">Utilisateurs modifiés</option>
                      <option value="system_alert">Alertes système</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="status-filter" className="text-xs">Statut:</Label>
                    <select
                      id="status-filter"
                      value={notificationFilters.is_read === undefined ? '' : notificationFilters.is_read.toString()}
                      onChange={(e) => handleFilterChange('is_read', e.target.value === '' ? undefined : e.target.value === 'true')}
                      className="px-2 py-1 border rounded-md text-xs"
                    >
                      <option value="">Tous</option>
                      <option value="false">Non lues</option>
                      <option value="true">Lues</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="priority-filter" className="text-xs">Priorité:</Label>
                    <select
                      id="priority-filter"
                      value={notificationFilters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      className="px-2 py-1 border rounded-md text-xs"
                    >
                      <option value="">Toutes</option>
                      <option value="urgent">Urgente</option>
                      <option value="high">Élevée</option>
                      <option value="medium">Moyenne</option>
                      <option value="low">Faible</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Liste des notifications */}
              <div className="space-y-3">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary"></div>
                  </div>
                ) : notificationsData?.notifications?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm md:text-base">Aucune notification trouvée</p>
                  </div>
                ) : (
                  notificationsData?.notifications?.map((notification) => (
                    <div
                      key={notification.id || Math.random()}
                      className={`p-3 md:p-4 border rounded-lg transition-all hover:shadow-md ${
                        notification.is_read ? 'bg-gray-50' : 'bg-white border-l-4 border-l-primary'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2 md:space-x-3 flex-1 min-w-0">
                          <div className="text-lg md:text-2xl flex-shrink-0">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                              <h4 className={`font-medium text-sm md:text-base truncate ${notification.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <Badge className={`${getPriorityColor(notification.priority)} text-xs`}>
                                  {notification.priority_display}
                                </Badge>
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            </div>
                            <p className={`text-xs md:text-sm ${notification.is_read ? 'text-gray-500' : 'text-gray-700'} break-words`}>
                              {notification.message}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 text-xs text-gray-500">
                              <span>{notification.time_ago}</span>
                              {notification.user_name && (
                                <span className="truncate">Par {notification.user_name} ({notification.user_role})</span>
                              )}
                              <span className="capitalize">{notification.type_display}</span>
                              <span className="text-gray-400">ID: {notification.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2 ml-2 flex-shrink-0">
                          {!notification.is_read && notification.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={markNotificationReadMutation.isPending}
                              className="h-6 w-6 md:h-8 md:w-8 p-0"
                            >
                              <Eye className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          )}
                          {notification.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              disabled={deleteNotificationMutation.isPending}
                              className="text-red-600 hover:text-red-700 h-6 w-6 md:h-8 md:w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {notificationsData && notificationsData.total > notificationFilters.page_size && (
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-6 pt-4 border-t">
                  <div className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
                    Affichage de {((notificationFilters.page - 1) * notificationFilters.page_size) + 1} à{' '}
                    {Math.min(notificationFilters.page * notificationFilters.page_size, notificationsData.total)} sur{' '}
                    {notificationsData.total} notifications
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', Math.max(1, notificationFilters.page - 1))}
                      disabled={notificationFilters.page === 1}
                      className="text-xs"
                    >
                      Précédent
                    </Button>
                    <span className="text-xs md:text-sm">
                      Page {notificationFilters.page} sur {Math.ceil(notificationsData.total / notificationFilters.page_size)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', notificationFilters.page + 1)}
                      disabled={notificationFilters.page >= Math.ceil(notificationsData.total / notificationFilters.page_size)}
                      className="text-xs"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">Configuration Base de Données</span>
                </div>
                <Badge variant={localConfig.database.status === 'online' ? 'default' : 'destructive'} className="text-xs w-fit">
                  {localConfig.database.status === 'online' ? 'En ligne' : 'Hors ligne'}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Paramètres de connexion et configuration de la base de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-type" className="text-xs md:text-sm">Type de Base de Données</Label>
                  <Input
                    id="db-type"
                    value={localConfig.database.type}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-host" className="text-xs md:text-sm">Hôte</Label>
                  <Input
                    id="db-host"
                    value={localConfig.database.host}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port" className="text-xs md:text-sm">Port</Label>
                  <Input
                    id="db-port"
                    type="number"
                    value={localConfig.database.port}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name" className="text-xs md:text-sm">Nom de la Base</Label>
                  <Input
                    id="db-name"
                    value={localConfig.database.name}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-sm md:text-base">Paramètres de Sécurité</span>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Configuration des paramètres de sécurité et d'authentification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jwt-expiry" className="text-xs md:text-sm">Expiration JWT (heures)</Label>
                  <Input
                    id="jwt-expiry"
                    type="number"
                    value={localConfig.security.jwt_expiry}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-length" className="text-xs md:text-sm">Longueur Min. Mot de Passe</Label>
                  <Input
                    id="password-length"
                    type="number"
                    value={localConfig.security.password_min_length}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout" className="text-xs md:text-sm">Timeout Session (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={localConfig.security.session_timeout}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="space-y-0.5">
                  <Label className="text-xs md:text-sm">Authentification à Deux Facteurs</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Activer l'authentification à deux facteurs pour tous les utilisateurs
                  </p>
                </div>
                <Switch
                  checked={localConfig.security.enable_two_factor}
                  disabled
                  className="scale-75 sm:scale-100"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-sm md:text-base">Optimisation Performance</span>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Configuration des paramètres de performance et de cache
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cache-size" className="text-xs md:text-sm">Taille du Cache (MB)</Label>
                  <Input
                    id="cache-size"
                    type="number"
                    value={localConfig.performance.cache_size}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-connections" className="text-xs md:text-sm">Connexions Max</Label>
                  <Input
                    id="max-connections"
                    type="number"
                    value={localConfig.performance.max_connections}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="space-y-0.5">
                  <Label className="text-xs md:text-sm">Mode Debug</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Activer le mode debug pour le développement
                  </p>
                </div>
                <Switch
                  checked={localConfig.performance.debug_mode}
                  disabled
                  className="scale-75 sm:scale-100"
                />
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="space-y-0.5">
                  <Label className="text-xs md:text-sm">Cache Activé</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Activer le système de cache pour améliorer les performances
                  </p>
                </div>
                <Switch
                  checked={localConfig.performance.cache_enabled}
                  disabled
                  className="scale-75 sm:scale-100"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-sm md:text-base">Maintenance et Sauvegarde</span>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Configuration des sauvegardes automatiques et mode maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency" className="text-xs md:text-sm">Fréquence Sauvegarde</Label>
                  <Input
                    id="backup-frequency"
                    value={localConfig.maintenance.backup_frequency}
                    readOnly
                    className="text-xs md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs md:text-sm">Dernière Sauvegarde</Label>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                    <span className="text-xs md:text-sm">{localConfig.maintenance.last_backup}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="space-y-0.5">
                  <Label className="text-xs md:text-sm">Sauvegarde Automatique</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Activer les sauvegardes automatiques de la base de données
                  </p>
                </div>
                <Switch
                  checked={localConfig.maintenance.auto_backup}
                  disabled
                  className="scale-75 sm:scale-100"
                />
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="space-y-0.5">
                  <Label className="text-xs md:text-sm">Mode Maintenance</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Activer le mode maintenance (accès limité aux administrateurs)
                  </p>
                </div>
                <Switch
                  checked={localConfig.maintenance.maintenance_mode}
                  disabled
                  className="scale-75 sm:scale-100"
                />
              </div>
              {localConfig.maintenance.maintenance_mode && (
                <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-yellow-800">
                      Mode maintenance activé - Seuls les administrateurs peuvent accéder au système
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfig;
