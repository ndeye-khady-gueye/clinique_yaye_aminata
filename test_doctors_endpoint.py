import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_doctors_endpoint():
    """Test de l'endpoint /users/?role=doctor"""
    print("🔍 Test de l'endpoint /users/?role=doctor")
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
            
            # Test de l'endpoint des docteurs
            print("\n📋 Test de l'endpoint /users/?role=doctor")
            response = requests.get(f"{BASE_URL}/users/?role=doctor", headers=headers)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                doctors_data = response.json()
                if isinstance(doctors_data, list):
                    doctors = doctors_data
                else:
                    doctors = doctors_data.get('results', [])
                
                print(f"✅ Docteurs récupérés avec succès!")
                print(f"   Nombre de docteurs: {len(doctors)}")
                
                print("\n📋 Liste des docteurs:")
                for i, doctor in enumerate(doctors[:10], 1):  # Afficher les 10 premiers
                    print(f"   {i}. ID: {doctor.get('id')} | {doctor.get('first_name')} {doctor.get('last_name')} | Spécialité: {doctor.get('speciality', 'Non spécifiée')}")
                
                if len(doctors) > 10:
                    print(f"   ... et {len(doctors) - 10} autres docteurs")
                    
                # Chercher le nouveau docteur créé
                new_doctor = None
                for doctor in doctors:
                    if doctor.get('first_name') == 'Dr. Test' and doctor.get('last_name') == 'Médecin':
                        new_doctor = doctor
                        break
                
                if new_doctor:
                    print(f"\n✅ Nouveau docteur trouvé dans la liste!")
                    print(f"   ID: {new_doctor.get('id')}")
                    print(f"   Nom: {new_doctor.get('first_name')} {new_doctor.get('last_name')}")
                    print(f"   Spécialité: {new_doctor.get('speciality')}")
                    print("   Il apparaîtra maintenant dans la liste des docteurs du formulaire de rendez-vous!")
                else:
                    print("\n❌ Nouveau docteur non trouvé dans la liste")
                    
            else:
                print(f"❌ Erreur récupération docteurs: {response.status_code}")
                print(f"   Réponse: {response.text}")
                
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_doctors_endpoint()
