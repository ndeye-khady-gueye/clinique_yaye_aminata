
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
      
    </section>
  );
};

export default AppointmentForm;
