
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Menu, X, Heart, Phone, Mail } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-gradient-clinic text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <Phone size={14} />
              (+221) 77 437 01 01
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} />
              cabinetyayeaminata25@gmail.com
            </span>
          </div>
          <div className="hidden md:block">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white text-primary hover:bg-gray-100 rounded-full"
              onClick={handleLoginClick}
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-clinic rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">CABINET</h1>
            <p className="text-xs text-gray-600 -mt-1">YAYE AMINATA</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollToSection('accueil')} className="text-gray-700 hover:text-primary transition-colors font-medium">Accueil</button>
          <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-primary transition-colors font-medium">À propos</button>
          <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-primary transition-colors font-medium">Nos services</button>
          <button onClick={() => scrollToSection('equipe')} className="text-gray-700 hover:text-primary transition-colors font-medium">Notre Équipe</button>
          <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-primary transition-colors font-medium">Nous contacter</button>
          <Button 
            className="bg-gradient-clinic hover:opacity-90 text-white rounded-full px-6"
            onClick={handleLoginClick}
          >
            Se connecter
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
            <button onClick={() => scrollToSection('about')} className="block text-gray-700 hover:text-primary transition-colors">À propos</button>
            <button onClick={() => scrollToSection('services')} className="block text-gray-700 hover:text-primary transition-colors">Nos services</button>
            <button onClick={() => scrollToSection('equipe')} className="block text-gray-700 hover:text-primary transition-colors">Notre Équipe</button>
            <button onClick={() => scrollToSection('contact')} className="block text-gray-700 hover:text-primary transition-colors">Nous contacter</button>
            <Button 
              className="w-full bg-gradient-clinic hover:opacity-90 text-white rounded-full"
              onClick={handleLoginClick}
            >
              Se connecter
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
