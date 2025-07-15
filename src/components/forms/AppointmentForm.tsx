
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AppointmentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const AppointmentForm = ({ onSubmit, onCancel, initialData }: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    patient: initialData?.patient || '',
    doctor: initialData?.doctor || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    service: initialData?.service || '',
    motif: initialData?.motif || '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'confirmed'
  });

  // Services du Cabinet Yaye Aminata
  const services = [
    'Consultation Sage femme',
    'Consultation gynéco',
    'Consultation médecin',
    'Consultation enfant',
    'Échographie',
    'Pansement',
    'Planification familiale',
    'Injection',
    'Dépistage Cancer du sein et du col',
    'Mise en observation',
    'Contrôle Tension',
    'Contrôle Glycémie Capillaire'
  ];

  const medecins = [
    'Dr. Yaye Aminata Diagne',
    'Dr. Fatou Diop',
    'Dr. Aminata Fall',
    'Dr. Moussa Kane',
    'Sage-femme Aissatou Ba'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        {/* En-tête Cabinet */}
        <div className="flex items-start justify-between mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F4E6F7' }}>
          <img
            src="/lovable-uploads/Logo_page-0001.jpg"
            alt="Logo Cabinet Yaye Aminata"
            className="h-16 w-16 mr-4"
          />
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold uppercase mb-2" style={{ color: '#6C2476' }}>CABINET YAYE AMINATA</h1>
            <div className="text-sm text-gray-700 space-y-1">
              <p>Tél: +221 33 893 47 89 / +221 78 437 01 01</p>
              <p>Email: cabinetyayeaminata25@gmail.com</p>
              <p>Adresse: Rufisque Nord, Quartier Jaraaf Nord Parcelle n°99, District Sanitaire de Sangalkam</p>
              <p>Dakar - Sénégal</p>
            </div>
          </div>
        </div>

        <DialogTitle className="text-center text-lg">
          {initialData ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
        </DialogTitle>
        <DialogDescription className="text-center">
          {initialData ? 'Modifiez les informations du rendez-vous' : 'Créez un nouveau rendez-vous pour un patient'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Patient et Médecin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patient">Patient *</Label>
            <Select value={formData.patient} onValueChange={(value) => setFormData({...formData, patient: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aminata Sy">Aminata Sy</SelectItem>
                <SelectItem value="Moussa Kane">Moussa Kane</SelectItem>
                <SelectItem value="Fatoumata Diallo">Fatoumata Diallo</SelectItem>
                <SelectItem value="Ibrahima Sarr">Ibrahima Sarr</SelectItem>
                <SelectItem value="Mame Diarra Ba">Mame Diarra Ba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doctor">Professionnel Consulté *</Label>
            <Select value={formData.doctor} onValueChange={(value) => setFormData({...formData, doctor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le médecin" />
              </SelectTrigger>
              <SelectContent>
                {medecins.map((medecin) => (
                  <SelectItem key={medecin} value={medecin}>{medecin}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date et Heure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input 
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required 
            />
          </div>
          <div>
            <Label htmlFor="time">Heure *</Label>
            <Input 
              type="time" 
              value={formData.time} 
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required 
            />
          </div>
        </div>

        {/* Service */}
        <div>
          <Label htmlFor="service">Service Demandé *</Label>
          <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>{service}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Motif */}
        <div>
          <Label htmlFor="motif">Motif de la consultation</Label>
          <Textarea 
            placeholder="Décrivez le motif de la consultation..."
            value={formData.motif}
            onChange={(e) => setFormData({...formData, motif: e.target.value})}
            rows={3}
          />
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Notes complémentaires</Label>
          <Textarea 
            placeholder="Notes supplémentaires..."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={2}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" style={{ backgroundColor: '#6C2476' }} className="hover:opacity-90 text-white">
            {initialData ? 'Modifier' : 'Créer le rendez-vous'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AppointmentForm;
