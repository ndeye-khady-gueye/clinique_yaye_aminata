
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Shield, Settings, Users, BarChart3 } from 'lucide-react';
import lolo2 from '@/assets/images/lolo2.jpg';

const AdminDashboard = () => {
  const { user } = useAuth();

  const handleRedirectToAdmin = () => {
    window.open('http://127.0.0.1:8000/admin/', '_blank');
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: '#F4E6F7' }}>
      {/* En-tête de bienvenue */}
      <div className="text-center">
        {/* Photo de l'équipe */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-primary/20">
              <img 
                src={lolo2}
                alt="Photo de l'équipe" 
                className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback vers l'image du dossier public
                e.currentTarget.src = '/lolo2.jpg';
              }}
            />
            <div className="w-full h-full bg-gradient-clinic flex items-center justify-center" style={{ display: 'none' }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">
          Bienvenue, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Administrateur Système</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Gérez votre système de gestion de clinique
        </p>
      </div>

      {/* Carte principale */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary dark:text-white mb-2">
            Administration Django
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Accédez à l'interface d'administration complète pour gérer tous les aspects de votre système
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Fonctionnalités disponibles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors" style={{ backgroundColor: '#B0368B' }}>
              <Users className="w-6 h-6 text-white mx-auto mb-2" />
              <h3 className="font-medium text-white mb-1">Gestion des Utilisateurs</h3>
              <p className="text-xs text-white/80">Créer, modifier et gérer les comptes utilisateurs</p>
            </div>
            
            <div className="text-center p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors" style={{ backgroundColor: '#B0368B' }}>
              <Settings className="w-6 h-6 text-white mx-auto mb-2" />
              <h3 className="font-medium text-white mb-1">Configuration Système</h3>
              <p className="text-xs text-white/80">Paramètres et configuration du système</p>
            </div>
            
            <div className="text-center p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors" style={{ backgroundColor: '#B0368B' }}>
              <BarChart3 className="w-6 h-6 text-white mx-auto mb-2" />
              <h3 className="font-medium text-white mb-1">Rapports & Statistiques</h3>
              <p className="text-xs text-white/80">Analyses et rapports détaillés</p>
            </div>
          </div>

          {/* Bouton d'accès */}
          <div className="text-center pt-4">
            <Button 
              onClick={handleRedirectToAdmin}
              size="lg"
              className="bg-gradient-clinic hover:opacity-90 text-white px-6 py-3 font-semibold"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Accéder à l'Administration Django
            </Button>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              L'administration s'ouvrira dans un nouvel onglet
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Informations supplémentaires */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">
              Système de Gestion de Clinique
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Interface d'administration complète pour la gestion des patients, rendez-vous, 
              utilisateurs et configuration du système de votre clinique.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
