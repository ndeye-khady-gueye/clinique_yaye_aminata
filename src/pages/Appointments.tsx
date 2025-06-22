
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Search, Plus, Filter, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Appointments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  // Données simulées des rendez-vous
  const mockAppointments = [
    {
      id: 1,
      patient: 'Aminata Sy',
      doctor: 'Dr. Fatou Diop',
      speciality: 'Cardiologie',
      date: '2024-01-15',
      time: '09:00',
      status: 'confirmed',
      notes: 'Consultation de suivi'
    },
    {
      id: 2,
      patient: 'Moussa Kane',
      doctor: 'Dr. Aminata Fall',
      speciality: 'Généraliste',
      date: '2024-01-15',
      time: '10:30',
      status: 'completed',
      notes: 'Consultation générale'
    },
    {
      id: 3,
      patient: 'Fatoumata Diallo',
      doctor: 'Dr. Fatou Diop',
      speciality: 'Cardiologie',
      date: '2024-01-16',
      time: '14:00',
      status: 'pending',
      notes: 'Premier rendez-vous'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const canModifyAppointments = user?.role === 'admin' || user?.role === 'receptionist';
  const canSeeAllAppointments = user?.role === 'admin' || user?.role === 'receptionist';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {canSeeAllAppointments ? 'Tous les rendez-vous' : 'Mes rendez-vous'}
          </h1>
          <p className="text-gray-600">
            Gestion et suivi des rendez-vous
          </p>
        </div>
        {canModifyAppointments && (
          <Button className="bg-gradient-clinic hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau RDV
          </Button>
        )}
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <Button variant="outline">
              Exporter CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des rendez-vous</CardTitle>
          <CardDescription>
            {mockAppointments.length} rendez-vous trouvés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                {canSeeAllAppointments && <TableHead>Médecin</TableHead>}
                <TableHead>Spécialité</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{appointment.patient}</span>
                    </div>
                  </TableCell>
                  {canSeeAllAppointments && (
                    <TableCell>{appointment.doctor}</TableCell>
                  )}
                  <TableCell>{appointment.speciality}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{appointment.date}</span>
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                      {canModifyAppointments && (
                        <>
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-3 w-3" />
                          </Button>
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

export default Appointments;
