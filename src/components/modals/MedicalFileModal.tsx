
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save, Printer, UserPlus } from 'lucide-react';

interface MedicalFileModalProps {
  patient: any;
}

const MedicalFileModal = ({ patient }: MedicalFileModalProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('fr-FR'),
    numeroDossier: '',
    heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    gsrh: '',
    prenom: patient?.prenom || '',
    nom: patient?.nom || '',
    age: patient ? new Date().getFullYear() - patient.anneeNaissance : '',
    adresse: patient?.adresse || '',
    tel: patient?.mobile || '',
    email: patient?.email || '',
    profession: patient?.profession || '',
    situationMatrimoniale: patient?.etatCivil || '',
    numeroConjoint: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Dossier client sauvegardé:', formData);
    // Ici vous pourriez sauvegarder les données
  };

  const handlePrint = () => {
    window.print();
  };

  const isNewFile = !patient?.hasDossierClient;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center" style={{ color: '#6C2476' }}>
          <FileText className="h-5 w-5 mr-2" />
          {isNewFile ? 'Créer Dossier Client' : 'Dossier Client'}
        </DialogTitle>
        <DialogDescription>
          {isNewFile ? 'Création d\'un nouveau dossier client' : 'Consultation du dossier client'}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 p-4">
        {/* En-tête du Cabinet */}
        <div className="text-center border-2 border-gray-800 p-4 bg-yellow-50">
          <div className="flex justify-between items-center">
            <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <span className="text-xs font-bold">LOGO</span>
            </div>
            
            <div className="flex-1 mx-4">
              <h2 className="text-xl font-bold text-gray-800">CABINET YAYE AMINATA</h2>
              <div className="text-sm text-gray-700 mt-1">
                <p>Tel : +221 33 893 47 89 / +221 78 437 01 01</p>
                <p>Email : cabinetyayeaminata@gmail.com</p>
                <p>Adresse : Rufisque Nord, Quartier Keur Djaraf Nord, Parcelle</p>
                <p>n°58. District Sanitaire de Rufisque (Dakar - Sénégal)</p>
              </div>
            </div>
            
            <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <span className="text-xs font-bold">LOGO</span>
            </div>
          </div>
        </div>

        {/* Titre du Dossier */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 inline-block px-4 py-1">
            DOSSIER DE LA CLIENTE
          </h3>
        </div>

        {/* Informations d'en-tête */}
        <div className="border-2 border-gray-800 p-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Date :</Label>
              <Input
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Heure :</Label>
                <Input
                  value={formData.heure}
                  onChange={(e) => handleInputChange('heure', e.target.value)}
                  className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">GSRh :</Label>
                <Input
                  value={formData.gsrh}
                  onChange={(e) => handleInputChange('gsrh', e.target.value)}
                  className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent"
                />
              </div>
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-sm font-medium">Numéro du dossier :</Label>
              <div className="flex">
                <Input
                  value={formData.numeroDossier}
                  onChange={(e) => handleInputChange('numeroDossier', e.target.value)}
                  className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire Principal */}
        <div className="border-2 border-gray-800 p-6 space-y-6 bg-yellow-50">
          {/* Prénom */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Prénom :</Label>
            <Input
              value={formData.prenom}
              onChange={(e) => handleInputChange('prenom', e.target.value)}
              className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-base p-2"
            />
          </div>

          {/* Nom */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Nom :</Label>
            <Input
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-base p-2"
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Age :</Label>
            <Input
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-base p-2 w-48"
            />
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Adresse:</Label>
            <Input
              value={formData.adresse}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
              className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-base p-2"
            />
          </div>

          {/* Tel et Email */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-medium">Tel :</Label>
              <Input
                value={formData.tel}
                onChange={(e) => handleInputChange('tel', e.target.value)}
                className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-base p-2"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-medium">Email :</Label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-base p-2"
              />
            </div>
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Profession :</Label>
            <Input
              value={formData.profession}
              onChange={(e) => handleInputChange('profession', e.target.value)}
              className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-base p-2"
            />
          </div>

          {/* Situation matrimoniale */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Situation matrimoniale :</Label>
            <Input
              value={formData.situationMatrimoniale}
              onChange={(e) => handleInputChange('situationMatrimoniale', e.target.value)}
              className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-base p-2"
            />
          </div>

          {/* Numéro du conjoint */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Numéro du conjoint :</Label>
            <Input
              value={formData.numeroConjoint}
              onChange={(e) => handleInputChange('numeroConjoint', e.target.value)}
              className="border-b-2 border-gray-800 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-base p-2"
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="flex items-center"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button 
            onClick={handleSave}
            style={{ backgroundColor: '#6C2476' }}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isNewFile ? 'Créer Dossier' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default MedicalFileModal;
