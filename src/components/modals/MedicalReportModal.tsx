
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Save, Printer, Calendar } from 'lucide-react';

interface MedicalReportModalProps {
  patient: any;
}

interface MonthlyStats {
  adults: {
    age15to19: number;
    age20to24: number;
    age25to49: number;
    age50to59: number;
    age60plus: number;
    total: number;
  };
  children: {
    age0to14: number;
    total: number;
  };
  grandTotal: number;
}

const MedicalReportModal = ({ patient }: MedicalReportModalProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState<MonthlyStats>({
    adults: {
      age15to19: 0,
      age20to24: 0,
      age25to49: 0,
      age50to59: 0,
      age60plus: 0,
      total: 0
    },
    children: {
      age0to14: 0,
      total: 0
    },
    grandTotal: 0
  });

  // Simulation des données patients pour le calcul des statistiques
  const patients = [
    { id: 1, nom: 'Sy', prenom: 'Aminata', anneeNaissance: 1985 },
    { id: 2, nom: 'Kane', prenom: 'Moussa', anneeNaissance: 1990 },
    { id: 3, nom: 'Diallo', prenom: 'Fatoumata', anneeNaissance: 1992 },
    { id: 4, nom: 'Ba', prenom: 'Omar', anneeNaissance: 1978 },
    { id: 5, nom: 'Fall', prenom: 'Awa', anneeNaissance: 2010 },
    { id: 6, nom: 'Ndiaye', prenom: 'Ibrahima', anneeNaissance: 1995 },
    { id: 7, nom: 'Seck', prenom: 'Marième', anneeNaissance: 2005 },
    { id: 8, nom: 'Diop', prenom: 'Cheikh', anneeNaissance: 1960 },
  ];

  useEffect(() => {
    calculateStats();
  }, [selectedMonth, selectedYear]);

  const calculateStats = () => {
    const currentYear = new Date().getFullYear();
    const newStats: MonthlyStats = {
      adults: {
        age15to19: 0,
        age20to24: 0,
        age25to49: 0,
        age50to59: 0,
        age60plus: 0,
        total: 0
      },
      children: {
        age0to14: 0,
        total: 0
      },
      grandTotal: 0
    };

    patients.forEach(patient => {
      const age = currentYear - patient.anneeNaissance;
      
      if (age >= 0 && age <= 14) {
        newStats.children.age0to14++;
      } else if (age >= 15 && age <= 19) {
        newStats.adults.age15to19++;
      } else if (age >= 20 && age <= 24) {
        newStats.adults.age20to24++;
      } else if (age >= 25 && age <= 49) {
        newStats.adults.age25to49++;
      } else if (age >= 50 && age <= 59) {
        newStats.adults.age50to59++;
      } else if (age >= 60) {
        newStats.adults.age60plus++;
      }
    });

    newStats.children.total = newStats.children.age0to14;
    newStats.adults.total = newStats.adults.age15to19 + newStats.adults.age20to24 + 
                           newStats.adults.age25to49 + newStats.adults.age50to59 + 
                           newStats.adults.age60plus;
    newStats.grandTotal = newStats.adults.total + newStats.children.total;

    setStats(newStats);
  };

  const handleSave = () => {
    console.log('Sauvegarde du rapport mensuel:', { selectedMonth, selectedYear, stats });
  };

  const handlePrint = () => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 50px; border-bottom: 3px solid #6C2476; padding-bottom: 20px;">
          <h1 style="color: #6C2476; margin-bottom: 10px; font-size: 28px; font-weight: bold;">RAPPORT CONSULTATION GÉNÉRAL</h1>
          <p style="font-size: 18px; color: #666; margin: 0;">Mois de ${monthNames[selectedMonth - 1]} ${selectedYear}</p>
        </div>
        
        <div style="margin-bottom: 40px;">
          <h2 style="color: #6C2476; font-size: 24px; margin-bottom: 25px; border-bottom: 2px solid #B0368B; padding-bottom: 10px;">ADULTES</h2>
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 5px solid #6C2476;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="margin-bottom: 15px;">
                <td style="padding: 8px 0; font-size: 16px; width: 200px;">15-19 ans:</td>
                <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #6C2476;">${stats.adults.age15to19.toString().padStart(2, '0')} patients</td>
              </tr>
              <tr style="margin-bottom: 15px;">
                <td style="padding: 8px 0; font-size: 16px;">20-24 ans:</td>
                <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #6C2476;">${stats.adults.age20to24.toString().padStart(2, '0')} patients</td>
              </tr>
              <tr style="margin-bottom: 15px;">
                <td style="padding: 8px 0; font-size: 16px;">25-49 ans:</td>
                <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #6C2476;">${stats.adults.age25to49.toString().padStart(2, '0')} patients</td>
              </tr>
              <tr style="margin-bottom: 15px;">
                <td style="padding: 8px 0; font-size: 16px;">50-59 ans:</td>
                <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #6C2476;">${stats.adults.age50to59.toString().padStart(2, '0')} patients</td>
              </tr>
              <tr style="margin-bottom: 15px;">
                <td style="padding: 8px 0; font-size: 16px;">60 ans et +:</td>
                <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #6C2476;">${stats.adults.age60plus.toString().padStart(2, '0')} patients</td>
              </tr>
              <tr style="border-top: 2px solid #6C2476; margin-top: 15px;">
                <td style="padding: 15px 0 8px 0; font-size: 18px; font-weight: bold;">Total:</td>
                <td style="padding: 15px 0 8px 0; font-size: 18px; font-weight: bold; color: #6C2476;">${stats.adults.total.toString().padStart(2, '0')} patients</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h2 style="color: #6C2476; font-size: 24px; margin-bottom: 25px; border-bottom: 2px solid #B0368B; padding-bottom: 10px;">ENFANTS 0-14 ANS</h2>
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 5px solid #B0368B;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="margin-bottom: 15px;">
                <td style="padding: 8px 0; font-size: 16px; width: 200px;">0-14 ans:</td>
                <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #B0368B;">${stats.children.age0to14.toString().padStart(2, '0')} patients</td>
              </tr>
              <tr style="border-top: 2px solid #B0368B; margin-top: 15px;">
                <td style="padding: 15px 0 8px 0; font-size: 18px; font-weight: bold;">Total:</td>
                <td style="padding: 15px 0 8px 0; font-size: 18px; font-weight: bold; color: #B0368B;">${stats.children.total.toString().padStart(2, '0')} patients</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="margin-top: 50px; padding: 25px; background: linear-gradient(135deg, #6C2476, #B0368B); color: white; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">TOTAL GÉNÉRAL</h2>
          <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold;">${stats.grandTotal.toString().padStart(2, '0')} PATIENTS</p>
        </div>

        <div style="margin-top: 60px; text-align: right; border-top: 1px solid #ddd; padding-top: 30px;">
          <p style="margin: 0; font-size: 14px; color: #666;">Rapport généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: bold;">Dr. [Nom du Médecin]</p>
          <div style="border: 1px solid #ccc; width: 200px; height: 80px; margin-left: auto; margin-top: 20px; display: flex; align-items: center; justify-content: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">Signature et cachet</p>
          </div>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Rapport Mensuel - ${monthNames[selectedMonth - 1]} ${selectedYear}</title>
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center" style={{ color: '#6C2476' }}>
          <FileText className="h-5 w-5 mr-2" />
          Rapport Mensuel
        </DialogTitle>
        <DialogDescription>
          Rapport de consultation général par tranche d'âge
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div>
              <Label htmlFor="month">Mois</Label>
              <select 
                id="month"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {monthNames.map((month, index) => (
                  <option key={index + 1} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="year">Année</Label>
              <Input
                id="year"
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSave} style={{ backgroundColor: '#6C2476' }}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button onClick={handlePrint} style={{ backgroundColor: '#B0368B' }}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </div>

        {/* Rapport de consultation général */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl" style={{ color: '#6C2476' }}>
              RAPPORT CONSULTATION GÉNÉRAL
            </CardTitle>
            <CardDescription className="text-lg">
              Mois de {monthNames[selectedMonth - 1]} {selectedYear}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Section Adultes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl" style={{ color: '#6C2476' }}>
              <Calendar className="h-5 w-5 mr-2" />
              ADULTES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">15-19 ans:</span>
                  <span className="font-bold text-lg" style={{ color: '#6C2476' }}>
                    {stats.adults.age15to19.toString().padStart(2, '0')} patients
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">20-24 ans:</span>
                  <span className="font-bold text-lg" style={{ color: '#6C2476' }}>
                    {stats.adults.age20to24.toString().padStart(2, '0')} patients
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">25-49 ans:</span>
                  <span className="font-bold text-lg" style={{ color: '#6C2476' }}>
                    {stats.adults.age25to49.toString().padStart(2, '0')} patients
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">50-59 ans:</span>
                  <span className="font-bold text-lg" style={{ color: '#6C2476' }}>
                    {stats.adults.age50to59.toString().padStart(2, '0')} patients
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">60 ans et +:</span>
                  <span className="font-bold text-lg" style={{ color: '#6C2476' }}>
                    {stats.adults.age60plus.toString().padStart(2, '0')} patients
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t-2 pt-4">
              <div className="flex justify-between items-center p-4 rounded" style={{ backgroundColor: '#6C2476', color: 'white' }}>
                <span className="font-bold text-xl">Total Adultes:</span>
                <span className="font-bold text-2xl">
                  {stats.adults.total.toString().padStart(2, '0')} patients
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Enfants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl" style={{ color: '#B0368B' }}>
              <Calendar className="h-5 w-5 mr-2" />
              ENFANTS 0-14 ANS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">0-14 ans:</span>
                <span className="font-bold text-lg" style={{ color: '#B0368B' }}>
                  {stats.children.age0to14.toString().padStart(2, '0')} patients
                </span>
              </div>
              <div className="border-t-2 pt-4">
                <div className="flex justify-between items-center p-4 rounded" style={{ backgroundColor: '#B0368B', color: 'white' }}>
                  <span className="font-bold text-xl">Total Enfants:</span>
                  <span className="font-bold text-2xl">
                    {stats.children.total.toString().padStart(2, '0')} patients
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Général */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center p-6 rounded-lg" style={{ background: 'linear-gradient(135deg, #6C2476, #B0368B)', color: 'white' }}>
              <h2 className="text-2xl font-bold mb-2">TOTAL GÉNÉRAL</h2>
              <p className="text-4xl font-bold">{stats.grandTotal.toString().padStart(2, '0')} PATIENTS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
};

export default MedicalReportModal;
