
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Printer, Calendar, DollarSign } from 'lucide-react';

interface FinancialReportsModalProps {
  onClose: () => void;
}

const FinancialReportsModal = ({ onClose }: FinancialReportsModalProps) => {
  const [reportConfig, setReportConfig] = useState({
    type: 'financial',
    dateFrom: '',
    dateTo: '',
    format: 'pdf'
  });

  // Données simulées pour les services et prix
  const servicesData = [
    { service: 'Consultation Sage femme', prix: 2500, nombre: 15, total: 37500 },
    { service: 'Consultation gynéco', prix: 5000, nombre: 12, total: 60000 },
    { service: 'Consultation médecin', prix: 3000, nombre: 18, total: 54000 },
    { service: 'Consultation enfant', prix: 2000, nombre: 8, total: 16000 },
    { service: 'Échographie', prix: 8000, nombre: 6, total: 48000 },
    { service: 'Pansement', prix: 1500, nombre: 10, total: 15000 },
    { service: 'Planification familiale', prix: 1000, nombre: 4, total: 4000 },
    { service: 'Injection', prix: 2000, nombre: 7, total: 14000 },
    { service: 'Dépistage Cancer', prix: 3500, nombre: 3, total: 10500 },
    { service: 'Mise en observation', prix: 5000, nombre: 2, total: 10000 },
    { service: 'Contrôle Tension', prix: 1000, nombre: 12, total: 12000 },
    { service: 'Contrôle Glycémie', prix: 1500, nombre: 5, total: 7500 }
  ];

  const totalGeneral = servicesData.reduce((sum, item) => sum + item.total, 0);
  const totalPatients = servicesData.reduce((sum, item) => sum + item.nombre, 0);

  // Données des rendez-vous par médecin
  const rdvData = [
    { medecin: 'Dr. Yaye Aminata Diagne', rdvTotal: 25, rdvHonores: 22, rdvAnnules: 3, taux: 88 },
    { medecin: 'Dr. Fatou Diop', rdvTotal: 18, rdvHonores: 16, rdvAnnules: 2, taux: 89 },
    { medecin: 'Dr. Aminata Fall', rdvTotal: 20, rdvHonores: 18, rdvAnnules: 2, taux: 90 },
    { medecin: 'Sage-femme Aissatou Ba', rdvTotal: 15, rdvHonores: 14, rdvAnnules: 1, taux: 93 }
  ];

  const handleGenerate = () => {
    console.log('Génération du rapport financier:', reportConfig);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
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
              <p>Adresse: Rufisque Nord, Quartier Jaraaf Nord Parcelle n°99</p>
              <p>District Sanitaire de Sangalkam - Dakar - Sénégal</p>
            </div>
          </div>
        </div>

        <DialogTitle className="flex items-center justify-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Rapport Financier et Rendez-vous</span>
        </DialogTitle>
        <DialogDescription className="text-center">
          Rapport détaillé des recettes par service et suivi des rendez-vous
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Configuration de période */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Période du Rapport
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dateFrom">Date de début</Label>
                <Input 
                  type="date"
                  value={reportConfig.dateFrom}
                  onChange={(e) => setReportConfig({...reportConfig, dateFrom: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="dateTo">Date de fin</Label>
                <Input 
                  type="date"
                  value={reportConfig.dateTo}
                  onChange={(e) => setReportConfig({...reportConfig, dateTo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <Select value={reportConfig.format} onValueChange={(value) => setReportConfig({...reportConfig, format: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rapport Financier par Service */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#6C2476' }}>RAPPORT FINANCIER PAR SERVICE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-gray-800">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-800 p-3 text-left font-bold">SERVICE</th>
                    <th className="border border-gray-800 p-3 text-center font-bold">PRIX UNITAIRE</th>
                    <th className="border border-gray-800 p-3 text-center font-bold">NOMBRE</th>
                    <th className="border border-gray-800 p-3 text-right font-bold">TOTAL (F CFA)</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-800 p-3">{item.service}</td>
                      <td className="border border-gray-800 p-3 text-center">{item.prix.toLocaleString()}</td>
                      <td className="border border-gray-800 p-3 text-center font-semibold">{item.nombre}</td>
                      <td className="border border-gray-800 p-3 text-right font-semibold">{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-100 font-bold">
                    <td className="border border-gray-800 p-3">TOTAL GÉNÉRAL</td>
                    <td className="border border-gray-800 p-3 text-center">-</td>
                    <td className="border border-gray-800 p-3 text-center">{totalPatients}</td>
                    <td className="border border-gray-800 p-3 text-right text-lg" style={{ color: '#6C2476' }}>
                      {totalGeneral.toLocaleString()} F CFA
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques Rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#6C2476' }}>SUIVI DES RENDEZ-VOUS PAR MÉDECIN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-gray-800">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-800 p-3 text-left font-bold">MÉDECIN</th>
                    <th className="border border-gray-800 p-3 text-center font-bold">RDV TOTAL</th>
                    <th className="border border-gray-800 p-3 text-center font-bold">RDV HONORÉS</th>
                    <th className="border border-gray-800 p-3 text-center font-bold">RDV ANNULÉS</th>
                    <th className="border border-gray-800 p-3 text-center font-bold">TAUX SUCCESS (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {rdvData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-800 p-3">{item.medecin}</td>
                      <td className="border border-gray-800 p-3 text-center font-semibold">{item.rdvTotal}</td>
                      <td className="border border-gray-800 p-3 text-center text-green-600 font-semibold">{item.rdvHonores}</td>
                      <td className="border border-gray-800 p-3 text-center text-red-600 font-semibold">{item.rdvAnnules}</td>
                      <td className="border border-gray-800 p-3 text-center font-bold" style={{ color: '#6C2476' }}>
                        {item.taux}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Résumé Exécutif */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#6C2476' }}>RÉSUMÉ EXÉCUTIF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{totalPatients}</div>
                <div className="text-sm text-gray-600">Total Patients</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{totalGeneral.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Recettes (F CFA)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border">
                <div className="text-2xl font-bold" style={{ color: '#6C2476' }}>
                  {Math.round(totalGeneral / totalPatients).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Recette Moy./Patient</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(rdvData.reduce((sum, item) => sum + item.taux, 0) / rdvData.length)}%
                </div>
                <div className="text-sm text-gray-600">Taux RDV Moyen</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleGenerate} style={{ backgroundColor: '#6C2476' }}>
            <Download className="h-4 w-4 mr-2" />
            Générer Rapport
          </Button>
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default FinancialReportsModal;
