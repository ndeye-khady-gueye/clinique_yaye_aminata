
import { Button } from "@/components/ui/button";
import { Calendar, Award, Users, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section id="accueil" className="relative bg-gradient-soft py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">Excellence médicale</span>
            <br />
            <span className="text-gray-800">à votre service</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            Depuis plus de 25 ans, la Clinique Yaye Aminata offre des soins de qualité supérieure 
            avec une approche humaine et personnalisée pour chaque patient.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button size="lg" className="bg-gradient-clinic hover:opacity-90 text-white px-8 py-3 text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Prendre rendez-vous
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg">
              Découvrir nos services
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center animate-fade-in">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-clinic">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">25+</div>
              <div className="text-gray-600">Années d'expérience</div>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-clinic">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary">50+</div>
              <div className="text-gray-600">Professionnels</div>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-clinic">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-gray-600">Patients soignés</div>
            </div>
            
            <div className="text-center animate-fade-in">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-clinic">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary">24/7</div>
              <div className="text-gray-600">Service d'urgence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
