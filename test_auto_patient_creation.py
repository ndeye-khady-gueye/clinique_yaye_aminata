import requests
import json
import random
import string

# Configuration
BASE_URL = "http://localhost:8000/api"

def generate_random_name():
    """Générer un nom aléatoire pour le test"""
    first_names = ["Aissatou", "Fatou", "Mariama", "Aminata", "Kadiatou", "Awa", "Ndeye", "Mame"]
    last_names = ["Diallo", "Sall", "Diop", "Ba", "Ndiaye", "Fall", "Gueye", "Thiam"]
    
    return random.choice(first_names), random.choice(last_names)

def test_auto_patient_creation():
    """Test de création automatique de profil Patient"""
    print("🔍 Test de création automatique de profil Patient")
    print("=" * 60)
    
    # Connexion responsable de cabinet
    login_data = {
        "email": "responsable@cabinet.com",
        "password": "responsable123"
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
            
            # Générer un nom aléatoire
            first_name, last_name = generate_random_name()
            email = f"{first_name.lower()}.{last_name.lower()}@test.com"
            
            # Créer un nouvel utilisateur avec le rôle patient
            print(f"\n📋 Création d'un nouveau patient: {first_name} {last_name}")
            new_patient_data = {
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "password": "test123456",
                "role": "patient",
                "phone": f"77{random.randint(1000000, 9999999)}"
            }
            
            print(f"📤 Données envoyées: {json.dumps(new_patient_data, indent=2)}")
            
            response = requests.post(f"{BASE_URL}/auth/register/", json=new_patient_data, headers=headers)
            print(f"Status création utilisateur: {response.status_code}")
            
            if response.status_code == 201:
                user_created = response.json()
                print("✅ Utilisateur patient créé avec succès!")
                print(f"   ID: {user_created.get('user', {}).get('id')}")
                print(f"   Nom: {user_created.get('user', {}).get('first_name')} {user_created.get('user', {}).get('last_name')}")
                print(f"   Rôle: {user_created.get('user', {}).get('role')}")
                
                # Vérifier si le profil Patient a été créé automatiquement
                print("\n🔍 Vérification du profil Patient...")
                response = requests.get(f"{BASE_URL}/patients/", headers=headers)
                
                if response.status_code == 200:
                    patients_data = response.json()
                    if isinstance(patients_data, list):
                        patients = patients_data
                    else:
                        patients = patients_data.get('results', [])
                    
                    # Chercher le nouveau patient
                    new_patient = None
                    for patient in patients:
                        if (patient.get('user', {}).get('first_name') == first_name and 
                            patient.get('user', {}).get('last_name') == last_name):
                            new_patient = patient
                            break
                    
                    if new_patient:
                        print("✅ Profil Patient créé automatiquement!")
                        print(f"   ID Patient: {new_patient.get('id')}")
                        print(f"   ID User: {new_patient.get('user', {}).get('id')}")
                        print(f"   Nom: {new_patient.get('user', {}).get('first_name')} {new_patient.get('user', {}).get('last_name')}")
                        print(f"   Adresse: {new_patient.get('adresse')}")
                        print(f"   Profession: {new_patient.get('profession')}")
                        
                        print("\n🎉 Le nouveau patient apparaîtra maintenant dans la liste de sélection!")
                    else:
                        print("❌ Profil Patient non trouvé - vérifiez les signaux Django")
                else:
                    print(f"❌ Erreur récupération patients: {response.status_code}")
                    print(f"   Réponse: {response.text}")
            else:
                print(f"❌ Erreur création utilisateur: {response.status_code}")
                print(f"   Réponse: {response.text}")
                
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_auto_patient_creation()
