
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const UserForm = ({ onSubmit, onCancel, initialData }: UserFormProps) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    role: initialData?.role || '',
    phone: initialData?.phone || '',
    speciality: initialData?.speciality || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</DialogTitle>
        <DialogDescription>
          {initialData ? 'Modifiez les informations de l\'utilisateur' : 'Créez un nouveau compte utilisateur'}
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
          <Label htmlFor="role">Rôle</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="responsable_cabinet">Responsable Cabinet</SelectItem>
              <SelectItem value="doctor">Docteur</SelectItem>
              <SelectItem value="receptionist">Réceptionniste</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+221 XX XXX XX XX"
          />
        </div>

        {formData.role === 'doctor' && (
          <div>
            <Label htmlFor="speciality">Spécialité</Label>
            <Select value={formData.speciality} onValueChange={(value) => setFormData({...formData, speciality: value})}>
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
        )}

        <div className="flex items-center space-x-2">
          <Switch 
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
          />
          <Label>Compte actif</Label>
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

export default UserForm;
