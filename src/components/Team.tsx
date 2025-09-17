
import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, Shield, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import yaye from '@/assets/images/yaye.jpg';
import photoMadameDaouda from '@/assets/images/photo-madame-daouda.jpg';

const Team = () => {
  const [stats, setStats] = useState({
    satisfaction: 0,
    disponibilite: 0,
    experience: 0
  });

  // Animation des chiffres avec défilement continu
  useEffect(() => {
    const finalValues = {
      satisfaction: 100,
      disponibilite: 24,
      experience: 15
    };
    
    // Démarrer l'animation après 1 seconde
    const timer = setTimeout(() => {
      let currentSatisfaction = 0;
      let currentDisponibilite = 0;
      let currentExperience = 0;
      let isAnimating = true;
      
      const animate = () => {
        if (!isAnimating) return;
        
        // Incrémenter les valeurs progressivement
        if (currentSatisfaction < finalValues.satisfaction) {
          currentSatisfaction += 2;
        }
        if (currentDisponibilite < finalValues.disponibilite) {
          currentDisponibilite += 1;
        }
        if (currentExperience < finalValues.experience) {
          currentExperience += 1;
        }
        
        setStats({
          satisfaction: Math.min(currentSatisfaction, finalValues.satisfaction),
          disponibilite: Math.min(currentDisponibilite, finalValues.disponibilite),
          experience: Math.min(currentExperience, finalValues.experience)
        });
        
        // Continuer l'animation indéfiniment
        setTimeout(animate, 100); // 100ms entre chaque étape
      };
      
      animate();
      
      // Nettoyer l'animation au démontage du composant
      return () => {
        isAnimating = false;
      };
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);


  const teamMembers = [
    {
      name: "Mme. Diasse SECK",
      role: "Sage-femme",
      experience: "15+ années d'expérience",
      expertise: [
        "Diplômée de l'École Supérieure Internationale des Praticiens de la Santé de Thiès",
        "Diplôme d'État de Sage-femme",
        "Diplôme en Échographie Obstétricale - Université Gaston Berger",
        "Ex-Coordinatrice régionale Marie Stopes International",
        "Fondatrice du Cabinet Yaye Aminata (Février 2025)",
        "Spécialisée en santé sexuelle et reproductive",
        "Soins accessibles aux populations vulnérables"
      ],
      image: photoMadameDaouda
    }
  ];

  return (
    <section id="equipe" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        



        {/* Équipe */}
        <div className="mb-16">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-8 text-gray-900">
            Notre équipe
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Une équipe dédiée à votre bien-être, combinant expertise médicale et approche humaine 
            pour vous offrir les meilleurs soins possibles.
          </p>
        </div>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              {teamMembers.map((member, index) => (
                <Card 
                  key={member.name}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-64 lg:h-full object-cover"
                      />
                    </div>
                    <div className="lg:w-2/3 p-8">
                      <h4 className="text-2xl font-bold mb-2 text-gray-800">{member.name}</h4>
                      <p className="text-primary font-semibold text-lg mb-2">{member.role}</p>
                      <p className="text-gray-600 mb-4 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {member.experience}
                      </p>
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-800 mb-2">Parcours & Expertise :</h5>
                        <div className="space-y-2">
                          {member.expertise.map((skill) => (
                            <div 
                              key={skill}
                              className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-primary text-sm rounded-lg border-l-4 border-primary"
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement - Image de fond avec overlay */}
        <div className="relative py-16 overflow-hidden">
          {/* Image de fond */}
          <div className="absolute inset-0">
            <img 
              src={yaye}
              alt="Consultations médicales"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay avec couleur principale */}
          <div className="absolute inset-0 bg-primary bg-opacity-80"></div>
          
          {/* Contenu */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-all duration-1000">
                  {stats.satisfaction}%
                </div>
                <div className="w-12 h-0.5 bg-white mx-auto mb-2"></div>
                <div className="text-white text-sm font-medium">Satisfaction patient</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-all duration-1000">
                  {stats.disponibilite}h
                </div>
                <div className="w-12 h-0.5 bg-white mx-auto mb-2"></div>
                <div className="text-white text-sm font-medium">Disponibilité</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 transition-all duration-1000">
                  {stats.experience}+
                </div>
                <div className="w-12 h-0.5 bg-white mx-auto mb-2"></div>
                <div className="text-white text-sm font-medium">Années d'expérience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
