#!/usr/bin/env python3
"""
Script de test pour l'API PatientEnregistre
"""

import requests
import json

# URL de base
BASE_URL = "http://127.0.0.1:8000"

def test_create_patient_enregistre():
    """Tester la création d'un patient enregistré"""
    
    # Données de test
    patient_data = {
        "nom": "Test",
        "prenom": "Patient",
        "telephone": "775797986",
        "email": "test@example.com",
        "age": 30,
        "motif_visite": "Consultation générale",
        "observations_notes": "Patient de test",
        "type_consultation": "MEDECIN",
        "prix_consultation": 5000,
        "profession": "Ingénieur",
        "adresse": "Dakar, Sénégal",
        "antecedents_medicaux": "Aucun antécédent"
    }
    
    print("🧪 Test de création d'un patient enregistré...")
    print(f"📤 Données envoyées: {json.dumps(patient_data, indent=2)}")
    
    try:
        # Test sans authentification (devrait échouer)
        response = requests.post(
            f"{BASE_URL}/api/patients-enregistres/",
            json=patient_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📥 Réponse (sans auth): {response.status_code}")
        if response.status_code != 401:
            print(f"⚠️  Attendu 401 (non autorisé), reçu {response.status_code}")
        else:
            print("✅ Test d'authentification réussi")
            
        print(f"📄 Contenu de la réponse: {response.text}")
        
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")

def test_get_patients_enregistres():
    """Tester la récupération des patients enregistrés"""
    
    print("\n🧪 Test de récupération des patients enregistrés...")
    
    try:
        # Test sans authentification (devrait échouer)
        response = requests.get(
            f"{BASE_URL}/api/patients-enregistres/",
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📥 Réponse (sans auth): {response.status_code}")
        if response.status_code != 401:
            print(f"⚠️  Attendu 401 (non autorisé), reçu {response.status_code}")
        else:
            print("✅ Test d'authentification réussi")
            
        print(f"📄 Contenu de la réponse: {response.text}")
        
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")

def test_endpoint_aujourd_hui():
    """Tester l'endpoint aujourd'hui"""
    
    print("\n🧪 Test de l'endpoint 'aujourd_hui'...")
    
    try:
        # Test sans authentification (devrait échouer)
        response = requests.get(
            f"{BASE_URL}/api/patients-enregistres/aujourd_hui/",
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📥 Réponse (sans auth): {response.status_code}")
        if response.status_code != 401:
            print(f"⚠️  Attendu 401 (non autorisé), reçu {response.status_code}")
        else:
            print("✅ Test d'authentification réussi")
            
        print(f"📄 Contenu de la réponse: {response.text}")
        
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")

if __name__ == "__main__":
    print("🚀 Démarrage des tests de l'API PatientEnregistre")
    print("=" * 50)
    
    test_create_patient_enregistre()
    test_get_patients_enregistres()
    test_endpoint_aujourd_hui()
    
    print("\n" + "=" * 50)
    print("✅ Tests terminés !")
    print("\n📝 Notes:")
    print("- Les erreurs 401 sont normales (pas d'authentification)")
    print("- L'API fonctionne si elle répond avec des erreurs d'auth")
    print("- Pour tester avec authentification, utilisez un token JWT valide")
