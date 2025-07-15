
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { User, Phone, MapPin, Calendar, Stethoscope, FileText, DollarSign, Clock } from 'lucide-react';

interface PatientRegistrationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const PatientRegistrationForm = ({ onSubmit, onCancel, initialData }: PatientRegistrationFormProps) => {
  const [formData, setFormData] = useState({
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    age: initialData?.age || '',
    telephone: initialData?.telephone || '',
    adresse: initialData?.adresse || '',
    email: initialData?.email || '',
    profession: initialData?.profession || '',
    situationMatrimoniale: initialData?.situationMatrimoniale || '',
    nombreEnfants: initialData?.nombreEnfants || '',
    personneAContacter: initialData?.personneAContacter || '',
    telephoneUrgence: initialData?.telephoneUrgence || '',
    typeConsultation: initialData?.typeConsultation || '',
    professionnelConsulte: initialData?.professionnelConsulte || '',
    motifVisite: initialData?.motifVisite || '',
    observationsNotes: initialData?.observationsNotes || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    registrationTime: initialData?.registrationTime || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    consultationPrice: initialData?.consultationPrice || 0
  });

  const services = [
    { code: 'SAGE_FEMME', name: 'Consultation Sage femme', price: 5000 },
    { code: 'GYNECO', name: 'Consultation gynéco', price: 7500 },
    { code: 'MEDECIN', name: 'Consultation médecin', price: 5000 },
    { code: 'ENFANT', name: 'Consultation enfant', price: 3000 },
    { code: 'ECHOGRAPHIE', name: 'Échographie', price: 15000 },
    { code: 'PANSEMENT', name: 'Pansement', price: 3000 },
    { code: 'PLANIFICATION', name: 'Planification familiale', price: 3000 },
    { code: 'INJECTION', name: 'Injection', price: 1000 },
    { code: 'DEPISTAGE', name: 'Dépistage Cancer du sein et du col', price: 3000 },
    { code: 'OBSERVATION', name: 'Mise en observation', price: 7500 },
    { code: 'TENSION', name: 'Contrôle Tension', price: 500 },
    { code: 'GLYCEMIE', name: 'Contrôle Glycémie Capillaire', price: 1000 }
  ];

  const professionnels = [
    'Dr. Yaye Aminata Diagne',
    'Dr. Fatou Diop',
    'Dr. Aminata Fall',
    'Dr. Moussa Kane',
    'Sage-femme Aissatou Ba'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedService = services.find(s => s.code === formData.typeConsultation);
    const finalData = {
      ...formData,
      consultationPrice: selectedService ? selectedService.price : 0
    };
    onSubmit(finalData);
  };

  const updatePrice = (serviceCode: string) => {
    const selectedService = services.find(s => s.code === serviceCode);
    setFormData({
      ...formData,
      typeConsultation: serviceCode,
      consultationPrice: selectedService ? selectedService.price : 0
    });
  };

  return (
    <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
      <DialogHeader>
        {/* En-tête Cabinet avec logo à gauche */}
        <div className="flex items-start justify-between mb-6 p-6 rounded-lg" style={{ backgroundColor: '#F4E6F7' }}>
          <img
            src="/lovable-uploads/Logo_page-0001.jpg"
            alt="Logo Cabinet Yaye Aminata"
            className="h-20 w-20 mr-6"
          />
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold uppercase mb-3" style={{ color: '#6C2476' }}>CABINET YAYE AMINATA</h1>
            <div className="text-base text-gray-700 space-y-1 leading-relaxed">
              <p>Tél: +221 33 893 47 89 / +221 78 437 01 01</p>
              <p>Email: cabinetyayeaminata25@gmail.com</p>
              <p>Adresse: Rufisque Nord, Quartier Jaraaf Nord Parcelle n°99, District Sanitaire de Sangalkam</p>
              <p>Dakar - Sénégal</p>
            </div>
          </div>
        </div>

        <DialogTitle className="text-center text-xl" style={{ color: '#6C2476' }}>
          Tableau d'Enregistrement des clients(es) - Cabinet Yaye Aminata
        </DialogTitle>
        <DialogDescription className="text-center text-base">
          Ce tableau est destiné à l'enregistrement des clients reçues au cabinet. Il permet de garder une trace des passages pour un suivi administratif et médical
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations Personnelles */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#6C2476' }}>
              <User className="h-5 w-5 mr-2" />
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                  className="focus:border-[#6C2476]"
                />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  required
                  className="focus:border-[#6C2476]"
                />
              </div>
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="focus:border-[#6C2476]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact et Adresse */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#B0368B' }}>
              <Phone className="h-5 w-5 mr-2" />
              Contact et Adresse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  required
                  className="focus:border-[#6C2476]"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="focus:border-[#6C2476]"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  value={formData.adresse}
                  onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  className="focus:border-[#6C2476]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations Supplémentaires */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#6C2476' }}>
              <FileText className="h-5 w-5 mr-2" />
              Informations Supplémentaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  className="focus:border-[#6C2476]"
                />
              </div>
              <div>
                <Label htmlFor="situationMatrimoniale">Situation Matrimoniale</Label>
                <Select value={formData.situationMatrimoniale} onValueChange={(value) => setFormData({...formData, situationMatrimoniale: value})}>
                  <SelectTrigger className="focus:border-[#6C2476]">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celibataire">Célibataire</SelectItem>
                    <SelectItem value="marie">Marié(e)</SelectItem>
                    <SelectItem value="divorce">Divorcé(e)</SelectItem>
                    <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nombreEnfants">Nombre d'enfants</Label>
                <Input
                  type="number"
                  value={formData.nombreEnfants}
                  onChange={(e) => setFormData({...formData, nombreEnfants: e.target.value})}
                  className="focus:border-[#6C2476]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact d'urgence */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#B0368B' }}>
              <Phone className="h-5 w-5 mr-2" />
              Contact d'Urgence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="personneAContacter">Personne à contacter</Label>
                <Input
                  value={formData.personneAContacter}
                  onChange={(e) => setFormData({...formData, personneAContacter: e.target.value})}
                  className="focus:border-[#6C2476]"
                />
              </div>
              <div>
                <Label htmlFor="telephoneUrgence">Téléphone d'urgence</Label>
                <Input
                  value={formData.telephoneUrgence}
                  onChange={(e) => setFormData({...formData, telephoneUrgence: e.target.value})}
                  className="focus:border-[#6C2476]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultation */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: '#6C2476' }}>
              <Stethoscope className="h-5 w-5 mr-2" />
              Informations de Consultation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="typeConsultation">Type de Consultation *</Label>
                <Select value={formData.typeConsultation} onValueChange={updatePrice}>
                  <SelectTrigger className="focus:border-[#6C2476]">
                    <SelectValue placeholder="Sélectionner le service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.code} value={service.code}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.name}</span>
                          <span className="ml-4 text-sm font-bold" style={{ color: '#6C2476' }}>
                            {service.price.toLocaleString()} F
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="professionnelConsulte">Professionnel Consulté</Label>
                <Select value={formData.professionnelConsulte} onValueChange={(value) => setFormData({...formData, professionnelConsulte: value})}>
                  <SelectTrigger className="focus:border-[#6C2476]">
                    <SelectValue placeholder="Sélectionner le professionnel" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionnels.map((prof) => (
                      <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date d'enregistrement</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="focus:border-[#6C2476]"
                />
              </div>
              <div>
                <Label htmlFor="registrationTime">Heure d'enregistrement</Label>
                <Input
                  type="time"
                  value={formData.registrationTime}
                  onChange={(e) => setFormData({...formData, registrationTime: e.target.value})}
                  className="focus:border-[#6C2476]"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="motifVisite">Motif de la visite</Label>
              <Input
                value={formData.motifVisite}
                onChange={(e) => setFormData({...formData, motifVisite: e.target.value})}
                className="focus:border-[#6C2476]"
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="observationsNotes">Observations / Notes</Label>
              <Textarea
                value={formData.observationsNotes}
                onChange={(e) => setFormData({...formData, observationsNotes: e.target.value})}
                rows={3}
                className="focus:border-[#6C2476]"
              />
            </div>
            {formData.consultationPrice > 0 && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#F4E6F7' }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold">Prix de la consultation:</span>
                  <span className="text-xl font-bold" style={{ color: '#6C2476' }}>
                    {formData.consultationPrice.toLocaleString()} F CFA
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="px-8">
            Annuler
          </Button>
          <Button 
            type="submit" 
            style={{ backgroundColor: '#6C2476' }} 
            className="hover:opacity-90 text-white px-8"
          >
            Enregistrer le Client
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default PatientRegistrationForm;
