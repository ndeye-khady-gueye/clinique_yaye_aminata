import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_patients_endpoint():
    """Test de l'endpoint /patients/"""
    print("🔍 Test de l'endpoint /patients/")
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
            
            # Test de l'endpoint /patients/
            print("\n📋 Test de l'endpoint /patients/")
            response = requests.get(f"{BASE_URL}/patients/", headers=headers)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                patients_data = response.json()
                print(f"✅ Patients récupérés avec succès!")
                print(f"   Nombre de patients: {patients_data.get('count', len(patients_data) if isinstance(patients_data, list) else 0)}")
                
                if patients_data.get('results'):
                    print("\n📋 Liste des patients:")
                    for i, patient in enumerate(patients_data['results'][:5]):  # Afficher les 5 premiers
                        user = patient.get('user', {})
                        print(f"   {i+1}. ID Patient: {patient['id']} | User ID: {user.get('id')} | {user.get('first_name')} {user.get('last_name')}")
                    
                    if len(patients_data['results']) > 5:
                        print(f"   ... et {len(patients_data['results']) - 5} autres patients")
                else:
                    print("   ❌ Aucun patient trouvé")
            else:
                print(f"❌ Erreur: {response.status_code}")
                print(f"   Réponse: {response.text}")
                
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_patients_endpoint()
