
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download } from 'lucide-react';

interface PDFExportFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  type: 'appointments' | 'reports' | 'patients';
}

const PDFExportForm = ({ onSubmit, onCancel, type }: PDFExportFormProps) => {
  const [formData, setFormData] = useState({
    format: 'pdf',
    dateRange: 'month',
    includeDetails: true,
    includeStats: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getTitle = () => {
    switch (type) {
      case 'appointments': return 'Exporter les rendez-vous en PDF';
      case 'reports': return 'Exporter les rapports en PDF';
      case 'patients': return 'Exporter les patients en PDF';
      default: return 'Exporter en PDF';
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          {getTitle()}
        </DialogTitle>
        <DialogDescription>
          Choisissez les options d'export pour générer votre PDF
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="dateRange">Période</Label>
          <Select value={formData.dateRange} onValueChange={(value) => setFormData({...formData, dateRange: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="all">Toutes les données</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={formData.includeDetails}
              onCheckedChange={(checked) => setFormData({...formData, includeDetails: !!checked})}
            />
            <Label>Inclure les détails complets</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              checked={formData.includeStats}
              onCheckedChange={(checked) => setFormData({...formData, includeStats: !!checked})}
            />
            <Label>Inclure les statistiques</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-clinic">
            <Download className="mr-2 h-4 w-4" />
            Générer PDF
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default PDFExportForm;
