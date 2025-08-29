import os
import sys
import django
from datetime import date

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User, Patient

def create_adja_profile():
    """Créer le profil Patient manquant pour Adja"""
    print("🔍 Création du profil Patient pour Adja")
    print("=" * 50)
    
    # Trouver l'utilisateur Adja
    try:
        adja_user = User.objects.get(first_name='Adja', last_name='diouf')
        print(f"✅ Utilisateur Adja trouvé: {adja_user.first_name} {adja_user.last_name} (ID: {adja_user.id})")
        print(f"   Email: {adja_user.email}")
        print(f"   Rôle: {adja_user.role}")
        
        # Vérifier s'il a déjà un profil Patient
        try:
            existing_profile = adja_user.patient_profile
            print(f"⚠️  Profil Patient existe déjà (ID: {existing_profile.id})")
            return
        except Patient.DoesNotExist:
            print("📋 Création du profil Patient...")
        
        # Créer le profil Patient
        patient_profile = Patient.objects.create(
            user=adja_user,
            date_naissance=date(1990, 1, 1),  # Date par défaut
            adresse="Adresse à compléter",
            profession="Non spécifié",
            situation_matrimoniale="celibataire",
            nombre_enfants=0,
            personne_contact=f"{adja_user.first_name} {adja_user.last_name}",
            telephone_urgence=adja_user.phone or "Non spécifié",
            groupe_sanguin="Non spécifié",
            allergies="Aucune",
            antecedents_medicaux="Aucun"
        )
        
        print(f"✅ Profil Patient créé avec succès!")
        print(f"   ID Patient: {patient_profile.id}")
        print(f"   Adresse: {patient_profile.adresse}")
        print(f"   Profession: {patient_profile.profession}")
        print(f"   Téléphone urgence: {patient_profile.telephone_urgence}")
        
        print("\n🎉 Adja apparaîtra maintenant dans la liste des patients à sélectionner!")
        
    except User.DoesNotExist:
        print("❌ Utilisateur Adja non trouvé")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    create_adja_profile()
