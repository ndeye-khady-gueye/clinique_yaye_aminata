import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append(os.path.join(os.path.dirname(__file__), 'cabinet_backend'))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User
from django.contrib.auth.hashers import make_password

def reset_responsable_password():
    """Réinitialiser le mot de passe du responsable"""
    print("🔧 Réinitialisation du mot de passe du responsable...")
    
    try:
        # Trouver le responsable
        responsable = User.objects.get(username='responsable')
        print(f"✅ Responsable trouvé: {responsable.email}")
        
        # Réinitialiser le mot de passe
        responsable.password = make_password('responsable123')
        responsable.save()
        
        print("✅ Mot de passe réinitialisé avec succès!")
        print(f"   Username: {responsable.username}")
        print(f"   Email: {responsable.email}")
        print(f"   Nouveau mot de passe: responsable123")
        
    except User.DoesNotExist:
        print("❌ Responsable non trouvé!")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    reset_responsable_password()
