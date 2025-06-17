
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AppointmentForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    date: "",
    time: "",
    message: ""
  });

  const specialties = [
    "Cardiologie",
    "Neurologie", 
    "Ophtalmologie",
    "Pédiatrie",
    "Chirurgie générale",
    "Médecine générale",
    "Urgences"
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.specialty || !formData.date || !formData.time) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Simulation d'envoi (ici vous intégreriez l'API Django)
    console.log("Données du rendez-vous:", formData);
    
    toast({
      title: "Rendez-vous demandé",
      description: "Votre demande de rendez-vous a été envoyée. Nous vous contacterons sous 24h.",
    });

    // Reset du formulaire
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialty: "",
      date: "",
      time: "",
      message: ""
    });
  };

  return (
    <section id="rendez-vous" className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Prendre rendez-vous</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Réservez votre consultation en quelques clics. Notre équipe vous contactera pour confirmer votre rendez-vous.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-clinic border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                <Calendar className="h-6 w-6" />
                Formulaire de rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Prénom *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nom *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="votre.email@exemple.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+221 XX XXX XX XX"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Spécialité médicale *</Label>
                  <Select value={formData.specialty} onValueChange={(value) => handleInputChange("specialty", value)}>
                    <SelectTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date souhaitée *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Heure souhaitée *
                    </Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                      <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message (optionnel)
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Décrivez brièvement le motif de votre consultation..."
                    rows={4}
                  />
                </div>

                <div className="text-center pt-4">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-gradient-clinic hover:opacity-90 text-white px-12 py-3 text-lg"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Envoyer ma demande
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              <strong>En urgence ?</strong> Appelez directement le service d'urgence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                <Phone className="mr-2 h-4 w-4" />
                Urgences : +221 33 XXX XX XX
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Mail className="mr-2 h-4 w-4" />
                contact@clinique-yaye-aminata.sn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
