
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Menu, X, Heart, Phone, Mail } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Fermer le menu mobile après navigation
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-gradient-clinic text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <Phone size={14} />
              +221 33 XXX XX XX
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} />
              contact@clinique-yaye-aminata.sn
            </span>
          </div>
          <div className="hidden md:block">
            <span>Horaires : Lun-Ven 8h-18h | Sam 8h-12h</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-primary">Clinique Yaye Aminata</h1>
            <p className="text-xs text-gray-600">Excellence médicale depuis 1995</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection('accueil')} className="text-gray-700 hover:text-primary transition-colors">Accueil</button>
          <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-primary transition-colors">Services</button>
          <button onClick={() => scrollToSection('equipe')} className="text-gray-700 hover:text-primary transition-colors">Notre équipe</button>
          <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-primary transition-colors">Contact</button>
          <Button 
            className="bg-gradient-clinic hover:opacity-90 text-white"
            onClick={() => scrollToSection('rendez-vous')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Prendre RDV
          </Button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button onClick={() => scrollToSection('accueil')} className="block text-gray-700 hover:text-primary transition-colors">Accueil</button>
            <button onClick={() => scrollToSection('services')} className="block text-gray-700 hover:text-primary transition-colors">Services</button>
            <button onClick={() => scrollToSection('equipe')} className="block text-gray-700 hover:text-primary transition-colors">Notre équipe</button>
            <button onClick={() => scrollToSection('contact')} className="block text-gray-700 hover:text-primary transition-colors">Contact</button>
            <Button 
              className="w-full bg-gradient-clinic hover:opacity-90 text-white"
              onClick={() => scrollToSection('rendez-vous')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Prendre RDV
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
