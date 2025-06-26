
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
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    console.log("Message envoyé:", formData);
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
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
              <h3 className="text-2xl font-bold mb-4 text-primary">POUR TOUT URGENCE</h3>
              <h4 className="text-3xl font-bold mb-6 text-primary">Nous Contacter</h4>
              
              <p className="text-gray-600 mb-8">
                La Clinique de famille est une clinique pluridisciplinaire. Des médecins spécialisés sont présents en permanence et elle dispose d'un laboratoire afin de réaliser les analyses les plus fréquentes.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">APPELEZ NOUS</p>
                    <p className="text-gray-800 font-bold">(+221) 77 437 01 01</p>
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
                    <p className="text-gray-800">sedima côté rond point</p>
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
                    <Label htmlFor="name">Votre Nom(obligatoire)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Votre Adresse Mail(obligatoire)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Objet</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Votre Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={6}
                      required
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className=" hover:opacity-90 text-white px-8 py-3 rounded-full"
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
