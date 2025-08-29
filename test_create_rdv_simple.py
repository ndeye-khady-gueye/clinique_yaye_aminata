import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_create_rdv_simple():
    """Test simple de création d'un rendez-vous avec un ID de patient connu"""
    print("🔍 Test simple de création d'un rendez-vous")
    print("=" * 50)
    
    # Connexion du médecin
    login_data = {
        "email": "docteur@cabinet.com",
        "password": "docteur123"
    }
    
    try:
        # Test de connexion
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        print(f"Connexion: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data['tokens']['access']
            print(f"✅ Connexion réussie: {data['user']['first_name']} {data['user']['last_name']}")
            
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            # Utiliser un ID de patient connu (créé par notre script)
            patient_id = 5  # ID du premier patient créé (Mamadou Ba)
            print(f"📋 Utilisation du patient ID: {patient_id}")
            
            # Récupérer un service pour le test
            print("\n📋 Récupération d'un service...")
            response = requests.get(f"{BASE_URL}/services/actifs/", headers=headers)
            if response.status_code == 200:
                services_data = response.json()
                if isinstance(services_data, list) and len(services_data) > 0:
                    service = services_data[0]
                    print(f"✅ Service sélectionné: {service['nom']} (ID: {service['id']})")
                else:
                    print("❌ Aucun service trouvé")
                    return
            else:
                print(f"❌ Erreur récupération services: {response.status_code}")
                return
            
            # Récupérer un médecin pour le test
            print("\n📋 Récupération d'un médecin...")
            response = requests.get(f"{BASE_URL}/users/?role=doctor", headers=headers)
            if response.status_code == 200:
                doctors_data = response.json()
                if doctors_data.get('results') and len(doctors_data['results']) > 0:
                    doctor = doctors_data['results'][0]
                    print(f"✅ Médecin sélectionné: {doctor['first_name']} {doctor['last_name']} (ID: {doctor['id']})")
                else:
                    print("❌ Aucun médecin trouvé")
                    return
            else:
                print(f"❌ Erreur récupération médecins: {response.status_code}")
                return
            
            # Créer un rendez-vous
            print("\n📋 Création du rendez-vous...")
            tomorrow = datetime.now() + timedelta(days=1)
            rdv_data = {
                "patient": patient_id,  # ID du profil Patient
                "service": service['id'],
                "docteur": doctor['id'],
                "date_confirmee": tomorrow.strftime("%Y-%m-%dT10:00:00"),
                "message": "Test de création de rendez-vous",
                "notes": "Rendez-vous créé via test",
                "statut": "confirme"
            }
            
            print(f"📤 Données envoyées: {json.dumps(rdv_data, indent=2)}")
            
            response = requests.post(f"{BASE_URL}/rendez-vous/", json=rdv_data, headers=headers)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 201:
                rdv_created = response.json()
                print("✅ Rendez-vous créé avec succès!")
                print(f"   ID: {rdv_created.get('rdv', {}).get('id')}")
                print(f"   Patient: {rdv_created.get('rdv', {}).get('patient', {}).get('user', {}).get('first_name')} {rdv_created.get('rdv', {}).get('patient', {}).get('user', {}).get('last_name')}")
                print(f"   Service: {rdv_created.get('rdv', {}).get('service', {}).get('nom')}")
                print(f"   Date: {rdv_created.get('rdv', {}).get('date_confirmee')}")
                print(f"   Statut: {rdv_created.get('rdv', {}).get('statut')}")
                
                print("\n🎉 Le rendez-vous a été créé avec succès et devrait apparaître dans:")
                print("   - La liste des rendez-vous de l'application")
                print("   - L'admin Django: http://127.0.0.1:8000/admin/cabinet/rendezvous/")
            else:
                print(f"❌ Erreur création: {response.status_code}")
                print(f"   Réponse: {response.text}")
                
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_create_rdv_simple()
