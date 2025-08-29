import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append(os.path.join(os.path.dirname(__file__), 'cabinet_backend'))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User

def check_user_roles():
    """Vérifier les rôles des utilisateurs"""
    print("🔍 Vérification des rôles des utilisateurs")
    print("=" * 50)
    
    users = User.objects.all()
    print(f"Nombre total d'utilisateurs: {users.count()}")
    
    for user in users:
        print(f"👤 {user.first_name} {user.last_name}")
        print(f"   Email: {user.email}")
        print(f"   Rôle: {user.role}")
        print(f"   Actif: {user.is_active}")
        print(f"   Date création: {user.created_at}")
        print("-" * 30)

if __name__ == "__main__":
    check_user_roles()
