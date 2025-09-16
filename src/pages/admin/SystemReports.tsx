import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Activity, 
  Database,
  Server,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/services/adminApi';
import { useQuery } from '@tanstack/react-query';
import { ExportService, ReportData } from '@/services/exportService';

// Couleurs pour les graphiques
const COLORS = ['#6C2476', '#B0368B', '#F4E6F7', '#F9E8F4', '#E8D5E8'];

const SystemReports = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Charger les rapports depuis l'API
  const { data: reports, isLoading, error, refetch } = useQuery({
    queryKey: ['systemReports', selectedPeriod],
    queryFn: adminApi.getSystemReports,
    refetchInterval: 300000, // Rafraîchir toutes les 5 minutes
  });

  // Fonction d'export
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!reports) {
      toast({
        title: "Erreur d'export",
        description: "Aucune donnée disponible pour l'export",
        variant: "destructive",
      });
      return;
    }

    try {
      switch (format) {
        case 'pdf':
          ExportService.exportToPDF(reports as ReportData);
          break;
        case 'excel':
          ExportService.exportToExcel(reports as ReportData);
          break;
        case 'csv':
          ExportService.exportToCSV(reports as ReportData);
          break;
        default:
          throw new Error('Format non supporté');
      }
      
      toast({
        title: "Export réussi",
        description: `Rapport exporté en format ${format.toUpperCase()}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur d'export",
        description: `Impossible d'exporter le rapport en format ${format.toUpperCase()}`,
        variant: "destructive",
      });
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
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-600">Erreur lors du chargement des rapports</p>
        <Button onClick={() => refetch()} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="text-center py-8">
        <p>Aucune donnée disponible</p>
        <Button onClick={() => refetch()} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* En-tête */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Rapports Système</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Analyse complète des performances et de l'utilisation du système
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-xs md:text-sm"
          >
            <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button onClick={() => handleExport('pdf')} className="text-xs md:text-sm">
            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            PDF
          </Button>
          <Button onClick={() => handleExport('excel')} className="text-xs md:text-sm">
            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Excel
          </Button>
          <Button onClick={() => handleExport('csv')} className="text-xs md:text-sm">
            <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{reports.users.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {reports.users.active} actifs ({Math.round((reports.users.active / reports.users.total) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Temps de Réponse</CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{reports.performance.response_time}ms</div>
            <p className="text-xs text-muted-foreground">
              Moyenne sur 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Disponibilité</CardTitle>
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{reports.performance.availability}%</div>
            <p className="text-xs text-muted-foreground">
              Uptime du système
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Erreurs</CardTitle>
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{reports.performance.errors_today}</div>
            <p className="text-xs text-muted-foreground">
              Erreurs 24h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs md:text-sm">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users" className="text-xs md:text-sm">Utilisateurs</TabsTrigger>
          <TabsTrigger value="appointments" className="text-xs md:text-sm">Rendez-vous</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs md:text-sm">Performance</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {/* Croissance des utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Croissance des Utilisateurs</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Évolution du nombre d'utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={reports.users.growth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#6C2476" fill="#F4E6F7" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition par rôle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <PieChartIcon className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Répartition par Rôle</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Distribution des utilisateurs par rôle</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={reports.users.by_role}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ role, percentage }) => `${role} ${percentage}%`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reports.users.by_role.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Requêtes quotidiennes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                <Activity className="h-4 w-4 md:h-5 md:w-5" />
                <span>Requêtes Quotidiennes</span>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Volume de requêtes par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reports.performance.daily_requests}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#6C2476" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilisateurs */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Statistiques Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total</span>
                  <Badge variant="outline" className="text-xs">{reports.users.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Actifs</span>
                  <Badge variant="default" className="text-xs">{reports.users.active}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Inactifs</span>
                  <Badge variant="secondary" className="text-xs">{reports.users.inactive}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Utilisateurs par Rôle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.users.by_role.map((role, index) => (
                    <div key={role.role} className="flex justify-between items-center">
                      <span className="capitalize text-sm">{role.role}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 md:w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${role.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{role.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rendez-vous */}
        <TabsContent value="appointments" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Statistiques Rendez-vous</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total</span>
                  <Badge variant="outline" className="text-xs">{reports.appointments.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Aujourd'hui</span>
                  <Badge variant="default" className="text-xs">{reports.appointments.today}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Rendez-vous par Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.appointments.by_status.map((status, index) => (
                    <div key={status.status} className="flex justify-between items-center">
                      <span className="capitalize text-sm">{status.status}</span>
                      <Badge variant="outline" className="text-xs">{status.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique des rendez-vous */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm md:text-base">Évolution des Rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={reports.appointments.growth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#6C2476" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <Server className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Temps de réponse</span>
                  <Badge variant="outline" className="text-xs">{reports.performance.response_time}ms</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Disponibilité</span>
                  <Badge variant="default" className="text-xs">{reports.performance.availability}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Erreurs 24h</span>
                  <Badge variant="destructive" className="text-xs">{reports.performance.errors_today}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <Database className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Base de Données</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Utilisateurs</span>
                  <Badge variant="outline" className="text-xs">{reports.users.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Patients</span>
                  <Badge variant="outline" className="text-xs">{reports.patients.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rendez-vous</span>
                  <Badge variant="outline" className="text-xs">{reports.appointments.total}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm md:text-base">
                  <Shield className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Sécurité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Notifications</span>
                  <Badge variant="outline" className="text-xs">{reports.notifications.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Non lues</span>
                  <Badge variant="destructive" className="text-xs">{reports.notifications.unread}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Types</span>
                  <Badge variant="outline" className="text-xs">{reports.notifications.by_type.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemReports;