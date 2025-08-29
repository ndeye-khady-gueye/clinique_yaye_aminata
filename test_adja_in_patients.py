import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_adja_in_patients():
    """Vérifier que Adja apparaît dans la liste des patients"""
    print("🔍 Vérification qu'Adja apparaît dans la liste des patients")
    print("=" * 60)
    
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
            
            # Test de l'endpoint des patients
            print("\n📋 Test de l'endpoint /patients/")
            response = requests.get(f"{BASE_URL}/patients/", headers=headers)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                patients_data = response.json()
                if isinstance(patients_data, list):
                    patients = patients_data
                else:
                    patients = patients_data.get('results', [])
                
                print(f"✅ Patients récupérés avec succès!")
                print(f"   Nombre de patients: {len(patients)}")
                
                # Chercher Adja dans la liste
                adja_found = False
                for patient in patients:
                    if (patient.get('user', {}).get('first_name') == 'Adja' and 
                        patient.get('user', {}).get('last_name') == 'diouf'):
                        adja_found = True
                        print(f"\n✅ Adja trouvé dans la liste des patients!")
                        print(f"   ID Patient: {patient.get('id')}")
                        print(f"   ID User: {patient.get('user', {}).get('id')}")
                        print(f"   Nom: {patient.get('user', {}).get('first_name')} {patient.get('user', {}).get('last_name')}")
                        print(f"   Email: {patient.get('user', {}).get('email')}")
                        print(f"   Adresse: {patient.get('adresse')}")
                        print(f"   Profession: {patient.get('profession')}")
                        break
                
                if not adja_found:
                    print("\n❌ Adja non trouvé dans la liste des patients")
                    print("   Liste des patients disponibles:")
                    for i, patient in enumerate(patients[:10], 1):
                        print(f"   {i}. {patient.get('user', {}).get('first_name')} {patient.get('user', {}).get('last_name')}")
                    if len(patients) > 10:
                        print(f"   ... et {len(patients) - 10} autres patients")
                        
            else:
                print(f"❌ Erreur récupération patients: {response.status_code}")
                print(f"   Réponse: {response.text}")
                
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_adja_in_patients()
