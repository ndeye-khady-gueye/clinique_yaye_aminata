#!/usr/bin/env python
"""
Script pour vérifier les données frontend
"""
import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_login():
    login_data = {
        'email': 'admin@dev.clinique.sn',
        'password': 'admin123'
    }
    
    response = requests.post(f'{BASE_URL}/auth/login/', json=login_data)
    if response.status_code == 200:
        return response.json()['tokens']['access']
    return None

def test_empty_fields(token):
    """Test avec des champs vides"""
    headers = {'Authorization': f'Bearer {token}'}
    
    user_data = {
        'username': '',
        'email': '',
        'first_name': '',
        'last_name': '',
        'role': 'patient',
        'phone': '',
        'password': '',
        'password_confirm': '',
        'is_active': True
    }
    
    print("Test avec champs vides:")
    response = requests.post(f'{BASE_URL}/users/', json=user_data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print()

def test_invalid_email(token):
    """Test avec email invalide"""
    headers = {'Authorization': f'Bearer {token}'}
    
    user_data = {
        'username': 'test_invalid',
        'email': 'invalid-email',
        'first_name': 'Test',
        'last_name': 'User',
        'role': 'patient',
        'phone': '123456789',
        'password': 'testpassword123',
        'password_confirm': 'testpassword123',
        'is_active': True
    }
    
    print("Test avec email invalide:")
    response = requests.post(f'{BASE_URL}/users/', json=user_data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print()

def main():
    print("Vérification des données frontend...")
    
    token = test_login()
    if not token:
        print("Erreur de connexion")
        return
    
    test_empty_fields(token)
    test_invalid_email(token)

if __name__ == '__main__':
    main()
