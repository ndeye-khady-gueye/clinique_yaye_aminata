#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import Service

# Créer un service simple
service, created = Service.objects.get_or_create(
    code='CONSULT',
    defaults={
        'nom': 'Consultation générale',
        'description': 'Consultation médicale générale',
        'prix': 5000,
        'duree_consultation': 30
    }
)

if created:
    print(f"✅ Service créé: {service.nom} (ID: {service.id})")
else:
    print(f"ℹ️ Service existe déjà: {service.nom} (ID: {service.id})")

# Afficher tous les services
services = Service.objects.all()
print(f"\n📋 Services disponibles ({services.count()}):")
for s in services:
    print(f"- ID: {s.id}, Code: {s.code}, Nom: {s.nom}, Prix: {s.prix} FCFA")
