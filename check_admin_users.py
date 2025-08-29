import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import User

def check_admin_users():
    """Vérifier les utilisateurs admin disponibles"""
    print("🔍 Vérification des utilisateurs admin")
    print("=" * 50)
    
    # Récupérer tous les utilisateurs admin
    admin_users = User.objects.filter(role='admin')
    print(f"Utilisateurs admin trouvés: {admin_users.count()}")
    
    print("\n📋 Liste des utilisateurs admin:")
    for user in admin_users:
        print(f"   - ID: {user.id} | {user.first_name} {user.last_name} | Email: {user.email}")
    
    # Récupérer aussi les responsables de cabinet
    responsable_users = User.objects.filter(role='responsable_cabinet')
    print(f"\n📋 Liste des responsables de cabinet:")
    for user in responsable_users:
        print(f"   - ID: {user.id} | {user.first_name} {user.last_name} | Email: {user.email}")

if __name__ == "__main__":
    check_admin_users()
