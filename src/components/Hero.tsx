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
      {/* Contenu animé */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight fade-in-up">
            CABINET<br />
            YAYE AMINATA
          </h1>

          <p className="text-xl mb-4 opacity-90 fade-in-up delay-1">
            Votre santé, notre priorité. Bienvenu dans un cabinet
            <br />
            où compassion et excellence se rencontrent.
          </p>

          <Button
            size="lg"
            className="hover:opacity-90 text-white px-8 py-3 text-lg rounded-full fade-in-up delay-2"
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
