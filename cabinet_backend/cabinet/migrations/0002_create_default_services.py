from django.db import migrations

def create_default_services(apps, schema_editor):
    Service = apps.get_model('cabinet', 'Service')
    
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
        Service.objects.get_or_create(
            code=data['code'],
            defaults=data
        )

def reverse_create_default_services(apps, schema_editor):
    Service = apps.get_model('cabinet', 'Service')
    Service.objects.filter(code__in=['CONSULT', 'CONTROL', 'PANSEMENT', 'GYNECO', 'OBSERV']).delete()

class Migration(migrations.Migration):
    dependencies = [
        ('cabinet', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_services, reverse_create_default_services),
    ]
