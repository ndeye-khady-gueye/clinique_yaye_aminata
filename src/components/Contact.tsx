
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Car, Bus, Navigation } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      details: ["Avenue Cheikh Anta Diop", "Dakar, Sénégal", "Face à l'Université"]
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: ["+221 33 XXX XX XX", "+221 77 XXX XX XX", "Urgences 24h/24"]
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@clinique-yaye-aminata.sn", "urgences@clinique-yaye-aminata.sn", "info@clinique-yaye-aminata.sn"]
    },
    {
      icon: Clock,
      title: "Horaires",
      details: ["Lun-Ven: 8h00 - 18h00", "Samedi: 8h00 - 12h00", "Urgences: 24h/24, 7j/7"]
    }
  ];

  const transportOptions = [
    {
      icon: Car,
      title: "En voiture",
      description: "Parking gratuit disponible pour les patients"
    },
    {
      icon: Bus,
      title: "Transport public",
      description: "Arrêt de bus à 50m, lignes 8, 15, 23"
    },
    {
      icon: Navigation,
      title: "GPS",
      description: "Coordonnées: 14.6928° N, 17.4467° W"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Nous contacter</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions 
            et vous accompagner dans vos démarches de soins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-gradient">Informations de contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card 
                    key={info.title}
                    className="border-0 shadow-clinic hover-scale transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-clinic rounded-full w-12 h-12 flex items-center justify-center mr-4">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">{info.title}</h4>
                      </div>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm mb-1">{detail}</p>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Map placeholder */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-gradient">Localisation</h3>
            <div className="bg-white rounded-2xl shadow-clinic p-8 text-center">
              <MapPin className="h-24 w-24 text-primary mx-auto mb-6" />
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Clinique Yaye Aminata</h4>
              <p className="text-gray-600 mb-6">
                Située au cœur de Dakar, notre clinique est facilement accessible 
                par tous les moyens de transport.
              </p>
              <Button className="bg-gradient-clinic hover:opacity-90 text-white">
                <Navigation className="mr-2 h-4 w-4" />
                Obtenir l'itinéraire
              </Button>
            </div>
          </div>
        </div>

        {/* Transport Options */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8 text-gradient">Comment nous rejoindre</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={option.title}
                  className="text-center border-0 shadow-clinic hover-scale transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="bg-gradient-soft rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">{option.title}</h4>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl shadow-clinic p-8 text-center">
          <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Phone className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-red-600">Urgences médicales</h3>
          <p className="text-gray-600 mb-6">
            En cas d'urgence médicale, notre équipe est disponible 24h/24 et 7j/7.
            N'hésitez pas à nous contacter immédiatement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Phone className="mr-2 h-4 w-4" />
              Appeler les urgences
            </Button>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
              WhatsApp +221 77 XXX XX XX
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
