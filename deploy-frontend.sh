#!/bin/bash

# Script de déploiement pour le frontend
# Usage: ./deploy-frontend.sh

echo "🚀 Déploiement du frontend sur cabinetyayeaminata.com"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci

# Construire l'application pour la production
echo "🔨 Construction de l'application..."
npm run build

# Vérifier que le build a réussi
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Le build a échoué. Le dossier dist n'existe pas."
    exit 1
fi

echo "✅ Build terminé avec succès!"
echo "📁 Dossier de déploiement: ./dist"
echo ""
echo "📋 Instructions de déploiement:"
echo "1. Uploadez le contenu du dossier 'dist' vers votre serveur web"
echo "2. Configurez votre serveur web pour servir les fichiers statiques"
echo "3. Configurez les redirections pour l'API backend"
echo ""
echo "🌐 URL de production: https://cabinetyayeaminata.com"
echo "🔗 API Backend: https://cabinetyayeaminata.com/api"
