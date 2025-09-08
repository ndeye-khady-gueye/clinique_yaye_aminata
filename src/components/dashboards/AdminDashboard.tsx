
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, UserCheck, Activity, Shield, UserX, Mail, Settings, BarChart3, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/adminApi';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Récupérer les vraies données depuis l'API
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: adminApi.getUserStats,
    staleTime: 30 * 1000, // 30 secondes
  });

  const { data: systemMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: adminApi.getSystemMetrics,
    staleTime: 60 * 1000, // 1 minute
  });

  if (!user) {
    return <div>Chargement...</div>;
  }

  const stats = [
    {
      title: 'Total Utilisateurs',
      value: userStats?.total || '0',
      description: `${userStats?.active || 0} actifs`,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Utilisateurs Actifs',
      value: userStats?.active || '0',
      description: `${userStats?.inactive || 0} inactifs`,
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      title: 'Administrateurs',
      value: userStats?.byRole?.find(r => r.role === 'admin')?.count || '0',
      description: 'Accès système complet',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: 'Utilisateurs Inactifs',
      value: userStats?.inactive || '0',
      description: 'Nécessitent attention',
      icon: UserX,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-responsive">
      {/* En-tête - Responsive */}
      <div className="text-center sm:text-left">
        <h1 className="text-responsive-xl font-bold text-gray-900 dark:text-white mb-2">
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-responsive text-gray-600 dark:text-gray-400">Tableau de bord administrateur</p>
      </div>

      {/* Statistiques - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow card-responsive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} flex-shrink-0`} />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Métriques système - Responsive */}
      {systemMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="card-responsive">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-responsive">Métriques Système</CardTitle>
              <CardDescription className="text-sm">État du système en temps réel</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPU</span>
                  <span className="text-sm font-medium">{systemMetrics.system.cpu_usage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mémoire</span>
                  <span className="text-sm font-medium">{systemMetrics.system.memory_usage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Disque</span>
                  <span className="text-sm font-medium">{systemMetrics.system.disk_usage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Temps de réponse</span>
                  <span className="text-sm font-medium">{systemMetrics.performance.response_time}ms</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-responsive">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-responsive">Sécurité</CardTitle>
              <CardDescription className="text-sm">Événements de sécurité récents</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                {systemMetrics.security.security_events.map((event, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <p className="text-sm break-words">{event.type}: {event.count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions rapides - Responsive */}
      <Card className="card-responsive">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-responsive">Actions Rapides</CardTitle>
          <CardDescription className="text-sm">Accès rapide aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button
              variant="outline"
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-2"
              onClick={() => navigate('/admin/contacts')}
            >
              <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm text-center">Messages de Contact</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-2"
              onClick={() => navigate('/admin/rendez-vous')}
            >
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm text-center">Gestion RDV</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-2"
              onClick={() => navigate('/admin/config')}
            >
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm text-center">Configuration</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 p-2"
              onClick={() => navigate('/admin/reports')}
            >
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-sm text-center">Rapports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cartes inférieures - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="card-responsive">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-responsive">Répartition par Rôle</CardTitle>
            <CardDescription className="text-sm">Utilisateurs par type</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {userStats?.byRole?.map((role) => (
                <div key={role.role} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium capitalize text-sm sm:text-base truncate">{role.role.replace('_', ' ')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{role.count} utilisateur(s)</p>
                  </div>
                  <span className="text-xs sm:text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                    {role.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-responsive">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-responsive">Activité système</CardTitle>
            <CardDescription className="text-sm">Événements récents</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {[
                'Nouveau utilisateur créé',
                'Connexion administrateur',
                'Mise à jour système',
                'Sauvegarde automatique'
              ].map((activity, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <p className="text-sm break-words">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
