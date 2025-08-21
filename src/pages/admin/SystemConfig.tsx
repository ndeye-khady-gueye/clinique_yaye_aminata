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
  Server
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/services/adminApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SystemConfig = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Charger la configuration depuis l'API
  const { data: config, isLoading, error } = useQuery({
    queryKey: ['systemConfig'],
    queryFn: adminApi.getSystemConfig,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration Système</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres système et la configuration de l'application
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleTestConnection} 
            disabled={testConnectionMutation.isPending}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tester Connexion
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saveConfigMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {saveConfigMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Base de Données</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span>Maintenance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Configuration Base de Données</span>
                <Badge variant={localConfig.database.status === 'online' ? 'default' : 'destructive'}>
                  {localConfig.database.status === 'online' ? 'En ligne' : 'Hors ligne'}
                </Badge>
              </CardTitle>
              <CardDescription>
                Paramètres de connexion et configuration de la base de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-type">Type de Base de Données</Label>
                  <Input
                    id="db-type"
                    value={localConfig.database.type}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-host">Hôte</Label>
                  <Input
                    id="db-host"
                    value={localConfig.database.host}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">Port</Label>
                  <Input
                    id="db-port"
                    type="number"
                    value={localConfig.database.port}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">Nom de la Base</Label>
                  <Input
                    id="db-name"
                    value={localConfig.database.name}
                    readOnly
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
                <Shield className="h-5 w-5" />
                <span>Paramètres de Sécurité</span>
              </CardTitle>
              <CardDescription>
                Configuration des paramètres de sécurité et d'authentification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jwt-expiry">Expiration JWT (heures)</Label>
                  <Input
                    id="jwt-expiry"
                    type="number"
                    value={localConfig.security.jwt_expiry}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-length">Longueur Min. Mot de Passe</Label>
                  <Input
                    id="password-length"
                    type="number"
                    value={localConfig.security.password_min_length}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Timeout Session (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={localConfig.security.session_timeout}
                    readOnly
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à Deux Facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer l'authentification à deux facteurs pour tous les utilisateurs
                  </p>
                </div>
                <Switch
                  checked={localConfig.security.enable_two_factor}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Optimisation Performance</span>
              </CardTitle>
              <CardDescription>
                Configuration des paramètres de performance et de cache
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cache-size">Taille du Cache (MB)</Label>
                  <Input
                    id="cache-size"
                    type="number"
                    value={localConfig.performance.cache_size}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-connections">Connexions Max</Label>
                  <Input
                    id="max-connections"
                    type="number"
                    value={localConfig.performance.max_connections}
                    readOnly
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode Debug</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le mode debug pour le développement
                  </p>
                </div>
                <Switch
                  checked={localConfig.performance.debug_mode}
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cache Activé</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le système de cache pour améliorer les performances
                  </p>
                </div>
                <Switch
                  checked={localConfig.performance.cache_enabled}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>Maintenance et Sauvegarde</span>
              </CardTitle>
              <CardDescription>
                Configuration des sauvegardes automatiques et mode maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Fréquence Sauvegarde</Label>
                  <Input
                    id="backup-frequency"
                    value={localConfig.maintenance.backup_frequency}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dernière Sauvegarde</Label>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{localConfig.maintenance.last_backup}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sauvegarde Automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les sauvegardes automatiques de la base de données
                  </p>
                </div>
                <Switch
                  checked={localConfig.maintenance.auto_backup}
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode Maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le mode maintenance (accès limité aux administrateurs)
                  </p>
                </div>
                <Switch
                  checked={localConfig.maintenance.maintenance_mode}
                  disabled
                />
              </div>
              {localConfig.maintenance.maintenance_mode && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
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
