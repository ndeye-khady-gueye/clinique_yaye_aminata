import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"
TOKEN = "YOUR_TOKEN_HERE"  # Remplacez par un vrai token

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

def test_endpoint(endpoint, description):
    """Test un endpoint et affiche les résultats"""
    print(f"\n🔍 Test: {description}")
    print(f"URL: {BASE_URL}{endpoint}")
    
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
    print("🚀 Test des endpoints API du backend Django")
    print("=" * 50)
    
    # Test des endpoints sans authentification
    test_without_auth("/patients/", "Liste des patients")
    test_without_auth("/users/?role=doctor", "Liste des médecins")
    test_without_auth("/services/actifs/", "Liste des services actifs")
    test_without_auth("/rendez-vous/", "Liste des rendez-vous")
    
    print("\n" + "=" * 50)
    print("🔐 Tests avec authentification (nécessite un token valide)")
    
    # Test des endpoints avec authentification
    test_endpoint("/patients/", "Liste des patients (avec auth)")
    test_endpoint("/users/?role=doctor", "Liste des médecins (avec auth)")
    test_endpoint("/services/actifs/", "Liste des services actifs (avec auth)")
    test_endpoint("/rendez-vous/", "Liste des rendez-vous (avec auth)")
    
    print("\n✅ Tests terminés!")
