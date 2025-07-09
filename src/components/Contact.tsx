import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: "",
    telephone: "",
    motif: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifications
    const ageNumber = parseInt(formData.age, 10);
    const telNumber = formData.telephone;

    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.age ||
      !formData.telephone ||
      !formData.motif
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(ageNumber) || ageNumber <= 0) {
      toast({
        title: "Erreur",
        description: "L'âge doit être un nombre positif.",
        variant: "destructive"
      });
      return;
    }

    if (!/^\d{9}$/.test(telNumber)) {
      toast({
        title: "Erreur",
        description: "Le numéro de téléphone doit contenir exactement 9 chiffres.",
        variant: "destructive"
      });
      return;
    }

    console.log("Formulaire envoyé:", formData);

    toast({
      title: "Formulaire envoyé",
      description: "Votre demande a été envoyée avec succès. Nous vous recontacterons rapidement.",
    });

    setFormData({
      nom: "",
      prenom: "",
      age: "",
      telephone: "",
      motif: ""
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Pour prendre rendez-vous
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">POUR TOUTE URGENCE</h3>
              <h4 className="text-3xl font-bold mb-6 text-primary">Nous Contacter</h4>

              <p className="text-gray-600 mb-8">
                Le Cabinet de Famille est un cabinet pluridisciplinaire. Des médecins spécialistes y sont présents en permanence pour assurer un suivi médical complet et de qualité.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">APPELEZ NOUS</p>
                    <p className="text-gray-800 font-bold">(+221) 78 437 01 01 - 33 893 47 89</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">EMAIL</p>
                    <p className="text-gray-800">cabinetyayeaminata25@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Adresse</p>
                    <p className="text-gray-800">Cité Jaraaf 2, Rufisque Nord, Route Centrale Électrique Kounoune</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div>
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange("nom", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input
                      id="prenom"
                      value={formData.prenom}
                      onChange={(e) => handleInputChange("prenom", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Âge</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telephone">Numéro de téléphone</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange("telephone", e.target.value)}
                      required
                      className="mt-2"
                      maxLength={9}
                    />
                  </div>

                  <div>
                    <Label htmlFor="motif">Motif de la visite</Label>
                    <Textarea
                      id="motif"
                      value={formData.motif}
                      onChange={(e) => handleInputChange("motif", e.target.value)}
                      rows={4}
                      required
                      className="mt-2"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="hover:opacity-90 text-white px-8 py-3 rounded-full"
                  >
                    Envoyer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
