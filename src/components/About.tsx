import { Button } from "@/components/ui/button";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const About = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          
          {/* Image animée */}
          <div className="relative fade-in-left order-2 lg:order-1">
            <img 
              src="/lovable-uploads/femmes.jpg" 
              alt="Consultation médicale" 
              className="rounded-lg shadow-lg w-full h-64 sm:h-80 object-cover"
            />
          </div>

          {/* Texte animé */}
          <div className="fade-in-up delay-1 order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-gray-800">
              Une maternité sereine,<br />
              un avenir en santé
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Dès le suivi de votre grossesse et tout au long de la vie de votre famille, nous sommes à vos côtés avec bienveillance et expertise. Pour vous offrir, à vous et à vos enfants, l'attention et les soins que vous méritez.
            </p>
            
            <Button 
              onClick={() => scrollToSection('services')}
              className="hover:opacity-90 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full fade-in-up delay-2 w-full sm:w-auto"
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
