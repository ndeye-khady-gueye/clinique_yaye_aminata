from django.core.management.base import BaseCommand
from cabinet.models import Service

class Command(BaseCommand):
    help = 'Créer les services par défaut pour la clinique'

    def handle(self, *args, **options):
        services_data = [
            {
                'code': 'SUIVI_GROSSESSE',
                'nom': 'Suivi de Grossesse',
                'description': 'Suivi médical complet pendant la grossesse',
                'prix': 15000.00,
                'duree_consultation': 45
            },
            {
                'code': 'PREP_NAISSANCE',
                'nom': 'Préparation à la Naissance',
                'description': 'Préparation physique et psychologique à l\'accouchement',
                'prix': 12000.00,
                'duree_consultation': 60
            },
            {
                'code': 'MONITORING_FOETAL',
                'nom': 'Monitoring Fœtal',
                'description': 'Surveillance du rythme cardiaque fœtal',
                'prix': 8000.00,
                'duree_consultation': 30
            },
            {
                'code': 'EDUC_SANTE',
                'nom': 'Education à la Santé',
                'description': 'Education à la santé durant la grossesse',
                'prix': 10000.00,
                'duree_consultation': 45
            },
            {
                'code': 'SOIN_POST_NATAL',
                'nom': 'Soin Post Natal',
                'description': 'Soins post-accouchement pour la mère et le bébé',
                'prix': 18000.00,
                'duree_consultation': 60
            },
            {
                'code': 'ECHOGRAPHIE',
                'nom': 'Echographie',
                'description': 'Echographie obstétricale',
                'prix': 25000.00,
                'duree_consultation': 30
            },
            {
                'code': 'PLANIF_FAMILIALE',
                'nom': 'Planification Familiale',
                'description': 'Conseil en planification familiale',
                'prix': 8000.00,
                'duree_consultation': 30
            },
            {
                'code': 'DEPISTAGE_CANCER',
                'nom': 'Dépistage Cancer',
                'description': 'Dépistage cancer du sein et du col de l\'utérus',
                'prix': 15000.00,
                'duree_consultation': 45
            },
            {
                'code': 'TRAITEMENT_IST',
                'nom': 'Traitement des IST',
                'description': 'Traitement des infections sexuellement transmissibles',
                'prix': 12000.00,
                'duree_consultation': 30
            },
            {
                'code': 'VACCINATION',
                'nom': 'Vaccination',
                'description': 'Service de vaccination',
                'prix': 5000.00,
                'duree_consultation': 15
            },
            {
                'code': 'CONSULT_GENERALE',
                'nom': 'Consultation Générale',
                'description': 'Consultation gynécologique générale',
                'prix': 10000.00,
                'duree_consultation': 30
            },
            {
                'code': 'CONSULT_LIGNE',
                'nom': 'Consultation en ligne',
                'description': 'Consultation médicale en ligne',
                'prix': 8000.00,
                'duree_consultation': 20
            },
        ]

        created_count = 0
        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                code=service_data['code'],
                defaults=service_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Service créé: {service.nom}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Service déjà existant: {service.nom}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'{created_count} nouveaux services créés avec succès!')
        )
