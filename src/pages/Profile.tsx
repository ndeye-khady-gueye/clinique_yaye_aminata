import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, Lock, Calendar, FileText, Bell, Shield, Camera, Save, Loader2, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import apiService from '@/services/api';

interface PatientProfile {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  adresse: string;
  date_naissance: string;
  personne_contact: string;
  telephone_urgence: string;
  antecedents_medicaux: string;
  allergies: string;
  profession: string;
  situation_matrimoniale: string;
  nombre_enfants: number;
  groupe_sanguin: string;
  created_at: string;
  updated_at: string;
}

interface PatientAppointment {
  id: number;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  date_confirmee: string;
  date_souhaitee: string;
  statut: string;
  message: string;
  prix_consultation: number;
  docteur: {
    id: number;
    first_name: string;
    last_name: string;
    speciality: string;
  };
  service: {
    id: number;
    nom: string;
    description: string;
    prix: number;
  };
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    profession: '',
    situationMatrimoniale: '',
    nombreEnfants: '',
    groupeSanguin: ''
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

  // Charger les données du profil patient
  const loadPatientProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les informations du patient depuis l'API
      const patientData = await apiService.getPatientProfile();
      
      if (patientData) {
        setFormData({
          firstName: patientData.user?.first_name || '',
          lastName: patientData.user?.last_name || '',
          email: patientData.user?.email || '',
          phone: patientData.user?.phone || '',
          address: patientData.adresse || '',
          birthDate: patientData.date_naissance || '',
          emergencyContactName: patientData.personne_contact || '',
          emergencyContactPhone: patientData.telephone_urgence || '',
          medicalHistory: patientData.antecedents_medicaux || '',
          allergies: patientData.allergies || '',
          currentMedications: '', // Ce champ n'existe pas dans l'API actuelle
          profession: patientData.profession || '',
          situationMatrimoniale: patientData.situation_matrimoniale || '',
          nombreEnfants: patientData.nombre_enfants?.toString() || '',
          groupeSanguin: patientData.groupe_sanguin || ''
        });
      }

      // Récupérer les rendez-vous du patient
      const allAppointments = await apiService.getRendezVous();
      const appointmentsArray = Array.isArray(allAppointments) ? allAppointments : [];
      
      // Filtrer les rendez-vous du patient connecté
      const patientAppointments = appointmentsArray.filter(rdv => 
        rdv.client_email === user?.email || 
        rdv.patient?.user?.email === user?.email
      );

      setAppointments(patientAppointments);

    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError('Erreur lors du chargement de votre profil');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadPatientProfile();
  }, [user?.email]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation des champs requis
      if (!formData.address.trim()) {
        toast.error('L\'adresse est requise');
        return;
      }
      
      if (!formData.birthDate) {
        toast.error('La date de naissance est requise');
        return;
      }
      
      // Préparer les données à envoyer
      const updateData = {
        adresse: formData.address.trim(),
        date_naissance: formData.birthDate,
        personne_contact: formData.emergencyContactName.trim() || '',
        telephone_urgence: formData.emergencyContactPhone.trim() || '',
        antecedents_medicaux: formData.medicalHistory.trim() || '',
        allergies: formData.allergies.trim() || '',
        profession: formData.profession.trim() || '',
        situation_matrimoniale: formData.situationMatrimoniale || null,
        nombre_enfants: parseInt(formData.nombreEnfants) || 0,
        groupe_sanguin: formData.groupeSanguin.trim() || ''
      };

      console.log('Données envoyées au backend:', updateData);
      
      // Mettre à jour le profil via l'API
      await apiService.updatePatientProfile(updateData);

      toast.success('Profil mis à jour avec succès !');
      setIsEditing(false);
      
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      
      // Afficher des détails sur l'erreur
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          const errorMessages = Object.values(errorData).flat();
          toast.error(`Erreur de validation: ${errorMessages.join(', ')}`);
        } else {
          toast.error('Erreur de validation des données');
        }
      } else {
        toast.error('Erreur lors de la sauvegarde du profil');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await apiService.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      
      toast.success('Mot de passe mis à jour avec succès !');
    } catch (err) {
      console.error('Erreur lors du changement de mot de passe:', err);
      toast.error('Erreur lors du changement de mot de passe');
    }
  };

  // Obtenir les prochains rendez-vous
  const getUpcomingAppointments = () => {
    return appointments
      .filter(rdv => {
        const appointmentDate = new Date(rdv.date_confirmee || rdv.date_souhaitee);
        return appointmentDate > new Date() && rdv.statut === 'confirme';
      })
      .sort((a, b) => new Date(a.date_confirmee || a.date_souhaitee).getTime() - new Date(b.date_confirmee || b.date_souhaitee).getTime())
      .slice(0, 5);
  };

  // Obtenir l'historique médical récent
  const getRecentMedicalHistory = () => {
    return appointments
      .filter(rdv => rdv.statut === 'realise' || rdv.statut === 'termine')
      .sort((a, b) => new Date(b.date_confirmee || b.date_souhaitee).getTime() - new Date(a.date_confirmee || a.date_souhaitee).getTime())
      .slice(0, 5);
  };

  // Calculer les statistiques
  const getStats = () => {
    const currentYear = new Date().getFullYear();
    const yearAppointments = appointments.filter(rdv => {
      const appointmentDate = new Date(rdv.date_confirmee || rdv.date_souhaitee);
      return appointmentDate.getFullYear() === currentYear;
    });

    // Spécialité la plus fréquente
    const specialtyCount: { [key: string]: number } = {};
    appointments.forEach(rdv => {
      const specialty = rdv.docteur?.speciality || rdv.service?.nom || 'Non spécifiée';
      specialtyCount[specialty] = (specialtyCount[specialty] || 0) + 1;
    });

    const favoriteSpecialty = Object.entries(specialtyCount).reduce((a, b) => 
      specialtyCount[a[0]] > specialtyCount[b[0]] ? a : b, ['Non spécifiée', 0]
    );

    // Prochain RDV
    const nextAppointment = getUpcomingAppointments()[0];

    return {
      yearConsultations: yearAppointments.length,
      favoriteSpecialty: favoriteSpecialty[0],
      favoriteSpecialtyCount: favoriteSpecialty[1],
      nextAppointment: nextAppointment ? {
        date: new Date(nextAppointment.date_confirmee || nextAppointment.date_souhaitee),
        doctor: `Dr. ${nextAppointment.docteur?.first_name} ${nextAppointment.docteur?.last_name}`
      } : null
    };
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Formater l'heure
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={loadPatientProfile}>Réessayer</Button>
      </div>
    );
  }

  const upcomingAppointments = getUpcomingAppointments();
  const recentMedicalHistory = getRecentMedicalHistory();
  const stats = getStats();

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
          className={!isEditing ? "hover:opacity-90" : ""}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sauvegarde...
            </>
          ) : isEditing ? 'Annuler' : 'Modifier'}
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
                    {formData.firstName?.[0]}{formData.lastName?.[0]}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={formData.profession || ''}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="situationMatrimoniale">Situation matrimoniale</Label>
                    <Input
                      id="situationMatrimoniale"
                      value={formData.situationMatrimoniale || ''}
                      onChange={(e) => handleInputChange('situationMatrimoniale', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombreEnfants">Nombre d'enfants</Label>
                    <Input
                      id="nombreEnfants"
                      type="number"
                      value={formData.nombreEnfants || ''}
                      onChange={(e) => handleInputChange('nombreEnfants', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupeSanguin">Groupe sanguin</Label>
                    <Input
                      id="groupeSanguin"
                      value={formData.groupeSanguin || ''}
                      onChange={(e) => handleInputChange('groupeSanguin', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                {isEditing && (
                  <Button onClick={handleSave} className="bg-gradient-clinic hover:opacity-90" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
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
                  <Label htmlFor="emergencyContactName">Nom du contact</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContactPhone">Téléphone d'urgence</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
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
                {isEditing && (
                  <Button onClick={handleSave} className="bg-gradient-clinic hover:opacity-90" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Historique médical récent */}
            <Card>
              <CardHeader>
                <CardTitle>Historique médical récent</CardTitle>
              </CardHeader>
              <CardContent>
                {recentMedicalHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Aucun historique médical récent</p>
                ) : (
                  <div className="space-y-3">
                    {recentMedicalHistory.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{record.docteur?.speciality || record.service?.nom || 'Consultation'}</p>
                            <p className="text-sm text-gray-600">
                              Dr. {record.docteur?.first_name} {record.docteur?.last_name} - {formatDate(record.date_confirmee || record.date_souhaitee)}
                            </p>
                            <p className="text-sm text-gray-500">{record.message || 'Consultation médicale'}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
                {upcomingAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Aucun rendez-vous à venir</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Dr. {appointment.docteur?.first_name} {appointment.docteur?.last_name}
                            </p>
                            <p className="text-sm text-gray-600">{appointment.docteur?.speciality || appointment.service?.nom}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(appointment.date_confirmee || appointment.date_souhaitee)} à {formatTime(appointment.date_confirmee || appointment.date_souhaitee)}
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
                )}
              </CardContent>
            </Card>

            {/* Statistiques personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Cette année</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.yearConsultations}</div>
                  <p className="text-xs text-gray-500">consultations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Spécialité favorite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{stats.favoriteSpecialty}</div>
                  <p className="text-xs text-gray-500">{stats.favoriteSpecialtyCount} consultations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Prochain RDV</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.nextAppointment ? (
                    <>
                      <div className="text-lg font-bold">
                        {stats.nextAppointment.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </div>
                      <p className="text-xs text-gray-500">{stats.nextAppointment.doctor}</p>
                    </>
                  ) : (
                    <div className="text-lg font-bold text-gray-400">Aucun</div>
                  )}
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
                <PasswordChangeForm onPasswordChange={handlePasswordChange} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Composant pour le changement de mot de passe
const PasswordChangeForm = ({ onPasswordChange }: { onPasswordChange: (current: string, newPassword: string, confirm: string) => void }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordChange(currentPassword, newPassword, confirmPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input 
          id="currentPassword" 
          type="password" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input 
          id="newPassword" 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="bg-gradient-clinic hover:opacity-90">
        <Lock className="h-4 w-4 mr-2" />
        Mettre à jour le mot de passe
      </Button>
    </form>
  );
};

export default Profile;