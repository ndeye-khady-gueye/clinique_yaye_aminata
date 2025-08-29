import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_patients_only():
    """Test spécifique des utilisateurs avec rôle patient"""
    print("🔍 Test spécifique des patients (utilisateurs avec role=patient)")
    print("=" * 60)
    
    # Connexion du médecin
    login_data = {
        "email": "docteur@cabinet.com",
        "password": "docteur123"
    }
    
    try:
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
            
            # Test spécifique des patients
            print("\n" + "=" * 60)
            print("📋 Test des utilisateurs avec role=patient")
            
            patients_response = requests.get(f"{BASE_URL}/users/?role=patient", headers=headers)
            print(f"Status: {patients_response.status_code}")
            
            if patients_response.status_code == 200:
                patients_data = patients_response.json()
                print(f"✅ Données reçues:")
                print(f"   Type: {type(patients_data)}")
                
                if isinstance(patients_data, dict):
                    print(f"   Count: {patients_data.get('count', 'N/A')}")
                    print(f"   Results: {len(patients_data.get('results', []))} patients")
                    
                    if patients_data.get('results'):
                        print(f"\n📋 Liste des patients trouvés:")
                        for i, patient in enumerate(patients_data['results'], 1):
                            print(f"   {i}. {patient.get('first_name', 'N/A')} {patient.get('last_name', 'N/A')}")
                            print(f"      Email: {patient.get('email', 'N/A')}")
                            print(f"      Rôle: {patient.get('role', 'N/A')}")
                            print(f"      ID: {patient.get('id', 'N/A')}")
                            print()
                    else:
                        print("   ❌ Aucun patient trouvé dans les résultats")
                        
                else:
                    print(f"   Nombre de patients: {len(patients_data)}")
                    if patients_data:
                        print(f"\n📋 Liste des patients trouvés:")
                        for i, patient in enumerate(patients_data, 1):
                            print(f"   {i}. {patient.get('first_name', 'N/A')} {patient.get('last_name', 'N/A')}")
                            print(f"      Email: {patient.get('email', 'N/A')}")
                            print(f"      Rôle: {patient.get('role', 'N/A')}")
                            print(f"      ID: {patient.get('id', 'N/A')}")
                            print()
                    else:
                        print("   ❌ Aucun patient trouvé")
            else:
                print(f"❌ Erreur: {patients_response.text}")
                
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n✅ Test terminé!")

if __name__ == "__main__":
    test_patients_only()
