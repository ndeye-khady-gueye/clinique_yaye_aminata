
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue dans votre espace personnel',
      });
      navigate('/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@clinique.sn', password: '123456' },
    { role: 'Docteur', email: 'dr.diop@clinique.sn', password: '123456' },
    { role: 'Réceptionniste', email: 'reception@clinique.sn', password: '123456' },
    { role: 'Patient', email: 'patient@example.com', password: '123456' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Logo et titre */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
            <div className="w-46 h-46 rounded-full flex items-center justify-center overflow-hidden bounce-logo">
              <img
                src="/lovable-uploads/Logo_page-0001.jpg"
                alt="Logo Clinique"
                className="w-44 h-44 object-contain"
              />

              <style>{`
                @keyframes bounceUpDown {
                  0% {
                    transform: translateY(0px);
                  }
                  50% {
                    transform: translateY(20px);
                  }
                  100% {
                    transform: translateY(0px);
                  }
                }

                .bounce-logo {
                  animation: bounceUpDown 2s ease-in-out infinite;
                }
              `}</style>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-primary">CABINET</h1>
              <p className="text-lg text-gray-600">YAYE AMINATA</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Bienvenue dans votre espace médical
          </h2>
          <p className="text-gray-600">
            Connectez-vous pour accéder à votre tableau de bord personnalisé
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Se connecter</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full  hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            {/* Comptes de démonstration */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 text-center">Comptes de démonstration :</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {demoAccounts.map((account, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                    }}
                  >
                    <p className="font-medium text-primary">{account.role}</p>
                    <p className="text-gray-600">{account.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
