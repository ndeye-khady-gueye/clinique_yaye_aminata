from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.contrib.admin.models import LogEntry, CHANGE, ADDITION
from django.contrib.contenttypes.models import ContentType
from .models import User, Patient, Service, RendezVous, Consultation, Prescription, Paiement, DossierMedical, Contact, PatientEnregistre

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined', 'last_login')
    list_filter = ('role', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informations Personnelles', {'fields': ('first_name', 'last_name', 'email', 'phone')}),
        ('Rôle et Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        ('Dates importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Les non-superusers ne voient que les utilisateurs non-admin
        return qs.exclude(role='admin')
    
    def has_delete_permission(self, request, obj=None):
        # Seuls les superusers peuvent supprimer des utilisateurs
        return request.user.is_superuser

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_naissance', 'profession', 'situation_matrimoniale', 'user_link')
    list_filter = ('date_naissance', 'situation_matrimoniale')
    search_fields = ('user__first_name', 'user__last_name', 'user__email')
    readonly_fields = ('user_link',)
    
    def user_link(self, obj):
        if obj.user:
            url = reverse('admin:cabinet_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.username)
        return "Aucun utilisateur"
    user_link.short_description = 'Utilisateur'

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        
        # Log de l'action
        LogEntry.objects.log_action(
            user_id=request.user.id,
            content_type_id=ContentType.objects.get_for_model(obj).pk,
            object_id=obj.pk,
            object_repr=str(obj),
            action_flag=CHANGE if change else ADDITION,
            change_message="Modification du patient" if change else "Création du patient"
        )

@admin.register(PatientEnregistre)
class PatientEnregistreAdmin(admin.ModelAdmin):
    """Admin pour les patients enregistrés temporairement"""
    list_display = ('nom', 'prenom', 'telephone', 'age', 'motif_visite', 'type_consultation', 'statut', 'date_enregistrement', 'heure_enregistrement')
    list_filter = ('statut', 'type_consultation', 'date_enregistrement')
    search_fields = ('nom', 'prenom', 'telephone', 'email')
    readonly_fields = ('date_enregistrement', 'heure_enregistrement', 'created_at', 'updated_at')
    date_hierarchy = 'date_enregistrement'
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('nom', 'prenom', 'telephone', 'email', 'age')
        }),
        ('Informations médicales', {
            'fields': ('motif_visite', 'observations_notes', 'antecedents_medicaux')
        }),
        ('Consultation', {
            'fields': ('type_consultation', 'prix_consultation', 'statut')
        }),
        ('Informations supplémentaires', {
            'fields': ('profession', 'adresse')
        }),
        ('Horodatage', {
            'fields': ('date_enregistrement', 'heure_enregistrement', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        
        # Log de l'action
        LogEntry.objects.log_action(
            user_id=request.user.id,
            content_type_id=ContentType.objects.get_for_model(obj).pk,
            object_id=obj.pk,
            object_repr=str(obj),
            action_flag=CHANGE if change else ADDITION,
            change_message="Modification du patient enregistré" if change else "Enregistrement d'un nouveau patient"
        )

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('code', 'nom', 'prix', 'duree_consultation', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'nom', 'description')

@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    list_display = ('get_client_info', 'service', 'get_date_info', 'statut', 'docteur', 'prix_consultation')
    list_filter = ('statut', 'service', 'docteur', 'created_at')
    search_fields = ('client_nom', 'client_email', 'client_telephone', 'patient__user__first_name', 'patient__user__last_name', 'docteur__username')
    date_hierarchy = 'created_at'
    actions = ['confirmer_rendez_vous', 'annuler_rendez_vous', 'exporter_rendez_vous']
    
    fieldsets = (
        ('Informations Client/Patient', {
            'fields': ('patient', 'client_nom', 'client_email', 'client_telephone'),
            'description': 'Remplir soit les informations patient soit les informations client'
        }),
        ('Informations Rendez-vous', {
            'fields': ('service', 'message', 'date_souhaitee', 'date_confirmee', 'docteur')
        }),
        ('Statut', {'fields': ('statut', 'notes', 'prix_consultation')}),
    )
    
    def get_client_info(self, obj):
        if obj.patient:
            return f"Patient: {obj.patient.user.first_name} {obj.patient.user.last_name}"
        else:
            return f"Client: {obj.client_nom}"
    get_client_info.short_description = 'Client/Patient'
    
    def get_date_info(self, obj):
        if obj.date_confirmee:
            return f"Confirmé: {obj.date_confirmee.strftime('%d/%m/%Y %H:%M')}"
        elif obj.date_souhaitee:
            return f"Souhaité: {obj.date_souhaitee.strftime('%d/%m/%Y %H:%M')}"
        else:
            return "Aucune date"
    get_date_info.short_description = 'Date'

    def confirmer_rendez_vous(self, request, queryset):
        updated = queryset.update(statut='confirme')
        self.message_user(request, f'{updated} rendez-vous confirmés avec succès.')
    confirmer_rendez_vous.short_description = "Confirmer les rendez-vous sélectionnés"
    
    def annuler_rendez_vous(self, request, queryset):
        updated = queryset.update(statut='annule')
        self.message_user(request, f'{updated} rendez-vous annulés.')
    annuler_rendez_vous.short_description = "Annuler les rendez-vous sélectionnés"
    
    def exporter_rendez_vous(self, request, queryset):
        # Logique d'export
        self.message_user(request, f'Export de {queryset.count()} rendez-vous en cours.')
    exporter_rendez_vous.short_description = "Exporter les rendez-vous sélectionnés"

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('rendez_vous', 'diagnostic', 'traitement', 'prochain_rdv', 'created_at')
    list_filter = ('created_at', 'prochain_rdv')
    search_fields = ('rendez_vous__patient__user__first_name', 'rendez_vous__patient__user__last_name', 'diagnostic')
    date_hierarchy = 'created_at'

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('consultation', 'medicament', 'posologie', 'duree_traitement', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('medicament', 'posologie', 'consultation__rendez_vous__patient__user__first_name')

@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = ('rendez_vous', 'montant', 'mode_paiement', 'statut', 'reference', 'date_paiement')
    list_filter = ('mode_paiement', 'statut', 'date_paiement')
    search_fields = ('reference', 'rendez_vous__patient__user__first_name', 'rendez_vous__patient__user__last_name')
    date_hierarchy = 'date_paiement'
    readonly_fields = ('reference',)

@admin.register(DossierMedical)
class DossierMedicalAdmin(admin.ModelAdmin):
    list_display = ('patient', 'numero_dossier', 'groupe_sanguin', 'allergies', 'created_at')
    list_filter = ('groupe_sanguin', 'created_at')
    search_fields = ('numero_dossier', 'patient__user__first_name', 'patient__user__last_name')
    readonly_fields = ('patient', 'numero_dossier')

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('nom', 'email', 'sujet', 'statut', 'date_heure_souhaitee', 'created_at')
    list_filter = ('statut', 'created_at', 'date_heure_souhaitee')
    search_fields = ('nom', 'email', 'sujet', 'message')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at')
    actions = ['marquer_comme_lu', 'marquer_comme_repondu', 'marquer_comme_traite']
    
    fieldsets = (
        ('Informations Contact', {
            'fields': ('nom', 'email', 'sujet', 'message', 'date_heure_souhaitee')
        }),
        ('Gestion', {
            'fields': ('statut', 'notes_admin')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def marquer_comme_lu(self, request, queryset):
        updated = queryset.update(statut='lu')
        self.message_user(request, f'{updated} messages marqués comme lus.')
    marquer_comme_lu.short_description = "Marquer comme lu"
    
    def marquer_comme_repondu(self, request, queryset):
        updated = queryset.update(statut='repondu')
        self.message_user(request, f'{updated} messages marqués comme répondus.')
    marquer_comme_repondu.short_description = "Marquer comme répondu"
    
    def marquer_comme_traite(self, request, queryset):
        updated = queryset.update(statut='traite')
        self.message_user(request, f'{updated} messages marqués comme traités.')
    marquer_comme_traite.short_description = "Marquer comme traité"
