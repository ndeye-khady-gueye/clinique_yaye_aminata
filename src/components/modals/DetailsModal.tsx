
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';

interface DetailsModalProps {
  type: 'appointment' | 'user' | 'patient';
  data: any;
}

const DetailsModal = ({ type, data }: DetailsModalProps) => {
  const renderAppointmentDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Patient</p>
          <p className="flex items-center"><User className="h-4 w-4 mr-2" />{data.patient}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Médecin</p>
          <p>{data.doctor}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Date</p>
          <p className="flex items-center"><Calendar className="h-4 w-4 mr-2" />{data.date}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Heure</p>
          <p className="flex items-center"><Clock className="h-4 w-4 mr-2" />{data.time}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Spécialité</p>
        <p>{data.speciality}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Statut</p>
        <Badge variant="secondary">{data.status}</Badge>
      </div>

      {data.notes && (
        <div>
          <p className="text-sm font-medium text-gray-600">Notes</p>
          <p className="bg-gray-50 p-3 rounded-lg">{data.notes}</p>
        </div>
      )}
    </div>
  );

  const renderUserDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Prénom</p>
          <p>{data.firstName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Nom</p>
          <p>{data.lastName}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Email</p>
        <p className="flex items-center"><Mail className="h-4 w-4 mr-2" />{data.email}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Rôle</p>
        <Badge variant="secondary">{data.role}</Badge>
      </div>

      {data.phone && (
        <div>
          <p className="text-sm font-medium text-gray-600">Téléphone</p>
          <p className="flex items-center"><Phone className="h-4 w-4 mr-2" />{data.phone}</p>
        </div>
      )}

      {data.speciality && (
        <div>
          <p className="text-sm font-medium text-gray-600">Spécialité</p>
          <p>{data.speciality}</p>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-600">Statut</p>
        <Badge variant={data.isActive ? "default" : "secondary"}>
          {data.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Date de création</p>
        <p>{data.createdAt}</p>
      </div>
    </div>
  );

  const renderPatientDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Prénom</p>
          <p>{data.firstName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Nom</p>
          <p>{data.lastName}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Email</p>
        <p className="flex items-center"><Mail className="h-4 w-4 mr-2" />{data.email}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Téléphone</p>
        <p className="flex items-center"><Phone className="h-4 w-4 mr-2" />{data.phone}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Date de naissance</p>
        <p>{data.birthDate}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Dernière visite</p>
        <p>{data.lastVisit}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600">Total visites</p>
        <p>{data.totalVisits}</p>
      </div>

      {data.notes && (
        <div>
          <p className="text-sm font-medium text-gray-600">Notes</p>
          <p className="bg-gray-50 p-3 rounded-lg">{data.notes}</p>
        </div>
      )}
    </div>
  );

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {type === 'appointment' && 'Détails du rendez-vous'}
          {type === 'user' && 'Détails de l\'utilisateur'}
          {type === 'patient' && 'Détails du patient'}
        </DialogTitle>
        <DialogDescription>
          Informations détaillées
        </DialogDescription>
      </DialogHeader>
      
      {type === 'appointment' && renderAppointmentDetails()}
      {type === 'user' && renderUserDetails()}
      {type === 'patient' && renderPatientDetails()}
    </DialogContent>
  );
};

export default DetailsModal;
