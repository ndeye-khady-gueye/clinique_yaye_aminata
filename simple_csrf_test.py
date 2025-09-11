#!/usr/bin/env python3
"""
Test simple de la correction CSRF
"""

import requests
import json

def test_csrf_fix():
    """Test simple de la correction CSRF"""
    
    print("🔧 Test de correction CSRF")
    print("=" * 40)
    
    # Test de connexion avec des identifiants par défaut
    login_data = {
        "identifier": "admin@clinique.com",
        "password": "admin123"
    }
    
    try:
        print("1. Test de connexion...")
        response = requests.post(
            "http://127.0.0.1:8000/api/auth/login/",
            json=login_data,
            timeout=5
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Connexion réussie - CSRF corrigé!")
            data = response.json()
            print(f"   Message: {data.get('message', 'N/A')}")
            
            # Test d'une requête GET
            token = data.get('tokens', {}).get('access')
            if token:
                print("\n2. Test de requête authentifiée...")
                headers = {
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
                
                get_response = requests.get(
                    "http://127.0.0.1:8000/api/services/",
                    headers=headers,
                    timeout=5
                )
                
                print(f"   Status GET: {get_response.status_code}")
                if get_response.status_code == 200:
                    print("   ✅ Requête GET réussie")
                else:
                    print(f"   ❌ Erreur GET: {get_response.text}")
        else:
            print(f"   ❌ Erreur: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Serveur non accessible")
        print("   💡 Démarrez le serveur: cd cabinet_backend && python manage.py runserver")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")

if __name__ == "__main__":
    test_csrf_fix()
