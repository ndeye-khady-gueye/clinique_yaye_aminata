#!/usr/bin/env python
"""
Script pour démarrer le backend Django
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

def main():
    # Ajouter le répertoire du projet au path
    project_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, project_dir)
    
    # Configurer Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
    django.setup()
    
    # Démarrer le serveur
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])

if __name__ == '__main__':
    main()

