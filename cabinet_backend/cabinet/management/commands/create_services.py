from django.core.management.base import BaseCommand
from cabinet.models import Service

class Command(BaseCommand):
    help = 'Créer des services de test'

    def handle(self, *args, **options):
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

        for data in services_data:
            service, created = Service.objects.get_or_create(
                code=data['code'],
                defaults=data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Service créé: {service.nom} - {service.prix} FCFA')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'ℹ️ Service existe déjà: {service.nom}')
                )

        self.stdout.write(
            self.style.SUCCESS('\n🎉 Services de test créés avec succès!')
        )
