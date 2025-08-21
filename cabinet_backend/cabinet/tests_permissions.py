from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Patient, Service, RendezVous

class PermissionsTestCase(TestCase):
    def setUp(self):
        """Configuration initiale pour les tests"""
        self.client = APIClient()
        
        # Créer différents types d'utilisateurs
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='testpass123',
            first_name='Admin',
            last_name='Test',
            role='admin'
        )
        
        self.responsable_user = User.objects.create_user(
            username='responsable',
            email='responsable@test.com',
            password='testpass123',
            first_name='Responsable',
            last_name='Test',
            role='responsable_cabinet'
        )
        
        self.doctor_user = User.objects.create_user(
            username='doctor',
            email='doctor@test.com',
            password='testpass123',
            first_name='Doctor',
            last_name='Test',
            role='doctor'
        )
        
        self.receptionist_user = User.objects.create_user(
            username='receptionist',
            email='receptionist@test.com',
            password='testpass123',
            first_name='Receptionist',
            last_name='Test',
            role='receptionist'
        )
        
        self.patient_user = User.objects.create_user(
            username='patient',
            email='patient@test.com',
            password='testpass123',
            first_name='Patient',
            last_name='Test',
            role='patient'
        )
        
        # Créer un patient
        self.patient = Patient.objects.create(
            user=self.patient_user,
            date_naissance='1990-01-01',
            adresse='Test Address'
        )
        
        # Créer un service
        self.service = Service.objects.create(
            code='CONS001',
            nom='Consultation Générale',
            prix=5000.00
        )

    def test_admin_can_access_all_users(self):
        """Test que l'admin peut accéder à tous les utilisateurs"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 5)  # Tous les utilisateurs

    def test_responsable_cannot_access_admin_users(self):
        """Test que le responsable ne peut pas voir les admins"""
        self.client.force_authenticate(user=self.responsable_user)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Vérifier qu'il n'y a pas d'admin dans les résultats
        admin_users = [user for user in response.data['results'] if user['role'] == 'admin']
        self.assertEqual(len(admin_users), 0)

    def test_patient_cannot_access_users(self):
        """Test qu'un patient ne peut pas accéder aux utilisateurs"""
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_access_system_stats(self):
        """Test que l'admin peut accéder aux statistiques système"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/users/statistiques_systeme/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_users', response.data)

    def test_responsable_cannot_access_system_stats(self):
        """Test que le responsable ne peut pas accéder aux statistiques système"""
        self.client.force_authenticate(user=self.responsable_user)
        response = self.client.get('/api/users/statistiques_systeme/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_and_responsable_can_access_cabinet_stats(self):
        """Test que admin et responsable peuvent accéder aux stats cabinet"""
        # Test avec admin
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/users/statistiques_cabinet/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test avec responsable
        self.client.force_authenticate(user=self.responsable_user)
        response = self.client.get('/api/users/statistiques_cabinet/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_doctor_cannot_access_cabinet_stats(self):
        """Test qu'un docteur ne peut pas accéder aux stats cabinet"""
        self.client.force_authenticate(user=self.doctor_user)
        response = self.client.get('/api/users/statistiques_cabinet/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_doctor_and_receptionist_can_view_patients(self):
        """Test que docteur et réceptionniste peuvent voir les patients"""
        # Test avec docteur
        self.client.force_authenticate(user=self.doctor_user)
        response = self.client.get('/api/patients/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test avec réceptionniste
        self.client.force_authenticate(user=self.receptionist_user)
        response = self.client.get('/api/patients/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patient_cannot_view_all_patients(self):
        """Test qu'un patient ne peut pas voir tous les patients"""
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get('/api/patients/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_responsable_and_receptionist_can_manage_appointments(self):
        """Test que responsable et réceptionniste peuvent gérer les RDV"""
        # Test avec responsable
        self.client.force_authenticate(user=self.responsable_user)
        response = self.client.get('/api/rendez-vous/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test avec réceptionniste
        self.client.force_authenticate(user=self.receptionist_user)
        response = self.client.get('/api/rendez-vous/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_doctor_cannot_manage_appointments(self):
        """Test qu'un docteur ne peut pas gérer les RDV (seulement voir les siens)"""
        self.client.force_authenticate(user=self.doctor_user)
        response = self.client.get('/api/rendez-vous/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_access_protected_endpoints(self):
        """Test qu'un utilisateur non authentifié ne peut pas accéder aux endpoints protégés"""
        # Test sans authentification
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        response = self.client.get('/api/patients/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        response = self.client.get('/api/rendez-vous/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_patient_can_access_own_data(self):
        """Test qu'un patient peut accéder à ses propres données"""
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(f'/api/patients/{self.patient.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_doctor_can_access_patient_data(self):
        """Test qu'un docteur peut accéder aux données des patients"""
        self.client.force_authenticate(user=self.doctor_user)
        response = self.client.get(f'/api/patients/{self.patient.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_receptionist_can_access_patient_data(self):
        """Test qu'un réceptionniste peut accéder aux données des patients"""
        self.client.force_authenticate(user=self.receptionist_user)
        response = self.client.get(f'/api/patients/{self.patient.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
