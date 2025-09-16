#!/bin/bash

# Script de déploiement pour le backend
# Usage: ./deploy-backend.sh

echo "🚀 Déploiement du backend sur cabinetyayeaminata.com"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "cabinet_backend/manage.py" ]; then
    echo "❌ Erreur: manage.py non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

cd cabinet_backend

# Installer les dépendances Python
echo "📦 Installation des dépendances Python..."
pip install -r requirements.txt

# Appliquer les migrations
echo "🔄 Application des migrations..."
python manage.py migrate

# Collecter les fichiers statiques
echo "📁 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

# Créer un superutilisateur si nécessaire
echo "👤 Vérification du superutilisateur..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    print('Création du superutilisateur...')
    User.objects.create_superuser('admin', 'admin@cabinetyayeaminata.com', 'admin123')
    print('Superutilisateur créé: admin/admin123')
else:
    print('Superutilisateur existe déjà')
"

echo "✅ Déploiement du backend terminé!"
echo ""
echo "📋 Instructions de déploiement:"
echo "1. Configurez votre serveur web (Nginx/Apache) pour servir l'application Django"
echo "2. Configurez votre base de données PostgreSQL"
echo "3. Configurez les variables d'environnement pour la production"
echo "4. Redémarrez votre serveur web"
echo ""
echo "🌐 URL de production: https://cabinetyayeaminata.com"
echo "🔗 API Backend: https://cabinetyayeaminata.com/api"
echo "👤 Admin: https://cabinetyayeaminata.com/admin"
