
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import consultations from '@/assets/images/consultations.jpg';
import grosPlan from '@/assets/images/gros-plan-d-un-garcon-se-faisant-examiner.jpg';
import vacciner from '@/assets/images/vacciner.jpg';
import infirmiere from '@/assets/images/infirmiere-afro-americaine-et-femme-enceinte-parlant.jpg';
import photoMadameDaouda from '@/assets/images/photo-madame-daouda.jpg';

const Services = () => {
  const services = [
    {
      title: "Consultations de routine",
      description: "Un petit souci de santé 7 jrs sur 7 pour vous écouter et vous rassurer",
      image: consultations,
      featured: false
    },
    {
      title: "Maladies chroniques",
      description: "Ensemble, on veille sur vous, jours après jours",
      image: grosPlan,
      featured: true
    },
    {
      title: "Vaccinations",
      description: "Un petit piqûre pour une grande protection",
      image: vacciner,
      featured: false
    },
    {
      title: "Bilans de santé",
      description: "Juste un petit contrôle pour prendre soin de vous",
      image: infirmiere,
      featured: false
    },
    
  ];

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
            Nos Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className={`hover-scale cursor-pointer transition-all duration-300 ${
                service.featured ? 'border-2 border-blue-400' : 'border-0'
              } shadow-lg hover:shadow-xl`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg mb-3 sm:mb-4"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-primary">{service.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{service.description}</p>
                <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-white text-xs sm:text-sm py-2">
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
