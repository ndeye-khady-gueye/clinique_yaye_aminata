#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import Service

def create_services():
    services = [
        ('CONSULT', 'Consultation générale', 'Consultation médicale générale', 5000, 30),
        ('CONTROL', 'Contrôle de tension', 'Mesure de la tension artérielle', 2000, 15),
        ('PANSEMENT', 'Pansement', 'Soins de pansement', 3000, 20),
        ('GYNECO', 'Consultation gynécologique', 'Consultation spécialisée en gynécologie', 8000, 45),
        ('OBSERV', 'Mise en observation', 'Surveillance médicale', 10000, 60)
    ]
    
    for code, nom, description, prix, duree in services:
        service, created = Service.objects.get_or_create(
            code=code,
            defaults={
                'nom': nom,
                'description': description,
                'prix': prix,
                'duree_consultation': duree
            }
        )
        if created:
            print(f"✅ Service créé: {service.nom} - {service.prix} FCFA")
        else:
            print(f"ℹ️ Service existe déjà: {service.nom}")

if __name__ == '__main__':
    create_services()
    print("\n🎉 Services créés avec succès!")
