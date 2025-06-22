
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, FileText, TrendingUp, Users, Activity } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('appointments');
  const [dateRange, setDateRange] = useState('month');

  // Données simulées pour les graphiques
  const appointmentData = [
    { name: 'Lun', rdv: 12, completed: 10 },
    { name: 'Mar', rdv: 19, completed: 16 },
    { name: 'Mer', rdv: 15, completed: 14 },
    { name: 'Jeu', rdv: 22, completed: 18 },
    { name: 'Ven', rdv: 18, completed: 17 },
    { name: 'Sam', rdv: 8, completed: 7 },
    { name: 'Dim', rdv: 5, completed: 4 }
  ];

  const doctorData = [
    { name: 'Dr. Diop', patients: 45, rdv: 67 },
    { name: 'Dr. Fall', patients: 38, rdv: 52 },
    { name: 'Dr. Kane', patients: 32, rdv: 48 },
    { name: 'Dr. Sy', patients: 28, rdv: 41 }
  ];

  const specialityData = [
    { name: 'Cardiologie', value: 35, color: '#8884d8' },
    { name: 'Généraliste', value: 28, color: '#82ca9d' },
    { name: 'Pédiatrie', value: 20, color: '#ffc658' },
    { name: 'Dermatologie', value: 17, color: '#ff7300' }
  ];

  const monthlyTrend = [
    { month: 'Jan', patients: 234, rdv: 456 },
    { month: 'Fév', patients: 267, rdv: 489 },
    { month: 'Mar', patients: 298, rdv: 523 },
    { month: 'Avr', patients: 321, rdv: 567 },
    { month: 'Mai', patients: 345, rdv: 612 },
    { month: 'Juin', patients: 367, rdv: 645 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports & Statistiques</h1>
          <p className="text-gray-600">Analyse des données et tendances de la clinique</p>
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
          <CardTitle>Paramètres du rapport</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Type de rapport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointments">Rendez-vous</SelectItem>
                <SelectItem value="patients">Patients</SelectItem>
                <SelectItem value="doctors">Médecins</SelectItem>
                <SelectItem value="revenue">Revenus</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" placeholder="Date début" />
            <Input type="date" placeholder="Date fin" />
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              RDV ce mois
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Nouveaux patients
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taux de réalisation
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Satisfaction moyenne
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendez-vous par jour */}
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous par jour</CardTitle>
            <CardDescription>Programmés vs Réalisés cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rdv" fill="#8884d8" name="Programmés" />
                <Bar dataKey="completed" fill="#82ca9d" name="Réalisés" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance par médecin */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par médecin</CardTitle>
            <CardDescription>Patients et rendez-vous ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={doctorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="patients" fill="#8884d8" name="Patients uniques" />
                <Bar dataKey="rdv" fill="#82ca9d" name="Total RDV" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par spécialité */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par spécialité</CardTitle>
            <CardDescription>Pourcentage des consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={specialityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {specialityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Évolution mensuelle */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution mensuelle</CardTitle>
            <CardDescription>Croissance des patients et rendez-vous</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="patients" stroke="#8884d8" name="Patients" />
                <Line type="monotone" dataKey="rdv" stroke="#82ca9d" name="Rendez-vous" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
