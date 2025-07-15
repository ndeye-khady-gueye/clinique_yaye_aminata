
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Calendar, MapPin, Briefcase, Heart, FileText } from 'lucide-react';

interface PatientDetailsModalProps {
  patient: any;
}

const PatientDetailsModal = ({ patient }: PatientDetailsModalProps) => {
  if (!patient) return null;

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center" style={{ color: '#6C2476' }}>
          <User className="h-5 w-5 mr-2" />
          Détails du Patient
        </DialogTitle>
        <DialogDescription>
          Informations complètes du patient
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Informations personnelles */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#6C2476' }}>
            Informations Personnelles
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Nom</p>
              <p className="font-medium">{patient.nom}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Prénom</p>
              <p className="font-medium">{patient.prenom}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sexe</p>
              <p>{patient.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Année de naissance</p>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {patient.anneeNaissance}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">État civil</p>
              <p>{patient.etatCivil}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Groupe sanguin</p>
              <p className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                {patient.groupeSanguin}
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#6C2476' }}>
            Contact
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Mobile</p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-green-600" />
                {patient.mobile}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                {patient.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Adresse</p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-600" />
                {patient.adresse}
              </p>
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#6C2476' }}>
            Informations Professionnelles
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Profession</p>
              <p className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                {patient.profession}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Assurance</p>
              <Badge variant="secondary">{patient.assurance}</Badge>
            </div>
          </div>
        </div>

        {/* Notes médicales */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#6C2476' }}>
            Notes du Médecin
          </h3>
          <div className="flex items-start">
            <FileText className="h-4 w-4 mr-2 mt-1 text-yellow-600" />
            <p className="text-gray-700">{patient.note}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default PatientDetailsModal;
