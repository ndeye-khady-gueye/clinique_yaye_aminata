
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, Printer, Plus, Trash2, Calendar } from 'lucide-react';

interface PrescriptionModalProps {
  patient: any;
}

interface Medicament {
  id: number;
  nom: string;
  forme: string;
  dosage: string;
  frequence: string;
  duree: string;
  instructions: string;
}

const PrescriptionModal = ({ patient }: PrescriptionModalProps) => {
  const [formData, setFormData] = useState({
    dateOrdonnance: new Date().toISOString().split('T')[0],
    diagnostic: '',
    observations: '',
    recommandations: ''
  });

  const [medicaments, setMedicaments] = useState<Medicament[]>([
    {
      id: 1,
      nom: 'Paracétamol',
      forme: 'Comprimé',
      dosage: '500mg',
      frequence: '3 fois/jour',
      duree: '7 jours',
      instructions: 'À prendre après les repas'
    }
  ]);

  const [nouveauMedicament, setNouveauMedicament] = useState({
    nom: '',
    forme: '',
    dosage: '',
    frequence: '',
    duree: '',
    instructions: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicamentChange = (field: string, value: string) => {
    setNouveauMedicament(prev => ({ ...prev, [field]: value }));
  };

  const ajouterMedicament = () => {
    if (nouveauMedicament.nom && nouveauMedicament.dosage) {
      const newId = Math.max(...medicaments.map(m => m.id)) + 1;
      setMedicaments(prev => [...prev, { ...nouveauMedicament, id: newId }]);
      setNouveauMedicament({
        nom: '',
        forme: '',
        dosage: '',
        frequence: '',
        duree: '',
        instructions: ''
      });
    }
  };

  const supprimerMedicament = (id: number) => {
    setMedicaments(prev => prev.filter(m => m.id !== id));
  };

  const handleSave = () => {
    console.log('Sauvegarde de l\'ordonnance:', { formData, medicaments });
    // Logique de sauvegarde
  };

  const handlePrint = () => {
    // Logique d'impression avec formatage spécial pour ordonnance
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #6C2476;">ORDONNANCE MÉDICALE</h2>
          <p>Dr. ${formData.diagnostic}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <strong>Patient:</strong> ${patient ? `${patient.prenom} ${patient.nom}` : 'Nouveau Patient'}<br>
          <strong>Date:</strong> ${formData.dateOrdonnance}
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3>Prescription:</h3>
          ${medicaments.map(med => `
            <div style="margin-bottom: 15px; border-left: 3px solid #6C2476; padding-left: 10px;">
              <strong>${med.nom}</strong> ${med.forme} ${med.dosage}<br>
              ${med.frequence} pendant ${med.duree}<br>
              <em>${med.instructions}</em>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 50px;">
          <p><strong>Recommandations:</strong></p>
          <p>${formData.recommandations}</p>
        </div>
        
        <div style="margin-top: 80px; text-align: right;">
          <p>Signature et cachet du médecin</p>
          <div style="border: 1px solid #ccc; width: 200px; height: 100px; margin-left: auto;"></div>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center" style={{ color: '#6C2476' }}>
          <FileText className="h-5 w-5 mr-2" />
          Ordonnance - {patient ? `${patient.prenom} ${patient.nom}` : 'Nouveau Patient'}
        </DialogTitle>
        <DialogDescription>
          Créer et imprimer une ordonnance médicale
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex justify-end space-x-2">
          <Button onClick={handleSave} style={{ backgroundColor: '#6C2476' }}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button onClick={handlePrint} style={{ backgroundColor: '#B0368B' }}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>

        {/* Informations de l'ordonnance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center" style={{ color: '#6C2476' }}>
              <Calendar className="h-5 w-5 mr-2" />
              Informations de l'Ordonnance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOrdonnance">Date de l'ordonnance</Label>
                <Input
                  id="dateOrdonnance"
                  type="date"
                  value={formData.dateOrdonnance}
                  onChange={(e) => handleInputChange('dateOrdonnance', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="diagnostic">Diagnostic</Label>
                <Input
                  id="diagnostic"
                  value={formData.diagnostic}
                  onChange={(e) => handleInputChange('diagnostic', e.target.value)}
                  placeholder="Diagnostic principal"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observations">Observations cliniques</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Observations sur l'état du patient..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ajouter un médicament */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#6C2476' }}>Ajouter un Médicament</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="nomMedicament">Nom du médicament</Label>
                <Input
                  id="nomMedicament"
                  value={nouveauMedicament.nom}
                  onChange={(e) => handleMedicamentChange('nom', e.target.value)}
                  placeholder="Ex: Doliprane"
                />
              </div>
              <div>
                <Label htmlFor="forme">Forme</Label>
                <Select value={nouveauMedicament.forme} onValueChange={(value) => handleMedicamentChange('forme', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Forme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprime">Comprimé</SelectItem>
                    <SelectItem value="gelule">Gélule</SelectItem>
                    <SelectItem value="sirop">Sirop</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="pommade">Pommade</SelectItem>
                    <SelectItem value="gouttes">Gouttes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={nouveauMedicament.dosage}
                  onChange={(e) => handleMedicamentChange('dosage', e.target.value)}
                  placeholder="Ex: 500mg"
                />
              </div>
              <div>
                <Label htmlFor="frequence">Fréquence</Label>
                <Select value={nouveauMedicament.frequence} onValueChange={(value) => handleMedicamentChange('frequence', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 fois/jour">1 fois/jour</SelectItem>
                    <SelectItem value="2 fois/jour">2 fois/jour</SelectItem>
                    <SelectItem value="3 fois/jour">3 fois/jour</SelectItem>
                    <SelectItem value="4 fois/jour">4 fois/jour</SelectItem>
                    <SelectItem value="Au besoin">Au besoin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duree">Durée</Label>
                <Input
                  id="duree"
                  value={nouveauMedicament.duree}
                  onChange={(e) => handleMedicamentChange('duree', e.target.value)}
                  placeholder="Ex: 7 jours"
                />
              </div>
              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Input
                  id="instructions"
                  value={nouveauMedicament.instructions}
                  onChange={(e) => handleMedicamentChange('instructions', e.target.value)}
                  placeholder="Ex: Après les repas"
                />
              </div>
            </div>
            <Button onClick={ajouterMedicament} className="w-full" style={{ backgroundColor: '#6C2476' }}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le médicament
            </Button>
          </CardContent>
        </Card>

        {/* Liste des médicaments */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#6C2476' }}>Médicaments Prescrits</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Médicament</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Instructions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicaments.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{med.nom}</p>
                        <p className="text-sm text-gray-600">{med.forme}</p>
                      </div>
                    </TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequence}</TableCell>
                    <TableCell>{med.duree}</TableCell>
                    <TableCell>{med.instructions}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => supprimerMedicament(med.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recommandations */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#6C2476' }}>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.recommandations}
              onChange={(e) => handleInputChange('recommandations', e.target.value)}
              placeholder="Conseils et recommandations pour le patient..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Prévisualisation */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#6C2476' }}>Prévisualisation de l'Ordonnance</CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-50 p-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#6C2476' }}>ORDONNANCE MÉDICALE</h3>
              <p className="text-sm text-gray-600">Dr. Nom du Médecin - Spécialité</p>
            </div>
            
            <div className="mb-4">
              <p><strong>Patient:</strong> {patient ? `${patient.prenom} ${patient.nom}` : 'Nouveau Patient'}</p>
              <p><strong>Date:</strong> {formData.dateOrdonnance}</p>
              {formData.diagnostic && <p><strong>Diagnostic:</strong> {formData.diagnostic}</p>}
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Prescription:</h4>
              {medicaments.map((med) => (
                <div key={med.id} className="mb-3 pl-4 border-l-2" style={{ borderColor: '#6C2476' }}>
                  <p className="font-medium">{med.nom} {med.forme} {med.dosage}</p>
                  <p className="text-sm">{med.frequence} pendant {med.duree}</p>
                  <p className="text-sm italic">{med.instructions}</p>
                </div>
              ))}
            </div>

            {formData.recommandations && (
              <div className="mb-4">
                <p><strong>Recommandations:</strong></p>
                <p className="text-sm">{formData.recommandations}</p>
              </div>
            )}

            <div className="mt-8 text-right">
              <p className="text-sm">Signature et cachet du médecin</p>
              <div className="border border-gray-300 w-48 h-24 ml-auto mt-2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
};

export default PrescriptionModal;
