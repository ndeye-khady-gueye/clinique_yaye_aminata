
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Search, Plus, Edit, Check, X, FileText, Phone, Mail } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const MyAppointments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [consultationNote, setConsultationNote] = useState('');

  // Données simulées pour les docteurs
  const doctorAppointments = [
    {
      id: 1,
      patient: 'Aminata Sy',
      patientPhone: '+221 77 123 45 67',
      patientEmail: 'aminata.sy@email.com',
      date: '2024-01-15',
      time: '09:00',
      status: 'confirmed',
      type: 'Consultation cardiologique',
      notes: 'Suivi hypertension artérielle',
      lastVisit: '2023-11-12'
    },
    {
      id: 2,
      patient: 'Moussa Kane',
      patientPhone: '+221 77 234 56 78',
      patientEmail: 'moussa.kane@email.com',
      date: '2024-01-15',
      time: '10:30',
      status: 'in-progress',
      type: 'Consultation de suivi',
      notes: 'Diabète type 2 - contrôle glycémie',
      lastVisit: '2023-12-18'
    },
    {
      id: 3,
      patient: 'Fatoumata Diallo',
      patientPhone: '+221 77 345 67 89',
      patientEmail: 'fatoumata.diallo@email.com',
      date: '2024-01-15',
      time: '14:00',
      status: 'completed',
      type: 'Première consultation',
      notes: 'Douleurs thoraciques',
      lastVisit: null,
      consultationReport: 'ECG normal, prescrit examens complémentaires'
    }
  ];

  // Données simulées pour les patients
  const patientAppointments = [
    {
      id: 1,
      doctor: 'Dr. Fatou Diop',
      specialty: 'Cardiologie',
      date: '2024-01-15',
      time: '14:00',
      status: 'confirmed',
      location: 'Cabinet 2',
      notes: 'Apporter les derniers examens'
    },
    {
      id: 2,
      doctor: 'Dr. Aminata Fall',
      specialty: 'Médecine générale',
      date: '2024-01-22',
      time: '10:30',
      status: 'confirmed',
      location: 'Cabinet 1',
      notes: ''
    },
    {
      id: 3,
      doctor: 'Dr. Fatou Diop',
      specialty: 'Cardiologie',
      date: '2024-01-08',
      time: '09:00',
      status: 'completed',
      location: 'Cabinet 2',
      notes: 'Consultation de suivi',
      report: 'Tension stable, continuer le traitement actuel'
    }
  ];

  const appointments = user?.role === 'doctor' ? doctorAppointments : patientAppointments;

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

  const handleMarkAsCompleted = (appointmentId: number) => {
    console.log('Marquer comme terminé:', appointmentId, consultationNote);
    // Ici on intégrerait avec l'API
    setSelectedAppointment(null);
    setConsultationNote('');
  };

  const DoctorView = () => (
    <>
      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">rendez-vous</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2</div>
            <p className="text-xs text-gray-500">à voir</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-xs text-gray-500">aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">rendez-vous</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Mes rendez-vous</CardTitle>
          <CardDescription>Gérez vos consultations et ajoutez des comptes rendus</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctorAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.patient}</div>
                      {appointment.lastVisit && (
                        <div className="text-xs text-gray-500">
                          Dernière visite: {appointment.lastVisit}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {appointment.patientPhone}
                      </div>
                      <div className="flex items-center text-xs">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {appointment.patientEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{appointment.date}</span>
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{appointment.type}</div>
                      <div className="text-xs text-gray-500">{appointment.notes}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {appointment.status === 'confirmed' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                              <Check className="h-3 w-3 mr-1" />
                              Terminer
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Terminer la consultation</DialogTitle>
                              <DialogDescription>
                                Patient: {appointment.patient} - {appointment.date} à {appointment.time}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Compte rendu de consultation</label>
                                <Textarea 
                                  placeholder="Saisissez le compte rendu de la consultation..."
                                  value={consultationNote}
                                  onChange={(e) => setConsultationNote(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                                  Annuler
                                </Button>
                                <Button onClick={() => handleMarkAsCompleted(appointment.id)} className="bg-gradient-clinic">
                                  Valider
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {appointment.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Rapport
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );

  const PatientView = () => (
    <>
      {/* Actions rapides */}
      <Card className="bg-gradient-clinic text-white mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Besoin d'un rendez-vous ?</h3>
              <p className="opacity-90">Réservez facilement votre prochaine consultation</p>
            </div>
            <Button variant="secondary" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Prendre RDV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Prochain RDV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">15 Jan</div>
            <p className="text-xs text-gray-500">Dr. Fatou Diop</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Cette année</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">consultations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Dernière visite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">8 Jan</div>
            <p className="text-xs text-gray-500">Cardiologie</p>
          </CardContent>
        </Card>
      </div>

      {/* Mes rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Mes rendez-vous</CardTitle>
          <CardDescription>Consultez l'historique et gérez vos rendez-vous</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Médecin</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="font-medium">{appointment.doctor}</div>
                  </TableCell>
                  <TableCell>{appointment.specialty}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{appointment.date}</span>
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.location}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {appointment.status === 'confirmed' && (
                        <Button variant="outline" size="sm" className="text-red-600">
                          <X className="h-3 w-3 mr-1" />
                          Annuler
                        </Button>
                      )}
                      {appointment.status === 'completed' && appointment.report && (
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Rapport
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'doctor' ? 'Mes consultations' : 'Mes rendez-vous'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'doctor' 
              ? 'Gérez vos consultations et rédigez vos comptes rendus'
              : 'Consultez et gérez vos rendez-vous médicaux'
            }
          </p>
        </div>
      </div>

      {user?.role === 'doctor' ? <DoctorView /> : <PatientView />}
    </div>
  );
};

export default MyAppointments;
