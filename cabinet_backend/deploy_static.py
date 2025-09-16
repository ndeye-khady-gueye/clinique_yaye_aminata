#!/usr/bin/env python
"""
Script de déploiement pour collecter les fichiers statiques
Usage: python deploy_static.py
"""

import os
import sys
import django
from pathlib import Path

# Ajouter le répertoire du projet au path Python
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.conf import settings

def collect_static_files():
    """Collecter les fichiers statiques pour le déploiement"""
    print("🚀 Collecte des fichiers statiques pour le déploiement...")
    
    try:
        # Collecter les fichiers statiques
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
        
        # Vérifier que le dossier staticfiles existe
        staticfiles_dir = BASE_DIR / 'staticfiles'
        if staticfiles_dir.exists():
            # Compter les fichiers
            file_count = sum(1 for _ in staticfiles_dir.rglob('*') if _.is_file())
            
            # Calculer la taille totale
            total_size = sum(f.stat().st_size for f in staticfiles_dir.rglob('*') if f.is_file())
            total_size_mb = total_size / (1024 * 1024)
            
            print(f"✅ Collecte terminée avec succès !")
            print(f"📁 Dossier: {staticfiles_dir}")
            print(f"📊 Fichiers: {file_count}")
            print(f"💾 Taille: {total_size_mb:.2f} MB")
            print(f"🌐 URL statique: {settings.STATIC_URL}")
            print(f"📂 Chemin statique: {settings.STATIC_ROOT}")
            
            return True
        else:
            print("❌ Erreur: Le dossier staticfiles n'a pas été créé")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors de la collecte: {e}")
        return False

def verify_static_config():
    """Vérifier la configuration des fichiers statiques"""
    print("\n🔍 Vérification de la configuration...")
    
    print(f"STATIC_URL: {settings.STATIC_URL}")
    print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"STATICFILES_DIRS: {settings.STATICFILES_DIRS}")
    
    # Vérifier que STATIC_ROOT est défini
    if not settings.STATIC_ROOT:
        print("❌ STATIC_ROOT n'est pas défini dans les paramètres")
        return False
    
    # Vérifier que le répertoire STATIC_ROOT peut être créé
    static_root = Path(settings.STATIC_ROOT)
    try:
        static_root.mkdir(parents=True, exist_ok=True)
        print("✅ STATIC_ROOT est accessible")
        return True
    except Exception as e:
        print(f"❌ Impossible de créer STATIC_ROOT: {e}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("🏥 CABINET YAYE AMINATA - COLLECTE DES FICHIERS STATIQUES")
    print("=" * 60)
    
    # Vérifier la configuration
    if not verify_static_config():
        sys.exit(1)
    
    # Collecter les fichiers statiques
    if collect_static_files():
        print("\n🎉 Déploiement des fichiers statiques réussi !")
        print("\n📋 Instructions pour le serveur web:")
        print("1. Copiez le dossier 'staticfiles' vers votre serveur")
        print("2. Configurez votre serveur web pour servir les fichiers statiques")
        print("3. Assurez-vous que l'URL /static/ pointe vers le dossier staticfiles")
        sys.exit(0)
    else:
        print("\n❌ Échec de la collecte des fichiers statiques")
        sys.exit(1)
