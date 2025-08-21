#!/usr/bin/env python
"""
Script pour simuler exactement ce que le frontend envoie
"""
import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_login():
    """Test de connexion pour obtenir un token"""
    login_data = {
        'email': 'admin@dev.clinique.sn',
        'password': 'admin123'
    }
    
    try:
        response = requests.post(f'{BASE_URL}/auth/login/', json=login_data)
        if response.status_code == 200:
            data = response.json()
            return data['tokens']['access']
        else:
            print(f"Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_frontend_like_request(token):
    """Test qui simule exactement ce que le frontend pourrait envoyer"""
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    # Données qui pourraient être envoyées par le frontend
    # avec des champs supplémentaires ou des valeurs incorrectes
    test_cases = [
        {
            'name': 'Test avec champs vides',
            'data': {
                'username': '',
                'email': '',
                'first_name': '',
                'last_name': '',
                'role': 'patient',
                'phone': '',
                'password': '',
                'password_confirm': '',
                'is_active': True
            }
        },
        {
            'name': 'Test avec email invalide',
            'data': {
                'username': 'test_invalid_email',
                'email': 'invalid-email',
                'first_name': 'Test',
                'last_name': 'User',
                'role': 'patient',
                'phone': '123456789',
                'password': 'testpassword123',
                'password_confirm': 'testpassword123',
                'is_active': True
            }
        },
        {
            'name': 'Test avec mots de passe différents',
            'data': {
                'username': 'test_password_mismatch',
                'email': 'test_password_mismatch@example.com',
                'first_name': 'Test',
                'last_name': 'User',
                'role': 'patient',
                'phone': '123456789',
                'password': 'testpassword123',
                'password_confirm': 'differentpassword',
                'is_active': True
            }
        },
        {
            'name': 'Test avec champs supplémentaires',
            'data': {
                'username': 'test_extra_fields',
                'email': 'test_extra_fields@example.com',
                'first_name': 'Test',
                'last_name': 'User',
                'role': 'patient',
                'phone': '123456789',
                'password': 'testpassword123',
                'password_confirm': 'testpassword123',
                'is_active': True,
                'extra_field': 'should_not_be_here',
                'another_field': 123
            }
        }
    ]
    
    for test_case in test_cases:
        print(f"\n{'='*60}")
        print(f"TEST: {test_case['name']}")
        print(f"{'='*60}")
        print(f"Envoi des données: {json.dumps(test_case['data'], indent=2)}")
        
        try:
            response = requests.post(f'{BASE_URL}/users/', json=test_case['data'], headers=headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 201:
                print("✅ Succès!")
            elif response.status_code == 400:
                print("❌ Erreur 400 (Bad Request) - C'est probablement ce qui se passe dans le frontend")
            else:
                print(f"⚠️ Status inattendu: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")

def main():
    print("🔍 Simulation des requêtes frontend...")
    
    # Test de connexion
    token = test_login()
    if not token:
        print("❌ Cannot proceed without valid token")
        return
    
    print(f"✅ Token obtenu: {token[:20]}...")
    
    # Test des différents cas
    test_frontend_like_request(token)
    
    print("\n✅ Simulation terminée!")

if __name__ == '__main__':
    main()
