
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, FileText, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedReport, setSelectedReport] = useState('appointments');

  // Données simulées pour les graphiques
  const appointmentsData = [
    { day: 'Lun', count: 12 },
    { day: 'Mar', count: 19 },
    { day: 'Mer', count: 15 },
    { day: 'Jeu', count: 22 },
    { day: 'Ven', count: 18 },
    { day: 'Sam', count: 8 },
    { day: 'Dim', count: 3 }
  ];

  const monthlyData = [
    { month: 'Jan', appointments: 145, patients: 89, revenue: 125000 },
    { month: 'Fév', appointments: 167, patients: 102, revenue: 145000 },
    { month: 'Mar', appointments: 189, patients: 115, revenue: 167000 },
    { month: 'Avr', appointments: 156, patients: 94, revenue: 134000 },
    { month: 'Mai', appointments: 201, patients: 128, revenue: 178000 },
    { month: 'Juin', appointments: 178, patients: 107, revenue: 156000 }
  ];

  const specialtyData = [
    { name: 'Cardiologie', value: 35, color: '#3B82F6' },
    { name: 'Généraliste', value: 28, color: '#10B981' },
    { name: 'Dermatologie', value: 20, color: '#F59E0B' },
    { name: 'Pédiatrie', value: 12, color: '#EF4444' },
    { name: 'Autres', value: 5, color: '#8B5CF6' }
  ];

  const doctorStats = [
    { name: 'Dr. Fatou Diop', patients: 45, appointments: 67, satisfaction: 4.8 },
    { name: 'Dr. Aminata Fall', patients: 38, appointments: 52, satisfaction: 4.6 },
    { name: 'Dr. Moussa Kane', patients: 42, appointments: 61, satisfaction: 4.7 },
    { name: 'Dr. Aïssatou Sy', patients: 35, appointments: 48, satisfaction: 4.5 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports et Analyses</h1>
          <p className="text-gray-600">Statistiques détaillées et analyses de performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <Button className="bg-gradient-clinic hover:opacity-90">
            <FileText className="mr-2 h-4 w-4" />
            Nouveau rapport
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et paramètres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="3months">3 derniers mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="Type de rapport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointments">Rendez-vous</SelectItem>
                <SelectItem value="patients">Patients</SelectItem>
                <SelectItem value="doctors">Médecins</SelectItem>
                <SelectItem value="financial">Financier</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" placeholder="Date spécifique" />
          </div>
        </CardContent>
      </Card>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RDV ce mois</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">178</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux patients</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156k FCFA</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 min</div>
            <p className="text-xs text-red-600">
              +3 min vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendez-vous par jour */}
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous par jour (cette semaine)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Évolution mensuelle */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="patients" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par spécialité */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par spécialité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={specialtyData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {specialtyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance des médecins */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des médecins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorStats.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-600">
                      {doctor.patients} patients • {doctor.appointments} RDV
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 font-medium">{doctor.satisfaction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rapport détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Rapport détaillé - Actions recommandées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800">📈 Croissance positive</h4>
              <p className="text-blue-700 text-sm mt-1">
                Le nombre de rendez-vous a augmenté de 12% ce mois. Considérez l'ajout de créneaux supplémentaires.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800">⚠️ Attention nécessaire</h4>
              <p className="text-yellow-700 text-sm mt-1">
                Le temps moyen de consultation a augmenté. Vérifiez la charge de travail des médecins.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800">✅ Performance excellente</h4>
              <p className="text-green-700 text-sm mt-1">
                Taux de satisfaction patient de 4.6/5 en moyenne. Continuez sur cette lancée !
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
