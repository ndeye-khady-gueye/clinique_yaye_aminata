import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_confirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation du nom d'utilisateur
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    // Validation du prénom
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }

    // Validation du nom
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }

    // Validation du téléphone (optionnel mais si fourni, doit être valide)
    if (formData.phone.trim()) {
      const phoneRegex = /^(77|76|78|70|75)[0-9]{7}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Le numéro de téléphone n\'est pas valide';
      }
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    // Validation de la confirmation du mot de passe
    if (!formData.password_confirm) {
      newErrors.password_confirm = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(formData);
      
      if (success) {
        toast({
          title: 'Inscription réussie',
          description: 'Votre compte a été créé avec succès. Bienvenue !',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Erreur d\'inscription',
          description: 'Une erreur est survenue lors de la création de votre compte.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Gérer les erreurs spécifiques du backend
      if (error.message) {
        toast({
          title: 'Erreur d\'inscription',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erreur d\'inscription',
          description: 'Une erreur inattendue est survenue.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Flèche de retour vers l'accueil */}
      <div className="absolute top-6 right-6">
        <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Retour à l'accueil</span>
        </Link>
      </div>

      <div className="flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Logo et titre */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-primary">CABINET</h1>
              <p className="text-lg text-gray-600">YAYE AMINATA</p>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Créez votre compte patient
            </h2>
            <p className="text-gray-600 mb-6">
              Rejoignez notre plateforme pour prendre facilement vos rendez-vous médicaux
            </p>
            
            {/* Avantages */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Prise de rendez-vous en ligne</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Suivi de vos consultations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Accès à votre dossier médical</span>
              </div>
            </div>
          </div>

          {/* Formulaire d'inscription */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
              <CardDescription className="text-center">
                Remplissez le formulaire ci-dessous pour créer votre compte patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom d'utilisateur */}
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">Nom d'utilisateur</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="votre_nom_utilisateur"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Prénom et Nom */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-sm font-medium">Prénom</label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Votre prénom"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={errors.first_name ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {errors.first_name && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.first_name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-sm font-medium">Nom</label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={errors.last_name ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {errors.last_name && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Téléphone (optionnel)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="77 123 45 67"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirmation du mot de passe */}
                <div className="space-y-2">
                  <label htmlFor="password_confirm" className="text-sm font-medium">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password_confirm"
                      name="password_confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password_confirm}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.password_confirm ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password_confirm && (
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password_confirm}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Création du compte...' : 'Créer mon compte'}
                </Button>

                {/* Lien vers la connexion */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
