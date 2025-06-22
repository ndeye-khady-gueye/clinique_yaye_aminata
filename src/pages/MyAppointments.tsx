
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MyAppointments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Données simulées selon le rôle
  const getAppointmentsData = () => {
    if (user?.role === 'doctor') {
      return [
        {
          id: 1,
          patient: 'Aminata Sy',
          date: '2024-01-15',
          time: '09:00',
          status: 'confirmed',
          type: 'Consultation de suivi',
          notes: 'Contrôle cardiaque'
        },
        {
          id: 2,
          patient: 'Moussa Kane',
          date: '2024-01-15',
          time: '10:30',
          status: 'in-progress',
          type: 'Première consultation',
          notes: 'Douleurs thoraciques'
        }
      ];
    } else if (user?.role === 'patient') {
      return [
        {
          id: 1,
          doctor: 'Dr. Fatou Diop',
          speciality: 'Cardiologie',
          date: '2024-01-15',
          time: '14:00',
          status: 'confirmed',
          type: 'Consultation de suivi'
        },
        {
          id: 2,
          doctor: 'Dr. Aminata Fall',
          speciality: 'Généraliste',
          date: '2024-01-22',
          time: '10:30',
          status: 'confirmed',
          type: 'Consultation générale'
        }
      ];
    }
    return [];
  };

  const appointments = getAppointmentsData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const handleMarkCompleted = (appointmentId: number) => {
    console.log('Marquer comme terminé:', appointmentId);
    // Logique pour marquer le rendez-vous comme terminé
  };

  const handleAddReport = (appointmentId: number) => {
    console.log('Ajouter compte rendu:', appointmentId);
    // Logique pour ajouter un compte rendu
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'doctor' ? 'Mes consultations' : 'Mes rendez-vous'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'doctor' 
              ? 'Gérez vos consultations et ajoutez des comptes rendus' 
              : 'Consultez et gérez vos rendez-vous'
            }
          </p>
        </div>
        {user?.role === 'patient' && (
          <Button className="bg-gradient-clinic hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau RDV
          </Button>
        )}
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          À venir
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Terminés
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'cancelled'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Annulés
        </button>
      </div>

      {/* Statistiques rapides pour les docteurs */}
      {user?.role === 'doctor' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-gray-500">consultations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Cette semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-gray-500">consultations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Patients uniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-gray-500">ce mois</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Rapports en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">2</div>
              <p className="text-xs text-gray-500">à rédiger</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'upcoming' && 'Rendez-vous à venir'}
            {activeTab === 'completed' && 'Rendez-vous terminés'}
            {activeTab === 'cancelled' && 'Rendez-vous annulés'}
          </CardTitle>
          <CardDescription>
            {appointments.length} rendez-vous trouvés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {user?.role === 'doctor' ? (
                  <TableHead>Patient</TableHead>
                ) : (
                  <>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Spécialité</TableHead>
                  </>
                )}
                <TableHead>Date & Heure</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  {user?.role === 'doctor' ? (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{appointment.patient}</span>
                      </div>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.speciality}</TableCell>
                    </>
                  )}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{appointment.date}</span>
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user?.role === 'doctor' ? (
                        <>
                          {appointment.status !== 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkCompleted(appointment.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Terminer
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddReport(appointment.id)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Rapport
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                          {appointment.status === 'confirmed' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Annuler
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyAppointments;
