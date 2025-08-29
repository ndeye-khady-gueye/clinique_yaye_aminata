from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import date
from .models import User, Patient

@receiver(post_save, sender=User)
def create_patient_profile(sender, instance, created, **kwargs):
    """
    Créer automatiquement un profil Patient quand un User avec le rôle 'patient' est créé
    """
    if created and instance.role == 'patient':
        # Vérifier si un profil Patient existe déjà
        if not hasattr(instance, 'patient_profile'):
            try:
                Patient.objects.create(
                    user=instance,
                    date_naissance=date(1990, 1, 1),  # Date par défaut
                    adresse="Adresse à compléter",
                    profession="Non spécifié",
                    situation_matrimoniale="celibataire",
                    nombre_enfants=0,
                    personne_contact=f"{instance.first_name} {instance.last_name}",
                    telephone_urgence=instance.phone or "Non spécifié",
                    groupe_sanguin="Non spécifié",
                    allergies="Aucune",
                    antecedents_medicaux="Aucun"
                )
                print(f"✅ Profil Patient créé automatiquement pour {instance.first_name} {instance.last_name}")
            except Exception as e:
                print(f"❌ Erreur création profil Patient pour {instance.first_name} {instance.last_name}: {e}")

@receiver(post_save, sender=User)
def update_patient_profile(sender, instance, created, **kwargs):
    """
    Mettre à jour le profil Patient si l'utilisateur change de rôle vers 'patient'
    """
    if not created and instance.role == 'patient':
        # Vérifier si un profil Patient existe déjà
        if not hasattr(instance, 'patient_profile'):
            try:
                Patient.objects.create(
                    user=instance,
                    date_naissance=date(1990, 1, 1),  # Date par défaut
                    adresse="Adresse à compléter",
                    profession="Non spécifié",
                    situation_matrimoniale="celibataire",
                    nombre_enfants=0,
                    personne_contact=f"{instance.first_name} {instance.last_name}",
                    telephone_urgence=instance.phone or "Non spécifié",
                    groupe_sanguin="Non spécifié",
                    allergies="Aucune",
                    antecedents_medicaux="Aucun"
                )
                print(f"✅ Profil Patient créé automatiquement pour {instance.first_name} {instance.last_name} (changement de rôle)")
            except Exception as e:
                print(f"❌ Erreur création profil Patient pour {instance.first_name} {instance.last_name}: {e}")
