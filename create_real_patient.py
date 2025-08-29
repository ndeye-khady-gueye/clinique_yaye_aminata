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

def create_real_patient():
    """Créer un vrai patient"""
    print("🚀 Création d'un vrai patient...")
    
    try:
        # Créer un utilisateur patient
        patient_user = User.objects.create(
            username='patient_test',
            email='patient.test@example.com',
            first_name='Fatou',
            last_name='Sall',
            phone='+221781234573',
            role='patient',
            password=make_password('patient123'),
            is_active=True
        )
        print(f"✅ Utilisateur patient créé: {patient_user.email}")
        
        # Créer le patient
        patient = Patient.objects.create(
            user=patient_user,
            date_naissance='1990-05-15',
            profession='Enseignante',
            situation_matrimoniale='mariée',
            nombre_enfants=2,
            personne_contact='Moussa Sall',
            telephone_urgence='+221781234574',
            adresse='Dakar, Sénégal',
            groupe_sanguin='O+',
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
    create_real_patient()
