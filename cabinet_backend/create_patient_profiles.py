import os
import sys
import django
from datetime import date

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User, Patient

def create_patient_profiles():
    """Créer des profils Patient pour les utilisateurs avec le rôle patient"""
    print("🔍 Création des profils Patient")
    print("=" * 50)
    
    # Récupérer tous les utilisateurs avec le rôle patient
    users_with_patient_role = User.objects.filter(role='patient')
    print(f"Utilisateurs avec rôle patient trouvés: {users_with_patient_role.count()}")
    
    created_count = 0
    existing_count = 0
    
    for user in users_with_patient_role:
        # Vérifier si un profil Patient existe déjà
        if hasattr(user, 'patient_profile'):
            print(f"⚠️  Profil Patient existe déjà pour {user.first_name} {user.last_name}")
            existing_count += 1
            continue
        
        try:
            # Créer un profil Patient
            patient = Patient.objects.create(
                user=user,
                date_naissance=date(1990, 1, 1),  # Date par défaut
                adresse="Adresse par défaut",
                profession="Non spécifié",
                situation_matrimoniale="celibataire",
                nombre_enfants=0,
                personne_contact=f"{user.first_name} {user.last_name}",
                telephone_urgence=user.phone or "Non spécifié",
                groupe_sanguin="Non spécifié",
                allergies="Aucune",
                antecedents_medicaux="Aucun"
            )
            
            print(f"✅ Profil Patient créé pour {user.first_name} {user.last_name} (ID: {patient.id})")
            created_count += 1
            
        except Exception as e:
            print(f"❌ Erreur création profil pour {user.first_name} {user.last_name}: {e}")
    
    print(f"\n📊 Résumé:")
    print(f"   Profils créés: {created_count}")
    print(f"   Profils existants: {existing_count}")
    print(f"   Total: {created_count + existing_count}")

if __name__ == "__main__":
    create_patient_profiles()
