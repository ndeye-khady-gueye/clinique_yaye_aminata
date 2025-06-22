
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Phone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReceptionistDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600">Gestion des rendez-vous et accueil</p>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button className="h-24 bg-gradient-clinic hover:opacity-90 flex flex-col">
          <Plus className="h-6 w-6 mb-2" />
          Nouveau RDV
        </Button>
        <Button variant="outline" className="h-24 flex flex-col">
          <Users className="h-6 w-6 mb-2" />
          Rechercher Patient
        </Button>
        <Button variant="outline" className="h-24 flex flex-col">
          <Phone className="h-6 w-6 mb-2" />
          Appels en attente
        </Button>
      </div>

      {/* RDV du jour */}
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous du jour</CardTitle>
          <CardDescription>Tous les rendez-vous d'aujourd'hui</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center min-w-[60px]">
                    <p className="font-medium">{9 + i}:00</p>
                  </div>
                  <div>
                    <p className="font-medium">Patient {i}</p>
                    <p className="text-sm text-gray-600">Dr. Diop - Consultation</p>
                  </div>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Programmé
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceptionistDashboard;
