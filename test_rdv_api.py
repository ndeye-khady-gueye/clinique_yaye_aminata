#!/usr/bin/env python3
"""
Script de test pour vérifier l'API des rendez-vous
"""

import requests
import json

def test_rdv_api():
    """Test de l'API des rendez-vous"""
    
    # Connexion
    login_data = {
        'identifier': 'papa@gmail.com',
        'password': 'Papa1234'
    }
    
    try:
        print("🔄 Connexion...")
        login_response = requests.post('http://127.0.0.1:8000/api/auth/login/', json=login_data)
        
        if login_response.status_code == 200:
            result = login_response.json()
            token = result['tokens']['access']
            print("✅ Token obtenu")
            
            # Récupération des rendez-vous
            headers = {'Authorization': f'Bearer {token}'}
            print("🔄 Récupération des rendez-vous...")
            rdv_response = requests.get('http://127.0.0.1:8000/api/rendez-vous/', headers=headers)
            
            if rdv_response.status_code == 200:
                rdv_data = rdv_response.json()
                print(f"✅ {len(rdv_data)} rendez-vous trouvés")
                
                # Afficher les détails de chaque rendez-vous
                for i, rdv in enumerate(rdv_data[:3], 1):  # Afficher les 3 premiers
                    print(f"\n📋 RDV {i}:")
                    print(f"   ID: {rdv.get('id')}")
                    print(f"   Client nom: {rdv.get('client_nom', 'N/A')}")
                    print(f"   Patient: {rdv.get('patient', 'N/A')}")
                    
                    if rdv.get('patient'):
                        patient = rdv['patient']
                        print(f"     - Patient ID: {patient.get('id')}")
                        if patient.get('user'):
                            user = patient['user']
                            print(f"     - User ID: {user.get('id')}")
                            print(f"     - first_name: {user.get('first_name', 'N/A')}")
                            print(f"     - last_name: {user.get('last_name', 'N/A')}")
                    
                    print(f"   Docteur: {rdv.get('docteur', 'N/A')}")
                    if rdv.get('docteur'):
                        docteur = rdv['docteur']
                        print(f"     - first_name: {docteur.get('first_name', 'N/A')}")
                        print(f"     - last_name: {docteur.get('last_name', 'N/A')}")
                    
                    print(f"   Service: {rdv.get('service', 'N/A')}")
                    if rdv.get('service'):
                        service = rdv['service']
                        print(f"     - nom: {service.get('nom', 'N/A')}")
                        print(f"     - prix: {service.get('prix', 'N/A')}")
                    
                    print(f"   Statut: {rdv.get('statut', 'N/A')}")
            else:
                print(f"❌ Erreur RDV: {rdv_response.status_code}")
                print(f"   Response: {rdv_response.text}")
        else:
            print(f"❌ Erreur login: {login_response.status_code}")
            print(f"   Response: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_rdv_api()
