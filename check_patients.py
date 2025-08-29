import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User, Patient

def check_patients():
    """Vérifier les patients existants dans la base de données"""
    print("🔍 Vérification des patients existants")
    print("=" * 50)
    
    # Récupérer tous les utilisateurs avec le rôle patient
    users_with_patient_role = User.objects.filter(role='patient')
    print(f"Utilisateurs avec rôle patient trouvés: {users_with_patient_role.count()}")
    
    print("\n📋 Liste des utilisateurs patients:")
    for user in users_with_patient_role:
        print(f"   - ID User: {user.id} | {user.first_name} {user.last_name} | Email: {user.email}")
    
    # Récupérer tous les profils Patient
    all_patients = Patient.objects.all()
    print(f"\n📋 Profils Patient existants: {all_patients.count()}")
    
    print("\n📋 Liste des profils Patient:")
    for patient in all_patients:
        user = patient.user
        print(f"   - ID Patient: {patient.id} | User ID: {user.id} | {user.first_name} {user.last_name}")
    
    # Vérifier les utilisateurs sans profil Patient
    print(f"\n🔍 Vérification des utilisateurs sans profil Patient:")
    users_without_profile = []
    for user in users_with_patient_role:
        if not hasattr(user, 'patient_profile'):
            users_without_profile.append(user)
    
    if users_without_profile:
        print(f"   ❌ {len(users_without_profile)} utilisateurs sans profil Patient:")
        for user in users_without_profile:
            print(f"      - ID User: {user.id} | {user.first_name} {user.last_name}")
    else:
        print("   ✅ Tous les utilisateurs patients ont un profil Patient")

if __name__ == "__main__":
    check_patients()
