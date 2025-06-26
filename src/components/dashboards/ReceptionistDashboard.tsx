
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Phone, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AppointmentForm from '@/components/forms/AppointmentForm';
import PatientForm from '@/components/forms/PatientForm';

const ReceptionistDashboard = () => {
  const { user } = useAuth();
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateAppointment = (data: any) => {
    console.log('Nouveau rendez-vous:', data);
    setIsAppointmentFormOpen(false);
  };

  const handleCreatePatient = (data: any) => {
    console.log('Nouveau patient:', data);
    setIsPatientFormOpen(false);
  };

  const handleSearchPatient = () => {
    console.log('Recherche patient:', searchTerm);
    // Logique de recherche
  };

  const handleCallsQueue = () => {
    console.log('Gestion des appels en attente');
    // Logique pour gérer les appels
  };

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
        <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
          <DialogTrigger asChild>
            <Button className="h-24  hover:opacity-90 flex flex-col" onClick={() => setIsAppointmentFormOpen(true)}>
              <Plus className="h-6 w-6 mb-2" />
              Nouveau RDV
            </Button>
          </DialogTrigger>
          <AppointmentForm 
            onSubmit={handleCreateAppointment}
            onCancel={() => setIsAppointmentFormOpen(false)}
          />
        </Dialog>

        <Card className="h-24 cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="h-full flex flex-col items-center justify-center p-4">
            <Users className="h-6 w-6 mb-2" />
            <div className="text-center">
              <p className="font-medium">Rechercher Patient</p>
              <div className="mt-2 w-full">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Nom du patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={handleSearchPatient}>
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          variant="outline" 
          className="h-24 flex flex-col"
          onClick={handleCallsQueue}
        >
          <Phone className="h-6 w-6 mb-2" />
          <span>Appels en attente</span>
          <span className="text-xs text-red-600">3 appels</span>
        </Button>
      </div>

      {/* Ajout patient */}
      <Card>
        <CardHeader>
          <CardTitle>Actions patient</CardTitle>
          <CardDescription>Gestion des patients</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isPatientFormOpen} onOpenChange={setIsPatientFormOpen}>
            <DialogTrigger asChild>
              <Button className=" hover:opacity-90" onClick={() => setIsPatientFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un nouveau patient
              </Button>
            </DialogTrigger>
            <PatientForm 
              onSubmit={handleCreatePatient}
              onCancel={() => setIsPatientFormOpen(false)}
            />
          </Dialog>
        </CardContent>
      </Card>

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
