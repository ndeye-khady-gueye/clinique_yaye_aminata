import requests
import json

# URL de l'API
BASE_URL = "http://127.0.0.1:8000/api"

def test_create_contact():
    """Test de création d'un message de contact"""
    url = f"{BASE_URL}/contacts/create_message/"
    
    data = {
        "nom": "Test User",
        "email": "test@example.com",
        "sujet": "Test de contact",
        "message": "Ceci est un test de l'API de contact",
        "date_heure_souhaitee": None
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            print("✅ Message de contact créé avec succès!")
        else:
            print("❌ Erreur lors de la création du message")
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur Django")
        print("Assurez-vous que le serveur Django est démarré sur http://127.0.0.1:8000")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_get_contacts():
    """Test de récupération des messages (nécessite un token admin)"""
    url = f"{BASE_URL}/contacts/"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Messages récupérés avec succès!")
        else:
            print("❌ Erreur lors de la récupération des messages")
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur Django")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("=== Test de l'API Contact ===")
    print("\n1. Test de création d'un message:")
    test_create_contact()
    
    print("\n2. Test de récupération des messages:")
    test_get_contacts()
