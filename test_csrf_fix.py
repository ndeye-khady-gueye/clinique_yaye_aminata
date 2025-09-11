#!/usr/bin/env python3
"""
Script de test pour vérifier que les requêtes POST fonctionnent sans erreur CSRF
"""

import requests
import json

# Configuration
API_BASE_URL = "http://127.0.0.1:8000/api"
LOGIN_URL = f"{API_BASE_URL}/auth/login/"

def test_csrf_fix():
    """Test des requêtes POST pour vérifier que CSRF est désactivé"""
    
    print("🔧 Test de correction CSRF...")
    print("=" * 50)
    
    # 1. Test de connexion (POST sans CSRF)
    print("1. Test de connexion...")
    login_data = {
        "identifier": "admin@clinique.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Connexion réussie - Pas d'erreur CSRF")
            data = response.json()
            token = data.get('tokens', {}).get('access')
            
            if token:
                print("   ✅ Token JWT reçu")
                
                # 2. Test d'une requête POST avec authentification
                print("\n2. Test de requête POST authentifiée...")
                headers = {
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
                
                # Test création d'un patient enregistré
                patient_data = {
                    "nom": "Test",
                    "prenom": "CSRF",
                    "telephone": "771234567",
                    "email": "test@csrf.com",
                    "age": 30,
                    "motif_visite": "Test CSRF",
                    "observations_notes": "Test de correction CSRF",
                    "type_consultation": "Consultation générale",
                    "prix_consultation": 5000,
                    "adresse": "Dakar",
                    "antecedents_medicaux": "Aucun"
                }
                
                create_response = requests.post(
                    f"{API_BASE_URL}/patients-enregistres/",
                    json=patient_data,
                    headers=headers
                )
                
                print(f"   Status: {create_response.status_code}")
                
                if create_response.status_code in [200, 201]:
                    print("   ✅ Création réussie - Pas d'erreur CSRF")
                else:
                    print(f"   ❌ Erreur: {create_response.text}")
                    
            else:
                print("   ❌ Aucun token reçu")
        else:
            print(f"   ❌ Erreur de connexion: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Impossible de se connecter au serveur Django")
        print("   Vérifiez que le serveur est démarré avec: python manage.py runserver")
    except Exception as e:
        print(f"   ❌ Erreur inattendue: {e}")
    
    print("\n" + "=" * 50)
    print("Test terminé")

if __name__ == "__main__":
    test_csrf_fix()
