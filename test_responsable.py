import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_responsable_endpoints():
    """Test des endpoints avec le responsable de cabinet"""
    print("🚀 Test des endpoints du Responsable de Cabinet")
    print("=" * 50)
    
    # Connexion du médecin (qui fonctionne)
    login_data = {
        "email": "docteur@cabinet.com",
        "password": "docteur123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        print(f"Connexion responsable: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data['tokens']['access']
            print(f"✅ Connexion réussie: {data['user']['first_name']} {data['user']['last_name']} ({data['user']['role']})")
            
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            print("\n" + "=" * 50)
            print("📊 Tests des endpoints du Responsable")
            
            # Test des statistiques
            print("\n🔍 Test: Statistiques du tableau de bord")
            stats_response = requests.get(f"{BASE_URL}/statistiques/dashboard/", headers=headers)
            print(f"Status: {stats_response.status_code}")
            if stats_response.status_code == 200:
                stats_data = stats_response.json()
                print("✅ Statistiques récupérées:")
                print(f"   Patients: {stats_data['total_patients']}")
                print(f"   RDV aujourd'hui: {stats_data['total_rdv_aujourd_hui']}")
                print(f"   Médecins: {stats_data['total_docteurs']}")
                print(f"   Revenus: {stats_data['revenus_mois']} FCFA")
            else:
                print(f"❌ Erreur: {stats_response.text}")
            
            # Test des patients
            print("\n🔍 Test: Liste des patients")
            patients_response = requests.get(f"{BASE_URL}/patients/", headers=headers)
            print(f"Status: {patients_response.status_code}")
            if patients_response.status_code == 200:
                patients_data = patients_response.json()
                print(f"✅ Patients récupérés: {patients_data['count']} patients")
                if patients_data['results']:
                    print(f"   Premier patient: {patients_data['results'][0]['user']['first_name']} {patients_data['results'][0]['user']['last_name']}")
            else:
                print(f"❌ Erreur: {patients_response.text}")
            
            # Test des médecins
            print("\n🔍 Test: Liste des médecins")
            doctors_response = requests.get(f"{BASE_URL}/users/?role=doctor", headers=headers)
            print(f"Status: {doctors_response.status_code}")
            if doctors_response.status_code == 200:
                doctors_data = doctors_response.json()
                print(f"✅ Médecins récupérés: {len(doctors_data)} médecins")
                if doctors_data:
                    print(f"   Premier médecin: {doctors_data[0]['first_name']} {doctors_data[0]['last_name']} - {doctors_data[0]['speciality']}")
            else:
                print(f"❌ Erreur: {doctors_response.text}")
            
            # Test des services
            print("\n🔍 Test: Services actifs")
            services_response = requests.get(f"{BASE_URL}/services/actifs/", headers=headers)
            print(f"Status: {services_response.status_code}")
            if services_response.status_code == 200:
                services_data = services_response.json()
                print(f"✅ Services récupérés: {len(services_data)} services")
                if services_data:
                    print(f"   Premier service: {services_data[0]['nom']} - {services_data[0]['prix']} FCFA")
            else:
                print(f"❌ Erreur: {services_response.text}")
            
            # Test des rendez-vous d'aujourd'hui
            print("\n🔍 Test: Rendez-vous d'aujourd'hui")
            rdv_response = requests.get(f"{BASE_URL}/rendez-vous/aujourd_hui/", headers=headers)
            print(f"Status: {rdv_response.status_code}")
            if rdv_response.status_code == 200:
                rdv_data = rdv_response.json()
                print(f"✅ RDV récupérés: {len(rdv_data)} rendez-vous")
            else:
                print(f"❌ Erreur: {rdv_response.text}")
            
            # Test de création d'un rendez-vous
            print("\n" + "=" * 50)
            print("📝 Test de création de rendez-vous")
            
            # Vérifier qu'on a les données nécessaires
            if (patients_response.status_code == 200 and 
                doctors_response.status_code == 200 and 
                services_response.status_code == 200):
                
                patients = patients_response.json()['results']
                doctors = doctors_response.json()
                services = services_response.json()
                
                if patients and doctors and services:
                    # Créer un rendez-vous de test
                    rdv_data = {
                        "patient": patients[0]['id'],
                        "docteur": doctors[0]['id'],
                        "service": services[0]['id'],
                        "date_confirmee": "2024-12-25T10:00:00",
                        "message": "Test de création de RDV par le responsable",
                        "statut": "confirme"
                    }
                    
                    create_rdv_response = requests.post(
                        f"{BASE_URL}/rendez-vous/", 
                        json=rdv_data,
                        headers=headers
                    )
                    
                    print(f"Test création RDV: {create_rdv_response.status_code}")
                    if create_rdv_response.status_code == 201:
                        print("✅ Rendez-vous créé avec succès!")
                        rdv_created = create_rdv_response.json()
                        print(f"   ID: {rdv_created['id']}")
                        print(f"   Patient: {rdv_created['patient']['user']['first_name']} {rdv_created['patient']['user']['last_name']}")
                        print(f"   Médecin: {rdv_created['docteur']['first_name']} {rdv_created['docteur']['last_name']}")
                        print(f"   Service: {rdv_created['service']['nom']}")
                        print(f"   Date: {rdv_created['date_confirmee']}")
                    else:
                        print(f"❌ Erreur création: {create_rdv_response.text}")
                else:
                    print("❌ Données insuffisantes pour créer un RDV")
                    print(f"   Patients: {len(patients)}")
                    print(f"   Médecins: {len(doctors)}")
                    print(f"   Services: {len(services)}")
            else:
                print("❌ Impossible de récupérer les données nécessaires")
            
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n✅ Tests terminés!")

if __name__ == "__main__":
    test_responsable_endpoints()
