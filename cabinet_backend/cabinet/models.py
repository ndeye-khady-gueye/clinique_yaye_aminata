from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class User(AbstractUser):
    """Modèle utilisateur personnalisé avec rôles"""
    
    ROLE_CHOICES = [
        ('admin', 'Administrateur Système'),
        ('responsable_cabinet', 'Responsable Cabinet'),
        ('doctor', 'Docteur'),
        ('receptionist', 'Réceptionniste'),
        ('patient', 'Patient'),
    ]
    
    user_id = models.PositiveIntegerField(unique=True, null=True, blank=True, verbose_name="ID Utilisateur")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    phone = models.CharField(max_length=15, blank=True, null=True)
    speciality = models.CharField(max_length=100, blank=True, null=True)  # Pour les docteurs
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
    
    def save(self, *args, **kwargs):
        if not self.user_id:
            # Générer automatiquement l'ID utilisateur
            last_user = User.objects.order_by('-user_id').first()
            if last_user and last_user.user_id:
                self.user_id = last_user.user_id + 1
            else:
                self.user_id = 1
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user_id} - {self.first_name} {self.last_name} ({self.get_role_display()})"

class Patient(models.Model):
    """Modèle pour les patients"""
    
    SITUATION_CHOICES = [
        ('celibataire', 'Célibataire'),
        ('marie', 'Marié(e)'),
        ('divorce', 'Divorcé(e)'),
        ('veuf', 'Veuf/Veuve'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_naissance = models.DateField()
    profession = models.CharField(max_length=100, blank=True, null=True)
    situation_matrimoniale = models.CharField(max_length=20, choices=SITUATION_CHOICES, blank=True, null=True)
    nombre_enfants = models.PositiveIntegerField(default=0)
    personne_contact = models.CharField(max_length=100, blank=True, null=True)
    telephone_urgence = models.CharField(max_length=15, blank=True, null=True)
    adresse = models.TextField()
    groupe_sanguin = models.CharField(max_length=5, blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    antecedents_medicaux = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Patient"
        verbose_name_plural = "Patients"
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Service(models.Model):
    """Modèle pour les services médicaux"""
    
    code = models.CharField(max_length=20, unique=True)
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    duree_consultation = models.PositiveIntegerField(default=30)  # en minutes
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Service"
        verbose_name_plural = "Services"
    
    def __str__(self):
        return f"{self.nom} - {self.prix} FCFA"

class RendezVous(models.Model):
    """Modèle pour les rendez-vous"""
    
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirme', 'Confirmé'),
        ('assigne', 'Assigné à un médecin'),
        ('realise', 'Réalisé'),
        ('annule', 'Annulé'),
        ('absent', 'Absent'),
    ]
    
    # Champs pour les patients avec compte
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='rendez_vous', null=True, blank=True)
    
    # Champs pour les clients/visiteurs sans compte
    client_nom = models.CharField(max_length=100, blank=True, null=True)
    client_email = models.EmailField(blank=True, null=True)
    client_telephone = models.CharField(max_length=15, blank=True, null=True)
    
    # Champs communs
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    message = models.TextField(blank=True, null=True)
    date_souhaitee = models.DateTimeField(blank=True, null=True)
    date_confirmee = models.DateTimeField(blank=True, null=True)
    docteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rdv_docteur', limit_choices_to={'role': 'doctor'}, null=True, blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    notes = models.TextField(blank=True, null=True)
    prix_consultation = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Rendez-vous"
        verbose_name_plural = "Rendez-vous"
        ordering = ['-created_at']
    
    def clean(self):
        """Validation personnalisée"""
        from django.core.exceptions import ValidationError
        
        # Vérifier qu'on a soit un patient soit les informations client
        if not self.patient and not (self.client_nom and (self.client_email or self.client_telephone)):
            raise ValidationError("Vous devez fournir soit un patient soit les informations client (nom + email ou téléphone)")
        
        # Si on a un patient, ne pas avoir les champs client
        if self.patient and (self.client_nom or self.client_email or self.client_telephone):
            raise ValidationError("Un rendez-vous ne peut pas avoir à la fois un patient et des informations client")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        if self.patient:
            return f"RDV {self.patient} - {self.service} - {self.date_confirmee or self.date_souhaitee}"
        else:
            return f"RDV {self.client_nom} - {self.service} - {self.date_confirmee or self.date_souhaitee}"

class Consultation(models.Model):
    """Modèle pour les consultations"""
    
    rendez_vous = models.OneToOneField(RendezVous, on_delete=models.CASCADE, related_name='consultation')
    diagnostic = models.TextField()
    traitement = models.TextField()
    ordonnance = models.TextField(blank=True, null=True)
    observations = models.TextField(blank=True, null=True)
    prochain_rdv = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Consultation"
        verbose_name_plural = "Consultations"
    
    def __str__(self):
        return f"Consultation {self.rendez_vous.patient} - {self.rendez_vous.date_rdv}"

class Prescription(models.Model):
    """Modèle pour les prescriptions"""
    
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='prescriptions')
    medicament = models.CharField(max_length=200)
    posologie = models.TextField()
    duree_traitement = models.CharField(max_length=50)
    instructions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Prescription"
        verbose_name_plural = "Prescriptions"
    
    def __str__(self):
        return f"{self.medicament} - {self.consultation.patient}"

class Paiement(models.Model):
    """Modèle pour les paiements"""
    
    MODE_PAIEMENT_CHOICES = [
        ('especes', 'Espèces'),
        ('carte', 'Carte bancaire'),
        ('mobile_money', 'Mobile Money'),
        ('virement', 'Virement bancaire'),
    ]
    
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('paye', 'Payé'),
        ('annule', 'Annulé'),
        ('rembourse', 'Remboursé'),
    ]
    
    rendez_vous = models.ForeignKey(RendezVous, on_delete=models.CASCADE, related_name='paiements')
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    mode_paiement = models.CharField(max_length=20, choices=MODE_PAIEMENT_CHOICES)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    reference = models.CharField(max_length=50, unique=True)
    date_paiement = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Paiement"
        verbose_name_plural = "Paiements"
    
    def __str__(self):
        return f"Paiement {self.reference} - {self.montant} FCFA"

class DossierMedical(models.Model):
    """Modèle pour les dossiers médicaux"""
    
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name='dossier_medical')
    numero_dossier = models.CharField(max_length=20, unique=True)
    groupe_sanguin = models.CharField(max_length=5, blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    antecedents_familiaux = models.TextField(blank=True, null=True)
    antecedents_personnels = models.TextField(blank=True, null=True)
    traitements_en_cours = models.TextField(blank=True, null=True)
    notes_medicales = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Dossier médical"
        verbose_name_plural = "Dossiers médicaux"
    
    def __str__(self):
        return f"Dossier {self.numero_dossier} - {self.patient}"

class Contact(models.Model):
    """Modèle pour les messages de contact"""
    
    nom = models.CharField(max_length=100, verbose_name="Nom et prénom")
    email = models.CharField(max_length=100, verbose_name="Email ou téléphone")
    sujet = models.CharField(max_length=200, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    date_heure_souhaitee = models.DateTimeField(blank=True, null=True, verbose_name="Date et heure souhaitée")
    statut = models.CharField(
        max_length=20, 
        choices=[
            ('nouveau', 'Nouveau'),
            ('lu', 'Lu'),
            ('repondu', 'Répondu'),
            ('traite', 'Traité'),
        ],
        default='nouveau',
        verbose_name="Statut"
    )
    notes_admin = models.TextField(blank=True, null=True, verbose_name="Notes administrateur")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message de {self.nom} - {self.sujet} ({self.created_at.strftime('%d/%m/%Y %H:%M')})"
