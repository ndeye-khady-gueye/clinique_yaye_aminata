
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Menu, X, Heart, Phone, Mail } from "lucide-react";
import logo from '@/assets/images/Logo_page-0001.jpg';

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
      {/* Main navigation - Responsive */}
      <nav className="container-responsive py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt="Logo Clinique"
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
              />
            </div>
            {/* Nom de la clinique - Masqué sur très petits écrans */}
            <div className="hidden sm:block">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold text-primary">
                CABINET YAYE AMINATA
              </h1>
            </div>
          </div>

          {/* Desktop Navigation - Responsive */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <button 
              onClick={() => scrollToSection('accueil')} 
              className="text-gray-700 hover:text-primary transition-colors font-medium text-sm xl:text-base"
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-700 hover:text-primary transition-colors font-medium text-sm xl:text-base"
            >
              À propos
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-gray-700 hover:text-primary transition-colors font-medium text-sm xl:text-base"
            >
              Nos services
            </button>
            <button 
              onClick={() => scrollToSection('equipe')} 
              className="text-gray-700 hover:text-primary transition-colors font-medium text-sm xl:text-base"
            >
              Notre Équipe
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-gray-700 hover:text-primary transition-colors font-medium text-sm xl:text-base"
            >
              Nous contacter
            </button>
            <Button 
              className="hover:opacity-90 text-white rounded-full px-4 xl:px-6 py-2 text-sm xl:text-base"
              onClick={handleLoginClick}
            >
              Se connecter
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary transition-colors"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Menu - Responsive avec overlay */}
        {isMenuOpen && (
          <div className="lg:hidden">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleMenu}
            />
            
            {/* Menu mobile */}
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 rounded-b-lg">
              <div className="px-4 py-6 space-y-4">
                <button 
                  onClick={() => scrollToSection('accueil')} 
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Accueil
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  À propos
                </button>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Nos services
                </button>
                <button 
                  onClick={() => scrollToSection('equipe')} 
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Notre Équipe
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="block w-full text-left text-gray-700 hover:text-primary transition-colors font-medium py-2"
                >
                  Nous contacter
                </button>
                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    className="w-full hover:opacity-90 text-white rounded-full"
                    onClick={handleLoginClick}
                  >
                    Se connecter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
