
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Mail, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AppointmentForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    date: '',
    time: ''
  });

  const specialties = [
    'Médecine générale',
    'Cardiologie', 
    'Neurologie',
    'Ophtalmologie',
    'Pédiatrie',
    'Chirurgie',
    'Dermatologie',
    'Gynécologie'
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.specialty || !formData.date || !formData.time) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Simulation d'envoi à l'API
    console.log('Données du formulaire:', formData);
    
    toast({
      title: "Rendez-vous demandé !",
      description: "Votre demande a été envoyée. Nous vous contacterons sous 24h pour confirmer.",
    });

    // Reset du formulaire
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialty: '',
      date: '',
      time: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Date minimum : aujourd'hui
  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Prendre rendez-vous</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Réservez votre consultation en quelques clics. Nous vous contacterons pour confirmer votre rendez-vous.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-clinic border-0">
            <CardHeader className="bg-gradient-clinic text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                <Calendar className="mr-3 h-6 w-6" />
                Formulaire de rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="mr-2 h-4 w-4" />
                      Prénom *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Votre prénom"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="mr-2 h-4 w-4" />
                      Nom *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Votre nom"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="mr-2 h-4 w-4" />
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+221 XX XXX XX XX"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Mail className="mr-2 h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Spécialité */}
                <div>
                  <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Spécialité médicale *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('specialty', value)} value={formData.specialty}>
                    <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Choisissez une spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date et heure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date souhaitée *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={today}
                      className="border-gray-300 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Clock className="mr-2 h-4 w-4" />
                      Heure souhaitée *
                    </Label>
                    <Select onValueChange={(value) => handleInputChange('time', value)} value={formData.time}>
                      <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                        <SelectValue placeholder="Choisissez un créneau" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-clinic hover:opacity-90 text-white py-3 text-lg font-medium"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Demander un rendez-vous
                </Button>

                <div className="text-center text-sm text-gray-500 mt-4">
                  * Champs obligatoires<br />
                  Nous vous contacterons sous 24h pour confirmer votre rendez-vous
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
