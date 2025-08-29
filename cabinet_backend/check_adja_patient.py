import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User, Patient

def check_adja_patient():
    """Vérifier spécifiquement l'utilisateur Adja"""
    print("🔍 Vérification de l'utilisateur Adja")
    print("=" * 50)
    
    # Chercher l'utilisateur Adja
    adja_users = User.objects.filter(first_name__icontains='Adja')
    print(f"Utilisateurs avec 'Adja' dans le prénom: {adja_users.count()}")
    
    for user in adja_users:
        print(f"\n📋 Utilisateur trouvé:")
        print(f"   ID: {user.id}")
        print(f"   Nom complet: {user.first_name} {user.last_name}")
        print(f"   Email: {user.email}")
        print(f"   Rôle: {user.role}")
        print(f"   Téléphone: {user.phone}")
        
        # Vérifier s'il a un profil Patient
        try:
            patient_profile = user.patient_profile
            print(f"   ✅ Profil Patient: OUI (ID: {patient_profile.id})")
            print(f"   Adresse: {patient_profile.adresse}")
            print(f"   Profession: {patient_profile.profession}")
        except Patient.DoesNotExist:
            print(f"   ❌ Profil Patient: NON")
    
    # Chercher aussi par nom de famille
    adja_lastname_users = User.objects.filter(last_name__icontains='Adja')
    print(f"\nUtilisateurs avec 'Adja' dans le nom: {adja_lastname_users.count()}")
    
    for user in adja_lastname_users:
        print(f"\n📋 Utilisateur trouvé (nom):")
        print(f"   ID: {user.id}")
        print(f"   Nom complet: {user.first_name} {user.last_name}")
        print(f"   Email: {user.email}")
        print(f"   Rôle: {user.role}")
        
        # Vérifier s'il a un profil Patient
        try:
            patient_profile = user.patient_profile
            print(f"   ✅ Profil Patient: OUI (ID: {patient_profile.id})")
        except Patient.DoesNotExist:
            print(f"   ❌ Profil Patient: NON")
    
    # Lister tous les patients pour voir s'il y a un Adja
    print(f"\n📋 Tous les patients:")
    all_patients = Patient.objects.all()
    for patient in all_patients:
        if 'adja' in patient.user.first_name.lower() or 'adja' in patient.user.last_name.lower():
            print(f"   ✅ Patient Adja trouvé: {patient.user.first_name} {patient.user.last_name} (ID Patient: {patient.id}, ID User: {patient.user.id})")

if __name__ == "__main__":
    check_adja_patient()
