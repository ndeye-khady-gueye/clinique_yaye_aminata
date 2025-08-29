import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append(os.path.join(os.path.dirname(__file__), 'cabinet_backend'))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User

def check_users():
    """Vérifier les utilisateurs dans la base de données"""
    print("🔍 Vérification des utilisateurs...")
    
    users = User.objects.all()
    print(f"Total utilisateurs: {users.count()}")
    
    for user in users:
        print(f"👤 {user.username} - {user.email} - {user.role} - Actif: {user.is_active}")
    
    # Chercher spécifiquement le responsable
    try:
        responsable = User.objects.get(email='responsable@cabinet.com')
        print(f"\n✅ Responsable trouvé:")
        print(f"   Username: {responsable.username}")
        print(f"   Email: {responsable.email}")
        print(f"   Role: {responsable.role}")
        print(f"   Actif: {responsable.is_active}")
        print(f"   Mot de passe hashé: {responsable.password[:50]}...")
    except User.DoesNotExist:
        print("\n❌ Responsable non trouvé!")
    
    # Chercher le médecin
    try:
        docteur = User.objects.get(email='docteur@cabinet.com')
        print(f"\n✅ Médecin trouvé:")
        print(f"   Username: {docteur.username}")
        print(f"   Email: {docteur.email}")
        print(f"   Role: {docteur.role}")
        print(f"   Actif: {docteur.is_active}")
    except User.DoesNotExist:
        print("\n❌ Médecin non trouvé!")

if __name__ == "__main__":
    check_users()
