# Generated manually to remove SystemConfiguration and SystemNotification models

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cabinet', '0005_systemconfiguration_systemnotification'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SystemNotification',
        ),
        migrations.DeleteModel(
            name='SystemConfiguration',
        ),
    ]
