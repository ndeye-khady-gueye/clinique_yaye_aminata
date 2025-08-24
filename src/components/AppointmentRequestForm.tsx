import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface Service {
  id: number;
  code: string;
  nom: string;
  description: string;
  prix: number;
  duree_consultation: number;
}

const AppointmentRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const [formData, setFormData] = useState({
    client_nom: "",
    client_email: "",
    client_telephone: "",
    service: "",
    message: "",
    date_souhaitee: ""
  });

  const [errors, setErrors] = useState({
    client_nom: "",
    client_email: "",
    client_telephone: "",
    service: "",
    message: "",
    date_souhaitee: ""
  });

  // Charger les services depuis l'API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services/');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      client_nom: "",
      client_email: "",
      client_telephone: "",
      service: "",
      message: "",
      date_souhaitee: ""
    };

    // Validation du nom (3-50 caractères)
    if (!formData.client_nom) {
      newErrors.client_nom = "Le nom est requis";
    } else if (formData.client_nom.length < 3 || formData.client_nom.length > 50) {
      newErrors.client_nom = "Le nom doit contenir entre 3 et 50 caractères";
    }

    // Validation de l'email ou téléphone (au moins un)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+221|221)?[0-9]{9}$/;
    
    if (!formData.client_email && !formData.client_telephone) {
      newErrors.client_email = "Vous devez fournir au moins un email ou un numéro de téléphone";
    } else {
      if (formData.client_email && !emailRegex.test(formData.client_email)) {
        newErrors.client_email = "L'email n'est pas valide";
      }
      if (formData.client_telephone && !phoneRegex.test(formData.client_telephone)) {
        newErrors.client_telephone = "Le numéro de téléphone n'est pas valide";
      }
    }

    // Validation du service
    if (!formData.service) {
      newErrors.service = "Le service est requis";
    }

    // Validation de la date souhaitée (optionnelle mais si fournie, doit être future)
    if (formData.date_souhaitee) {
      const selectedDate = new Date(formData.date_souhaitee);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.date_souhaitee = "La date souhaitée doit être dans le futur";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/rendez-vous/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessMessage(true);
        toast({
          title: "Succès !",
          description: "Votre demande de rendez-vous a été envoyée. Nous vous contacterons bientôt.",
        });
        
        // Réinitialiser le formulaire
        setFormData({
          client_nom: "",
          client_email: "",
          client_telephone: "",
          service: "",
          message: "",
          date_souhaitee: ""
        });
        
        // Masquer le message après 5 secondes
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Une erreur s'est produite lors de l'envoi de votre demande.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-8 text-gray-900">
            Demande de Rendez-vous
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Remplissez ce formulaire pour demander un rendez-vous. Nous vous contacterons 
            dans les plus brefs délais pour confirmer votre rendez-vous.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Formulaire de Demande
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {showSuccessMessage ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Demande Envoyée !
                  </h3>
                  <p className="text-gray-600">
                    Votre demande de rendez-vous a été reçue. Nous vous contacterons 
                    bientôt pour confirmer votre rendez-vous.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Nom */}
                  <div>
                    <Label htmlFor="client_nom" className="flex items-center gap-2 text-lg font-semibold">
                      <User className="w-5 h-5" />
                      Nom et Prénom *
                    </Label>
                    <Input
                      id="client_nom"
                      placeholder="Votre nom et prénom"
                      value={formData.client_nom}
                      onChange={(e) => handleInputChange("client_nom", e.target.value)}
                      className={`h-14 text-lg border-2 mt-2 ${
                        errors.client_nom ? 'border-red-500' : 'border-gray-200'
                      } focus:border-blue-500 rounded-lg`}
                    />
                    {errors.client_nom && (
                      <p className="text-red-500 text-sm mt-2">{errors.client_nom}</p>
                    )}
                  </div>

                  {/* Email et Téléphone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client_email" className="flex items-center gap-2 text-lg font-semibold">
                        <Mail className="w-5 h-5" />
                        Email
                      </Label>
                      <Input
                        id="client_email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.client_email}
                        onChange={(e) => handleInputChange("client_email", e.target.value)}
                        className={`h-14 text-lg border-2 mt-2 ${
                          errors.client_email ? 'border-red-500' : 'border-gray-200'
                        } focus:border-blue-500 rounded-lg`}
                      />
                      {errors.client_email && (
                        <p className="text-red-500 text-sm mt-2">{errors.client_email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="client_telephone" className="flex items-center gap-2 text-lg font-semibold">
                        <Phone className="w-5 h-5" />
                        Téléphone
                      </Label>
                      <Input
                        id="client_telephone"
                        type="tel"
                        placeholder="+221 77 123 45 67"
                        value={formData.client_telephone}
                        onChange={(e) => handleInputChange("client_telephone", e.target.value)}
                        className={`h-14 text-lg border-2 mt-2 ${
                          errors.client_telephone ? 'border-red-500' : 'border-gray-200'
                        } focus:border-blue-500 rounded-lg`}
                      />
                      {errors.client_telephone && (
                        <p className="text-red-500 text-sm mt-2">{errors.client_telephone}</p>
                      )}
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <Label htmlFor="service" className="flex items-center gap-2 text-lg font-semibold">
                      <MessageSquare className="w-5 h-5" />
                      Service souhaité *
                    </Label>
                    <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                      <SelectTrigger className={`h-14 text-lg border-2 mt-2 ${
                        errors.service ? 'border-red-500' : 'border-gray-200'
                      } focus:border-blue-500 rounded-lg`}>
                        <SelectValue placeholder="Choisissez un service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.nom} - {service.prix} FCFA
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && (
                      <p className="text-red-500 text-sm mt-2">{errors.service}</p>
                    )}
                  </div>

                  {/* Date souhaitée */}
                  <div>
                    <Label htmlFor="date_souhaitee" className="flex items-center gap-2 text-lg font-semibold">
                      <Calendar className="w-5 h-5" />
                      Date souhaitée (optionnel)
                    </Label>
                    <Input
                      id="date_souhaitee"
                      type="datetime-local"
                      value={formData.date_souhaitee}
                      onChange={(e) => handleInputChange("date_souhaitee", e.target.value)}
                      className={`h-14 text-lg border-2 mt-2 ${
                        errors.date_souhaitee ? 'border-red-500' : 'border-gray-200'
                      } focus:border-blue-500 rounded-lg`}
                    />
                    {errors.date_souhaitee && (
                      <p className="text-red-500 text-sm mt-2">{errors.date_souhaitee}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="flex items-center gap-2 text-lg font-semibold">
                      <MessageSquare className="w-5 h-5" />
                      Message (optionnel)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Décrivez brièvement votre situation ou vos besoins..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={4}
                      className={`text-lg border-2 mt-2 ${
                        errors.message ? 'border-red-500' : 'border-gray-200'
                      } focus:border-blue-500 rounded-lg resize-none`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-2">{errors.message}</p>
                    )}
                  </div>

                  {/* Bouton d'envoi */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      "Envoyer ma demande"
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    * Champs obligatoires. Nous vous contacterons dans les 24h pour confirmer votre rendez-vous.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AppointmentRequestForm;
