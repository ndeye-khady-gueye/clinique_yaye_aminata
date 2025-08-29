import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_users_data():
    """Test des données des utilisateurs pour le formulaire"""
    print("🚀 Test des données des utilisateurs")
    print("=" * 50)
    
    # Connexion du responsable
    login_data = {
        "email": "responsable@test.com",
        "password": "responsable123"
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
            
            print("\n" + "=" * 50)
            print("📊 Test des données des utilisateurs")
            
            # Test des patients (utilisateurs avec role=patient)
            print("\n🔍 Test: Patients (utilisateurs avec role=patient)")
            patients_response = requests.get(f"{BASE_URL}/users/?role=patient", headers=headers)
            print(f"Status: {patients_response.status_code}")
            if patients_response.status_code == 200:
                patients_data = patients_response.json()
                print(f"✅ Patients récupérés:")
                print(f"   Structure: {type(patients_data)}")
                if isinstance(patients_data, dict):
                    print(f"   Count: {patients_data.get('count', 'N/A')}")
                    print(f"   Results: {len(patients_data.get('results', []))} patients")
                    if patients_data.get('results'):
                        for i, patient in enumerate(patients_data['results'][:3]):  # Afficher les 3 premiers
                            print(f"   Patient {i+1}: {patient.get('first_name')} {patient.get('last_name')} ({patient.get('email')})")
                else:
                    print(f"   Nombre de patients: {len(patients_data)}")
                    for i, patient in enumerate(patients_data[:3]):  # Afficher les 3 premiers
                        print(f"   Patient {i+1}: {patient.get('first_name')} {patient.get('last_name')} ({patient.get('email')})")
            else:
                print(f"❌ Erreur: {patients_response.text}")
            
            # Test des médecins (utilisateurs avec role=doctor)
            print("\n🔍 Test: Médecins (utilisateurs avec role=doctor)")
            doctors_response = requests.get(f"{BASE_URL}/users/?role=doctor", headers=headers)
            print(f"Status: {doctors_response.status_code}")
            if doctors_response.status_code == 200:
                doctors_data = doctors_response.json()
                print(f"✅ Médecins récupérés:")
                print(f"   Structure: {type(doctors_data)}")
                if isinstance(doctors_data, dict):
                    print(f"   Count: {doctors_data.get('count', 'N/A')}")
                    print(f"   Results: {len(doctors_data.get('results', []))} médecins")
                    if doctors_data.get('results'):
                        for i, doctor in enumerate(doctors_data['results']):
                            print(f"   Médecin {i+1}: Dr. {doctor.get('first_name')} {doctor.get('last_name')} - {doctor.get('speciality', 'Spécialité non définie')}")
                else:
                    print(f"   Nombre de médecins: {len(doctors_data)}")
                    for i, doctor in enumerate(doctors_data):
                        print(f"   Médecin {i+1}: Dr. {doctor.get('first_name')} {doctor.get('last_name')} - {doctor.get('speciality', 'Spécialité non définie')}")
            else:
                print(f"❌ Erreur: {doctors_response.text}")
            
            # Test des services
            print("\n🔍 Test: Services")
            services_response = requests.get(f"{BASE_URL}/services/actifs/", headers=headers)
            print(f"Status: {services_response.status_code}")
            if services_response.status_code == 200:
                services_data = services_response.json()
                print(f"✅ Services récupérés:")
                print(f"   Nombre: {len(services_data)}")
                if services_data:
                    for i, service in enumerate(services_data[:3]):  # Afficher les 3 premiers
                        print(f"   Service {i+1}: {service.get('nom')} - {service.get('prix')} FCFA")
            else:
                print(f"❌ Erreur: {services_response.text}")
            
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n✅ Tests terminés!")

if __name__ == "__main__":
    test_users_data()
