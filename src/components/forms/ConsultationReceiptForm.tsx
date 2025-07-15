
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileText, Printer, Download, Calendar, User, DollarSign } from 'lucide-react';

interface ConsultationReceiptFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const ConsultationReceiptForm = ({ onSubmit, onCancel, initialData }: ConsultationReceiptFormProps) => {
  const [formData, setFormData] = useState({
    receiptNumber: initialData?.receiptNumber || `R${Date.now()}`,
    patient: initialData?.patient || '',
    service: initialData?.service || '',
    doctor: initialData?.doctor || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    amount: initialData?.amount || '',
    paymentMethod: initialData?.paymentMethod || 'cash'
  });

  // Grille tarifaire
  const tarifs = [
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

  const getServicePrice = () => {
    const service = tarifs.find(t => t.code === formData.service);
    return service ? service.price : 0;
  };

  const getServiceName = () => {
    const service = tarifs.find(t => t.code === formData.service);
    return service ? service.name : '';
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

        <DialogTitle className="flex items-center justify-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Génération de Reçu de Consultation</span>
        </DialogTitle>
        <DialogDescription className="text-center">
          Créez un reçu professionnel pour la consultation
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F4E6F7' }}>
              <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#6C2476' }}>
                <User className="h-4 w-4 mr-2" />
                Informations du Reçu
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="receiptNumber">N° Reçu</Label>
                  <Input
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="mt-3">
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
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9E8F4' }}>
              <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#B0368B' }}>
                <DollarSign className="h-4 w-4 mr-2" />
                Service et Tarification
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="service">Service *</Label>
                  <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le service" />
                    </SelectTrigger>
                    <SelectContent>
                      {tarifs.map((tarif) => (
                        <SelectItem key={tarif.code} value={tarif.code}>
                          <div className="flex justify-between items-center w-full">
                            <span>{tarif.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {tarif.price.toLocaleString()} F
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="doctor">Professionnel</Label>
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
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" style={{ backgroundColor: '#6C2476' }} className="hover:opacity-90 text-white">
                Générer le Reçu
              </Button>
            </div>
          </form>
        </div>

        {/* Aperçu du Reçu */}
        <div className="space-y-4">
          <h3 className="font-semibold">Aperçu du Reçu</h3>
          <div className="border-2 border-dashed border-gray-300 p-4 bg-white rounded-lg">
            <div className="text-center border-b pb-4 mb-4">
              <h2 className="font-bold text-lg" style={{ color: '#6C2476' }}>CABINET YAYE AMINATA</h2>
              <p className="text-sm text-gray-600">Reçu de Consultation</p>
              <p className="text-xs text-gray-500">N° {formData.receiptNumber}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formData.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Patient:</span>
                <span>{formData.patient || 'Non sélectionné'}</span>
              </div>
              <div className="flex justify-between">
                <span>Service:</span>
                <span>{getServiceName() || 'Non sélectionné'}</span>
              </div>
              <div className="flex justify-between">
                <span>Professionnel:</span>
                <span>{formData.doctor || 'Non sélectionné'}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span style={{ color: '#6C2476' }}>{getServicePrice().toLocaleString()} F CFA</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t text-center text-xs text-gray-500">
              <p>Merci de votre confiance</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ConsultationReceiptForm;
