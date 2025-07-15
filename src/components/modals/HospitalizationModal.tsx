
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Hospital, Save, Printer } from 'lucide-react';

interface HospitalizationModalProps {
  patient: any;
}

const HospitalizationModal = ({ patient }: HospitalizationModalProps) => {
  const [formData, setFormData] = useState({
    numeroDossier: '',
    numeroLit: '',
    prenomNom: patient ? `${patient.prenom} ${patient.nom}` : '',
    ethnie: '',
    age: patient ? new Date().getFullYear() - patient.anneeNaissance : '',
    conjoint: '',
    profession: patient?.profession || '',
    professionConjoint: '',
    adresse: patient?.adresse || '',
    entree: new Date().toLocaleDateString('fr-FR'),
    diagnosticEntree: '',
    sortie: '',
    diagnosticSortie: '',
    motifHospitalisation: '',
    histoireMaladie: '',
    antecedents: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Sauvegarde du dossier d\'hospitalisation:', formData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-center" style={{ color: '#6C2476' }}>
          <Hospital className="h-5 w-5 mr-2" />
          Dossier d'Hospitalisation - {patient ? `${patient.prenom} ${patient.nom}` : 'Nouveau Patient'}
        </DialogTitle>
        <DialogDescription className="text-center">
          République du Sénégal - Ministère de la Santé et de l'Action Sociale
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 p-4">
        {/* En-tête officiel */}
        <div className="text-center border-2 border-gray-800 p-4 bg-white">
          <div className="flex items-start justify-center mb-4">
            <div className="w-16 h-16 border-2 border-gray-800 rounded-full flex items-center justify-center mr-4">
              <span className="text-xs font-bold">LOGO MS</span>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold uppercase">RÉPUBLIQUE DU SÉNÉGAL</h2>
              <p className="text-sm font-medium">Ministère de la Santé et de l'Action Sociale</p>
              <div className="text-xs mt-2 space-y-1">
                <p>District de : ............................</p>
                <p>Centre de Santé de : ............................</p>
                <p>Poste de Santé de : ............................</p>
              </div>
            </div>
          </div>
          
          <h1 className="text-xl font-bold uppercase border-b-2 border-gray-800 inline-block px-8 py-2 mb-6">
            DOSSIER D'HOSPITALISATION
          </h1>
        </div>

        {/* Informations du patient */}
        <div className="border-2 border-gray-800 p-6 bg-white">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <Label className="text-sm font-medium">N° Dossier:</Label>
              <Input
                value={formData.numeroDossier}
                onChange={(e) => handleInputChange('numeroDossier', e.target.value)}
                className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">N° de Lit:</Label>
              <Input
                value={formData.numeroLit}
                onChange={(e) => handleInputChange('numeroLit', e.target.value)}
                className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Prénoms / Nom:</Label>
                <Input
                  value={formData.prenomNom}
                  onChange={(e) => handleInputChange('prenomNom', e.target.value)}
                  className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Age:</Label>
                <Input
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent w-32"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Ethnie:</Label>
              <Input
                value={formData.ethnie}
                onChange={(e) => handleInputChange('ethnie', e.target.value)}
                className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Conjoint:</Label>
                <Input
                  value={formData.conjoint}
                  onChange={(e) => handleInputChange('conjoint', e.target.value)}
                  className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Profession:</Label>
                <Input
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Profession (Conjoint):</Label>
              <Input
                value={formData.professionConjoint}
                onChange={(e) => handleInputChange('professionConjoint', e.target.value)}
                className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Adresse:</Label>
              <Textarea
                value={formData.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                className="border-2 border-gray-800 rounded-none bg-transparent min-h-[60px]"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Informations médicales */}
        <div className="border-2 border-gray-800 p-6 bg-white">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Entrée le:</Label>
              <Input
                type="date"
                value={formData.entree}
                onChange={(e) => handleInputChange('entree', e.target.value)}
                className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Sortie le:</Label>
              <Input
                type="date"
                value={formData.sortie}
                onChange={(e) => handleInputChange('sortie', e.target.value)}
                className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Diagnostic d'Entrée:</Label>
              <Textarea
                value={formData.diagnosticEntree}
                onChange={(e) => handleInputChange('diagnosticEntree', e.target.value)}
                className="border-2 border-gray-800 rounded-none bg-transparent min-h-[60px]"
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Diagnostic de Sortie:</Label>
              <Textarea
                value={formData.diagnosticSortie}
                onChange={(e) => handleInputChange('diagnosticSortie', e.target.value)}
                className="border-2 border-gray-800 rounded-none bg-transparent min-h-[60px]"
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Motif d'Hospitalisation:</Label>
              <Textarea
                value={formData.motifHospitalisation}
                onChange={(e) => handleInputChange('motifHospitalisation', e.target.value)}
                className="border-2 border-gray-800 rounded-none bg-transparent min-h-[120px]"
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Histoire de la Maladie */}
        <div className="border-2 border-gray-800 p-6 bg-white">
          <h3 className="text-lg font-bold mb-4">Histoire de la Maladie</h3>
          <Textarea
            value={formData.histoireMaladie}
            onChange={(e) => handleInputChange('histoireMaladie', e.target.value)}
            className="border-2 border-gray-800 rounded-none bg-transparent min-h-[150px] w-full"
            rows={8}
          />
        </div>

        {/* Antécédants */}
        <div className="border-2 border-gray-800 p-6 bg-white">
          <h3 className="text-lg font-bold mb-4">Antécédants</h3>
          <Textarea
            value={formData.antecedents}
            onChange={(e) => handleInputChange('antecedents', e.target.value)}
            className="border-2 border-gray-800 rounded-none bg-transparent min-h-[150px] w-full"
            rows={8}
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleSave} style={{ backgroundColor: '#6C2476' }}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default HospitalizationModal;
