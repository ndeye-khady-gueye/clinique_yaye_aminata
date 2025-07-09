
import { Card, CardContent } from "@/components/ui/card";
import { Award, GraduationCap, Users, MapPin } from "lucide-react";

const Team = () => {
  const doctors = [
    {
      name: "Mme. Daouda Seck",
      specialty: "Sage-femme",
      image: "DS",
      description: "Spécialiste en Sage femme, Mme. Seck dirige notre équipe avec excellence."
    },
    {
      name: "La Sécrétaire",
      specialty: "Infirmière",
      image: "LS",
      description: "Expert en soins infirmiers, elle assure un suivi de qualité pour chaque patient."
    },
    {
      name: "Dr. Samba Sarr",
      specialty: "Odontologie-Stomatologie",
      image: "SS",
      description: "Odontologue expérimenté, il assure des soins dentaires de qualité."
    }
    
  ];

  const stats = [
    { icon: Users, number: "50+", label: "Professionnels de santé" },
    { icon: Award, number: "1+", label: "Années d'expérience" },
    { icon: GraduationCap, number: "100%", label: "Médecins certifiés" },
    { icon: MapPin, number: "1er", label: "Cabinet Kounoune Central" }
  ];

  return (
    <section id="equipe" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Notre équipe médicale</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une équipe de professionnels qualifiés et expérimentés, formés dans les meilleures institutions 
            médicales du Sénégal, à votre service pour des soins d'excellence.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-gradient-soft rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <Card 
              key={doctor.name}
              className="hover-scale border-0 shadow-clinic hover:shadow-2xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-clinic rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {doctor.image}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{doctor.name}</h3>
                <p className="text-primary font-medium mb-2">{doctor.specialty}</p>
                <p className="text-sm text-gray-600 mb-2">{doctor.experience}</p>
                <p className="text-xs text-gray-500 mb-3">{doctor.education}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{doctor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-soft rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-gradient">Engagement qualité</h3>
            <p className="text-gray-600 mb-4">
              Tous nos médecins sont certifiés par l'Ordre des Médecins du Sénégal et participent 
              régulièrement à des formations continues pour maintenir leur expertise au plus haut niveau.
            </p>
            <p className="text-gray-600">
              Notre équipe pluridisciplinaire travaille en étroite collaboration pour vous offrir 
              une prise en charge globale et personnalisée.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
