import requests
import json
from datetime import datetime, timedelta

# URL de l'API
BASE_URL = "http://127.0.0.1:8000/api"

def test_rdv_responsable_api():
    """Test des fonctionnalités de gestion des rendez-vous par le responsable"""
    
    print("=== Test de l'API Gestion RDV Responsable ===\n")
    
    # 1. Test de récupération des demandes en attente
    print("1. Test de récupération des demandes en attente:")
    try:
        response = requests.get(f"{BASE_URL}/rdv-responsable/demandes_en_attente/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {len(data)} demandes en attente trouvées")
            if data:
                print(f"   Première demande: {data[0]['client_nom']} - {data[0]['service']['nom']}")
        else:
            print(f"❌ Erreur: {response.json()}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    print()
    
    # 2. Test de récupération des statistiques
    print("2. Test de récupération des statistiques:")
    try:
        response = requests.get(f"{BASE_URL}/rdv-responsable/statistiques/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Statistiques récupérées:")
            print(f"   Total RDV: {data['total_rdv']}")
            print(f"   En attente: {data['en_attente']}")
            print(f"   Confirmés: {data['confirmes']}")
            print(f"   Réalisés: {data['realises']}")
            print(f"   Annulés: {data['annules']}")
        else:
            print(f"❌ Erreur: {response.json()}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    print()
    
    # 3. Test de récupération de tous les rendez-vous
    print("3. Test de récupération de tous les rendez-vous:")
    try:
        response = requests.get(f"{BASE_URL}/rdv-responsable/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {len(data)} rendez-vous trouvés au total")
        else:
            print(f"❌ Erreur: {response.json()}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    print()
    
    # 4. Test de confirmation d'un rendez-vous (si des demandes existent)
    print("4. Test de confirmation d'un rendez-vous:")
    try:
        # D'abord récupérer les demandes en attente
        response = requests.get(f"{BASE_URL}/rdv-responsable/demandes_en_attente/")
        if response.status_code == 200:
            demandes = response.json()
            if demandes:
                rdv_id = demandes[0]['id']
                date_confirmee = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%dT%H:%M')
                
                confirmation_data = {
                    "rendez_vous_id": rdv_id,
                    "date_confirmee": date_confirmee,
                    "notes": "Test de confirmation via API",
                    "envoyer_notification": False
                }
                
                response = requests.post(f"{BASE_URL}/rdv-responsable/confirmer_rendez_vous/", json=confirmation_data)
                print(f"Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("✅ Rendez-vous confirmé avec succès")
                else:
                    print(f"❌ Erreur: {response.json()}")
            else:
                print("⚠️  Aucune demande en attente pour tester la confirmation")
        else:
            print(f"❌ Erreur lors de la récupération des demandes: {response.json()}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    print()
    
    # 5. Test de modification d'un rendez-vous
    print("5. Test de modification d'un rendez-vous:")
    try:
        # Récupérer un rendez-vous confirmé
        response = requests.get(f"{BASE_URL}/rdv-responsable/")
        if response.status_code == 200:
            rdv_list = response.json()
            rdv_confirme = None
            for rdv in rdv_list:
                if rdv['statut'] == 'confirme':
                    rdv_confirme = rdv
                    break
            
            if rdv_confirme:
                rdv_id = rdv_confirme['id']
                nouvelle_date = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%dT%H:%M')
                
                modification_data = {
                    "rendez_vous_id": rdv_id,
                    "date_confirmee": nouvelle_date,
                    "raison_modification": "Test de modification via API",
                    "notes": "Modification effectuée pour test",
                    "envoyer_notification": False
                }
                
                response = requests.post(f"{BASE_URL}/rdv-responsable/modifier_rendez_vous/", json=modification_data)
                print(f"Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("✅ Rendez-vous modifié avec succès")
                else:
                    print(f"❌ Erreur: {response.json()}")
            else:
                print("⚠️  Aucun rendez-vous confirmé pour tester la modification")
        else:
            print(f"❌ Erreur lors de la récupération des rendez-vous: {response.json()}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    print()
    
    # 6. Test de création d'un patient (si des demandes existent)
    print("6. Test de création d'un patient:")
    try:
        # Récupérer une demande en attente
        response = requests.get(f"{BASE_URL}/rdv-responsable/demandes_en_attente/")
        if response.status_code == 200:
            demandes = response.json()
            if demandes:
                rdv_id = demandes[0]['id']
                
                patient_data = {
                    "rendez_vous_id": rdv_id,
                    "username": "test_patient_api",
                    "password": "Test123!",
                    "password_confirm": "Test123!",
                    "date_naissance": "1990-01-01",
                    "profession": "Testeur",
                    "situation_matrimoniale": "celibataire",
                    "nombre_enfants": 0,
                    "adresse": "Adresse de test",
                    "groupe_sanguin": "A+",
                    "allergies": "Aucune",
                    "antecedents_medicaux": "Aucun"
                }
                
                response = requests.post(f"{BASE_URL}/rdv-responsable/creer_patient/", json=patient_data)
                print(f"Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("✅ Patient créé avec succès")
                else:
                    print(f"❌ Erreur: {response.json()}")
            else:
                print("⚠️  Aucune demande en attente pour tester la création de patient")
        else:
            print(f"❌ Erreur lors de la récupération des demandes: {response.json()}")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_rdv_responsable_api()
