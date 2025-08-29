import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_endpoint_with_auth(endpoint, description, token):
    """Test un endpoint avec authentification"""
    print(f"\n🔍 Test: {description}")
    print(f"URL: {BASE_URL}{endpoint}")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Succès! Données reçues:")
            print(f"Type de données: {type(data)}")
            if isinstance(data, list):
                print(f"Nombre d'éléments: {len(data)}")
                if len(data) > 0:
                    print(f"Premier élément: {json.dumps(data[0], indent=2, ensure_ascii=False)}")
            else:
                print(f"Données: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Erreur: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

def test_login():
    """Test de connexion pour obtenir un token"""
    print("🔐 Test de connexion...")
    
    # Test avec différents identifiants possibles
    login_attempts = [
        {"username": "responsable", "password": "responsable123"},
        {"email": "docteur@cabinet.com", "password": "docteur123"},
        {"email": "patient@example.com", "password": "patient123"},
    ]
    
    for attempt in login_attempts:
        try:
            response = requests.post(f"{BASE_URL}/auth/login/", json=attempt)
            print(f"Tentative avec {attempt['email']}: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Connexion réussie!")
                print(f"Utilisateur: {data['user']['first_name']} {data['user']['last_name']} ({data['user']['role']})")
                print(f"Token: {data['tokens']['access'][:50]}...")
                return data['tokens']['access']
            else:
                print(f"❌ Échec: {response.text}")
                
        except Exception as e:
            print(f"❌ Exception: {e}")
    
    return None

def test_without_auth(endpoint, description):
    """Test un endpoint sans authentification"""
    print(f"\n🔍 Test sans auth: {description}")
    print(f"URL: {BASE_URL}{endpoint}")
    
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Succès! Données reçues:")
            print(f"Type de données: {type(data)}")
            if isinstance(data, list):
                print(f"Nombre d'éléments: {len(data)}")
                if len(data) > 0:
                    print(f"Premier élément: {json.dumps(data[0], indent=2, ensure_ascii=False)}")
            else:
                print(f"Données: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"❌ Erreur: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    print("🚀 Test des endpoints après correction")
    print("=" * 50)
    
    # Test de connexion
    token = test_login()
    
    if token:
        print("\n" + "=" * 50)
        print("📊 Tests des endpoints du tableau de bord")
        
        # Test des statistiques (qui causait l'erreur 500)
        test_endpoint_with_auth("/statistiques/dashboard/", "Statistiques du tableau de bord", token)
        
        # Test des rendez-vous d'aujourd'hui
        test_endpoint_with_auth("/rendez-vous/aujourd_hui/", "Rendez-vous d'aujourd'hui", token)
        
        # Test des patients
        test_endpoint_with_auth("/patients/", "Liste des patients", token)
        
        # Test des médecins
        test_endpoint_with_auth("/users/?role=doctor", "Liste des médecins", token)
        
        # Test des services
        test_endpoint_with_auth("/services/actifs/", "Services actifs", token)
        
        # Test de création d'un rendez-vous
        print("\n" + "=" * 50)
        print("📝 Test de création de rendez-vous")
        
        # D'abord, récupérer les données nécessaires
        try:
            patients_response = requests.get(f"{BASE_URL}/patients/", headers={"Authorization": f"Bearer {token}"})
            doctors_response = requests.get(f"{BASE_URL}/users/?role=doctor", headers={"Authorization": f"Bearer {token}"})
            services_response = requests.get(f"{BASE_URL}/services/actifs/", headers={"Authorization": f"Bearer {token}"})
            
            if patients_response.status_code == 200 and doctors_response.status_code == 200 and services_response.status_code == 200:
                patients = patients_response.json()
                doctors = doctors_response.json()
                services = services_response.json()
                
                if patients and doctors and services:
                    # Créer un rendez-vous de test
                    rdv_data = {
                        "patient": patients[0]['id'],
                        "docteur": doctors[0]['id'],
                        "service": services[0]['id'],
                        "date_confirmee": "2024-12-25T10:00:00",
                        "message": "Test de création de RDV",
                        "statut": "confirme"
                    }
                    
                    rdv_response = requests.post(
                        f"{BASE_URL}/rendez-vous/", 
                        json=rdv_data,
                        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
                    )
                    
                    print(f"Test création RDV: {rdv_response.status_code}")
                    if rdv_response.status_code == 201:
                        print("✅ Rendez-vous créé avec succès!")
                        print(f"Données: {json.dumps(rdv_response.json(), indent=2, ensure_ascii=False)}")
                    else:
                        print(f"❌ Erreur création: {rdv_response.text}")
                else:
                    print("❌ Données insuffisantes pour créer un RDV")
                    print(f"Patients: {len(patients)}, Médecins: {len(doctors)}, Services: {len(services)}")
            else:
                print("❌ Impossible de récupérer les données nécessaires")
                
        except Exception as e:
            print(f"❌ Exception lors du test de création: {e}")
        
    else:
        print("\n❌ Impossible de se connecter. Vérifiez les identifiants.")
        print("💡 Assurez-vous qu'un utilisateur existe dans la base de données.")
        
        # Test sans authentification pour voir les erreurs
        print("\n" + "=" * 50)
        print("🔍 Tests sans authentification")
        test_without_auth("/patients/", "Patients (sans auth)")
        test_without_auth("/users/?role=doctor", "Médecins (sans auth)")
        test_without_auth("/services/actifs/", "Services (sans auth)")
    
    print("\n✅ Tests terminés!")
