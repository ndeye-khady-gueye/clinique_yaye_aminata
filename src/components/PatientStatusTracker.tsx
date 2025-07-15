
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Activity, CheckCircle, XCircle, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';

interface Appointment {
  id: number;
  time: string;
  patient: string;
  doctor: string;
  specialty: string;
  status: string;
  priority: string;
}

interface PatientStatusTrackerProps {
  appointments: Appointment[];
}

const PatientStatusTracker: React.FC<PatientStatusTrackerProps> = ({ appointments }) => {
  const [currentStatuses, setCurrentStatuses] = useState<Record<number, string>>(
    appointments.reduce((acc, apt) => ({ ...acc, [apt.id]: apt.status }), {})
  );

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmé', color: 'bg-gray-100 text-gray-800', icon: Clock },
    { value: 'waiting', label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'in-consultation', label: 'En consultation', color: 'bg-blue-100 text-blue-800', icon: Activity },
    { value: 'completed', label: 'Terminé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'cancelled', label: 'Annulé', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    setCurrentStatuses(prev => ({
      ...prev,
      [appointmentId]: newStatus
    }));
    console.log(`Statut changé pour RDV ${appointmentId}: ${newStatus}`);
    // Ici on enverrait la mise à jour au backend
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const getWaitingTime = (time: string) => {
    const appointmentTime = new Date();
    const [hours, minutes] = time.split(':');
    appointmentTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - appointmentTime.getTime()) / (1000 * 60));
    
    if (diffMinutes > 0) {
      return `+${diffMinutes} min`;
    }
    return null;
  };

  const waitingPatients = appointments.filter(apt => currentStatuses[apt.id] === 'waiting');
  const inConsultation = appointments.filter(apt => currentStatuses[apt.id] === 'in-consultation');
  const completed = appointments.filter(apt => currentStatuses[apt.id] === 'completed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Patients en attente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-700">
            <Clock className="h-5 w-5 mr-2" />
            Salle d'attente ({waitingPatients.length})
          </CardTitle>
          <CardDescription>Patients arrivés et en attente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {waitingPatients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun patient en attente</p>
          ) : (
            waitingPatients.map((appointment) => {
              const statusInfo = getStatusInfo(currentStatuses[appointment.id]);
              const waitingTime = getWaitingTime(appointment.time);
              
              return (
                <div key={appointment.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.time} - {appointment.doctor}</p>
                      <p className="text-xs text-gray-500">{appointment.specialty}</p>
                    </div>
                    {waitingTime && (
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        {waitingTime}
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusChange(appointment.id, 'in-consultation')}
                      className="flex-1"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Appeler
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                    >
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Patients en consultation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <Activity className="h-5 w-5 mr-2" />
            En consultation ({inConsultation.length})
          </CardTitle>
          <CardDescription>Consultations en cours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {inConsultation.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune consultation en cours</p>
          ) : (
            inConsultation.map((appointment) => {
              const statusInfo = getStatusInfo(currentStatuses[appointment.id]);
              
              return (
                <div key={appointment.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.time} - {appointment.doctor}</p>
                      <p className="text-xs text-gray-500">{appointment.specialty}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 animate-pulse">
                      <Activity className="h-3 w-3 mr-1" />
                      Actif
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusChange(appointment.id, 'completed')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Terminer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange(appointment.id, 'waiting')}
                    >
                      <Pause className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Consultations terminées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <CheckCircle className="h-5 w-5 mr-2" />
            Terminées ({completed.length})
          </CardTitle>
          <CardDescription>Consultations finalisées aujourd'hui</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {completed.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune consultation terminée</p>
          ) : (
            completed.map((appointment) => {
              return (
                <div key={appointment.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.time} - {appointment.doctor}</p>
                      <p className="text-xs text-gray-500">{appointment.specialty}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      OK
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      disabled
                    >
                      Consultation terminée
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange(appointment.id, 'waiting')}
                      title="Reprendre"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientStatusTracker;
