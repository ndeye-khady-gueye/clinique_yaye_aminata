
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
            
            {/* Section Google Maps professionnelle */}
            <div className="mt-8 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">Notre localisation</h5>
                  <p className="text-xs text-gray-300">Cabinet Yaye Aminata</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-300">4.7 (19 avis)</span>
                </div>
                <a 
                  href="https://www.google.com/viewer/place?client=mobilesearchapp&sca_esv=55b51c43d294a49c&bih=768&biw=375&channel=iss&cs=0&hl=fr&rlz=1MDAPLA_frSN1108SN1108&v=373.1.772062114&output=search&mid=/g/11yg1g28fn&pip=CgdjYWJpbmV0EAI%3D&lqi=ChBjYWJpbmV0IGtvdW5vdW5lSLTDhJe4vYCACFoYEAAYABgBIhBjYWJpbmV0IGtvdW5vdW5lkgEObWVkaWNhbF9jZW50ZXKqAUYQASoLIgdjYWJpbmV0KAQyHxABIhvua2ZFhwJMRUccWjN7S3JYqENUX4EO4hCK4S4yFBACIhBjYWJpbmV0IGtvdW5vdW5l&phdesc=XbvXxAwuCC0&sa=X&sqi=2&ved=2ahUKEwj5t8Wu7rmOAxVvNfsDHaTaH5oQkbkFegQIGRAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-300 flex items-center space-x-1"
                >
                  <span>Voir</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
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
