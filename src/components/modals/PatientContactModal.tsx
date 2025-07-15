
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, History, FileText, Heart, Phone, Mail, Calendar, Stethoscope, Pill, Activity } from 'lucide-react';

interface PatientContactModalProps {
  patient: any;
}

const PatientContactModal = ({ patient }: PatientContactModalProps) => {
  if (!patient) return null;

  const antecedents = [
    { type: 'Médical', description: 'Hypertension artérielle depuis 2020', date: '2020-03-15' },
    { type: 'Chirurgical', description: 'Appendicectomie', date: '2015-07-20' },
    { type: 'Familial', description: 'Diabète (père)', date: '' },
    { type: 'Allergique', description: 'Pénicilline', date: '2018-05-10' }
  ];

  const dossierMedical = {
    consultations: [
      { date: '2024-01-15', motif: 'Contrôle tension', diagnostic: 'HTA stable', traitement: 'Amlodipine 5mg' },
      { date: '2024-01-01', motif: 'Bilan annuel', diagnostic: 'RAS', traitement: 'Vitamines' },
      { date: '2023-12-15', motif: 'Mal de tête', diagnostic: 'Céphalée tension', traitement: 'Paracétamol' }
    ],
    examens: [
      { date: '2024-01-15', type: 'Prise de tension', resultat: '140/90 mmHg' },
      { date: '2024-01-01', type: 'Bilan sanguin', resultat: 'Normal' },
      { date: '2023-12-01', type: 'ECG', resultat: 'Rythme sinusal' }
    ],
    traitements: [
      { medicament: 'Amlodipine', dosage: '5mg', frequence: '1/jour', duree: 'En cours' },
      { medicament: 'Aspirine', dosage: '100mg', frequence: '1/jour', duree: '6 mois' }
    ]
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center" style={{ color: '#6C2476' }}>
          <Phone className="h-5 w-5 mr-2" />
          Contact Patient - {patient.prenom} {patient.nom}
        </DialogTitle>
        <DialogDescription>
          Informations détaillées et dossier médical
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="informations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="informations">Informations du Patient</TabsTrigger>
          <TabsTrigger value="antecedents">Antécédents</TabsTrigger>
          <TabsTrigger value="dossier">Dossier Médical</TabsTrigger>
        </TabsList>
        
        {/* Onglet 1: Informations du Patient */}
        <TabsContent value="informations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" style={{ color: '#6C2476' }}>
                <User className="h-5 w-5 mr-2" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><strong>Nom:</strong> {patient.nom}</p>
                  <p><strong>Prénom:</strong> {patient.prenom}</p>
                  <p><strong>Sexe:</strong> {patient.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                  <p><strong>Année de naissance:</strong> {patient.anneeNaissance}</p>
                  <p><strong>État civil:</strong> {patient.etatCivil}</p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <strong>Mobile:</strong> {patient.mobile}
                  </p>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <strong>Email:</strong> {patient.email}
                  </p>
                  <p><strong>Adresse:</strong> {patient.adresse}</p>
                  <p><strong>Profession:</strong> {patient.profession}</p>
                  <p><strong>Assurance:</strong> <Badge variant="secondary">{patient.assurance}</Badge></p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  <strong>Groupe sanguin:</strong> {patient.groupeSanguin}
                </p>
                <div className="mt-2">
                  <strong>Note du médecin:</strong>
                  <p className="bg-yellow-50 p-3 rounded mt-1">{patient.note}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 2: Antécédents */}
        <TabsContent value="antecedents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" style={{ color: '#6C2476' }}>
                <History className="h-5 w-5 mr-2" />
                Antécédents Médicaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {antecedents.map((antecedent, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <Badge 
                        className={
                          antecedent.type === 'Médical' ? 'bg-blue-100 text-blue-800' :
                          antecedent.type === 'Chirurgical' ? 'bg-red-100 text-red-800' :
                          antecedent.type === 'Familial' ? 'bg-green-100 text-green-800' :
                          'bg-orange-100 text-orange-800'
                        }
                      >
                        {antecedent.type}
                      </Badge>
                      {antecedent.date && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {antecedent.date}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-medium">{antecedent.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 3: Dossier Médical */}
        <TabsContent value="dossier" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Consultations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: '#6C2476' }}>
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Consultations Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dossierMedical.consultations.map((consultation, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <strong className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {consultation.date}
                        </strong>
                        <Badge variant="outline">{consultation.motif}</Badge>
                      </div>
                      <p><strong>Diagnostic:</strong> {consultation.diagnostic}</p>
                      <p><strong>Traitement:</strong> {consultation.traitement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Examens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: '#6C2476' }}>
                  <Activity className="h-5 w-5 mr-2" />
                  Examens et Résultats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dossierMedical.examens.map((examen, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{examen.type}</p>
                        <p className="text-sm text-gray-600">{examen.date}</p>
                      </div>
                      <Badge variant="secondary">{examen.resultat}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traitements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: '#6C2476' }}>
                  <Pill className="h-5 w-5 mr-2" />
                  Traitements Actuels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dossierMedical.traitements.map((traitement, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{traitement.medicament}</p>
                        <p className="text-sm text-gray-600">
                          {traitement.dosage} - {traitement.frequence}
                        </p>
                      </div>
                      <Badge 
                        className={traitement.duree === 'En cours' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {traitement.duree}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default PatientContactModal;
