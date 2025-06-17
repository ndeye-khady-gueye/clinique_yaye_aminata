
import { Heart, Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-xl font-bold">Clinique Yaye Aminata</h3>
                <p className="text-sm text-gray-400">Excellence médicale depuis 1995</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              La Clinique Yaye Aminata s'engage à fournir des soins de santé de qualité supérieure 
              avec une approche humaine et personnalisée pour chaque patient.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-primary/20 p-2 rounded-full hover:bg-primary/30 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-primary/20 p-2 rounded-full hover:bg-primary/30 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-primary/20 p-2 rounded-full hover:bg-primary/30 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Nos Services</h4>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Cardiologie</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Neurologie</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pédiatrie</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ophtalmologie</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Urgences 24/7</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Chirurgie</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Avenue Cheikh Anta Diop<br />Dakar, Sénégal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+221 33 XXX XX XX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>contact@clinique-yaye-aminata.sn</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <div>Lun-Ven: 8h-18h</div>
                  <div>Sam: 8h-12h</div>
                  <div>Urgences: 24h/24</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Clinique Yaye Aminata. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
