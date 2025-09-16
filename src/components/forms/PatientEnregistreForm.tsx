import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import logo from '@/assets/images/Logo_page-0001.jpg';

interface PatientEnregistreFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const PatientEnregistreForm: React.FC<PatientEnregistreFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState({
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    telephone: initialData?.telephone || '',
    email: initialData?.email || '',
    age: initialData?.age || '',
    motif_visite: initialData?.motif_visite || '',
    observations_notes: initialData?.observations_notes || '',
    type_consultation: initialData?.type_consultation || 'MEDECIN',
    prix_consultation: initialData?.prix_consultation || 5000,
    profession: initialData?.profession || '',
    adresse: initialData?.adresse || '',
    antecedents_medicaux: initialData?.antecedents_medicaux || ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validation des champs obligatoires
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire';
    if (!formData.motif_visite.trim()) newErrors.motif_visite = 'Le motif de la visite est obligatoire';

    // Validation de l'âge si fourni
    if (formData.age && (parseInt(formData.age.toString()) < 0 || parseInt(formData.age.toString()) > 150)) {
      newErrors.age = 'L\'âge doit être entre 0 et 150 ans';
    }

    // Validation du prix si fourni
    if (formData.prix_consultation && formData.prix_consultation < 0) {
      newErrors.prix_consultation = 'Le prix ne peut pas être négatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Transformer les données pour le backend
      const patientData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        telephone: formData.telephone.trim() || undefined,
        email: formData.email.trim() || undefined,
        age: formData.age ? parseInt(formData.age.toString()) : undefined,
        motif_visite: formData.motif_visite.trim(),
        observations_notes: formData.observations_notes.trim() || undefined,
        type_consultation: formData.type_consultation,
        prix_consultation: parseFloat(formData.prix_consultation.toString()),
        profession: formData.profession.trim() || undefined,
        adresse: formData.adresse.trim() || undefined,
        antecedents_medicaux: formData.antecedents_medicaux.trim() || undefined
      };

      onSubmit(patientData);
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="space-y-0 pb-4">
        {/* En-tête Cabinet avec logo à gauche */}
        <div className="flex items-start justify-between mb-6 p-6 rounded-lg" style={{ backgroundColor: '#F4E6F7' }}>
          <img
            src={logo}
            alt="Logo Cabinet Yaye Aminata"
            className="h-20 w-20 mr-6"
          />
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold uppercase mb-3" style={{ color: '#6C2476' }}>CABINET YAYE AMINATA</h1>
            <div className="text-base text-gray-700 space-y-1 leading-relaxed">
              <p>Tél: +221 33 893 47 89 / +221 78 437 01 01</p>
              <p>Email: cabinetyayeaminata25@gmail.com</p>
              <p>Adresse: Rufisque Nord, Quartier Jaraaf Nord Parcelle n°99, District Sanitaire de Sangalkam</p>
              <p>Dakar - Sénégal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-center text-xl" style={{ color: '#6C2476' }}>
              {initialData?.id ? 'Modification du patient' : 'Tableau d\'Enregistrement des clients(es) - Cabinet Yaye Aminata'}
            </CardTitle>
            <CardDescription className="text-center text-base">
              Ce tableau est destiné à l'enregistrement des clients reçues au cabinet. Il permet de garder une trace des passages pour un suivi administratif et médical
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Informations de base
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Nom de famille"
                  className={errors.nom ? 'border-red-500' : ''}
                />
                {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  placeholder="Prénom"
                  className={errors.prenom ? 'border-red-500' : ''}
                />
                {errors.prenom && <p className="text-sm text-red-500">{errors.prenom}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="775797986"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="150"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Âge"
                  className={errors.age ? 'border-red-500' : ''}
                />
                {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  placeholder="Profession"
                />
              </div>
            </div>
          </div>

          {/* Section Informations médicales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Informations médicales
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motif_visite">Motif de la visite *</Label>
                <Input
                  id="motif_visite"
                  value={formData.motif_visite}
                  onChange={(e) => handleInputChange('motif_visite', e.target.value)}
                  placeholder="Raison de la consultation"
                  className={errors.motif_visite ? 'border-red-500' : ''}
                />
                {errors.motif_visite && <p className="text-sm text-red-500">{errors.motif_visite}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type_consultation">Type de consultation</Label>
                  <Select
                    value={formData.type_consultation}
                    onValueChange={(value) => handleInputChange('type_consultation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEDECIN">Médecin</SelectItem>
                      <SelectItem value="GYNECO">Gynécologie</SelectItem>
                      <SelectItem value="PEDIATRIE">Pédiatrie</SelectItem>
                      <SelectItem value="SAGE_FEMME">Sage-femme</SelectItem>
                      <SelectItem value="ENFANT">Enfant</SelectItem>
                      <SelectItem value="AUTRE">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prix_consultation">Prix consultation (FCFA)</Label>
                  <Input
                    id="prix_consultation"
                    type="number"
                    min="0"
                    value={formData.prix_consultation}
                    onChange={(e) => handleInputChange('prix_consultation', parseFloat(e.target.value) || 0)}
                    placeholder="5000"
                    className={errors.prix_consultation ? 'border-red-500' : ''}
                  />
                  {errors.prix_consultation && <p className="text-sm text-red-500">{errors.prix_consultation}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observations_notes">Observations/Notes</Label>
                <Textarea
                  id="observations_notes"
                  value={formData.observations_notes}
                  onChange={(e) => handleInputChange('observations_notes', e.target.value)}
                  placeholder="Observations, notes importantes..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="antecedents_medicaux">Antécédents médicaux</Label>
                <Textarea
                  id="antecedents_medicaux"
                  value={formData.antecedents_medicaux}
                  onChange={(e) => handleInputChange('antecedents_medicaux', e.target.value)}
                  placeholder="Antécédents médicaux, traitements en cours, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Section Informations supplémentaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Informations supplémentaires
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                value={formData.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                placeholder="Adresse complète"
                rows={2}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {initialData?.id ? 'Modifier le patient' : 'Enregistrer le patient'}
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
};

export default PatientEnregistreForm;
