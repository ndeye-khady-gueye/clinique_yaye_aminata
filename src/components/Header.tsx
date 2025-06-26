
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
      
      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          
          <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
            <img
              src="/lovable-uploads/Logo_page-0001.jpg"
              alt="Logo Clinique"
              className="w-12 h-12 object-contain"
            />
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
            className=" hover:opacity-90 text-white rounded-full px-6"
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
    </header>
  );
};

export default Header;
