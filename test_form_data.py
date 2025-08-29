import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_form_data():
    """Test des données nécessaires pour le formulaire de rendez-vous"""
    print("🚀 Test des données du formulaire de rendez-vous")
    print("=" * 50)
    
    # Connexion du médecin
    login_data = {
        "email": "docteur@cabinet.com",
        "password": "docteur123"
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
            print("📊 Test des données du formulaire")
            
            # Test des patients
            print("\n🔍 Test: Patients")
            patients_response = requests.get(f"{BASE_URL}/patients/", headers=headers)
            print(f"Status: {patients_response.status_code}")
            if patients_response.status_code == 200:
                patients_data = patients_response.json()
                print(f"✅ Patients récupérés:")
                print(f"   Structure: {type(patients_data)}")
                if isinstance(patients_data, dict):
                    print(f"   Count: {patients_data.get('count', 'N/A')}")
                    print(f"   Results: {len(patients_data.get('results', []))} patients")
                    if patients_data.get('results'):
                        patient = patients_data['results'][0]
                        print(f"   Premier patient: {patient.get('user', {}).get('first_name')} {patient.get('user', {}).get('last_name')}")
                        print(f"   Structure patient: {json.dumps(patient, indent=2, ensure_ascii=False)}")
                else:
                    print(f"   Nombre de patients: {len(patients_data)}")
                    if patients_data:
                        print(f"   Premier patient: {json.dumps(patients_data[0], indent=2, ensure_ascii=False)}")
            else:
                print(f"❌ Erreur: {patients_response.text}")
            
            # Test des médecins
            print("\n🔍 Test: Médecins")
            doctors_response = requests.get(f"{BASE_URL}/users/?role=doctor", headers=headers)
            print(f"Status: {doctors_response.status_code}")
            if doctors_response.status_code == 200:
                doctors_data = doctors_response.json()
                print(f"✅ Médecins récupérés:")
                print(f"   Nombre: {len(doctors_data)}")
                if doctors_data:
                    doctor = doctors_data[0]
                    print(f"   Premier médecin: {doctor.get('first_name')} {doctor.get('last_name')}")
                    print(f"   Structure médecin: {json.dumps(doctor, indent=2, ensure_ascii=False)}")
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
                    service = services_data[0]
                    print(f"   Premier service: {service.get('nom')} - {service.get('prix')} FCFA")
                    print(f"   Structure service: {json.dumps(service, indent=2, ensure_ascii=False)}")
            else:
                print(f"❌ Erreur: {services_response.text}")
            
        else:
            print(f"❌ Échec de connexion: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n✅ Tests terminés!")

if __name__ == "__main__":
    test_form_data()
