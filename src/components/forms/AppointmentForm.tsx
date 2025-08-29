
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface AppointmentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  speciality?: string;
  role: string;
}

interface Service {
  id: number;
  nom: string;
  prix: number;
}

const AppointmentForm = ({ onSubmit, onCancel, initialData }: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    patient: initialData?.patient || '',
    doctor: initialData?.doctor || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    service: initialData?.service || '',
    motif: initialData?.motif || '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'confirme'
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Charger les données depuis l'API
  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      setDataLoading(true);
      
      // Vérifier si l'utilisateur est connecté
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour créer un rendez-vous",
          variant: "destructive",
        });
        return;
      }
      
      // Charger les patients
      const patientsData = await apiService.getPatients();
      console.log('Patients data:', patientsData); // Debug log
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      
      // Charger les médecins
      const doctorsData = await apiService.getDoctors();
      console.log('Doctors data:', doctorsData); // Debug log
      setDoctors(Array.isArray(doctorsData) ? doctorsData as any : []);
      
      // Charger les services
      const servicesData = await apiService.getActiveServices();
      console.log('Services data:', servicesData); // Debug log
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error);
      
      if (error.message?.includes('401') || error.message?.includes('403')) {
        toast({
          title: "Erreur d'authentification",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du formulaire",
          variant: "destructive",
        });
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient || !formData.doctor || !formData.date || !formData.time || !formData.service) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Préparer les données pour l'API
      const appointmentData = {
        patient: parseInt(formData.patient),
        docteur: parseInt(formData.doctor),
        service: parseInt(formData.service),
        date_confirmee: `${formData.date}T${formData.time}:00`,
        message: formData.motif,
        notes: formData.notes,
        statut: formData.status
      };

      // Appeler l'API pour créer le rendez-vous
      const response = await apiService.createRendezVous(appointmentData);
      
      toast({
        title: "Succès",
        description: "Rendez-vous créé avec succès !",
      });
      
      onSubmit(response);
    } catch (error: any) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création du rendez-vous",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

        <DialogTitle className="text-center text-lg">
          {initialData ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
        </DialogTitle>
        <DialogDescription className="text-center">
          {initialData ? 'Modifiez les informations du rendez-vous' : 'Créez un nouveau rendez-vous pour un patient'}
        </DialogDescription>
      </DialogHeader>

      {dataLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2">Chargement des données...</span>
        </div>
      ) : patients.length === 0 && doctors.length === 0 && services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Aucune donnée disponible</h3>
            <p className="text-gray-600 mb-4">
              Impossible de charger les patients, médecins ou services.
            </p>
            <p className="text-sm text-gray-500">
              Vérifiez votre connexion et réessayez.
            </p>
          </div>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations Patient et Médecin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patient">Patient *</Label>
            <Select value={formData.patient} onValueChange={(value) => setFormData({...formData, patient: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                  {Array.isArray(patients) && patients.map((patient: any) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.user?.first_name} {patient.user?.last_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
              <Label htmlFor="doctor">Professionnel consulté *</Label>
            <Select value={formData.doctor} onValueChange={(value) => setFormData({...formData, doctor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le médecin" />
              </SelectTrigger>
              <SelectContent>
                  {Array.isArray(doctors) && doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      Dr. {doctor.first_name} {doctor.last_name} {doctor.speciality ? `- ${doctor.speciality}` : ''}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date et Heure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input 
                id="date"
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required 
            />
          </div>

          <div>
            <Label htmlFor="time">Heure *</Label>
            <Input 
                id="time"
              type="time" 
              value={formData.time} 
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required 
            />
          </div>
        </div>

          {/* Service demandé */}
        <div>
            <Label htmlFor="service">Service demandé *</Label>
          <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le service" />
            </SelectTrigger>
            <SelectContent>
                  {Array.isArray(services) && services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.nom} - {service.prix} F
                    </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

          {/* Motif de consultation */}
        <div>
          <Label htmlFor="motif">Motif de la consultation</Label>
          <Textarea 
              id="motif"
            placeholder="Décrivez le motif de la consultation..."
            value={formData.motif}
            onChange={(e) => setFormData({...formData, motif: e.target.value})}
            rows={3}
          />
        </div>

          {/* Notes complémentaires */}
        <div>
          <Label htmlFor="notes">Notes complémentaires</Label>
          <Textarea 
              id="notes"
            placeholder="Notes supplémentaires..."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
          />
        </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
            Annuler
          </Button>
            <Button
              type="submit"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #6C2476 0%, #B0368B 100%)' }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création...
                </>
              ) : (
                'Créer le rendez-vous'
              )}
          </Button>
        </div>
      </form>
      )}
    </DialogContent>
  );
};

export default AppointmentForm;
