import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User, Patient
from datetime import date

def test_auto_doctor_creation():
    """Test de création automatique de docteur"""
    print("🔍 Test de création automatique de docteur")
    print("=" * 50)
    
    # Compter les docteurs avant
    doctors_before = User.objects.filter(role='doctor').count()
    
    print(f"Docteurs avant: {doctors_before}")
    
    # Créer un nouvel utilisateur avec le rôle doctor
    try:
        new_doctor = User.objects.create_user(
            username=f"test_doctor_{User.objects.count() + 1}",
            email=f"test_doctor_{User.objects.count() + 1}@test.com",
            password="test123456",
            first_name="Dr. Test",
            last_name="Médecin",
            role="doctor",
            phone="771234568",
            speciality="Médecine générale"
        )
        
        print(f"✅ Docteur créé: {new_doctor.first_name} {new_doctor.last_name} (ID: {new_doctor.id})")
        print(f"   Spécialité: {new_doctor.speciality}")
        
        # Compter les docteurs après
        doctors_after = User.objects.filter(role='doctor').count()
        
        print(f"\n📊 Résumé:")
        print(f"   Docteurs avant: {doctors_before} → après: {doctors_after}")
        
        if doctors_after > doctors_before:
            print("🎉 Le nouveau docteur a été créé avec succès!")
            print("   Il apparaîtra maintenant dans la liste des docteurs du formulaire de rendez-vous.")
        else:
            print("❌ Erreur lors de la création du docteur.")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_auto_doctor_creation()
