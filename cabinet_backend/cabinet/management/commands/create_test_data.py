from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from cabinet.models import Service, RendezVous
from datetime import datetime, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Créer des données de test pour les services et rendez-vous'

    def handle(self, *args, **options):
        self.stdout.write('Création des données de test...')

        # Créer des services de test
        services_data = [
            {
                'code': 'CONS_GEN',
                'nom': 'Consultation Générale',
                'description': 'Consultation médicale générale',
                'prix': 5000,
                'duree_consultation': 30
            },
            {
                'code': 'ECHO',
                'nom': 'Échographie',
                'description': 'Échographie obstétricale ou gynécologique',
                'prix': 15000,
                'duree_consultation': 45
            },
            {
                'code': 'SUIVI_GROSS',
                'nom': 'Suivi de Grossesse',
                'description': 'Suivi médical de la grossesse',
                'prix': 8000,
                'duree_consultation': 40
            },
            {
                'code': 'VACCIN',
                'nom': 'Vaccination',
                'description': 'Service de vaccination',
                'prix': 3000,
                'duree_consultation': 20
            },
            {
                'code': 'DEPISTAGE',
                'nom': 'Dépistage Cancer',
                'description': 'Dépistage cancer sein/col utérus',
                'prix': 12000,
                'duree_consultation': 60
            },
            {
                'code': 'PLAN_FAM',
                'nom': 'Planification Familiale',
                'description': 'Consultation planification familiale',
                'prix': 4000,
                'duree_consultation': 30
            },
            {
                'code': 'IST',
                'nom': 'Traitement IST',
                'description': 'Traitement des infections sexuellement transmissibles',
                'prix': 10000,
                'duree_consultation': 45
            },
            {
                'code': 'POST_NATAL',
                'nom': 'Soin Post Natal',
                'description': 'Soins post-natals',
                'prix': 6000,
                'duree_consultation': 35
            }
        ]

        services_created = []
        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                code=service_data['code'],
                defaults=service_data
            )
            if created:
                self.stdout.write(f'Service créé: {service.nom}')
            services_created.append(service)

        # Créer des rendez-vous de test (clients/visiteurs)
        clients_data = [
            {
                'client_nom': 'Fatou Diop',
                'client_email': 'fatou.diop@email.com',
                'client_telephone': '+221771234567',
                'message': 'Je souhaite une consultation pour un suivi de grossesse.'
            },
            {
                'client_nom': 'Moussa Ba',
                'client_email': 'moussa.ba@email.com',
                'client_telephone': '+221772345678',
                'message': 'Besoin d\'une échographie pour ma femme.'
            },
            {
                'client_nom': 'Aissatou Diallo',
                'client_email': 'aissatou.diallo@email.com',
                'client_telephone': '+221773456789',
                'message': 'Consultation générale pour un problème de santé.'
            },
            {
                'client_nom': 'Ousmane Sow',
                'client_email': 'ousmane.sow@email.com',
                'client_telephone': '+221774567890',
                'message': 'Vaccination pour mon enfant de 2 ans.'
            },
            {
                'client_nom': 'Mariama Cissé',
                'client_email': 'mariama.cisse@email.com',
                'client_telephone': '+221775678901',
                'message': 'Dépistage cancer du sein.'
            }
        ]

        # Créer des dates de test
        base_date = datetime.now()
        dates_souhaitees = [
            base_date + timedelta(days=1, hours=9),  # Demain 9h
            base_date + timedelta(days=2, hours=14), # Après-demain 14h
            base_date + timedelta(days=3, hours=10), # Dans 3 jours 10h
            base_date + timedelta(days=4, hours=16), # Dans 4 jours 16h
            base_date + timedelta(days=5, hours=11), # Dans 5 jours 11h
        ]

        for i, client_data in enumerate(clients_data):
            service = random.choice(services_created)
            date_souhaitee = dates_souhaitees[i] if i < len(dates_souhaitees) else None
            
            rdv = RendezVous.objects.create(
                client_nom=client_data['client_nom'],
                client_email=client_data['client_email'],
                client_telephone=client_data['client_telephone'],
                service=service,
                message=client_data['message'],
                date_souhaitee=date_souhaitee,
                statut='en_attente'
            )
            self.stdout.write(f'Rendez-vous créé: {rdv.client_nom} - {rdv.service.nom}')

        # Créer quelques rendez-vous confirmés
        rdv_confirmes_data = [
            {
                'client_nom': 'Aminata Fall',
                'client_email': 'aminata.fall@email.com',
                'client_telephone': '+221776789012',
                'message': 'Consultation de suivi.',
                'date_confirmee': base_date + timedelta(days=1, hours=15),
                'statut': 'confirme'
            },
            {
                'client_nom': 'Ibrahima Ndiaye',
                'client_email': 'ibrahima.ndiaye@email.com',
                'client_telephone': '+221777890123',
                'message': 'Échographie de contrôle.',
                'date_confirmee': base_date + timedelta(days=2, hours=11),
                'statut': 'assigne'
            }
        ]

        for rdv_data in rdv_confirmes_data:
            service = random.choice(services_created)
            rdv = RendezVous.objects.create(
                client_nom=rdv_data['client_nom'],
                client_email=rdv_data['client_email'],
                client_telephone=rdv_data['client_telephone'],
                service=service,
                message=rdv_data['message'],
                date_confirmee=rdv_data['date_confirmee'],
                statut=rdv_data['statut']
            )
            self.stdout.write(f'Rendez-vous confirmé créé: {rdv.client_nom} - {rdv.service.nom}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Données de test créées avec succès!\n'
                f'- {len(services_created)} services\n'
                f'- {len(clients_data) + len(rdv_confirmes_data)} rendez-vous'
            )
        )
