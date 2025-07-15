import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, Printer, Calendar, BarChart3, Building2 } from 'lucide-react';

interface ReportsGeneratorProps {
  onClose: () => void;
}

const ReportsGenerator = ({ onClose }: ReportsGeneratorProps) => {
  const [reportConfig, setReportConfig] = useState({
    type: '',
    dateFrom: '',
    dateTo: '',
    format: 'pdf',
    includeStats: true,
    includeDetails: true,
    includeCharts: false,
    filters: {
      doctor: '',
      service: '',
      paymentStatus: ''
    }
  });

  const reportTypes = [
    { value: 'daily', label: 'Rapport Journalier', description: 'Activités de la journée' },
    { value: 'weekly', label: 'Rapport Hebdomadaire', description: 'Résumé de la semaine' },
    { value: 'monthly', label: 'Rapport Mensuel', description: 'Statistiques mensuelles' },
    { value: 'patients', label: 'Rapport Patients', description: 'Liste des patients et consultations' },
    { value: 'financial', label: 'Rapport Financier', description: 'Recettes et paiements' },
    { value: 'appointments', label: 'Rapport Rendez-vous', description: 'Planning et consultations' },
    { value: 'services', label: 'Rapport Services', description: 'Analyse par type de service' }
  ];

  const services = [
    'Consultation Sage femme',
    'Consultation gynéco', 
    'Consultation médecin',
    'Consultation enfant',
    'Échographie',
    'Pansement',
    'Planification familiale',
    'Injection',
    'Dépistage Cancer du sein et du col',
    'Mise en observation',
    'Contrôle Tension',
    'Contrôle Glycémie Capillaire'
  ];

  const doctors = [
    'Dr. Yaye Aminata Diagne',
    'Dr. Fatou Diop',
    'Dr. Aminata Fall',
    'Dr. Moussa Kane',
    'Sage-femme Aissatou Ba'
  ];

  // Données simulées pour l'aperçu
  const mockData = {
    totalPatients: 45,
    totalConsultations: 52,
    totalRevenue: 285000,
    topService: 'Consultation gynéco',
    busyDay: 'Mercredi',
    averagePerDay: 8.2
  };

  const handleGenerate = () => {
    console.log('Génération du rapport avec configuration:', reportConfig);
    onClose();
  };

  const getReportPreview = () => {
    const selectedReport = reportTypes.find(r => r.value === reportConfig.type);
    if (!selectedReport) return null;

    return (
      <div className="bg-white p-4 border rounded-lg">
        <div className="text-center mb-4 border-b pb-3">
          <h3 className="font-bold uppercase" style={{ color: '#6C2476' }}>CABINET YAYE AMINATA</h3>
          <p className="text-sm text-gray-600">Rapport: {selectedReport.label}</p>
          <p className="text-xs text-gray-500">
            {reportConfig.dateFrom && reportConfig.dateTo 
              ? `Période: ${reportConfig.dateFrom} au ${reportConfig.dateTo}`
              : 'Période: Non définie'
            }
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Patients Total</p>
              <p className="text-lg font-bold" style={{ color: '#6C2476' }}>{mockData.totalPatients}</p>
            </div>
            <div>
              <p className="font-medium">Consultations</p>
              <p className="text-lg font-bold" style={{ color: '#B0368B' }}>{mockData.totalConsultations}</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium">Recettes Totales</p>
            <p className="text-xl font-bold" style={{ color: '#6C2476' }}>{mockData.totalRevenue.toLocaleString()} F CFA</p>
          </div>

          <div className="pt-2 border-t">
            <p><strong>Service populaire:</strong> {mockData.topService}</p>
            <p><strong>Jour le plus actif:</strong> {mockData.busyDay}</p>
            <p><strong>Moyenne/jour:</strong> {mockData.averagePerDay} patients</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
          <BarChart3 className="h-5 w-5" />
          <span>Générateur de Rapports - Cabinet Yaye Aminata</span>
        </DialogTitle>
        <DialogDescription className="text-center">
          Créez des rapports personnalisés pour le suivi et l'analyse de l'activité du cabinet
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-6">
          {/* Type de rapport */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F4E6F7' }}>
            <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#6C2476' }}>
              <FileText className="h-4 w-4 mr-2" />
              Type de Rapport
            </h3>
            <Select value={reportConfig.type} onValueChange={(value) => setReportConfig({...reportConfig, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de rapport" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Période */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9E8F4' }}>
            <h3 className="font-semibold mb-3 flex items-center" style={{ color: '#B0368B' }}>
              <Calendar className="h-4 w-4 mr-2" />
              Période
            </h3>
            <div className="grid grid-cols-2 gap-3">
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
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Filtres (Optionnels)</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="doctor">Médecin spécifique</Label>
                <Select value={reportConfig.filters.doctor} onValueChange={(value) => 
                  setReportConfig({...reportConfig, filters: {...reportConfig.filters, doctor: value}})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les médecins" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les médecins</SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="service">Service spécifique</Label>
                <Select value={reportConfig.filters.service} onValueChange={(value) => 
                  setReportConfig({...reportConfig, filters: {...reportConfig.filters, service: value}})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les services</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Options du Rapport</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeStats"
                  checked={reportConfig.includeStats}
                  onCheckedChange={(checked) => setReportConfig({...reportConfig, includeStats: !!checked})}
                />
                <Label htmlFor="includeStats">Inclure les statistiques</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeDetails"
                  checked={reportConfig.includeDetails}
                  onCheckedChange={(checked) => setReportConfig({...reportConfig, includeDetails: !!checked})}
                />
                <Label htmlFor="includeDetails">Inclure les détails</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeCharts"
                  checked={reportConfig.includeCharts}
                  onCheckedChange={(checked) => setReportConfig({...reportConfig, includeCharts: !!checked})}
                />
                <Label htmlFor="includeCharts">Inclure les graphiques</Label>
              </div>
            </div>
          </div>

          {/* Format */}
          <div>
            <Label htmlFor="format">Format d'export</Label>
            <Select value={reportConfig.format} onValueChange={(value) => setReportConfig({...reportConfig, format: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Aperçu */}
        <div className="space-y-4">
          <h3 className="font-semibold">Aperçu du Rapport</h3>
          {getReportPreview()}
          
          <div className="space-y-2">
            <Button onClick={handleGenerate} style={{ backgroundColor: '#6C2476' }} className="hover:opacity-90 text-white">
              <Download className="mr-2 h-4 w-4" />
              Générer le Rapport
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ReportsGenerator;
