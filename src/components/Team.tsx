
import { Card, CardContent } from "@/components/ui/card";
import { Award, Clock, Shield, Heart } from "lucide-react";
import { useState, useEffect } from "react";

const Team = () => {
  const [stats, setStats] = useState({
    satisfaction: 0,
    disponibilite: 0,
    experience: 0
  });

  // Animation des chiffres avec mouvement continu
  useEffect(() => {
    const animateNumbers = () => {
      setStats({
        satisfaction: Math.floor(Math.random() * 20) + 85, // 85-105%
        disponibilite: Math.floor(Math.random() * 4) + 22, // 22-26h
        experience: Math.floor(Math.random() * 3) + 14 // 14-17+
      });
    };
    
    // Animation initiale
    const initialTimer = setTimeout(() => {
      setStats({
        satisfaction: 98,
        disponibilite: 24,
        experience: 15
      });
    }, 500);
    
    // Animation continue toutes les 200ms (rapide)
    const intervalTimer = setInterval(() => {
      animateNumbers();
    }, 200);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);


  const teamMembers = [
    {
      name: "Mme. Daouda Seck",
      role: "Sage-femme",
      experience: "15+ années d'expérience",
      expertise: ["Suivi de grossesse", "Accouchement", "Soins post-natals"],
      image: "/lovable-uploads/lolo.jpg"
    },
    {
      name: "Dr. Samba Sarr",
      role: "Odontologue",
      experience: "12+ années d'expérience", 
      expertise: ["Soins dentaires", "Chirurgie orale", "Prévention"],
      image: "/lovable-uploads/lolo2.jpg"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                      <h5 className="font-semibold text-gray-800 mb-2">Expertise :</h5>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill) => (
                          <span 
                            key={skill}
                            className="px-3 py-1 bg-gradient-soft text-primary text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Engagement - Image de fond avec overlay */}
        <div className="relative py-16 overflow-hidden">
          {/* Image de fond */}
          <div className="absolute inset-0">
            <img 
              src="/lovable-uploads/yaye.jpg" 
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
