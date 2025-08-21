# Personnalisation de l'Interface d'Administration Django

## Vue d'ensemble

Ce guide vous explique comment personnaliser l'interface d'administration Django (`http://127.0.0.1:8000/admin/`) pour la Clinique Yaye Aminata.

## 1. Configuration de l'Admin Django

### 1.1 Personnalisation des Modèles Admin

Créez ou modifiez le fichier `cabinet_backend/cabinet/admin.py` :

```python
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import User, Patient, Service, RendezVous, Consultation, Prescription, Paiement, DossierMedical

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

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'date_naissance', 'telephone', 'email', 'user_link')
    list_filter = ('date_naissance', 'sexe')
    search_fields = ('nom', 'prenom', 'telephone', 'email')
    readonly_fields = ('user_link',)
    
    def user_link(self, obj):
        if obj.user:
            url = reverse('admin:cabinet_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.username)
        return "Aucun utilisateur"
    user_link.short_description = 'Utilisateur'

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('nom', 'description', 'prix', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('nom', 'description')

@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    list_display = ('patient', 'docteur', 'service', 'date_rdv', 'heure_rdv', 'statut', 'created_at')
    list_filter = ('statut', 'date_rdv', 'docteur', 'service')
    search_fields = ('patient__nom', 'patient__prenom', 'docteur__username')
    date_hierarchy = 'date_rdv'
    
    fieldsets = (
        ('Informations Patient', {'fields': ('patient',)}),
        ('Informations Rendez-vous', {'fields': ('docteur', 'service', 'date_rdv', 'heure_rdv')}),
        ('Statut', {'fields': ('statut', 'notes')}),
    )

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'docteur', 'date_consultation', 'diagnostic', 'traitement')
    list_filter = ('date_consultation', 'docteur')
    search_fields = ('patient__nom', 'patient__prenom', 'diagnostic')
    date_hierarchy = 'date_consultation'

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('consultation', 'medicament', 'posologie', 'duree_traitement')
    list_filter = ('duree_traitement',)
    search_fields = ('medicament', 'posologie')

@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = ('rendez_vous', 'montant', 'mode_paiement', 'statut', 'date_paiement')
    list_filter = ('mode_paiement', 'statut', 'date_paiement')
    search_fields = ('rendez_vous__patient__nom', 'rendez_vous__patient__prenom')
    date_hierarchy = 'date_paiement'

@admin.register(DossierMedical)
class DossierMedicalAdmin(admin.ModelAdmin):
    list_display = ('patient', 'groupe_sanguin', 'allergies', 'antecedents_medicaux')
    search_fields = ('patient__nom', 'patient__prenom')
    readonly_fields = ('patient',)
```

### 1.2 Personnalisation du Site Admin

Modifiez le fichier `cabinet_backend/cabinet_backend/settings.py` :

```python
# Configuration de l'admin Django
ADMIN_SITE_HEADER = "Clinique Yaye Aminata - Administration"
ADMIN_SITE_TITLE = "Administration Clinique"
ADMIN_INDEX_TITLE = "Tableau de bord de la Clinique Yaye Aminata"
```

### 1.3 Personnalisation des URLs Admin

Modifiez le fichier `cabinet_backend/cabinet_backend/urls.py` :

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Personnalisation de l'admin
admin.site.site_header = "Clinique Yaye Aminata - Administration"
admin.site.site_title = "Administration Clinique"
admin.site.index_title = "Tableau de bord de la Clinique Yaye Aminata"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('cabinet.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## 2. Personnalisation Visuelle

### 2.1 Création d'un Template Admin Personnalisé

Créez le dossier `cabinet_backend/templates/admin/` et ajoutez un fichier `base_site.html` :

```html
{% extends "admin/base_site.html" %}
{% load static %}

{% block title %}{{ title }} | Clinique Yaye Aminata{% endblock %}

{% block extrastyle %}
<style>
    :root {
        --primary: #2563eb;
        --secondary: #64748b;
        --accent: #f59e0b;
        --primary-fg: #ffffff;
        --body-fg: #333333;
        --body-bg: #f8fafc;
        --header-color: #ffffff;
        --header-branding-color: #ffffff;
        --header-bg: #1e40af;
        --header-link-color: #ffffff;
    }

    #header {
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    #branding h1 {
        color: #ffffff;
        font-weight: 600;
    }

    .module h2, .module caption, .inline-group h2 {
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        color: #ffffff;
    }

    div.breadcrumbs {
        background: #f1f5f9;
        color: #64748b;
        border-bottom: 1px solid #e2e8f0;
    }

    div.breadcrumbs a {
        color: #2563eb;
    }

    div.breadcrumbs a:hover {
        color: #1e40af;
    }

    .button, input[type=submit], input[type=button], .submit-row input, a.button {
        background: #2563eb;
        color: #ffffff;
        border-radius: 6px;
        border: none;
        padding: 8px 16px;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .button:hover, input[type=submit]:hover, input[type=button]:hover, .submit-row input:hover, a.button:hover {
        background: #1e40af;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
    }

    .button.default, input[type=submit].default, .submit-row input.default {
        background: #059669;
    }

    .button.default:hover, input[type=submit].default:hover, .submit-row input.default:hover {
        background: #047857;
    }

    .object-tools a:link, .object-tools a:visited {
        background: #2563eb;
        color: #ffffff;
        border-radius: 6px;
        padding: 8px 16px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .object-tools a:hover {
        background: #1e40af;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
    }

    .module {
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border: 1px solid #e2e8f0;
    }

    .module h2 {
        border-radius: 8px 8px 0 0;
    }

    table {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    thead th {
        background: #f8fafc;
        color: #374151;
        font-weight: 600;
        border-bottom: 2px solid #e5e7eb;
    }

    tbody tr:hover {
        background: #f1f5f9;
    }

    .field-get_user_link a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;
    }

    .field-get_user_link a:hover {
        color: #1e40af;
        text-decoration: underline;
    }

    /* Badges pour les statuts */
    .field-statut {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
    }

    .field-statut.confirme {
        background: #dcfce7;
        color: #166534;
    }

    .field-statut.annule {
        background: #fef2f2;
        color: #dc2626;
    }

    .field-statut.en_attente {
        background: #fef3c7;
        color: #d97706;
    }

    /* Responsive */
    @media (max-width: 768px) {
        #header {
            padding: 10px;
        }
        
        #branding h1 {
            font-size: 18px;
        }
        
        .module {
            margin: 10px 0;
        }
    }
</style>
{% endblock %}

{% block branding %}
<h1 id="site-name">
    <img src="{% static 'admin/img/logo.png' %}" alt="Logo" style="height: 30px; margin-right: 10px;">
    Clinique Yaye Aminata - Administration
</h1>
{% endblock %}

{% block nav-global %}{% endblock %}
```

### 2.2 Ajout d'un Logo

Créez le dossier `cabinet_backend/static/admin/img/` et ajoutez votre logo `logo.png`.

### 2.3 Configuration des Templates

Ajoutez dans `cabinet_backend/cabinet_backend/settings.py` :

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Ajoutez cette ligne
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Configuration des fichiers statiques
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
```

## 3. Fonctionnalités Avancées

### 3.1 Actions Personnalisées

Ajoutez dans `cabinet_backend/cabinet/admin.py` :

```python
@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    # ... configuration existante ...
    
    actions = ['confirmer_rendez_vous', 'annuler_rendez_vous', 'exporter_rendez_vous']
    
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
```

### 3.2 Filtres Personnalisés

```python
from django.contrib.admin import SimpleListFilter

class StatutRendezVousFilter(SimpleListFilter):
    title = 'Statut Rendez-vous'
    parameter_name = 'statut_rdv'

    def lookups(self, request, model_admin):
        return (
            ('confirme', 'Confirmé'),
            ('annule', 'Annulé'),
            ('en_attente', 'En attente'),
        )

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(statut=self.value())
```

### 3.3 Dashboard Personnalisé

Créez un fichier `cabinet_backend/cabinet/admin_views.py` :

```python
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
from .models import User, Patient, RendezVous, Paiement

@staff_member_required
def admin_dashboard(request):
    # Statistiques générales
    total_users = User.objects.count()
    total_patients = Patient.objects.count()
    total_appointments = RendezVous.objects.count()
    total_payments = Paiement.objects.count()
    
    # Rendez-vous du jour
    today = timezone.now().date()
    appointments_today = RendezVous.objects.filter(date_rdv=today).count()
    
    # Revenus du mois
    month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_revenue = Paiement.objects.filter(
        date_paiement__gte=month_start,
        statut='paye'
    ).aggregate(total=Sum('montant'))['total'] or 0
    
    # Utilisateurs par rôle
    users_by_role = User.objects.values('role').annotate(count=Count('id'))
    
    context = {
        'total_users': total_users,
        'total_patients': total_patients,
        'total_appointments': total_appointments,
        'total_payments': total_payments,
        'appointments_today': appointments_today,
        'monthly_revenue': monthly_revenue,
        'users_by_role': users_by_role,
    }
    
    return render(request, 'admin/dashboard.html', context)
```

## 4. Sécurité et Permissions

### 4.1 Restriction d'Accès

```python
# Dans admin.py
class UserAdmin(BaseUserAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Les non-superusers ne voient que les utilisateurs non-admin
        return qs.exclude(role='admin')
    
    def has_delete_permission(self, request, obj=None):
        # Seuls les superusers peuvent supprimer des utilisateurs
        return request.user.is_superuser
```

### 4.2 Audit Trail

```python
from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.contenttypes.models import ContentType

class PatientAdmin(admin.ModelAdmin):
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
```

## 5. Déploiement

### 5.1 Collecte des Fichiers Statiques

```bash
python manage.py collectstatic
```

### 5.2 Configuration de Production

Dans `settings.py` pour la production :

```python
DEBUG = False
ALLOWED_HOSTS = ['votre-domaine.com', 'www.votre-domaine.com']

# Sécurité
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

## 6. Utilisation

1. **Accès à l'admin** : `http://127.0.0.1:8000/admin/`
2. **Créer un superuser** : `python manage.py createsuperuser`
3. **Personnaliser** : Modifiez les fichiers selon vos besoins
4. **Déployer** : Suivez les étapes de déploiement

## 7. Avantages de cette Personnalisation

- **Interface moderne** : Design professionnel et responsive
- **Fonctionnalités avancées** : Actions en lot, filtres personnalisés
- **Sécurité renforcée** : Permissions granulaires, audit trail
- **Expérience utilisateur** : Navigation intuitive, informations contextuelles
- **Maintenance facilitée** : Code organisé, documentation complète

Cette personnalisation transforme l'interface d'administration Django standard en une interface moderne et fonctionnelle adaptée aux besoins de la Clinique Yaye Aminata.
