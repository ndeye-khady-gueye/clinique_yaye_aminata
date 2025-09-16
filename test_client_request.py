#!/usr/bin/env python3
"""
Script de test pour simuler une demande de rendez-vous depuis un client
"""

import requests
import json
from datetime import datetime, timedelta

def test_client_appointment_request():
    """Test de création d'une demande de rendez-vous par un client"""
    
    # URL de l'API
    api_url = "http://127.0.0.1:8000/api/rendez-vous/"
    
    # Données de la demande de rendez-vous
    appointment_data = {
        "client_nom": "Aminata Diallo",
        "client_email": "aminata.diallo@example.com",
        "client_telephone": "+221701234567",
        "service": "SUIVI_GROSSESSE",
        "message": "Bonjour, je souhaite prendre rendez-vous pour un suivi de grossesse. Je suis enceinte de 3 mois et j'aimerais avoir un suivi régulier.",
        "date_souhaitee": (datetime.now() + timedelta(days=7)).isoformat(),
        "statut": "en_attente"
    }
    
    print("🔄 Test de création d'une demande de rendez-vous...")
    print(f"📋 Données: {json.dumps(appointment_data, indent=2, ensure_ascii=False)}")
    
    try:
        # Envoyer la demande
        response = requests.post(api_url, json=appointment_data)
        
        print(f"\n📊 Résultat:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Demande de rendez-vous créée avec succès!")
            data = response.json()
            if 'rdv' in data:
                print(f"   ID du rendez-vous: {data['rdv'].get('id')}")
                print(f"   Statut: {data['rdv'].get('statut')}")
        else:
            print("❌ Erreur lors de la création de la demande")
            
    except requests.exceptions.ConnectionError:
        print("❌ Erreur: Impossible de se connecter au serveur")
        print("   Vérifiez que le serveur Django est démarré (python manage.py runserver)")
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")

def test_get_appointments():
    """Test de récupération des rendez-vous"""
    
    api_url = "http://127.0.0.1:8000/api/rendez-vous/"
    
    print("\n🔄 Test de récupération des rendez-vous...")
    
    try:
        response = requests.get(api_url)
        
        print(f"📊 Résultat:")
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            appointments = data.get('results', data) if isinstance(data, dict) else data
            
            print(f"✅ {len(appointments)} rendez-vous trouvés")
            
            # Afficher les demandes en attente
            pending = [rdv for rdv in appointments if rdv.get('statut') == 'en_attente']
            print(f"   - {len(pending)} demande(s) en attente")
            
            for rdv in pending[:3]:  # Afficher les 3 premières
                print(f"     • {rdv.get('client_nom', 'N/A')} - {rdv.get('service', {}).get('nom', 'N/A')}")
        else:
            print(f"❌ Erreur: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("🧪 Test du système de demandes de rendez-vous")
    print("=" * 50)
    
    # Test 1: Créer une demande
    test_client_appointment_request()
    
    # Test 2: Récupérer les rendez-vous
    test_get_appointments()
    
    print("\n" + "=" * 50)
    print("✅ Tests terminés")
