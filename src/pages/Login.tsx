import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [identifier, setIdentifier] = useState(''); // email ou téléphone
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  const fullText = "Bienvenue dans votre espace médical";
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Animation de type curseur pour le titre
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        setTimeout(() => {
          setDisplayText("");
          setCurrentIndex(0);
        }, 3000);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [currentIndex, fullText]);

  // Animation du curseur clignotant
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    return () => clearInterval(cursorTimer);
  }, []);

  // Étape 1 : Validation de l'identifiant
  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('handleIdentifierSubmit - identifier:', identifier); // Debug log

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(77|76|78|70|75)[0-9]{7}$/;
    
    if (!identifier) {
      setError("L'email ou téléphone est requis");
      return;
    }
    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      setError("L'email ou téléphone n'est pas valide");
      return;
    }

    console.log('Identifier validated, moving to step 2'); // Debug log
    setCurrentStep(2); // passage à l'étape mot de passe
  };

  // Étape 2 : Validation + login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('handleSubmit - current identifier:', identifier); // Debug log

    if (!identifier || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    console.log('Login attempt with identifier:', identifier); // Debug log
    
    const success = await login(identifier, password);
    
    if (success) {
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue dans votre espace personnel',
      });
      navigate('/dashboard');
    } else {
      setError('Email/téléphone ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Flèche de retour vers l'accueil - Responsive */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <Link to="/" className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-primary transition-colors">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm">Retour à l'accueil</span>
        </Link>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-center">
          
          {/* Logo et titre - Responsive */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">CABINET</h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600">YAYE AMINATA</p>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
              <span className="inline-block">
                {displayText}
                <span 
                  className={`inline-block w-0.5 sm:w-1 h-6 sm:h-8 bg-primary ml-1 transition-opacity duration-200 ${
                    showCursor ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Connectez-vous pour accéder à votre tableau de bord personnalisé
            </p>
          </div>

          {/* Formulaire de connexion - Responsive */}
          <Card className="w-full order-1 lg:order-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl text-center">Se connecter</CardTitle>
              <CardDescription className="text-center text-sm sm:text-base">
                Entrez vos identifiants pour accéder à votre compte
              </CardDescription>
              
              {/* Indicateur d'étapes */}
              <div className="flex items-center justify-center mt-4">
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      1
                    </div>
                    <span className={`text-xs font-medium mt-1 ${
                      currentStep >= 1 ? 'text-primary' : 'text-gray-500'
                    }`}>
                      Identification
                    </span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      2
                    </div>
                    <span className={`text-xs font-medium mt-1 ${
                      currentStep >= 2 ? 'text-primary' : 'text-gray-500'
                    }`}>
                      Mot de passe
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {currentStep === 1 ? (
                // Étape 1 : Identification - Responsive
                <form onSubmit={handleIdentifierSubmit} className="form-responsive">
                  <div className="space-y-2">
                    <label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                      Email ou numéro de téléphone
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="votre@email.com ou 771234567"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="input-responsive pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    {error && (
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full hover:opacity-90 btn-responsive"
                    disabled={isLoading}
                  >
                    Continuer
                  </Button>
                </form>
              ) : (
                // Étape 2 : Mot de passe - Responsive
                <form onSubmit={handleSubmit} className="form-responsive">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-responsive pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="break-words">{error}</span>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full hover:opacity-90 btn-responsive"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
