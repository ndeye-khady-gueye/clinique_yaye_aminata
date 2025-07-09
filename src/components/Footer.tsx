
import { Heart, Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              
              <div>
                <h3 className="text-xl font-bold">Cabinet Yaye Aminata</h3>
                <p className="text-sm text-gray-400">Excellence médicale depuis 2025</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Le Cabinet Yaye Aminata s'engage à fournir des soins de santé de qualité supérieure 
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
              <li><a href="#" className="hover:text-primary transition-colors">Suivi de Grossesse</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Préparation à la Naissance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Monitoring Fœtal</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Education à la Santé durant la grossesse</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Soin Post Natal</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Echographie</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Planification Familiale</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Dépistage Cancer : Sein / Col de l'utérus</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Traitement des IST</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vaccination</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Conslutation Générale</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Conslutation en ligne</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Espace Conseils adoléscents et jeunes </a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Cité Jaeaaf 2 , Rufisque Nord<br />Route centrale élétrique kounoune District de Sangalkam</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span>+221 33 893 47 89 - 78 437 01 01 </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span>cabinetyayeaminata25@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <div>Lun-Ven: 8h-18h</div>
                  <div>Sam: 8h-16h</div>
                  <div>Urgences: 24h/24</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Cabinet Yaye Aminata. Tous droits réservés.
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
