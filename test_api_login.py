import requests
import json

# URL de l'API
BASE_URL = "http://localhost:8000/api"

def test_login(email=None, phone=None, password="Inna1234"):
    """Test de connexion avec email ou téléphone"""
    
    # Préparer les données selon le type d'identifiant
    if email:
        payload = {"email": email, "password": password}
        print(f"\n🔍 Test de connexion avec EMAIL: {email}")
    elif phone:
        payload = {"phone": phone, "password": password}
        print(f"\n📱 Test de connexion avec TÉLÉPHONE: {phone}")
    else:
        print("❌ Erreur: email ou phone requis")
        return
    
    print(f"📤 Payload envoyé: {payload}")
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=payload)
        print(f"📥 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Connexion réussie!")
            print(f"👤 Utilisateur: {data.get('user', {}).get('username', 'N/A')}")
            print(f"🔑 Token: {data.get('tokens', {}).get('access', 'N/A')[:20]}...")
        else:
            print("❌ Échec de connexion")
            print(f"📄 Réponse: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur. Assurez-vous que le serveur Django est démarré.")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("🧪 Test de l'API de connexion avec détection email/téléphone")
    print("=" * 60)
    
    # Test avec email
    test_login(email="inna@gmail.com")
    
    # Test avec téléphone
    test_login(phone="785202934")
    
    # Test avec email invalide
    test_login(email="invalid@email")
    
    # Test avec téléphone invalide
    test_login(phone="123456789")
