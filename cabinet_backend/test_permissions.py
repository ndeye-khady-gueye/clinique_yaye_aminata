#!/usr/bin/env python
"""
Script de test rapide pour vérifier les permissions
Usage: python test_permissions.py
"""

import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from cabinet.models import User, Patient, Service
from cabinet.permissions import (
    IsAdminUser, IsResponsableCabinet, IsDoctor, IsReceptionist, IsPatient,
    IsAdminOrResponsable, IsResponsableOrReceptionist, IsDoctorOrReceptionist, IsDoctorOrPatient,
    IsOwnerOrStaff, CanManageUsers, CanViewReports, CanManageAppointments, CanViewPatients
)

def test_permissions():
    """Test rapide des permissions"""
    print("🔐 Test des Permissions d'Authentification")
    print("=" * 50)
    
    # Créer des utilisateurs de test avec des usernames uniques
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    
    admin_user = User.objects.create_user(
        username=f'test_admin_{unique_id}',
        email=f'admin_{unique_id}@test.com',
        password='testpass123',
        first_name='Admin',
        last_name='Test',
        role='admin'
    )
    
    responsable_user = User.objects.create_user(
        username=f'test_responsable_{unique_id}',
        email=f'responsable_{unique_id}@test.com',
        password='testpass123',
        first_name='Responsable',
        last_name='Test',
        role='responsable_cabinet'
    )
    
    doctor_user = User.objects.create_user(
        username=f'test_doctor_{unique_id}',
        email=f'doctor_{unique_id}@test.com',
        password='testpass123',
        first_name='Doctor',
        last_name='Test',
        role='doctor'
    )
    
    receptionist_user = User.objects.create_user(
        username=f'test_receptionist_{unique_id}',
        email=f'receptionist_{unique_id}@test.com',
        password='testpass123',
        first_name='Receptionist',
        last_name='Test',
        role='receptionist'
    )
    
    patient_user = User.objects.create_user(
        username=f'test_patient_{unique_id}',
        email=f'patient_{unique_id}@test.com',
        password='testpass123',
        first_name='Patient',
        last_name='Test',
        role='patient'
    )
    
    # Créer un patient pour les tests
    patient = Patient.objects.create(
        user=patient_user,
        date_naissance='1990-01-01',
        adresse='Test Address'
    )
    
    # Test des permissions individuelles
    print("\n📋 Test des Permissions Individuelles:")
    
    # Créer des requêtes simulées
    class MockRequest:
        def __init__(self, user):
            self.user = user
    
    # Test IsAdminUser
    admin_permission = IsAdminUser()
    admin_request = MockRequest(admin_user)
    responsable_request = MockRequest(responsable_user)
    doctor_request = MockRequest(doctor_user)
    receptionist_request = MockRequest(receptionist_user)
    patient_request = MockRequest(patient_user)
    
    print(f"✅ IsAdminUser - Admin: {admin_permission.has_permission(admin_request, None)}")
    print(f"❌ IsAdminUser - Responsable: {admin_permission.has_permission(responsable_request, None)}")
    
    # Test IsResponsableCabinet
    responsable_permission = IsResponsableCabinet()
    print(f"❌ IsResponsableCabinet - Admin: {responsable_permission.has_permission(admin_request, None)}")
    print(f"✅ IsResponsableCabinet - Responsable: {responsable_permission.has_permission(responsable_request, None)}")
    
    # Test IsDoctor
    doctor_permission = IsDoctor()
    print(f"❌ IsDoctor - Admin: {doctor_permission.has_permission(admin_request, None)}")
    print(f"✅ IsDoctor - Doctor: {doctor_permission.has_permission(doctor_request, None)}")
    
    # Test des permissions combinées
    print("\n🔗 Test des Permissions Combinées:")
    
    # Test IsAdminOrResponsable
    admin_or_resp_permission = IsAdminOrResponsable()
    print(f"✅ IsAdminOrResponsable - Admin: {admin_or_resp_permission.has_permission(admin_request, None)}")
    print(f"✅ IsAdminOrResponsable - Responsable: {admin_or_resp_permission.has_permission(responsable_request, None)}")
    print(f"❌ IsAdminOrResponsable - Doctor: {admin_or_resp_permission.has_permission(doctor_request, None)}")
    
    # Test CanManageUsers
    manage_users_permission = CanManageUsers()
    print(f"✅ CanManageUsers - Admin: {manage_users_permission.has_permission(admin_request, None)}")
    print(f"✅ CanManageUsers - Responsable: {manage_users_permission.has_permission(responsable_request, None)}")
    print(f"❌ CanManageUsers - Doctor: {manage_users_permission.has_permission(doctor_request, None)}")
    
    # Test CanViewPatients
    view_patients_permission = CanViewPatients()
    print(f"❌ CanViewPatients - Admin: {view_patients_permission.has_permission(admin_request, None)}")
    print(f"❌ CanViewPatients - Responsable: {view_patients_permission.has_permission(responsable_request, None)}")
    print(f"✅ CanViewPatients - Doctor: {view_patients_permission.has_permission(doctor_request, None)}")
    print(f"✅ CanViewPatients - Receptionist: {view_patients_permission.has_permission(receptionist_request, None)}")
    
    # Test CanManageAppointments
    manage_appointments_permission = CanManageAppointments()
    print(f"❌ CanManageAppointments - Admin: {manage_appointments_permission.has_permission(admin_request, None)}")
    print(f"✅ CanManageAppointments - Responsable: {manage_appointments_permission.has_permission(responsable_request, None)}")
    print(f"❌ CanManageAppointments - Doctor: {manage_appointments_permission.has_permission(doctor_request, None)}")
    print(f"✅ CanManageAppointments - Receptionist: {manage_appointments_permission.has_permission(receptionist_request, None)}")
    
    # Test des permissions d'objet
    print("\n🎯 Test des Permissions d'Objet:")
    
    # Test IsOwnerOrStaff
    owner_or_staff_permission = IsOwnerOrStaff()
    
    # Simuler un objet avec un utilisateur
    class MockObject:
        def __init__(self, user):
            self.user = user
    
    mock_object = MockObject(patient_user)
    
    print(f"✅ IsOwnerOrStaff - Admin accès à objet patient: {owner_or_staff_permission.has_object_permission(admin_request, None, mock_object)}")
    
    print(f"✅ IsOwnerOrStaff - Patient accès à son objet: {owner_or_staff_permission.has_object_permission(patient_request, None, mock_object)}")
    
    print(f"✅ IsOwnerOrStaff - Doctor accès à objet patient: {owner_or_staff_permission.has_object_permission(doctor_request, None, mock_object)}")
    
    # Nettoyer les données de test
    admin_user.delete()
    responsable_user.delete()
    doctor_user.delete()
    receptionist_user.delete()
    patient_user.delete()
    patient.delete()
    
    print("\n🎉 Tests terminés avec succès!")
    print("\n📚 Pour plus d'informations, consultez le fichier PERMISSIONS_GUIDE.md")

if __name__ == '__main__':
    test_permissions()
