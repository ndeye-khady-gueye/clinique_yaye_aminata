#!/bin/bash

# Script de déploiement complet pour le frontend React
# Usage: ./deploy-frontend-complete.sh

echo "🚀 Déploiement complet du frontend React - Cabinet Yaye Aminata"
echo "================================================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Erreur: Node.js n'est pas installé."
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ Erreur: npm n'est pas installé."
    exit 1
fi

echo "📦 Installation des dépendances..."
npm ci --production=false

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances."
    exit 1
fi

echo "🔨 Construction de l'application pour la production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la construction de l'application."
    exit 1
fi

# Vérifier que le build a réussi
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Le build a échoué. Le dossier dist n'existe pas."
    exit 1
fi

# Calculer la taille du build
BUILD_SIZE=$(du -sh dist | cut -f1)
echo "📊 Taille du build: $BUILD_SIZE"

# Compter les fichiers
FILE_COUNT=$(find dist -type f | wc -l)
echo "📁 Nombre de fichiers: $FILE_COUNT"

echo ""
echo "✅ Build terminé avec succès!"
echo "📁 Dossier de déploiement: ./dist"
echo ""

# Créer un fichier de vérification
cat > dist/deployment-info.txt << EOF
Cabinet Yaye Aminata - Frontend React
=====================================

Date de build: $(date)
Version: $(node -p "require('./package.json').version")
Node.js: $(node --version)
NPM: $(npm --version)

Fichiers inclus:
- index.html (point d'entrée)
- assets/ (CSS, JS, images, vidéos)
- robots.txt
- placeholder.svg

Instructions de déploiement:
1. Copiez tout le contenu du dossier 'dist' vers votre serveur web
2. Configurez votre serveur web pour servir index.html pour toutes les routes
3. Configurez les redirections pour l'API backend
4. Testez l'application

URLs importantes:
- Site principal: https://cabinetyayeaminata.com
- API Backend: https://cabinetyayeaminata.com/api
- Admin Django: https://cabinetyayeaminata.com/admin

Support: Contactez l'équipe de développement
EOF

echo "📋 Informations de déploiement créées: dist/deployment-info.txt"
echo ""
echo "🎯 Prochaines étapes:"
echo "1. Uploadez le contenu du dossier 'dist' vers votre serveur web"
echo "2. Configurez votre serveur web (Nginx/Apache) pour servir les fichiers statiques"
echo "3. Configurez les redirections pour l'API backend"
echo "4. Testez l'application en production"
echo ""
echo "🌐 URL de production: https://cabinetyayeaminata.com"
echo "🔗 API Backend: https://cabinetyayeaminata.com/api"
echo ""
echo "🎉 Déploiement du frontend prêt !"
