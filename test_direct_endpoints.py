import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_direct_endpoints():
    """Test direct des endpoints pour voir les données disponibles"""
    print("🚀 Test direct des endpoints")
    print("=" * 50)
    
    # Test des patients sans authentification
    print("\n🔍 Test: Patients (sans auth)")
    try:
        patients_response = requests.get(f"{BASE_URL}/patients/")
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
            else:
                print(f"   Nombre de patients: {len(patients_data)}")
        else:
            print(f"❌ Erreur: {patients_response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test des services sans authentification
    print("\n🔍 Test: Services (sans auth)")
    try:
        services_response = requests.get(f"{BASE_URL}/services/actifs/")
        print(f"Status: {services_response.status_code}")
        if services_response.status_code == 200:
            services_data = services_response.json()
            print(f"✅ Services récupérés:")
            print(f"   Nombre: {len(services_data)}")
            if services_data:
                service = services_data[0]
                print(f"   Premier service: {service.get('nom')} - {service.get('prix')} FCFA")
        else:
            print(f"❌ Erreur: {services_response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    # Test des utilisateurs sans authentification
    print("\n🔍 Test: Utilisateurs (sans auth)")
    try:
        users_response = requests.get(f"{BASE_URL}/users/")
        print(f"Status: {users_response.status_code}")
        if users_response.status_code == 200:
            users_data = users_response.json()
            print(f"✅ Utilisateurs récupérés:")
            print(f"   Structure: {type(users_data)}")
            if isinstance(users_data, dict):
                print(f"   Count: {users_data.get('count', 'N/A')}")
                print(f"   Results: {len(users_data.get('results', []))} utilisateurs")
                if users_data.get('results'):
                    # Filtrer les médecins
                    doctors = [u for u in users_data['results'] if u.get('role') == 'doctor']
                    print(f"   Médecins trouvés: {len(doctors)}")
                    if doctors:
                        doctor = doctors[0]
                        print(f"   Premier médecin: {doctor.get('first_name')} {doctor.get('last_name')} - {doctor.get('speciality')}")
            else:
                print(f"   Nombre d'utilisateurs: {len(users_data)}")
        else:
            print(f"❌ Erreur: {users_response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    print("\n✅ Tests terminés!")

if __name__ == "__main__":
    test_direct_endpoints()
