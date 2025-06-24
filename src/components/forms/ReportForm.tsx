
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReportFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ReportForm = ({ onSubmit, onCancel }: ReportFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    period: '',
    startDate: '',
    endDate: '',
    description: '',
    includeCharts: true,
    format: 'pdf'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Nouveau rapport</DialogTitle>
        <DialogDescription>
          Créez un rapport personnalisé avec les données de votre choix
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Titre du rapport</Label>
          <Input 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Ex: Rapport mensuel janvier 2024"
            required 
          />
        </div>

        <div>
          <Label htmlFor="type">Type de rapport</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointments">Rendez-vous</SelectItem>
              <SelectItem value="patients">Patients</SelectItem>
              <SelectItem value="doctors">Médecins</SelectItem>
              <SelectItem value="financial">Financier</SelectItem>
              <SelectItem value="global">Rapport global</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="period">Période</Label>
          <Select value={formData.period} onValueChange={(value) => setFormData({...formData, period: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="3months">3 derniers mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="custom">Période personnalisée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.period === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input 
                type="date" 
                value={formData.startDate} 
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required 
              />
            </div>
            <div>
              <Label htmlFor="endDate">Date de fin</Label>
              <Input 
                type="date" 
                value={formData.endDate} 
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required 
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            placeholder="Description optionnelle du rapport..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="format">Format d'export</Label>
          <Select value={formData.format} onValueChange={(value) => setFormData({...formData, format: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-clinic">
            Générer le rapport
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ReportForm;
