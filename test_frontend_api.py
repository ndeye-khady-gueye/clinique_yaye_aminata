import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_frontend_api():
    """Test de l'API pour vérifier les données retournées"""
    print("🔍 Test de l'API pour le frontend")
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
            
            # Test des endpoints utilisés par le frontend
            print("\n" + "="*50)
            print("📋 Test des endpoints frontend")
            print("="*50)
            
            # 1. Test /users/?role=patient
            print("\n1️⃣ Test /users/?role=patient")
            response = requests.get(f"{BASE_URL}/users/?role=patient", headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Patients trouvés: {data.get('count', 0)}")
                if data.get('results'):
                    print(f"   Premier patient: {data['results'][0].get('first_name', 'N/A')} {data['results'][0].get('last_name', 'N/A')}")
            else:
                print(f"❌ Erreur: {response.text}")
            
            # 2. Test /users/?role=doctor
            print("\n2️⃣ Test /users/?role=doctor")
            response = requests.get(f"{BASE_URL}/users/?role=doctor", headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Médecins trouvés: {data.get('count', 0)}")
                if data.get('results'):
                    print(f"   Premier médecin: {data['results'][0].get('first_name', 'N/A')} {data['results'][0].get('last_name', 'N/A')}")
            else:
                print(f"❌ Erreur: {response.text}")
            
            # 3. Test /services/actifs/
            print("\n3️⃣ Test /services/actifs/")
            response = requests.get(f"{BASE_URL}/services/actifs/", headers=headers)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Services trouvés: {len(data) if isinstance(data, list) else data.get('count', 0)}")
                if isinstance(data, list) and data:
                    print(f"   Premier service: {data[0].get('nom', 'N/A')}")
                elif data.get('results') and data['results']:
                    print(f"   Premier service: {data['results'][0].get('nom', 'N/A')}")
            else:
                print(f"❌ Erreur: {response.text}")
                
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_frontend_api()
