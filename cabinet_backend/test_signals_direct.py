import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User, Patient
from datetime import date

def test_signals_direct():
    """Test direct des signaux Django"""
    print("🔍 Test direct des signaux Django")
    print("=" * 50)
    
    # Compter les patients avant
    patients_before = Patient.objects.count()
    users_patient_before = User.objects.filter(role='patient').count()
    
    print(f"Patients avant: {patients_before}")
    print(f"Utilisateurs patient avant: {users_patient_before}")
    
    # Créer un nouvel utilisateur avec le rôle patient
    try:
        new_user = User.objects.create_user(
            username=f"test_patient_{User.objects.count() + 1}",
            email=f"test_patient_{User.objects.count() + 1}@test.com",
            password="test123456",
            first_name="Test",
            last_name="Patient",
            role="patient",
            phone="771234567"
        )
        
        print(f"✅ Utilisateur créé: {new_user.first_name} {new_user.last_name} (ID: {new_user.id})")
        
        # Vérifier si le profil Patient a été créé automatiquement
        try:
            patient_profile = new_user.patient_profile
            print(f"✅ Profil Patient créé automatiquement! (ID: {patient_profile.id})")
            print(f"   Adresse: {patient_profile.adresse}")
            print(f"   Profession: {patient_profile.profession}")
        except Patient.DoesNotExist:
            print("❌ Profil Patient non créé automatiquement")
        
        # Compter les patients après
        patients_after = Patient.objects.count()
        users_patient_after = User.objects.filter(role='patient').count()
        
        print(f"\n📊 Résumé:")
        print(f"   Patients avant: {patients_before} → après: {patients_after}")
        print(f"   Utilisateurs patient avant: {users_patient_before} → après: {users_patient_after}")
        
        if patients_after > patients_before:
            print("🎉 Le signal fonctionne ! Le profil Patient a été créé automatiquement.")
        else:
            print("❌ Le signal ne fonctionne pas.")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_signals_direct()
