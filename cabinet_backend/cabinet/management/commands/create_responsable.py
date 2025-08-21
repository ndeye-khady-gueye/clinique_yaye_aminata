from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from cabinet.models import User

class Command(BaseCommand):
    help = 'Crée un compte responsable de cabinet'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, required=True, help='Nom d\'utilisateur')
        parser.add_argument('--email', type=str, required=True, help='Email')
        parser.add_argument('--password', type=str, required=True, help='Mot de passe')
        parser.add_argument('--first-name', type=str, required=True, help='Prénom')
        parser.add_argument('--last-name', type=str, required=True, help='Nom')
        parser.add_argument('--phone', type=str, help='Numéro de téléphone')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        first_name = options['first_name']
        last_name = options['last_name']
        phone = options.get('phone', '')

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

        # Créer l'utilisateur responsable de cabinet
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            role='responsable_cabinet',
            is_staff=True
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Compte responsable de cabinet créé avec succès:\n'
                f'  Username: {username}\n'
                f'  Email: {email}\n'
                f'  Nom: {first_name} {last_name}\n'
                f'  Téléphone: {phone or "Non renseigné"}\n'
                f'  Rôle: Responsable Cabinet'
            )
        )
