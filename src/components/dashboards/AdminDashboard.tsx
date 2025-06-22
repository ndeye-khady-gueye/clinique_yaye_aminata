
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, UserCheck, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Patients',
      value: '234',
      description: '+12% ce mois',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'RDV Aujourd\'hui',
      value: '18',
      description: '3 en attente',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Médecins Actifs',
      value: '6',
      description: 'Tous disponibles',
      icon: UserCheck,
      color: 'text-purple-600'
    },
    {
      title: 'Consultations/Jour',
      value: '45',
      description: '+8% cette semaine',
      icon: Activity,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600">Tableau de bord administrateur</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous récents</CardTitle>
            <CardDescription>Dernières réservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Patient {i}</p>
                    <p className="text-sm text-gray-600">Dr. Diop - 14h00</p>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Confirmé
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité système</CardTitle>
            <CardDescription>Événements récents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                'Nouveau patient inscrit',
                'RDV annulé par Dr. Fall',
                'Rapport mensuel généré'
              ].map((activity, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p className="text-sm">{activity}</p>
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
