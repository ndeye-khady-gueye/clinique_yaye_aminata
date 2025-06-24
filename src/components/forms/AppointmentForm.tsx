
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
    specialty: initialData?.specialty || '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'confirmed'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}</DialogTitle>
        <DialogDescription>
          {initialData ? 'Modifiez les informations du rendez-vous' : 'Créez un nouveau rendez-vous'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="patient">Patient</Label>
          <Select value={formData.patient} onValueChange={(value) => setFormData({...formData, patient: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aminata Sy">Aminata Sy</SelectItem>
              <SelectItem value="Moussa Kane">Moussa Kane</SelectItem>
              <SelectItem value="Fatoumata Diallo">Fatoumata Diallo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="doctor">Médecin</Label>
          <Select value={formData.doctor} onValueChange={(value) => setFormData({...formData, doctor: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un médecin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. Fatou Diop">Dr. Fatou Diop</SelectItem>
              <SelectItem value="Dr. Aminata Fall">Dr. Aminata Fall</SelectItem>
              <SelectItem value="Dr. Moussa Kane">Dr. Moussa Kane</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input 
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required 
            />
          </div>
          <div>
            <Label htmlFor="time">Heure</Label>
            <Input 
              type="time" 
              value={formData.time} 
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required 
            />
          </div>
        </div>

        <div>
          <Label htmlFor="specialty">Spécialité</Label>
          <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une spécialité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cardiologie">Cardiologie</SelectItem>
              <SelectItem value="Généraliste">Médecine générale</SelectItem>
              <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
              <SelectItem value="Dermatologie">Dermatologie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            placeholder="Notes supplémentaires..."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-clinic">
            {initialData ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AppointmentForm;
