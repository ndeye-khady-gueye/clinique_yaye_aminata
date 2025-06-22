
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PatientDashboard = () => {
  const { user } = useAuth();

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Fatou Diop', date: '2024-01-15', time: '14:00', type: 'Cardiologie' },
    { id: 2, doctor: 'Dr. Aminata Fall', date: '2024-01-22', time: '10:30', type: 'Généraliste' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600">Votre espace patient</p>
      </div>

      {/* Action rapide */}
      <Card className="bg-gradient-clinic text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Prendre un rendez-vous</h3>
              <p className="opacity-90">Réservez votre consultation en quelques clics</p>
            </div>
            <Button variant="secondary" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau RDV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prochains RDV */}
      <Card>
        <CardHeader>
          <CardTitle>Vos prochains rendez-vous</CardTitle>
          <CardDescription>Consultations à venir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.date} à {appointment.time}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Détails
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historique récent */}
      <Card>
        <CardHeader>
          <CardTitle>Historique récent</CardTitle>
          <CardDescription>Vos dernières consultations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Consultation générale</p>
                    <p className="text-sm text-gray-600">Dr. Diop - 12/12/2023</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Voir rapport
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
