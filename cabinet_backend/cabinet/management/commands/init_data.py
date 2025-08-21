from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from cabinet.models import User, Service
from datetime import date

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialise les données de base pour le cabinet'

    def handle(self, *args, **options):
        self.stdout.write('Initialisation des données de base...')
        
        # Créer l'utilisateur admin
        if not User.objects.filter(email='admin@dev.clinique.sn').exists():
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@dev.clinique.sn',
                password='123456',
                first_name='Super',
                last_name='Admin',
                role='admin',
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(f'✓ Utilisateur admin créé: {admin_user}')
        
        # Créer le responsable cabinet
        if not User.objects.filter(email='responsable@clinique.sn').exists():
            responsable = User.objects.create_user(
                username='responsable',
                email='responsable@clinique.sn',
                password='123456',
                first_name='Mme Fatou',
                last_name='Seck',
                role='responsable_cabinet',
                phone='+221 77 123 45 67'
            )
            self.stdout.write(f'✓ Responsable cabinet créé: {responsable}')
        
        # Créer les docteurs
        docteurs_data = [
            {
                'username': 'dr.diop',
                'email': 'dr.diop@clinique.sn',
                'password': '123456',
                'first_name': 'Dr. Fatou',
                'last_name': 'Diop',
                'role': 'doctor',
                'speciality': 'Cardiologie',
                'phone': '+221 77 234 56 78'
            },
            {
                'username': 'dr.fall',
                'email': 'dr.fall@clinique.sn',
                'password': '123456',
                'first_name': 'Dr. Aminata',
                'last_name': 'Fall',
                'role': 'doctor',
                'speciality': 'Gynécologie',
                'phone': '+221 77 345 67 89'
            },
            {
                'username': 'dr.kane',
                'email': 'dr.kane@clinique.sn',
                'password': '123456',
                'first_name': 'Dr. Moussa',
                'last_name': 'Kane',
                'role': 'doctor',
                'speciality': 'Médecine générale',
                'phone': '+221 77 456 78 90'
            }
        ]
        
        for docteur_data in docteurs_data:
            if not User.objects.filter(email=docteur_data['email']).exists():
                docteur = User.objects.create_user(**docteur_data)
                self.stdout.write(f'✓ Docteur créé: {docteur}')
        
        # Créer les réceptionnistes
        if not User.objects.filter(email='reception@clinique.sn').exists():
            receptionniste = User.objects.create_user(
                username='reception',
                email='reception@clinique.sn',
                password='123456',
                first_name='Aïssatou',
                last_name='Fall',
                role='receptionist',
                phone='+221 77 567 89 01'
            )
            self.stdout.write(f'✓ Réceptionniste créé: {receptionniste}')
        
        # Créer un patient de test
        if not User.objects.filter(email='patient@example.com').exists():
            patient_user = User.objects.create_user(
                username='patient',
                email='patient@example.com',
                password='123456',
                first_name='Mamadou',
                last_name='Ba',
                role='patient',
                phone='+221 77 123 45 67'
            )
            self.stdout.write(f'✓ Patient de test créé: {patient_user}')
        
        # Créer les services
        services_data = [
            {'code': 'SAGE_FEMME', 'nom': 'Consultation Sage femme', 'prix': 5000},
            {'code': 'GYNECO', 'nom': 'Consultation gynéco', 'prix': 7500},
            {'code': 'MEDECIN', 'nom': 'Consultation médecin', 'prix': 5000},
            {'code': 'ENFANT', 'nom': 'Consultation enfant', 'prix': 3000},
            {'code': 'ECHOGRAPHIE', 'nom': 'Échographie', 'prix': 15000},
            {'code': 'PANSEMENT', 'nom': 'Pansement', 'prix': 3000},
            {'code': 'PLANIFICATION', 'nom': 'Planification familiale', 'prix': 3000},
            {'code': 'INJECTION', 'nom': 'Injection', 'prix': 1000},
            {'code': 'DEPISTAGE', 'nom': 'Dépistage Cancer du sein et du col', 'prix': 3000},
            {'code': 'OBSERVATION', 'nom': 'Mise en observation', 'prix': 7500},
            {'code': 'TENSION', 'nom': 'Contrôle Tension', 'prix': 500},
            {'code': 'GLYCEMIE', 'nom': 'Contrôle Glycémie Capillaire', 'prix': 1000}
        ]
        
        for service_data in services_data:
            if not Service.objects.filter(code=service_data['code']).exists():
                service = Service.objects.create(**service_data)
                self.stdout.write(f'✓ Service créé: {service}')
        
        self.stdout.write(self.style.SUCCESS('✓ Initialisation terminée avec succès!'))
        self.stdout.write('\nComptes de test créés:')
        self.stdout.write('- Admin: admin@dev.clinique.sn / 123456')
        self.stdout.write('- Responsable: responsable@clinique.sn / 123456')
        self.stdout.write('- Docteur: dr.diop@clinique.sn / 123456')
        self.stdout.write('- Réceptionniste: reception@clinique.sn / 123456')
        self.stdout.write('- Patient: patient@example.com / 123456')

