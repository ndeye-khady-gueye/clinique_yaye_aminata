from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from cabinet.models import User

class Command(BaseCommand):
    help = 'Crée un compte administrateur système'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, required=True, help='Nom d\'utilisateur')
        parser.add_argument('--email', type=str, required=True, help='Email')
        parser.add_argument('--password', type=str, required=True, help='Mot de passe')
        parser.add_argument('--first-name', type=str, required=True, help='Prénom')
        parser.add_argument('--last-name', type=str, required=True, help='Nom')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        first_name = options['first_name']
        last_name = options['last_name']

        # Vérifier si l'utilisateur existe déjà
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'L\'utilisateur "{username}" existe déjà.')
            )
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'L\'email "{email}" est déjà utilisé.')
            )
            return

        # Créer l'utilisateur administrateur
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role='admin',
            is_staff=True,
            is_superuser=True
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Compte administrateur créé avec succès:\n'
                f'  Username: {username}\n'
                f'  Email: {email}\n'
                f'  Nom: {first_name} {last_name}\n'
                f'  Rôle: Administrateur Système'
            )
        )
