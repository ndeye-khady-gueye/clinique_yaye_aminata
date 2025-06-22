
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Lock, Calendar, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Données simulées de l'historique patient
  const patientHistory = [
    {
      id: 1,
      date: '2024-01-10',
      doctor: 'Dr. Fatou Diop',
      type: 'Consultation cardiologie',
      status: 'completed',
      canDownload: true
    },
    {
      id: 2,
      date: '2023-12-15',
      doctor: 'Dr. Aminata Fall',
      type: 'Consultation générale',
      status: 'completed',
      canDownload: true
    },
    {
      id: 3,
      date: '2023-11-20',
      doctor: 'Dr. Fatou Diop',
      type: 'Suivi cardiologique',
      status: 'completed',
      canDownload: false
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    // Logique de sauvegarde du profil
    toast({
      title: 'Profil mis à jour',
      description: 'Vos informations ont été sauvegardées avec succès.',
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.',
        variant: 'destructive'
      });
      return;
    }
    
    // Logique de changement de mot de passe
    toast({
      title: 'Mot de passe modifié',
      description: 'Votre mot de passe a été mis à jour avec succès.',
    });
    
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleDownloadReport = (reportId: number) => {
    toast({
      title: 'Téléchargement en cours',
      description: 'Le rapport médical va être téléchargé.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles et votre historique médical
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Modifiez vos informations de base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveProfile} className="bg-gradient-clinic hover:opacity-90">
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Modifier
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Modifiez votre mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            <Button onClick={handleChangePassword} className="w-full">
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Historique médical pour les patients */}
      {user?.role === 'patient' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Historique médical
            </CardTitle>
            <CardDescription>
              Vos consultations et rapports médicaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientHistory.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{visit.type}</p>
                      <p className="text-sm text-gray-600">{visit.doctor}</p>
                      <p className="text-sm text-gray-500">{visit.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Terminé
                    </span>
                    {visit.canDownload && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReport(visit.id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Rapport
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
