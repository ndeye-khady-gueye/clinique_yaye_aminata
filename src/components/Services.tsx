
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Brain, Eye, Baby, Zap, Stethoscope, Activity, Pill } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Heart,
      title: "Cardiologie",
      description: "Diagnostic et traitement des maladies cardiovasculaires avec équipements de pointe",
      color: "text-red-500"
    },
    {
      icon: Brain,
      title: "Neurologie",
      description: "Prise en charge des troubles neurologiques par des spécialistes expérimentés",
      color: "text-purple-500"
    },
    {
      icon: Eye,
      title: "Ophtalmologie",
      description: "Soins oculaires complets, chirurgie et correction de la vision",
      color: "text-blue-500"
    },
    {
      icon: Baby,
      title: "Pédiatrie",
      description: "Soins dédiés aux enfants dans un environnement adapté et bienveillant",
      color: "text-pink-500"
    },
    {
      icon: Zap,
      title: "Urgences",
      description: "Service d'urgence 24h/24, 7j/7 avec équipe médicale spécialisée",
      color: "text-orange-500"
    },
    {
      icon: Stethoscope,
      title: "Médecine générale",
      description: "Consultations générales et suivi médical personnalisé",
      color: "text-green-500"
    },
    {
      icon: Activity,
      title: "Chirurgie",
      description: "Bloc opératoire moderne pour interventions chirurgicales sécurisées",
      color: "text-indigo-500"
    },
    {
      icon: Pill,
      title: "Pharmacie",
      description: "Pharmacie interne avec médicaments de qualité et conseil pharmaceutique",
      color: "text-teal-500"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Nos services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une gamme complète de services médicaux pour répondre à tous vos besoins de santé
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.title} 
                className="hover-scale cursor-pointer border-0 shadow-clinic hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-soft rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Besoin d'un service spécialisé ?</p>
          <button className="text-primary hover:text-secondary transition-colors font-medium">
            Voir tous nos services →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
