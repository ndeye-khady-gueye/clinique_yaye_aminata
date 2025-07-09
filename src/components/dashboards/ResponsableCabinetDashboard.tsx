
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, UserCheck, Activity, Building, TrendingUp } from 'lucide-react';

const ResponsableCabinetDashboard = () => {
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
      title: 'Équipe Médicale',
      value: '8',
      description: '6 docteurs, 2 réceptionnistes',
      icon: UserCheck,
      color: 'text-purple-600'
    },
    {
      title: 'Revenus Mensuel',
      value: '2.4M CFA',
      description: '+15% ce mois',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    'Nouveau patient inscrit - Aminata Diallo',
    'RDV confirmé avec Dr. Diop à 14h',
    'Rapport mensuel généré',
    'Paiement reçu - Consultation Mamadou Ba',
    'Matériel médical livré'
  ];

  const todayAppointments = [
    { patient: 'Fatou Sall', doctor: 'Dr. Diop', time: '09:00', status: 'Confirmé' },
    { patient: 'Moussa Kane', doctor: 'Dr. Fall', time: '10:30', status: 'En attente' },
    { patient: 'Aïcha Sy', doctor: 'Dr. Diop', time: '14:00', status: 'Confirmé' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Building className="h-8 w-8 text-primary" />
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600">Tableau de bord - Responsable Cabinet</p>
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
            <CardTitle>Rendez-vous du jour</CardTitle>
            <CardDescription>Planification d'aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAppointments.map((apt, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{apt.patient}</p>
                    <p className="text-sm text-gray-600">{apt.doctor} - {apt.time}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    apt.status === 'Confirmé' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Événements du cabinet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quickActions.map((activity, i) => (
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

export default ResponsableCabinetDashboard;
