import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append(os.path.join(os.path.dirname(__file__), 'cabinet_backend'))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User, Patient
from django.contrib.auth.hashers import make_password

def create_test_patient():
    """Créer un patient de test"""
    print("🚀 Création d'un patient de test...")
    
    try:
        # Créer un utilisateur patient
        patient_user = User.objects.create(
            username='test_patient',
            email='test.patient@example.com',
            first_name='Aminata',
            last_name='Diallo',
            phone='+221781234571',
            role='patient',
            password=make_password('patient123'),
            is_active=True
        )
        print(f"✅ Utilisateur patient créé: {patient_user.email}")
        
        # Créer le patient
        patient = Patient.objects.create(
            user=patient_user,
            date_naissance='1985-03-20',
            profession='Infirmière',
            situation_matrimoniale='mariée',
            nombre_enfants=3,
            personne_contact='Moussa Diallo',
            telephone_urgence='+221781234572',
            adresse='Dakar, Sénégal',
            groupe_sanguin='A+',
            allergies='Aucune',
            antecedents_medicaux='Aucun'
        )
        print(f"✅ Patient créé: {patient.user.first_name} {patient.user.last_name}")
        
        print(f"\n📋 Patient créé avec succès!")
        print(f"   Nom: {patient.user.first_name} {patient.user.last_name}")
        print(f"   Email: {patient.user.email}")
        print(f"   Téléphone: {patient.user.phone}")
        print(f"   Profession: {patient.profession}")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    create_test_patient()
