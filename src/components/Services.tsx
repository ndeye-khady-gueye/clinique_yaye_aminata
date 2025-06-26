
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      title: "Consultations de routine",
      description: "Un petit souci de santé 7 jrs sur 7 pour vous écouter et vous rassurer",
      image: "/lovable-uploads/consultations.jpg",
      featured: false
    },
    {
      title: "Maladies chroniques",
      description: "Ensemble, on veille sur vous, jours après jours",
      image: "/lovable-uploads/gros-plan-d-un-garcon-se-faisant-examiner.jpg",
      featured: true
    },
    {
      title: "Vaccinations",
      description: "Un petit piqûre pour une grande protection",
      image: "/lovable-uploads/vacciner.jpg",
      featured: false
    },
    {
      title: "Bilans de santé",
      description: "Juste un petit contrôle pour prendre soin de vous",
      image: "/lovable-uploads/infirmiere-afro-americaine-et-femme-enceinte-parlant.jpg",
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
        
      </div>
    </section>
  );
};

export default Services;
