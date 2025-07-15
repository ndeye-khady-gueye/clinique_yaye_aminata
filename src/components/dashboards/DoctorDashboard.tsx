import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, FileText, Eye, Phone, Mail, UserPlus, CalendarPlus, FileCheck, Printer, Hospital, Plus, FileX, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import PatientDetailsModal from '@/components/modals/PatientDetailsModal';
import PatientContactModal from '@/components/modals/PatientContactModal';
import MedicalFileModal from '@/components/modals/MedicalFileModal';
import HospitalizationModal from '@/components/modals/HospitalizationModal';
import PrescriptionModal from '@/components/modals/PrescriptionModal';
import MedicalReportModal from '@/components/modals/MedicalReportModal';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showPatientContact, setShowPatientContact] = useState(false);
  const [showMedicalFile, setShowMedicalFile] = useState(false);
  const [showHospitalization, setShowHospitalization] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showMedicalReport, setShowMedicalReport] = useState(false);

  const todayAppointments = [
    { id: 1, patient: 'Aminata Sy', time: '09:00', status: 'confirmed', patientId: 1 },
    { id: 2, patient: 'Moussa Kane', time: '10:30', status: 'in-progress', patientId: 2 },
    { id: 3, patient: 'Fatoumata Diallo', time: '14:00', status: 'confirmed', patientId: 3 },
    { id: 4, patient: 'Omar Ba', time: '15:30', status: 'confirmed', patientId: 4 },
  ];

  const patients = [
    {
      id: 1,
      nom: 'Sy',
      prenom: 'Aminata',
      sexe: 'F',
      anneeNaissance: 1985,
      mobile: '+221 77 123 45 67',
      email: 'aminata.sy@email.com',
      etatCivil: 'Mariée',
      assurance: 'IPM',
      adresse: 'Dakar, Plateau',
      profession: 'Enseignante',
      groupeSanguin: 'A+',
      note: 'Patient suivi pour hypertension',
      hasDossierClient: true,
      isHospitalized: false,
      hasHospitalizationFile: false
    },
    {
      id: 2,
      nom: 'Kane',
      prenom: 'Moussa',
      sexe: 'M',
      anneeNaissance: 1990,
      mobile: '+221 78 234 56 78',
      email: 'moussa.kane@email.com',
      etatCivil: 'Célibataire',
      assurance: 'CNSS',
      adresse: 'Thiès, Centre-ville',
      profession: 'Ingénieur',
      groupeSanguin: 'O+',
      note: 'Contrôle annuel',
      hasDossierClient: true,
      isHospitalized: true,
      hasHospitalizationFile: true
    },
    {
      id: 3,
      nom: 'Diallo',
      prenom: 'Fatoumata',
      sexe: 'F',
      anneeNaissance: 1992,
      mobile: '+221 76 345 67 89',
      email: 'fatoumata.diallo@email.com',
      etatCivil: 'Mariée',
      assurance: 'Allianz',
      adresse: 'Saint-Louis, Nord',
      profession: 'Commerçante',
      groupeSanguin: 'B+',
      note: 'Suivi grossesse',
      hasDossierClient: true,
      isHospitalized: false,
      hasHospitalizationFile: false
    },
    {
      id: 4,
      nom: 'Ba',
      prenom: 'Omar',
      sexe: 'M',
      anneeNaissance: 1978,
      mobile: '+221 77 456 78 90',
      email: 'omar.ba@email.com',
      etatCivil: 'Marié',
      assurance: 'Saham',
      adresse: 'Kaolack, Médina',
      profession: 'Mécanicien',
      groupeSanguin: 'AB+',
      note: 'Diabète type 2',
      hasDossierClient: false,
      isHospitalized: false,
      hasHospitalizationFile: false
    }
  ];

  const consultations = [
    { id: 1, patient: 'Aminata Sy', date: '2024-01-15', motif: 'Contrôle tension', diagnostic: 'HTA stable' },
    { id: 2, patient: 'Moussa Kane', date: '2024-01-14', motif: 'Bilan annuel', diagnostic: 'RAS' },
    { id: 3, patient: 'Fatoumata Diallo', date: '2024-01-13', motif: 'Suivi grossesse', diagnostic: 'Grossesse normale' },
  ];

  const handlePatientAction = (patient, action) => {
    setSelectedPatient(patient);
    switch (action) {
      case 'details':
        setShowPatientDetails(true);
        break;
      case 'contact':
        setShowPatientContact(true);
        break;
      case 'medical':
        setShowMedicalFile(true);
        break;
      case 'hospitalization':
        setShowHospitalization(true);
        break;
      case 'prescription':
        setShowPrescription(true);
        break;
      case 'report':
        setShowMedicalReport(true);
        break;
      case 'hospitalize':
        // Mark patient as hospitalized and open hospitalization modal
        const updatedPatients = patients.map(p => 
          p.id === patient.id ? { ...p, isHospitalized: true } : p
        );
        console.log('Patient hospitalisé:', patient.prenom, patient.nom);
        setShowHospitalization(true);
        break;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#6C2476' }}>
            Bienvenue, Dr. {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600">
            {user?.speciality} - Tableau de bord médical
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handlePatientAction(null, 'prescription')} style={{ backgroundColor: '#B0368B' }}>
            <FileCheck className="h-4 w-4 mr-2" />
            Nouvelle Ordonnance
          </Button>
          <Button onClick={() => handlePatientAction(null, 'report')} style={{ backgroundColor: '#6C2476' }}>
            <FileText className="h-4 w-4 mr-2" />
            Rapport Mensuel
          </Button>
        </div>
      </div>

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              RDV Aujourd'hui
            </CardTitle>
            <Calendar className="h-4 w-4" style={{ color: '#6C2476' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En cours
            </CardTitle>
            <Clock className="h-4 w-4" style={{ color: '#B0368B' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Patients ce mois
            </CardTitle>
            <Users className="h-4 w-4" style={{ color: '#6C2476' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Consultations
            </CardTitle>
            <FileText className="h-4 w-4" style={{ color: '#B0368B' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Mes Rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#6C2476' }}>Mes Rendez-vous du jour</CardTitle>
          <CardDescription>Vos rendez-vous de la journée</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">Consultation générale</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                  >
                    {appointment.status === 'confirmed' ? 'Confirmé' : 'En cours'}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const patient = patients.find(p => p.id === appointment.patientId);
                      handlePatientAction(patient, 'details');
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mes Patients */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#6C2476' }}>Gestion des Patients</CardTitle>
          <CardDescription>Liste de vos patients avec leurs dossiers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dossier Client</TableHead>
                <TableHead>Hospitalisation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{patient.prenom} {patient.nom}</p>
                      <p className="text-sm text-gray-600">{patient.sexe} - {patient.anneeNaissance}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-normal text-blue-600 text-xs"
                        onClick={() => handlePatientAction(patient, 'contact')}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        {patient.mobile}
                      </Button>
                      <br />
                      <Button 
                        variant="link" 
                        className="p-0 h-auto font-normal text-blue-600 text-xs"
                        onClick={() => handlePatientAction(patient, 'contact')}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        {patient.email}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="secondary">{patient.assurance}</Badge>
                      {patient.isHospitalized && (
                        <Badge className="bg-red-100 text-red-800">Hospitalisé</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.hasDossierClient ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePatientAction(patient, 'medical')}
                        style={{ borderColor: '#6C2476', color: '#6C2476' }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Voir Dossier
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handlePatientAction(patient, 'medical')}
                        style={{ backgroundColor: '#6C2476' }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Créer Dossier
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.isHospitalized ? (
                      patient.hasHospitalizationFile ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePatientAction(patient, 'hospitalization')}
                          style={{ borderColor: '#B0368B', color: '#B0368B' }}
                        >
                          <Hospital className="h-4 w-4 mr-1" />
                          Voir Hosp.
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handlePatientAction(patient, 'hospitalization')}
                          style={{ backgroundColor: '#B0368B' }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Créer Hosp.
                        </Button>
                      )
                    ) : (
                      <div className="flex flex-col items-center space-y-2">
                        <Badge variant="outline" className="text-gray-400">
                          Non hospitalisé
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => handlePatientAction(patient, 'hospitalize')}
                          style={{ backgroundColor: '#B0368B' }}
                          className="text-xs"
                          title="Hospitaliser ce patient"
                        >
                          <Hospital className="h-3 w-3 mr-1" />
                          Hospitaliser
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePatientAction(patient, 'details')}
                        title="Détails du patient"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePatientAction(patient, 'prescription')}
                        style={{ borderColor: '#B0368B', color: '#B0368B' }}
                        title="Ordonnance"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePatientAction(patient, 'report')}
                        title="Rapport médical"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Consultations récentes */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#6C2476' }}>Consultations récentes</CardTitle>
          <CardDescription>Historique des consultations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Diagnostic</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell className="font-medium">{consultation.patient}</TableCell>
                  <TableCell>{consultation.date}</TableCell>
                  <TableCell>{consultation.motif}</TableCell>
                  <TableCell>{consultation.diagnostic}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePatientAction(null, 'report')}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Rapport
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <PatientDetailsModal patient={selectedPatient} />
      </Dialog>

      <Dialog open={showPatientContact} onOpenChange={setShowPatientContact}>
        <PatientContactModal patient={selectedPatient} />
      </Dialog>

      <Dialog open={showMedicalFile} onOpenChange={setShowMedicalFile}>
        <MedicalFileModal patient={selectedPatient} />
      </Dialog>

      <Dialog open={showHospitalization} onOpenChange={setShowHospitalization}>
        <HospitalizationModal patient={selectedPatient} />
      </Dialog>

      <Dialog open={showPrescription} onOpenChange={setShowPrescription}>
        <PrescriptionModal patient={selectedPatient} />
      </Dialog>

      <Dialog open={showMedicalReport} onOpenChange={setShowMedicalReport}>
        <MedicalReportModal patient={selectedPatient} />
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
