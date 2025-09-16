
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Heart, Shield, Clock } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Fatou Diop",
      role: "Patiente",
      image: "/lovable-uploads/femmes.jpg",
      rating: 5,
      comment: "L'équipe du Cabinet Yaye Aminata est exceptionnelle. J'ai toujours reçu des soins de qualité avec beaucoup d'attention et de professionnalisme. Je recommande vivement !",
      service: "Suivi de grossesse"
    },
    {
      name: "Mamadou Sall",
      role: "Professeur",
      image: "/lovable-uploads/consultations.jpg",
      rating: 5,
      comment: "Grâce au service de consultation, ma santé s'est considérablement améliorée. Les médecins sont très compétents et à l'écoute de mes besoins.",
      service: "Consultation générale"
    },
    {
      name: "Aissatou Ba",
      role: "Mère de famille",
      image: "/lovable-uploads/gros-plan-d-un-garcon-se-faisant-examiner.jpg",
      rating: 5,
      comment: "Le service planning familial est remarquable. L'équipe est à l'écoute et propose des solutions adaptées à chaque situation.",
      service: "Planning familial"
    }
  ];



  return (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 text-gray-900">
            Ce que disent nos patients
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez les témoignages de nos patients qui font confiance à notre équipe 
            pour leurs soins de santé et leur bien-être.
          </p>
        </div>

        {/* Témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-0">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
            >
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                  "{testimonial.comment}"
                </p>
                
                <div className="border-t border-gray-100 pt-3 sm:pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base lg:text-lg">{testimonial.name}</h4>
                      <p className="text-gray-500 text-xs sm:text-sm">{testimonial.role}</p>
                    </div>
                    <span className="inline-block px-2 sm:px-3 py-1 bg-gradient-soft text-primary text-xs sm:text-sm rounded-full font-medium w-fit">
                      {testimonial.service}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vidéo de présentation - Style Senelec */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
              {/* Colonne gauche - Vidéo */}
              <div className="relative order-2 lg:order-1">
                <div className="bg-primary w-2 sm:w-4 h-full absolute left-0 top-0"></div>
                <div className="pl-4 sm:pl-6 lg:pl-8 pr-2 sm:pr-4">
                  <div className="overflow-hidden rounded-xl shadow-lg">
                    <video
                      className="w-full h-48 sm:h-64 lg:h-96 object-cover"
                      controls
                      controlsList="nodownload"
                      autoPlay
                      muted
                      loop
                    >
                      <source src="/lovable-uploads/Video.mp4" type="video/mp4" />
                      Votre navigateur ne supporte pas la vidéo.
                    </video>
                  </div>
                </div>
              </div>

              {/* Colonne droite - Texte */}
              <div className="p-4 sm:p-6 lg:p-8 relative order-1 lg:order-2">
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2 border-gray-300 border-dotted rounded-lg"></div>
                </div>
                
                <div className="relative z-10">
                  <span className="inline-block px-2 sm:px-3 py-1 bg-gradient-soft text-primary text-xs sm:text-sm rounded-full mb-3 sm:mb-4">
                    Notre Mission
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl lg:text-4xl font-bold text-primary mb-4 sm:mb-6">
                    MOT DE LA RESPONSABLE
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                    <p>
                      C'est avec un grand plaisir que je vous souhaite la bienvenue au Cabinet Yaye Aminata. Notre mission est de vous offrir des soins de santé de qualité dans un environnement bienveillant et professionnel.
                    </p>
                    <p>
                      Que vous soyez enceinte et en quête d'un suivi de grossesse, en recherche de conseils en planning familial, ou simplement pour une consultation générale, notre équipe pluridisciplinaire est là pour vous accompagner à chaque étape de votre vie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
