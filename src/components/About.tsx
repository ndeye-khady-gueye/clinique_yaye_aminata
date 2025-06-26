import { Button } from "@/components/ui/button";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const About = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image animée */}
          <div className="relative fade-in-left">
            <img 
              src="/lovable-uploads/femmes.jpg" 
              alt="Consultation médicale" 
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>

          {/* Texte animé */}
          <div className="fade-in-up delay-1">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Une maternité sereine,<br />
              un avenir en santé
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              De la première échographie aux soins de toute la famille, nous vous accompagnons avec douceur et expertise à chaque étape de la vie. Parce que votre bien-être et celui de vos petits méritent toute notre attention.
            </p>
            
            <Button 
              onClick={() => scrollToSection('services')}
              className="hover:opacity-90 text-white px-8 py-3 rounded-full fade-in-up delay-2"
            >
              Voir le contenu
            </Button>
          </div>
        </div>
      </div>

      {/* Animation CSS intégrée */}
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.9s ease-out forwards;
        }

        .fade-in-left {
          opacity: 0;
          animation: fadeInLeft 0.9s ease-out forwards;
        }

        .delay-1 {
          animation-delay: 0.3s;
        }

        .delay-2 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
};

export default About;
