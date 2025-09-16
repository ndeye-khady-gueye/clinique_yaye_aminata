import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { contactApi } from "@/services/api";
import contactImage from "@/assets/images/contact.png";

const Contact = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fullText = "Contactez-nous";
  
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
    date_heure_souhaitee: ""
  });

  const [errors, setErrors] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
    date_heure_souhaitee: ""
  });

  // Animation de type curseur pour le titre
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        // Réinitialiser l'animation après 3 secondes
        setTimeout(() => {
          setDisplayText("");
          setCurrentIndex(0);
        }, 3000);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [currentIndex, fullText]);

  // Animation du curseur clignotant
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    return () => clearInterval(cursorTimer);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      nom: "",
      email: "",
      sujet: "",
      message: "",
      date_heure_souhaitee: ""
    };

    // Validation du nom (3-20 caractères)
    if (!formData.nom) {
      newErrors.nom = "Le nom est requis";
    } else if (formData.nom.length < 3 || formData.nom.length > 20) {
      newErrors.nom = "Le nom doit contenir entre 3 et 20 caractères";
    }

    // Validation de l'email ou téléphone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+221|221)?[0-9]{9}$/;
    
    if (!formData.email) {
      newErrors.email = "L'email ou téléphone est requis";
    } else if (!emailRegex.test(formData.email) && !phoneRegex.test(formData.email)) {
      newErrors.email = "L'email ou téléphone n'est pas valide";
    }

    // Validation du sujet
    if (!formData.sujet) {
      newErrors.sujet = "Le sujet est requis";
    }

    // Validation du message
    if (!formData.message) {
      newErrors.message = "Le message est requis";
    }

    // Validation de la date et heure (optionnelle)
    if (formData.date_heure_souhaitee) {
      const selectedDate = new Date(formData.date_heure_souhaitee);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.date_heure_souhaitee = "La date et heure doivent être dans le futur";
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await contactApi.createMessage({
        nom: formData.nom,
        email: formData.email,
        sujet: formData.sujet,
        message: formData.message,
        date_heure_souhaitee: formData.date_heure_souhaitee || null
      });

      toast({
        title: "Succès",
        description: "Votre demande de rendez-vous a été envoyée avec succès. Nous vous contacterons pour confirmer.",
      });

      // Afficher le message de succès
      setShowSuccessMessage(true);
      
      // Masquer le message après 5 secondes
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        email: "",
        sujet: "",
        message: "",
        date_heure_souhaitee: ""
      });
      setErrors({
        nom: "",
        email: "",
        sujet: "",
        message: "",
        date_heure_souhaitee: ""
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      
      // Gérer les erreurs de validation du backend
      if (error.message) {
        if (error.message.includes('nom')) {
          setErrors(prev => ({ ...prev, nom: error.message }));
        }
        if (error.message.includes('email')) {
          setErrors(prev => ({ ...prev, email: error.message }));
        }
        if (error.message.includes('sujet')) {
          setErrors(prev => ({ ...prev, sujet: error.message }));
        }
        if (error.message.includes('message')) {
          setErrors(prev => ({ ...prev, message: error.message }));
        }
        if (error.message.includes('date_heure_souhaitee')) {
          setErrors(prev => ({ ...prev, date_heure_souhaitee: error.message }));
        }
      }

      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    "Suivi de Grossesse",
    "Préparation à la Naissance",
    "Monitoring Fœtal",
    "Education à la Santé durant la grossesse",
    "Soin Post Natal",
    "Echographie",
    "Planification Familiale",
    "Dépistage Cancer : Sein / Col de l'utérus",
    "Traitement des IST",
    "Vaccination",
    "Consultation Générale",
    "Consultation en ligne",
    "Autre"
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 text-gray-900">
            <span className="inline-block">
              {displayText}
              <span 
                className={`inline-block w-1 h-6 sm:h-8 lg:h-12 bg-primary ml-1 transition-opacity duration-200 ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Pour toute question ou information supplémentaire, n'hésitez pas à nous 
            contacter. Nous sommes là pour vous aider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Formulaire de contact */}
          <div className="order-2 lg:order-1">
            <Card className="shadow-xl border-0 bg-white h-fit">
              <CardContent className="p-4 sm:p-6 lg:p-10">
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <div>
                    <Input
                      id="nom"
                      placeholder="Votre nom et prénom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      className={`h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-2 ${
                        errors.nom ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary rounded-lg`}
                    />
                    {errors.nom && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">{errors.nom}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Votre email ou numéro de téléphone"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-2 ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary rounded-lg`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Select value={formData.sujet} onValueChange={(value) => handleInputChange("sujet", value)}>
                      <SelectTrigger className={`h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-2 ${
                        errors.sujet ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary rounded-lg`}>
                        <SelectValue placeholder="Sujet du message" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.sujet && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">{errors.sujet}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      id="date_heure_souhaitee"
                      type="datetime-local"
                      placeholder="Date et heure souhaitée (optionnel)"
                      value={formData.date_heure_souhaitee}
                      onChange={(e) => handleInputChange("date_heure_souhaitee", e.target.value)}
                      className={`h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg border-2 ${
                        errors.date_heure_souhaitee ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary rounded-lg`}
                    />
                    {errors.date_heure_souhaitee && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">{errors.date_heure_souhaitee}</p>
                    )}
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      Si vous souhaitez un rendez-vous, indiquez une date et heure préférée
                    </p>
                  </div>

                  <div>
                    <Textarea
                      id="message"
                      placeholder="Votre message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={4}
                      className={`text-sm sm:text-base lg:text-lg border-2 ${
                        errors.message ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary rounded-lg resize-none`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-2">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-10 sm:h-12 lg:h-14 bg-gradient-clinic hover:opacity-90 text-white text-sm sm:text-base lg:text-lg font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            {/* Image de fond avec bordure bleue */}
            <div className="relative h-64 sm:h-80 lg:h-[600px] rounded-2xl overflow-hidden border-2 sm:border-4 border-primary transform lg:-translate-x-8 lg:translate-y-8">
              <img
                src={contactImage}
                alt="Contact"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
