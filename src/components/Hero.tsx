
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="accueil" className="relative h-screen bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: "linear-gradient(rgba(108, 36, 118, 0.7), rgba(176, 54, 139, 0.7)), url('/lovable-uploads/19d4fdac-9077-4b24-8006-3bb2b0251a3f.png')"
    }}>
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            CABINET<br />
            YAYE AMINATA
          </h1>
          
          <p className="text-xl mb-4 opacity-90">
            Votre santé notre priorité thérapeutique 24h et clinique
          </p>
          
          <p className="text-lg mb-8 opacity-80">
            De compassion et excellence se rencontrent
          </p>

          <Button 
            size="lg" 
            className="bg-gradient-clinic hover:opacity-90 text-white px-8 py-3 text-lg rounded-full"
            onClick={() => scrollToSection('rendez-vous')}
          >
            Rendez-vous
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
