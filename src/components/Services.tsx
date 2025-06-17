
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      title: "Consultations de routine",
      description: "Un petit souci de santé 7 jrs sur 7 pour vous écouter et vous rassurer",
      image: "/lovable-uploads/233aa0b2-d473-4595-99da-0c7c560bf772.png",
      featured: false
    },
    {
      title: "Maladies chroniques",
      description: "Ensemble, on veille sur vous, jours après jours",
      image: "/lovable-uploads/233aa0b2-d473-4595-99da-0c7c560bf772.png",
      featured: true
    },
    {
      title: "Vaccinations",
      description: "Un petit piqûre pour une grande protection",
      image: "/lovable-uploads/233aa0b2-d473-4595-99da-0c7c560bf772.png",
      featured: false
    },
    {
      title: "Bilans de santé",
      description: "Juste un petit contrôle pour prendre soin de vous",
      image: "/lovable-uploads/233aa0b2-d473-4595-99da-0c7c560bf772.png",
      featured: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Nos Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className={`hover-scale cursor-pointer transition-all duration-300 ${
                service.featured ? 'border-2 border-blue-400' : 'border-0'
              } shadow-lg hover:shadow-xl`}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-white">
                  Voir plus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* À Propos de Nous section */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">À Propos de Nous</h3>
          
          <div className="mb-8">
            <h4 className="text-2xl font-semibold mb-4 text-primary">Notre Histoire</h4>
            <div className="space-y-4 text-gray-600">
              <p>
                La clinique yaye aminata, autrefois « Clinique de la Vision » a été inaugurée en 2012. Elle était principalement axée sur la médecine oculaire.
              </p>
              <p>
                Depuis quelques années, la clinique a décidé d'élargir ses horizons en accueillant d'autres spécialistes médicaux à offrir à la population un site garantissant des soins de qualité dans un cadre chaleureux et humain.
              </p>
              <p>
                C'est ainsi qu'en 2018, la Clinique de la Vision devient la Clinique yaye aminata et accueillant dans son enceinte des cardiologues, traumatologues, chirurgiens ORL, oncologues, etc.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-semibold mb-6 text-primary">Notre Équipe</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: "Responsable", image: "/lovable-uploads/233aa0b2-d473-4595-99da-0c7c560bf772.png" },
                { title: "Médecin général", image: "/lovable-uploads/233aa0b2-d473-4595-99da-0c7c560bf772.png" },
                { title: "Infirmière", image: "/lovable-uploads/233aa0b2-d473-4595-99da-0c7c560bf772.png" },
                { title: "Sage femme", image: "/lovable-uploads/233aa0b2-d473-4595-99da-0c7c560bf772.png" }
              ].map((member, index) => (
                <div key={member.title} className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 overflow-hidden">
                    <img src={member.image} alt={member.title} className="w-full h-full object-cover" />
                  </div>
                  <h5 className="font-semibold text-gray-800">{member.title}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
