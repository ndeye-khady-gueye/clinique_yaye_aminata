
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Award, Clock, Users, Stethoscope } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Humanité",
      description: "Une approche bienveillante et empathique avec chaque patient"
    },
    {
      icon: Shield,
      title: "Excellence",
      description: "Des soins de qualité supérieure avec les meilleures technologies"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Une équipe pluridisciplinaire qui travaille ensemble"
    },
    {
      icon: Award,
      title: "Innovation",
      description: "À la pointe des dernières avancées médicales"
    }
  ];

  const milestones = [
    { year: "1995", event: "Fondation de la Clinique Yaye Aminata" },
    { year: "2000", event: "Ouverture du service de cardiologie" },
    { year: "2005", event: "Création du bloc opératoire moderne" },
    { year: "2010", event: "Inauguration du service d'urgences 24h/24" },
    { year: "2015", event: "Certification ISO pour la qualité des soins" },
    { year: "2020", event: "Digitalisation complète des services" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Histoire */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-gradient">Notre histoire</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Depuis 1995, la Clinique Yaye Aminata s'est imposée comme une référence en matière de soins de santé 
            au Sénégal. Née de la vision du Dr. Yaye Aminata DIOP, notre établissement a toujours placé 
            l'excellence médicale et l'humanité au cœur de sa mission.
          </p>
          <div className="bg-gradient-soft rounded-2xl p-8">
            <p className="text-lg text-gray-700 italic">
              "Notre mission est de fournir des soins de santé exceptionnels dans un environnement 
              chaleureux et bienveillant, en combinant expertise médicale et technologies de pointe 
              pour le bien-être de nos patients."
            </p>
            <p className="text-primary font-semibold mt-4">- Dr. Yaye Aminata DIOP, Fondatrice</p>
          </div>
        </div>

        {/* Valeurs */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="text-gradient">Nos valeurs</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={value.title}
                  className="text-center border-0 shadow-clinic hover-scale transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="bg-gradient-soft rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold mb-3 text-gray-800">{value.title}</h4>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="text-gradient">Nos étapes clés</span>
          </h3>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div 
                key={milestone.year}
                className="flex items-center mb-8 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-clinic text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm mr-6 flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="bg-gradient-soft rounded-lg p-4 flex-1">
                  <p className="text-gray-700 font-medium">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chiffres clés */}
        <div className="bg-gradient-soft rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="text-gradient">La clinique en chiffres</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-gray-600">Années d'expérience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">10,000+</div>
              <div className="text-gray-600">Patients soignés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Professionnels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">15</div>
              <div className="text-gray-600">Spécialités médicales</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
