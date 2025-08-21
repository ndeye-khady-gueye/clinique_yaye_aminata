import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

const Contact = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  const fullText = "Contactez-nous";
  
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: ""
  });

  const [errors, setErrors] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: ""
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
      message: ""
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

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    console.log("Formulaire envoyé:", formData);

    // Afficher le message de succès
    setShowSuccessMessage(true);
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    setFormData({
      nom: "",
      email: "",
      sujet: "",
      message: ""
    });
    setErrors({
      nom: "",
      email: "",
      sujet: "",
      message: ""
    });
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
    <section id="contact" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-8 text-gray-900">
            <span className="inline-block">
              {displayText}
              <span 
                className={`inline-block w-1 h-12 bg-primary ml-1 transition-opacity duration-200 ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Pour toute question ou information supplémentaire, n'hésitez pas à nous 
            contacter. Nous sommes là pour vous aider.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Formulaire de contact */}
          <div className="order-2 lg:order-1">
            <Card className="shadow-xl border-0 bg-white h-fit">
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div>
                    <Input
                      id="nom"
                      placeholder="Votre nom et prénom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      className={`h-14 text-lg border-2 ${
                        errors.nom ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary rounded-lg`}
                    />
                    {errors.nom && (
                      <p className="text-red-500 text-sm mt-2">{errors.nom}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Votre email ou numéro de téléphone"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`h-14 text-lg border-2 ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary rounded-lg`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Select value={formData.sujet} onValueChange={(value) => handleInputChange("sujet", value)}>
                      <SelectTrigger className={`h-14 text-lg border-2 ${
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
                      <p className="text-red-500 text-sm mt-2">{errors.sujet}</p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      id="message"
                      placeholder="Votre message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={6}
                      className={`text-lg border-2 ${
                        errors.message ? 'border-red-500' : 'border-gray-200'
                      } focus:border-primary rounded-lg resize-none`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-2">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full h-14 bg-gradient-clinic hover:opacity-90 text-white text-lg font-semibold rounded-lg transition-all duration-300"
                  >
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            {/* Image de fond avec bordure bleue */}
            <div className="relative lg:h-[600px] h-96 rounded-2xl overflow-hidden border-4 border-primary transform lg:-translate-x-8 lg:translate-y-8">
              <img
                src="/lovable-uploads/contact.png"
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