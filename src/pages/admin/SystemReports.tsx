import React, { useState, useEffect } from 'react';
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
  LineChart as LineChartIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemMetrics {
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: { role: string; count: number }[];
    growth: { month: string; count: number }[];
  };
  performance: {
    responseTime: number;
    uptime: number;
    errors: number;
    dailyRequests: { date: string; requests: number }[];
  };
  security: {
    failedLogins: number;
    blockedIPs: number;
    securityEvents: { type: string; count: number }[];
  };
  database: {
    size: string;
    connections: number;
    queries: number;
    performance: { time: string; load: number }[];
  };
}

const SystemReports = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  // Données de démonstration
  const mockMetrics: SystemMetrics = {
    users: {
      total: 1250,
      active: 1180,
      inactive: 70,
      byRole: [
        { role: 'Admin', count: 3 },
        { role: 'Responsable', count: 5 },
        { role: 'Docteur', count: 12 },
        { role: 'Réceptionniste', count: 8 },
        { role: 'Patient', count: 1222 }
      ],
      growth: [
        { month: 'Jan', count: 1100 },
        { month: 'Fév', count: 1150 },
        { month: 'Mar', count: 1200 },
        { month: 'Avr', count: 1250 }
      ]
    },
    performance: {
      responseTime: 245,
      uptime: 99.8,
      errors: 12,
      dailyRequests: [
        { date: 'Lun', requests: 1250 },
        { date: 'Mar', requests: 1350 },
        { date: 'Mer', requests: 1450 },
        { date: 'Jeu', requests: 1550 },
        { date: 'Ven', requests: 1650 },
        { date: 'Sam', requests: 1200 },
        { date: 'Dim', requests: 1000 }
      ]
    },
    security: {
      failedLogins: 45,
      blockedIPs: 3,
      securityEvents: [
        { type: 'Tentatives de connexion échouées', count: 45 },
        { type: 'IPs bloquées', count: 3 },
        { type: 'Tentatives d\'injection SQL', count: 2 },
        { type: 'Accès non autorisés', count: 8 }
      ]
    },
    database: {
      size: '2.5 GB',
      connections: 25,
      queries: 15420,
      performance: [
        { time: '00:00', load: 15 },
        { time: '04:00', load: 8 },
        { time: '08:00', load: 45 },
        { time: '12:00', load: 78 },
        { time: '16:00', load: 65 },
        { time: '20:00', load: 35 },
        { time: '23:59', load: 20 }
      ]
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setMetrics(mockMetrics);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleExportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      // Simuler l'export
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Rapport exporté",
        description: `Le rapport a été exporté en format ${format.toUpperCase()}.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le rapport.",
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

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports Système</h1>
          <p className="text-muted-foreground">
            Analyse complète des performances et de l'utilisation du système
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.users.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{((metrics.users.active / metrics.users.total) * 100).toFixed(1)}% actifs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.performance.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              Moyenne sur 24h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilité</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.performance.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              Uptime du système
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.performance.errors}</div>
            <p className="text-xs text-muted-foreground">
              Erreurs 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Croissance des Utilisateurs</CardTitle>
                <CardDescription>Évolution du nombre d'utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.users.growth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Rôle</CardTitle>
                <CardDescription>Distribution des utilisateurs par rôle</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.users.byRole}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ role, percent }) => `${role} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {metrics.users.byRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Requêtes Quotidiennes</CardTitle>
              <CardDescription>Volume de requêtes par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics.performance.dailyRequests}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Utilisateurs Actifs</span>
                  <Badge variant="default">{metrics.users.active}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Utilisateurs Inactifs</span>
                  <Badge variant="secondary">{metrics.users.inactive}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Taux d'Activation</span>
                  <Badge variant="outline">
                    {((metrics.users.active / metrics.users.total) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Rôle</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.users.byRole}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Base de Données</CardTitle>
                <CardDescription>Charge de la base de données</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.database.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="load" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques Système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Taille Base de Données</span>
                  <Badge variant="outline">{metrics.database.size}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Connexions Actives</span>
                  <Badge variant="default">{metrics.database.connections}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Requêtes/Heure</span>
                  <Badge variant="secondary">{metrics.database.queries.toLocaleString()}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Temps de Réponse</span>
                  <Badge variant="outline">{metrics.performance.responseTime}ms</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Événements de Sécurité</CardTitle>
                <CardDescription>Alertes et incidents de sécurité</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.security.securityEvents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ff6b6b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Tentatives Échouées</span>
                  <Badge variant="destructive">{metrics.security.failedLogins}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>IPs Bloquées</span>
                  <Badge variant="destructive">{metrics.security.blockedIPs}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Statut Système</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Sécurisé
                  </Badge>
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
