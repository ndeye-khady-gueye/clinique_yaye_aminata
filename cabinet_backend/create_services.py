import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cabinet_backend.settings')
django.setup()

from cabinet.models import Service

# Données des services
services_data = [
    {
        'code': 'CONSULT',
        'nom': 'Consultation générale',
        'description': 'Consultation médicale générale',
        'prix': 5000,
        'duree_consultation': 30
    },
    {
        'code': 'CONTROL',
        'nom': 'Contrôle de tension',
        'description': 'Mesure de la tension artérielle',
        'prix': 2000,
        'duree_consultation': 15
    },
    {
        'code': 'PANSEMENT',
        'nom': 'Pansement',
        'description': 'Soins de pansement',
        'prix': 3000,
        'duree_consultation': 20
    },
    {
        'code': 'GYNECO',
        'nom': 'Consultation gynécologique',
        'description': 'Consultation spécialisée en gynécologie',
        'prix': 8000,
        'duree_consultation': 45
    },
    {
        'code': 'OBSERV',
        'nom': 'Mise en observation',
        'description': 'Surveillance médicale',
        'prix': 10000,
        'duree_consultation': 60
    }
]

# Créer les services
for data in services_data:
    service, created = Service.objects.get_or_create(
        code=data['code'],
        defaults=data
    )
    if created:
        print(f"✅ Service créé: {service.nom} - {service.prix} FCFA")
    else:
        print(f"ℹ️ Service existe déjà: {service.nom}")

print("\n🎉 Services de test créés avec succès!")
