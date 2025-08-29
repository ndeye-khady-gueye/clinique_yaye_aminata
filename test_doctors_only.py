import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_doctors_only():
    """Test spécifique des utilisateurs avec rôle doctor"""
    print("🔍 Test spécifique des médecins (utilisateurs avec role=doctor)")
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
            
            # Test spécifique des médecins
            print("\n" + "=" * 60)
            print("👨‍⚕️ Test des utilisateurs avec role=doctor")
            
            doctors_response = requests.get(f"{BASE_URL}/users/?role=doctor", headers=headers)
            print(f"Status: {doctors_response.status_code}")
            
            if doctors_response.status_code == 200:
                doctors_data = doctors_response.json()
                print(f"✅ Données reçues:")
                print(f"   Type: {type(doctors_data)}")
                
                if isinstance(doctors_data, dict):
                    print(f"   Count: {doctors_data.get('count', 'N/A')}")
                    print(f"   Results: {len(doctors_data.get('results', []))} médecins")
                    
                    if doctors_data.get('results'):
                        print(f"\n👨‍⚕️ Liste des médecins trouvés:")
                        for i, doctor in enumerate(doctors_data['results'], 1):
                            print(f"   {i}. Dr. {doctor.get('first_name', 'N/A')} {doctor.get('last_name', 'N/A')}")
                            print(f"      Email: {doctor.get('email', 'N/A')}")
                            print(f"      Rôle: {doctor.get('role', 'N/A')}")
                            print(f"      Spécialité: {doctor.get('speciality', 'Non définie')}")
                            print(f"      ID: {doctor.get('id', 'N/A')}")
                            print()
                    else:
                        print("   ❌ Aucun médecin trouvé dans les résultats")
                        
                else:
                    print(f"   Nombre de médecins: {len(doctors_data)}")
                    if doctors_data:
                        print(f"\n👨‍⚕️ Liste des médecins trouvés:")
                        for i, doctor in enumerate(doctors_data, 1):
                            print(f"   {i}. Dr. {doctor.get('first_name', 'N/A')} {doctor.get('last_name', 'N/A')}")
                            print(f"      Email: {doctor.get('email', 'N/A')}")
                            print(f"      Rôle: {doctor.get('role', 'N/A')}")
                            print(f"      Spécialité: {doctor.get('speciality', 'Non définie')}")
                            print(f"      ID: {doctor.get('id', 'N/A')}")
                            print()
                    else:
                        print("   ❌ Aucun médecin trouvé")
            else:
                print(f"❌ Erreur: {doctors_response.text}")
                
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n✅ Test terminé!")

if __name__ == "__main__":
    test_doctors_only()
