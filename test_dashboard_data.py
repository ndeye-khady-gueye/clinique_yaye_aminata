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
    
    login_data = {
        "email": "responsable@cabinet.com",  # Remplacez par les vraies données
        "password": "password123"  # Remplacez par le vrai mot de passe
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Connexion réussie!")
            print(f"Token: {data['tokens']['access'][:50]}...")
            return data['tokens']['access']
        else:
            print(f"❌ Erreur de connexion: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Exception lors de la connexion: {e}")
        return None

if __name__ == "__main__":
    print("🚀 Test des données du tableau de bord")
    print("=" * 50)
    
    # Test de connexion
    token = test_login()
    
    if token:
        print("\n" + "=" * 50)
        print("📊 Tests des endpoints du tableau de bord")
        
        # Test des statistiques
        test_endpoint_with_auth("/statistiques/dashboard/", "Statistiques du tableau de bord", token)
        
        # Test des rendez-vous d'aujourd'hui
        test_endpoint_with_auth("/rendez-vous/aujourd_hui/", "Rendez-vous d'aujourd'hui", token)
        
        # Test des patients
        test_endpoint_with_auth("/patients/", "Liste des patients", token)
        
        # Test des médecins
        test_endpoint_with_auth("/users/?role=doctor", "Liste des médecins", token)
        
        # Test des services
        test_endpoint_with_auth("/services/actifs/", "Services actifs", token)
        
    else:
        print("\n❌ Impossible de se connecter. Vérifiez les identifiants.")
        print("💡 Assurez-vous qu'un utilisateur 'responsable_cabinet' existe dans la base de données.")
    
    print("\n✅ Tests terminés!")
