
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PatientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const PatientForm = ({ onSubmit, onCancel, initialData }: PatientFormProps) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    birthDate: initialData?.birthDate || '',
    address: initialData?.address || '',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Modifier le patient' : 'Nouveau patient'}</DialogTitle>
        <DialogDescription>
          {initialData ? 'Modifiez les informations du patient' : 'Ajoutez un nouveau patient'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input 
              value={formData.firstName} 
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required 
            />
          </div>
          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input 
              value={formData.lastName} 
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required 
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email"
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
        </div>

        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+221 XX XXX XX XX"
            required
          />
        </div>

        <div>
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input 
            type="date"
            value={formData.birthDate} 
            onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
            required 
          />
        </div>

        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input 
            value={formData.address} 
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Adresse complète"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes médicales</Label>
          <Textarea 
            placeholder="Antécédents, allergies, notes importantes..."
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

export default PatientForm;
