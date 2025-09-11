#!/usr/bin/env python3
"""
Script pour vérifier les utilisateurs et tester la correction CSRF
"""

import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append('cabinet_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User
import requests
import json

def check_users():
    """Vérifier les utilisateurs existants"""
    print("👥 Utilisateurs existants dans la base de données:")
    print("=" * 50)
    
    users = User.objects.all()
    if not users:
        print("❌ Aucun utilisateur trouvé")
        return None
    
    for user in users:
        print(f"📧 Email: {user.email}")
        print(f"👤 Rôle: {user.role}")
        print(f"✅ Actif: {user.is_active}")
        print("-" * 30)
    
    return users.first()

def test_csrf_fix_with_user(user):
    """Tester la correction CSRF avec un utilisateur existant"""
    if not user:
        print("❌ Aucun utilisateur pour tester")
        return
    
    print(f"\n🔧 Test CSRF avec l'utilisateur: {user.email}")
    print("=" * 50)
    
    # Test de connexion
    login_data = {
        "identifier": user.email,
        "password": "admin123"  # Mot de passe par défaut
    }
    
    try:
        response = requests.post(
            "http://127.0.0.1:8000/api/auth/login/",
            json=login_data,
            timeout=10
        )
        
        print(f"📡 Status de connexion: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Connexion réussie - Pas d'erreur CSRF!")
            data = response.json()
            token = data.get('tokens', {}).get('access')
            
            if token:
                print("✅ Token JWT reçu")
                
                # Test d'une requête POST
                headers = {
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
                
                # Test simple - récupérer les services
                test_response = requests.get(
                    "http://127.0.0.1:8000/api/services/",
                    headers=headers,
                    timeout=10
                )
                
                print(f"📡 Status test GET: {test_response.status_code}")
                
                if test_response.status_code == 200:
                    print("✅ Requête GET réussie")
                else:
                    print(f"❌ Erreur GET: {test_response.text}")
                    
            else:
                print("❌ Aucun token reçu")
        else:
            print(f"❌ Erreur de connexion: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur Django")
        print("💡 Démarrez le serveur avec: cd cabinet_backend && python manage.py runserver")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    print("🔍 Vérification des utilisateurs et test CSRF")
    print("=" * 60)
    
    # Vérifier les utilisateurs
    user = check_users()
    
    # Tester CSRF
    test_csrf_fix_with_user(user)

if __name__ == "__main__":
    main()
