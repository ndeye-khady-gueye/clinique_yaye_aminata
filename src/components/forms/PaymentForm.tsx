
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, Banknote, Calculator } from 'lucide-react';

interface PaymentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const PaymentForm = ({ onSubmit, onCancel, initialData }: PaymentFormProps) => {
  const [formData, setFormData] = useState({
    patient: initialData?.patient || '',
    service: initialData?.service || '',
    amount: initialData?.amount || '',
    paymentMethod: initialData?.paymentMethod || 'cash',
    notes: initialData?.notes || '',
    discount: initialData?.discount || 0
  });

  // Grille tarifaire du Cabinet Yaye Aminata
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getServicePrice = () => {
    const service = tarifs.find(t => t.code === formData.service);
    return service ? service.price : 0;
  };

  const calculateTotal = () => {
    const basePrice = getServicePrice();
    const discount = parseFloat(formData.discount) || 0;
    return Math.max(0, basePrice - discount);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        {/* En-tête Cabinet avec logo à gauche */}
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
          <DollarSign className="h-5 w-5" />
          <span>Gestion des Paiements - Cabinet Yaye Aminata</span>
        </DialogTitle>
        <DialogDescription className="text-center">
          Traitement des paiements avec génération automatique de reçu
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Patient */}
        <div className="p-4 rounded-lg bg-white border">
          <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#6C2476' }}>
            <CreditCard className="h-4 w-4 mr-2" />
            Informations Patient
          </h3>
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
          </div>
        </div>

        {/* Service et Tarification */}
        <div className="p-4 rounded-lg bg-white border">
          <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#B0368B' }}>
            <Calculator className="h-4 w-4 mr-2" />
            Service et Tarification
          </h3>
          <div className="space-y-4">
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
                          {tarif.price.toLocaleString()} F CFA
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.service && (
              <div className="p-3 bg-white rounded border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Prix du service:</span>
                  <span className="text-lg font-bold" style={{ color: '#6C2476' }}>
                    {getServicePrice().toLocaleString()} F CFA
                  </span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="discount">Remise (optionnel)</Label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                placeholder="Montant de la remise en F CFA"
              />
            </div>

            {formData.service && (
              <div className="p-3 rounded border-2" style={{ backgroundColor: '#E4C2EB', borderColor: '#6C2476' }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total à payer:</span>
                  <span className="text-2xl font-bold" style={{ color: '#6C2476' }}>
                    {calculateTotal().toLocaleString()} F CFA
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Méthode de Paiement */}
        <div className="p-4 rounded-lg bg-white border">
          <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#6C2476' }}>
            <Banknote className="h-4 w-4 mr-2" />
            Méthode de Paiement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Méthode de paiement *</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                  <SelectItem value="insurance">Assurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes de paiement</Label>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Références, numéro de transaction..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" style={{ backgroundColor: '#6C2476' }} className="hover:opacity-90 text-white">
            Valider le Paiement
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default PaymentForm;
