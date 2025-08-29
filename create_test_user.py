import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append(os.path.join(os.path.dirname(__file__), 'cabinet_backend'))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User, Patient, Service
from django.contrib.auth.hashers import make_password

def create_test_data():
    """Créer des données de test pour le cabinet"""
    print("🚀 Création des données de test...")
    
    # Créer un utilisateur responsable de cabinet
    try:
        responsable = User.objects.create(
            username='responsable',
            email='responsable@cabinet.com',
            first_name='Responsable',
            last_name='Cabinet',
            phone='+221781234567',
            role='responsable_cabinet',
            password=make_password('responsable123'),
            is_active=True
        )
        print(f"✅ Responsable créé: {responsable.email}")
    except Exception as e:
        print(f"⚠️ Responsable existe déjà ou erreur: {e}")
        responsable = User.objects.get(email='responsable@cabinet.com')
    
    # Créer un médecin
    try:
        docteur = User.objects.create(
            username='docteur',
            email='docteur@cabinet.com',
            first_name='Dr. Mamadou',
            last_name='Diop',
            phone='+221781234568',
            role='doctor',
            speciality='Gynécologie',
            password=make_password('docteur123'),
            is_active=True
        )
        print(f"✅ Médecin créé: {docteur.email}")
    except Exception as e:
        print(f"⚠️ Médecin existe déjà ou erreur: {e}")
        docteur = User.objects.get(email='docteur@cabinet.com')
    
    # Créer un patient
    try:
        patient_user = User.objects.create(
            username='patient',
            email='patient@example.com',
            first_name='Fatou',
            last_name='Sall',
            phone='+221781234569',
            role='patient',
            password=make_password('patient123'),
            is_active=True
        )
        
        patient = Patient.objects.create(
            user=patient_user,
            date_naissance='1990-05-15',
            profession='Enseignante',
            situation_matrimoniale='mariée',
            nombre_enfants=2,
            personne_contact='Moussa Sall',
            telephone_urgence='+221781234570',
            adresse='Rufisque, Sénégal',
            groupe_sanguin='O+',
            allergies='Aucune',
            antecedents_medicaux='Aucun'
        )
        print(f"✅ Patient créé: {patient.user.email}")
    except Exception as e:
        print(f"⚠️ Patient existe déjà ou erreur: {e}")
    
    # Créer des services
    services_data = [
        {
            'nom': 'Consultation générale',
            'description': 'Consultation médicale générale',
            'prix': 5000,
            'actif': True
        },
        {
            'nom': 'Échographie',
            'description': 'Échographie obstétricale',
            'prix': 15000,
            'actif': True
        },
        {
            'nom': 'Suivi de grossesse',
            'description': 'Suivi médical de la grossesse',
            'prix': 8000,
            'actif': True
        },
        {
            'nom': 'Préparation à la naissance',
            'description': 'Séances de préparation à l\'accouchement',
            'prix': 12000,
            'actif': True
        }
    ]
    
    for service_data in services_data:
        try:
            service = Service.objects.create(**service_data)
            print(f"✅ Service créé: {service.nom} - {service.prix} FCFA")
        except Exception as e:
            print(f"⚠️ Service existe déjà ou erreur: {e}")
    
    print("\n📋 Résumé des données créées:")
    print(f"👥 Utilisateurs: {User.objects.count()}")
    print(f"🏥 Patients: {Patient.objects.count()}")
    print(f"💊 Services: {Service.objects.count()}")
    
    print("\n🔑 Identifiants de connexion:")
    print("Responsable: responsable@cabinet.com / responsable123")
    print("Médecin: docteur@cabinet.com / docteur123")
    print("Patient: patient@example.com / patient123")
    
    print("\n✅ Données de test créées avec succès!")

if __name__ == "__main__":
    create_test_data()
