import requests
import json

# Configuration
BASE_URL = "http://127.0.0.1:8000"
API_URL = f"{BASE_URL}/api"

def test_confirmation_api():
    """Test de l'API de confirmation des rendez-vous"""
    
    print("🔍 Test de l'API de confirmation des rendez-vous")
    print("=" * 50)
    
    # 1. Test de connexion au serveur
    try:
        response = requests.get(f"{BASE_URL}/admin/")
        print("✅ Serveur Django accessible")
    except Exception as e:
        print(f"❌ Erreur de connexion au serveur: {e}")
        return
    
    # 2. Test de l'endpoint des demandes en attente
    try:
        response = requests.get(f"{API_URL}/rdv-responsable/demandes_en_attente/")
        print(f"📋 Endpoint demandes en attente: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   📊 Nombre de demandes: {len(data)}")
        else:
            print(f"   ❌ Erreur: {response.text}")
    except Exception as e:
        print(f"❌ Erreur endpoint demandes: {e}")
    
    # 3. Test de l'endpoint de confirmation (sans authentification pour voir l'erreur)
    try:
        test_data = {
            "rendez_vous_id": 1,
            "docteur_id": 1,
            "date_confirmee": "2025-08-30T10:00:00Z",
            "notes": "Test de confirmation",
            "envoyer_notification": True
        }
        
        response = requests.post(
            f"{API_URL}/rdv-responsable/confirmer_rendez_vous/",
            json=test_data
        )
        print(f"🔐 Endpoint confirmation: {response.status_code}")
        if response.status_code == 401:
            print("   ✅ API protégée par authentification (normal)")
        else:
            print(f"   📝 Réponse: {response.text}")
    except Exception as e:
        print(f"❌ Erreur endpoint confirmation: {e}")
    
    print("\n🎯 Résumé:")
    print("- Si vous voyez 'API protégée par authentification', l'API fonctionne")
    print("- Le problème vient probablement de l'authentification côté frontend")
    print("- Vérifiez que le token d'authentification est valide")

if __name__ == "__main__":
    test_confirmation_api()
