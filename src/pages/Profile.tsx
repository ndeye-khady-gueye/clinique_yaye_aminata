
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, Lock, Calendar, FileText, Bell, Shield, Camera, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '123 Rue de la Paix, Dakar',
    birthDate: '1985-03-15',
    emergencyContact: '+221 77 999 88 77',
    emergencyName: 'Marie Diallo',
    medicalHistory: 'Hypertension artérielle, Diabète type 2',
    allergies: 'Pénicilline, Fruits de mer',
    currentMedications: 'Metformine 500mg, Lisinopril 10mg'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    reminders: true,
    newsletter: false
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginNotifications: true
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    // Ici on intégrerait avec l'API
  };

  const medicalHistory = [
    { date: '2024-01-08', doctor: 'Dr. Fatou Diop', type: 'Cardiologie', diagnosis: 'Suivi hypertension' },
    { date: '2023-12-15', doctor: 'Dr. Aminata Fall', type: 'Généraliste', diagnosis: 'Consultation générale' },
    { date: '2023-11-22', doctor: 'Dr. Fatou Diop', type: 'Cardiologie', diagnosis: 'ECG de contrôle' },
    { date: '2023-10-18', doctor: 'Dr. Moussa Kane', type: 'Endocrinologie', diagnosis: 'Suivi diabète' }
  ];

  const upcomingAppointments = [
    { date: '2024-01-15', time: '14:00', doctor: 'Dr. Fatou Diop', type: 'Cardiologie' },
    { date: '2024-01-22', time: '10:30', doctor: 'Dr. Aminata Fall', type: 'Généraliste' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className={!isEditing ? "bg-gradient-clinic hover:opacity-90" : ""}
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personnel</TabsTrigger>
          <TabsTrigger value="medical">Médical</TabsTrigger>
          <TabsTrigger value="appointments">RDV</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* Informations personnelles */}
        <TabsContent value="personal">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo de profil */}
            <Card>
              <CardHeader>
                <CardTitle>Photo de profil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Informations de base */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Vos informations de base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Date de naissance</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
                {isEditing && (
                  <Button onClick={handleSave} className="bg-gradient-clinic hover:opacity-90">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact d'urgence */}
          <Card>
            <CardHeader>
              <CardTitle>Contact d'urgence</CardTitle>
              <CardDescription>Personne à contacter en cas d'urgence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Nom du contact</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyName}
                    onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Téléphone d'urgence</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Informations médicales */}
        <TabsContent value="medical">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations médicales</CardTitle>
                <CardDescription>Vos antécédents et informations de santé</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="medicalHistory">Antécédents médicaux</Label>
                  <Textarea
                    id="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Décrivez vos antécédents médicaux..."
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                    placeholder="Listez vos allergies connues..."
                  />
                </div>
                <div>
                  <Label htmlFor="currentMedications">Médicaments actuels</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Listez vos médicaments actuels..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Historique médical récent */}
            <Card>
              <CardHeader>
                <CardTitle>Historique médical récent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medicalHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{record.type}</p>
                          <p className="text-sm text-gray-600">{record.doctor} - {record.date}</p>
                          <p className="text-sm text-gray-500">{record.diagnosis}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rendez-vous */}
        <TabsContent value="appointments">
          <div className="space-y-6">
            {/* Prochains RDV */}
            <Card>
              <CardHeader>
                <CardTitle>Prochains rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.doctor}</p>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.date} à {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistiques personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Cette année</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-gray-500">consultations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Spécialité favorite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Cardiologie</div>
                  <p className="text-xs text-gray-500">5 consultations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Prochain RDV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">15 Jan</div>
                  <p className="text-xs text-gray-500">dans 3 jours</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>Gérez comment vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-gray-500">Recevez les confirmations et rappels par email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications SMS</Label>
                  <p className="text-sm text-gray-500">Recevez les rappels par SMS</p>
                </div>
                <Switch 
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rappels automatiques</Label>
                  <p className="text-sm text-gray-500">Rappels 24h avant vos rendez-vous</p>
                </div>
                <Switch 
                  checked={notifications.reminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reminders: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Newsletter</Label>
                  <p className="text-sm text-gray-500">Recevez nos actualités et conseils santé</p>
                </div>
                <Switch 
                  checked={notifications.newsletter}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newsletter: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de sécurité</CardTitle>
                <CardDescription>Gérez la sécurité de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire</p>
                  </div>
                  <Switch 
                    checked={security.twoFactor}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications de connexion</Label>
                    <p className="text-sm text-gray-500">Soyez alerté lors de nouvelles connexions</p>
                  </div>
                  <Switch 
                    checked={security.loginNotifications}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginNotifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="bg-gradient-clinic hover:opacity-90">
                  <Lock className="h-4 w-4 mr-2" />
                  Mettre à jour le mot de passe
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connexions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '2024-01-12 14:30', device: 'Chrome sur Windows', location: 'Dakar, Sénégal', current: true },
                    { date: '2024-01-11 09:15', device: 'Safari sur iPhone', location: 'Dakar, Sénégal', current: false },
                    { date: '2024-01-10 16:45', device: 'Chrome sur Android', location: 'Thiès, Sénégal', current: false }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <p className="text-sm text-gray-600">{session.location}</p>
                        <p className="text-xs text-gray-500">{session.date}</p>
                      </div>
                      <div>
                        {session.current ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Session actuelle
                          </span>
                        ) : (
                          <Button variant="outline" size="sm" className="text-red-600">
                            Déconnecter
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
