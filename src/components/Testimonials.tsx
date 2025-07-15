
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Fatou Diop",
      role: "Patiente depuis 1 mois",
      image: "FD",
      rating: 5,
      comment: "L'équipe de le Cabinet Yaye Aminata est exceptionnelle. J'ai toujours reçu des soins de qualité avec beaucoup d'attention et de professionnalisme."
    },
    {
      name: "Mamadou Sall",
      role: "Professeur",
      image: "MS",
      rating: 5,
      comment: "Grâce au service de consultation, ma santé s'est considérablement améliorée. Les médecins sont très compétents et à l'écoute."
    },
    {
      name: "Aissatou Ba",
      role: "Mère de famille",
      image: "AB",
      rating: 5,
      comment: "Le service planning familial est remarquable. L'équipe est à l'écoute et propose des solutions adaptées."
    }
  ];

  return (
    <section className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Témoignages</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que nos patients disent de leur expérience au Cabinet Yaye Aminata
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="hover-scale border-0 shadow-clinic hover:shadow-2xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Quote className="h-8 w-8 text-primary/20" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-clinic rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

     <div className="text-center mt-12">
  <div className="bg-white rounded-lg p-8 max-w-6xl mx-auto shadow-clinic transition-all duration-700 ease-in-out hover:scale-105">
    <h3 className="text-2xl font-semibold mb-4 text-gradient">Découvrez notre cabinet en vidéo</h3>
    <div className="overflow-hidden rounded-lg shadow-lg mb-4">
      <video
        className="w-full h-96 object-cover transition-transform duration-700 ease-in-out hover:scale-105"
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
    <p className="text-gray-600">
      Regardez cette vidéo pour en savoir plus sur nos services et notre équipe.
    </p>
  </div>
</div>




      </div>
    </section>
  );
};

export default Testimonials;
