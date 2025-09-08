import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="accueil"
      className="relative h-screen bg-cover bg-center bg-no-repeat bg-animated"
      style={{
        backgroundImage: "url('/lovable-uploads/2149117843.jpg')",
      }}
    >
      {/* Overlay pour améliorer la lisibilité sur mobile */}
      <div className="absolute inset-0 bg-black bg-opacity-30 sm:bg-opacity-20"></div>
      
      {/* Contenu animé - Responsive */}
      <div className="container-responsive h-full flex items-center relative z-10">
        <div className="max-w-2xl text-white text-center sm:text-left">
          {/* Titre principal - Responsive */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight fade-in-up">
            CABINET<br />
            YAYE AMINATA
          </h1>

          {/* Sous-titre - Responsive */}
          <p className="text-base xs:text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 fade-in-up delay-1 leading-relaxed">
            Un espace d'écoute, de bienveillance et d'accompagnement
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            pour vous et votre famille, à chaque étape de votre vie.
          </p>

          {/* Bouton CTA - Responsive */}
          <Button
            size="lg"
            className="hover:opacity-90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full fade-in-up delay-2 w-full sm:w-auto"
            onClick={() => scrollToSection('rendez-vous')}
          >
            Rendez-vous
          </Button>
        </div>
      </div>

      {/* Animation styles */}
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

        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
        }

        .delay-1 {
          animation-delay: 0.3s;
        }

        .delay-2 {
          animation-delay: 0.6s;
        }

        @keyframes zoomIn {
          0% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .bg-animated {
          animation: zoomIn 4s ease-in-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
