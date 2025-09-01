import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Mail, MapPin, Stethoscope, DollarSign, FileText } from 'lucide-react';
import { PatientEnregistre } from '@/services/patientEnregistreService';

interface PatientEnregistreDetailsModalProps {
  patient: PatientEnregistre;
}

const PatientEnregistreDetailsModal = ({ patient }: PatientEnregistreDetailsModalProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Non renseigné';
    return timeString;
  };

  const getTypeConsultationLabel = (type: string) => {
    const types = {
      'MEDECIN': 'Médecin',
      'GYNECO': 'Gynécologie',
      'PEDIATRIE': 'Pédiatrie',
      'SAGE_FEMME': 'Sage-femme',
      'ENFANT': 'Enfant',
      'AUTRE': 'Autre'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatutLabel = (statut: string) => {
    const statuts = {
      'enregistre': 'Enregistré',
      'en_consultation': 'En consultation',
      'termine': 'Terminé',
      'annule': 'Annulé'
    };
    return statuts[statut as keyof typeof statuts] || statut;
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gray-900">
          Détails du patient enregistré
        </DialogTitle>
        <DialogDescription>
          Informations complètes du patient temporaire
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
                 {/* Informations de base */}
         <div className="bg-gray-50 p-4 rounded-lg">
           <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
             <User className="h-5 w-5 mr-2" />
             Informations de base
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <p className="text-sm font-medium text-gray-600">ID Patient</p>
               <p className="text-gray-900 font-medium">
                 <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                   #{patient.id}
                 </span>
               </p>
             </div>
             <div>
               <p className="text-sm font-medium text-gray-600">Nom complet</p>
               <p className="text-gray-900 font-medium">{patient.nom} {patient.prenom}</p>
             </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Âge</p>
              <p className="text-gray-900">{patient.age ? `${patient.age} ans` : 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Profession</p>
              <p className="text-gray-900">{patient.profession || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Statut</p>
              <Badge variant="secondary">{getStatutLabel(patient.statut)}</Badge>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Informations de contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Téléphone</p>
              <p className="text-gray-900 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {patient.telephone || 'Non renseigné'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-gray-900 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {patient.email || 'Non renseigné'}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600">Adresse</p>
              <p className="text-gray-900 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {patient.adresse || 'Non renseigné'}
              </p>
            </div>
          </div>
        </div>

        {/* Informations médicales */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Stethoscope className="h-5 w-5 mr-2" />
            Informations médicales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Motif de la visite</p>
              <p className="text-gray-900">{patient.motif_visite}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Type de consultation</p>
              <p className="text-gray-900">{getTypeConsultationLabel(patient.type_consultation)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Prix consultation</p>
              <p className="text-gray-900 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                {patient.prix_consultation?.toLocaleString()} FCFA
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Antécédents médicaux</p>
              <p className="text-gray-900">{patient.antecedents_medicaux || 'Aucun'}</p>
            </div>
          </div>
          {patient.observations_notes && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600">Observations/Notes</p>
              <p className="text-gray-900 bg-white p-3 rounded border">{patient.observations_notes}</p>
            </div>
          )}
        </div>

        {/* Informations d'enregistrement */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Informations d'enregistrement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Date d'enregistrement</p>
              <p className="text-gray-900 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(patient.date_enregistrement)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Heure d'enregistrement</p>
              <p className="text-gray-900 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(patient.heure_enregistrement)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default PatientEnregistreDetailsModal;
