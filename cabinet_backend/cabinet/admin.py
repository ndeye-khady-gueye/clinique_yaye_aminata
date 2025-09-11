from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.contrib.admin.models import LogEntry, CHANGE, ADDITION
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from django.db.models import Count, Sum, Avg, Q
from django.db.models.functions import TruncMonth, TruncDate
from datetime import timedelta, datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import json
import colorsys
import random
from .models import User, Patient, Service, RendezVous, Consultation, Prescription, Paiement, DossierMedical, Contact, PatientEnregistre

# Fonction pour générer des couleurs dynamiques
def generate_colors(count):
    """Génère une liste de couleurs harmonieuses"""
    if count <= 25:
        # Palette prédéfinie de 25 couleurs
        predefined_colors = [
            '#B0368B', '#6C2476', '#10b981', '#f59e0b', '#ef4444',
            '#3b82f6', '#8b5cf6', '#6b7280', '#84cc16', '#f97316',
            '#06b6d4', '#ec4899', '#8b5a2b', '#059669', '#7c3aed',
            '#dc2626', '#2563eb', '#9333ea', '#0891b2', '#ea580c',
            '#16a34a', '#ca8a04', '#be123c', '#7c2d12', '#1e40af'
        ]
        return predefined_colors[:count]
    else:
        # Génération automatique avec golden angle
        colors = []
        golden_angle = 137.5
        for i in range(count):
            hue = (i * golden_angle) % 360
            saturation = 0.7 + (i % 3) * 0.1  # Variation de saturation
            lightness = 0.5 + (i % 2) * 0.1   # Variation de luminosité
            
            # Conversion HSL vers RGB
            h = hue / 360
            s = saturation
            l = lightness
            
            r, g, b = colorsys.hls_to_rgb(h, l, s)
            hex_color = '#{:02x}{:02x}{:02x}'.format(int(r*255), int(g*255), int(b*255))
            colors.append(hex_color)
        return colors

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
        return qs.exclude(role='admin')
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def changelist_view(self, request, extra_context=None):
        # Vérifier d'abord si c'est une demande d'export PDF
        if request.GET.get('export') == 'pdf':
            return self._render_users_pdf(request)
        
        # Créer une copie des paramètres GET sans 'export' pour éviter les erreurs de filtre
        filtered_request = request
        if 'export' in request.GET:
            # Créer une nouvelle QueryDict sans le paramètre 'export'
            from django.http import QueryDict
            new_get = QueryDict(mutable=True)
            for key, value in request.GET.items():
                if key != 'export':
                    new_get[key] = value
            
            # Créer un objet request modifié
            class FilteredRequest:
                def __init__(self, original_request, new_get):
                    self.__dict__.update(original_request.__dict__)
                    self.GET = new_get
                    self.META = original_request.META
                    self.user = original_request.user
                    self.method = original_request.method
            
            filtered_request = FilteredRequest(request, new_get)
        
        chart_data = self._get_user_chart_data(filtered_request)
        
        # Construire l'URL pour l'export PDF
        from django.urls import reverse
        from urllib.parse import urlencode
        
        # Récupérer les paramètres de filtre actuels
        query_params = dict(request.GET.items())
        query_params['export'] = 'pdf'  # Ajouter le paramètre export
        
        # Construire l'URL avec les paramètres
        base_url = reverse('admin:cabinet_user_changelist')
        pdf_export_url = f"{base_url}?{urlencode(query_params)}"
        
        extra_context = extra_context or {}
        extra_context.update({
            'chart_data_json': chart_data.get('chart_data_json'),
            'total_filtered_count': chart_data.get('total_filtered_count', 0),
            'pdf_export_url': pdf_export_url,
        })
        
        return super().changelist_view(filtered_request, extra_context=extra_context)

    def _get_user_chart_data(self, request):
        cl = self.get_changelist_instance(request)
        queryset = cl.get_queryset(request)
        
        role_data = queryset.values('role').annotate(count=Count('id'))
        role_labels = []
        role_counts = []
        role_translations = {
            'admin': 'Administrateur',
            'doctor': 'Docteur', 
            'patient': 'Patient',
            'receptionist': 'Réceptionniste',
            'responsable_cabinet': 'Responsable Cabinet'
        }
        
        for item in role_data:
            role_labels.append(role_translations.get(item['role'], item['role']))
            role_counts.append(item['count'])
        
        active_count = queryset.filter(is_active=True).count()
        inactive_count = queryset.filter(is_active=False).count()
        
        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_data = (queryset.filter(date_joined__gte=six_months_ago)
                       .annotate(month=TruncMonth('date_joined'))
                       .values('month')
                       .annotate(count=Count('id'))
                       .order_by('month'))
        
        monthly_labels = []
        monthly_counts = []
        for item in monthly_data:
            monthly_labels.append(item['month'].strftime('%B %Y'))
            monthly_counts.append(item['count'])
        
        thirty_days_ago = timezone.now() - timedelta(days=30)
        activity_data = (queryset.filter(last_login__gte=thirty_days_ago)
                        .annotate(day=TruncDate('last_login'))
                        .values('day')
                        .annotate(count=Count('id'))
                        .order_by('day'))
        
        activity_labels = []
        activity_counts = []
        for item in activity_data:
            activity_labels.append(item['day'].strftime('%d/%m'))
            activity_counts.append(item['count'])
        
        chart_data_json = json.dumps({
            'roles': {
                'labels': role_labels,
                'data': role_counts,
                'colors': generate_colors(len(role_labels))
            },
            'status': {
                'labels': ['Actifs', 'Inactifs'],
                'data': [active_count, inactive_count],
                'colors': ['#10b981', '#ef4444']
            },
            'monthly': {
                'labels': monthly_labels,
                'data': monthly_counts,
                'color': '#B0368B'
            },
            'activity': {
                'labels': activity_labels,
                'data': activity_counts,
                'color': '#6C2476'
            }
        })
        
        return {
            'chart_data_json': chart_data_json,
            'total_filtered_count': queryset.count()
        }

    def _render_users_pdf(self, request):
        try:
            print("DEBUG: Début de _render_users_pdf")
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="utilisateurs.pdf"'
            
            print("DEBUG: Response créé")
            doc = SimpleDocTemplate(response, pagesize=A4)
            styles = getSampleStyleSheet()
            story = []
            
            print("DEBUG: Document PDF initialisé")
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=18,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=colors.HexColor('#B0368B')
            )
            story.append(Paragraph("Liste des Utilisateurs", title_style))
            story.append(Spacer(1, 20))
            
            print("DEBUG: Titre ajouté")
            from django.http import QueryDict
            new_get = QueryDict(mutable=True)
            for key, value in request.GET.items():
                if key != 'export':
                    new_get[key] = value
            
            class FilteredRequest:
                def __init__(self, original_request, new_get):
                    self.__dict__.update(original_request.__dict__)
                    self.GET = new_get
                    self.META = original_request.META
                    self.user = original_request.user
                    self.method = original_request.method
            
            filtered_request = FilteredRequest(request, new_get)
            
            print("DEBUG: Request filtré créé")
            cl = self.get_changelist_instance(filtered_request)
            queryset = cl.get_queryset(filtered_request)
            
            print(f"DEBUG: Queryset obtenu - {queryset.count()} utilisateurs")
            data = [['Nom d\'utilisateur', 'Email', 'Nom complet', 'Rôle', 'Statut', 'Date d\'inscription']]
            
            for user in queryset:
                full_name = f"{user.first_name} {user.last_name}".strip() or "N/A"
                status = "Actif" if user.is_active else "Inactif"
                role_translations = {
                    'admin': 'Administrateur',
                    'doctor': 'Docteur',
                    'patient': 'Patient', 
                    'receptionist': 'Réceptionniste',
                    'responsable_cabinet': 'Responsable Cabinet'
                }
                role = role_translations.get(user.role, user.role)
                
                data.append([
                    user.username,
                    user.email,
                    full_name,
                    role,
                    status,
                    user.date_joined.strftime('%d/%m/%Y')
                ])
            
            print(f"DEBUG: Données préparées - {len(data)-1} lignes")
            
            # Calculer les largeurs de colonnes pour s'adapter à la page A4
            from reportlab.lib.units import inch
            page_width = A4[0] - 2*inch  # Largeur page moins marges
            col_widths = [
                page_width * 0.22,  # Nom d'utilisateur - 18%
                page_width * 0.22,  # Email - 25%
                page_width * 0.22,  # Nom complet - 20%
                page_width * 0.22,  # Rôle - 15%
                page_width * 0.15,  # Statut - 10%
                page_width * 0.22   # Date d'inscription - 12%
            ]
            
            table = Table(data, colWidths=col_widths)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#B0368B')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            print("DEBUG: Table créée et stylée")
            story.append(table)
            doc.build(story)
            print("DEBUG: PDF généré avec succès")
            return response
            
        except Exception as e:
            print(f"DEBUG: Erreur dans _render_users_pdf - {str(e)}")
            import traceback
            print(f"DEBUG: Traceback - {traceback.format_exc()}")
            # Retourner une réponse d'erreur
            return HttpResponse(f"Erreur lors de la génération du PDF: {str(e)}", status=500)

@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    list_display = ('get_client_info', 'service', 'get_date_info', 'statut_badge', 'docteur', 'prix_consultation')
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

    def statut_badge(self, obj):
        """Affiche le statut avec des couleurs différentes"""
        statut_colors = {
            'en_attente': '#f59e0b',      # Orange - En attente
            'confirme': '#10b981',        # Vert - Confirmé  
            'assigne': '#3b82f6',         # Bleu - Assigné à un médecin
            'realise': '#8b5cf6',         # Violet - Réalisé
            'annule': '#ef4444',          # Rouge - Annulé
            'absent': '#6b7280',          # Gris - Absent
        }
        
        statut_labels = {
            'en_attente': 'En attente',
            'confirme': 'Confirmé',
            'assigne': 'Assigné à un médecin', 
            'realise': 'Réalisé',
            'annule': 'Annulé',
            'absent': 'Absent',
        }
        
        color = statut_colors.get(obj.statut, '#6b7280')
        label = statut_labels.get(obj.statut, obj.statut)
        
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 12px; font-size: 10px; font-weight: 500; '
            'text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; '
            'display: inline-block;">{}</span>',
            color, label
        )
    statut_badge.short_description = 'Statut'
    statut_badge.admin_order_field = 'statut'

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

    def changelist_view(self, request, extra_context=None):
        # Vérifier d'abord si c'est une demande d'export PDF
        if request.GET.get('export') == 'pdf':
            return self._render_rendez_vous_pdf(request)
        
        # Créer une copie des paramètres GET sans 'export' pour éviter les erreurs de filtre
        filtered_request = request
        if 'export' in request.GET:
            # Créer une nouvelle QueryDict sans le paramètre 'export'
            from django.http import QueryDict
            new_get = QueryDict(mutable=True)
            for key, value in request.GET.items():
                if key != 'export':
                    new_get[key] = value
            
            # Créer un objet request modifié
            class FilteredRequest:
                def __init__(self, original_request, new_get):
                    self.__dict__.update(original_request.__dict__)
                    self.GET = new_get
                    self.META = original_request.META
                    self.user = original_request.user
                    self.method = original_request.method
            
            filtered_request = FilteredRequest(request, new_get)
        
        chart_data = self._get_rendez_vous_chart_data(filtered_request)
        
        # Construire l'URL pour l'export PDF
        from django.urls import reverse
        from urllib.parse import urlencode
        
        # Récupérer les paramètres de filtre actuels
        query_params = dict(request.GET.items())
        query_params['export'] = 'pdf'  # Ajouter le paramètre export
        
        # Construire l'URL avec les paramètres
        base_url = reverse('admin:cabinet_rendezvous_changelist')
        pdf_export_url = f"{base_url}?{urlencode(query_params)}"
        
        extra_context = extra_context or {}
        extra_context.update({
            'chart_data_json': chart_data.get('chart_data_json'),
            'total_filtered_count': chart_data.get('total_filtered_count', 0),
            'pdf_export_url': pdf_export_url,
        })
        
        return super().changelist_view(filtered_request, extra_context=extra_context)

    def _get_rendez_vous_chart_data(self, request):
        cl = self.get_changelist_instance(request)
        queryset = cl.get_queryset(request)
        
        # 1. Graphique par statut
        statut_data = queryset.values('statut').annotate(count=Count('id'))
        statut_labels = []
        statut_counts = []
        statut_colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6']
        
        for item in statut_data:
            statut_labels.append(item['statut'].replace('_', ' ').title())
            statut_counts.append(item['count'])
        
        # 2. Graphique par service (top 10)
        service_data = (queryset.values('service__nom')
                       .annotate(count=Count('id'))
                       .order_by('-count')[:10])
        service_labels = []
        service_counts = []
        
        for item in service_data:
            service_labels.append(item['service__nom'])
            service_counts.append(item['count'])
        
        # 3. Graphique par docteur (top 10)
        docteur_data = (queryset.values('docteur__first_name', 'docteur__last_name', 'docteur__username')
                        .annotate(count=Count('id'))
                        .order_by('-count')[:10])
        docteur_labels = []
        docteur_counts = []
        
        for item in docteur_data:
            if item['docteur__first_name'] or item['docteur__last_name']:
                if item['docteur__first_name'] and item['docteur__last_name']:
                    nom = f"Dr. {item['docteur__first_name']} {item['docteur__last_name']}"
                elif item['docteur__first_name']:
                    nom = f"Dr. {item['docteur__first_name']}"
                else:
                    nom = f"Dr. {item['docteur__last_name']}"
            else:
                nom = f"Dr. {item['docteur__username']}"
            
            docteur_labels.append(nom)
            docteur_counts.append(item['count'])
        
        # 4. Évolution quotidienne (30 derniers jours)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        daily_data = (queryset.filter(date_souhaitee__gte=thirty_days_ago)
                     .annotate(day=TruncDate('date_souhaitee'))
                     .values('day')
                     .annotate(count=Count('id'))
                     .order_by('day'))
        
        daily_labels = []
        daily_counts = []
        for item in daily_data:
            daily_labels.append(item['day'].strftime('%d/%m'))
            daily_counts.append(item['count'])
        
        # 5. Graphique par prix de consultation (tranches)
        price_ranges = [
            (0, 25000, '0-25k'),
            (25000, 50000, '25k-50k'),
            (50000, 75000, '50k-75k'),
            (75000, 100000, '75k-100k'),
            (100000, float('inf'), '100k+')
        ]
        
        price_labels = []
        price_counts = []
        price_colors = ['#B0368B', '#6C2476', '#10b981', '#f59e0b', '#ef4444']
        
        for min_price, max_price, label in price_ranges:
            if max_price == float('inf'):
                count = queryset.filter(prix_consultation__gte=min_price).count()
            else:
                count = queryset.filter(prix_consultation__gte=min_price, prix_consultation__lt=max_price).count()
            
            price_labels.append(label)
            price_counts.append(count)
        
        chart_data_json = json.dumps({
            'statut': {
                'labels': statut_labels,
                'data': statut_counts,
                'colors': statut_colors[:len(statut_labels)]
            },
            'services': {
                'labels': service_labels,
                'data': service_counts,
                'colors': generate_colors(len(service_labels))
            },
            'docteurs': {
                'labels': docteur_labels,
                'data': docteur_counts,
                'colors': generate_colors(len(docteur_labels))
            },
            'daily': {
                'labels': daily_labels,
                'data': daily_counts,
                'color': '#B0368B'
            },
            'prix': {
                'labels': price_labels,
                'data': price_counts,
                'colors': price_colors
            }
        })
        
        return {
            'chart_data_json': chart_data_json,
            'total_filtered_count': queryset.count()
        }

    def _render_rendez_vous_pdf(self, request):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="rendez_vous.pdf"'
        
        doc = SimpleDocTemplate(response, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#B0368B')
        )
        story.append(Paragraph("Liste des Rendez-vous", title_style))
        story.append(Spacer(1, 20))
        
        from django.http import QueryDict
        new_get = QueryDict(mutable=True)
        for key, value in request.GET.items():
            if key != 'export':
                new_get[key] = value
        
        class FilteredRequest:
            def __init__(self, original_request, new_get):
                self.__dict__.update(original_request.__dict__)
                self.GET = new_get
                self.META = original_request.META
                self.user = original_request.user
                self.method = original_request.method
        
        filtered_request = FilteredRequest(request, new_get)
        
        cl = self.get_changelist_instance(filtered_request)
        queryset = cl.get_queryset(filtered_request)
        
        data = [['Client/Patient', 'Service', 'Date', 'Statut', 'Docteur', 'Prix']]
        
        for rendez_vous in queryset:
            client_info = self.get_client_info(rendez_vous)
            date_info = self.get_date_info(rendez_vous)
            
            # Tronquer les textes longs pour éviter les débordements
            client_info = (client_info[:25] + '...') if len(client_info) > 28 else client_info
            service_nom = (rendez_vous.service.nom[:20] + '...') if len(rendez_vous.service.nom) > 23 else rendez_vous.service.nom
            docteur_nom = rendez_vous.docteur.username if rendez_vous.docteur else 'Non assigné'
            docteur_nom = (docteur_nom[:15] + '...') if len(docteur_nom) > 18 else docteur_nom
            
            data.append([
                client_info,
                service_nom,
                date_info,
                rendez_vous.statut,
                docteur_nom,
                f"{rendez_vous.prix_consultation:,.0f} FCFA" if rendez_vous.prix_consultation else "Non défini"
            ])
        
        # Calculer les largeurs de colonnes pour s'adapter à la page A4
        from reportlab.lib.units import inch
        page_width = A4[0] - 2*inch  # Largeur page moins marges
        col_widths = [
            page_width * 0.22,  # Client/Patient - 22%
            page_width * 0.22,  # Service - 18%
            page_width * 0.25,  # Date - 15%
            page_width * 0.22,  # Statut - 12%
            page_width * 0.22,  # Docteur - 15%
            page_width * 0.22   # Prix - 18%
        ]
        
        table = Table(data, colWidths=col_widths)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#B0368B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('WORDWRAP', (0, 0), (-1, -1), True),
            ('LEFTPADDING', (0, 0), (-1, -1), 4),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ]))
        
        story.append(table)
        doc.build(story)
        return response

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('code', 'nom', 'prix', 'duree_consultation', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'nom', 'description')

    def changelist_view(self, request, extra_context=None):
        # Vérifier d'abord si c'est une demande d'export PDF
        if request.GET.get('export') == 'pdf':
            return self._render_services_pdf(request)
        
        # Créer une copie des paramètres GET sans 'export' pour éviter les erreurs de filtre
        filtered_request = request
        if 'export' in request.GET:
            # Créer une nouvelle QueryDict sans le paramètre 'export'
            from django.http import QueryDict
            new_get = QueryDict(mutable=True)
            for key, value in request.GET.items():
                if key != 'export':
                    new_get[key] = value
            
            # Créer un objet request modifié
            class FilteredRequest:
                def __init__(self, original_request, new_get):
                    self.__dict__.update(original_request.__dict__)
                    self.GET = new_get
                    self.META = original_request.META
                    self.user = original_request.user
                    self.method = original_request.method
            
            filtered_request = FilteredRequest(request, new_get)
        
        chart_data = self._get_service_chart_data(filtered_request)
        
        # Construire l'URL pour l'export PDF
        from django.urls import reverse
        from urllib.parse import urlencode
        
        # Récupérer les paramètres de filtre actuels
        query_params = dict(request.GET.items())
        query_params['export'] = 'pdf'  # Ajouter le paramètre export
        
        # Construire l'URL avec les paramètres
        base_url = reverse('admin:cabinet_service_changelist')
        pdf_export_url = f"{base_url}?{urlencode(query_params)}"
        
        extra_context = extra_context or {}
        extra_context.update({
            'chart_data_json': chart_data.get('chart_data_json'),
            'total_filtered_count': chart_data.get('total_filtered_count', 0),
            'pdf_export_url': pdf_export_url,
        })
        
        return super().changelist_view(filtered_request, extra_context=extra_context)

    def _get_service_chart_data(self, request):
        cl = self.get_changelist_instance(request)
        queryset = cl.get_queryset(request)
        
        # 1. Graphique par statut (Actifs/Inactifs)
        active_count = queryset.filter(is_active=True).count()
        inactive_count = queryset.filter(is_active=False).count()
        
        # 2. Graphique par prix (tranches)
        price_ranges = [
            (0, 25000, '0-25k'),
            (25000, 50000, '25k-50k'),
            (50000, 75000, '50k-75k'),
            (75000, 100000, '75k-100k'),
            (100000, float('inf'), '100k+')
        ]
        
        price_labels = []
        price_counts = []
        price_colors = ['#B0368B', '#6C2476', '#10b981', '#f59e0b', '#ef4444']
        
        for min_price, max_price, label in price_ranges:
            if max_price == float('inf'):
                count = queryset.filter(prix__gte=min_price).count()
            else:
                count = queryset.filter(prix__gte=min_price, prix__lt=max_price).count()
            
            price_labels.append(label)
            price_counts.append(count)
        
        # 3. Tous les services avec nombre de RDV (popularité)
        services_with_rdv = (queryset.annotate(rdv_count=Count('rendezvous'))
                             .order_by('-rdv_count', 'nom'))
        
        popular_labels = []
        popular_counts = []
        
        for service in services_with_rdv:
            popular_labels.append(service.nom)
            popular_counts.append(service.rdv_count)
        
        # Générer des couleurs pour tous les services
        popular_colors = generate_colors(len(popular_labels))
        
        # 4. Graphique par durée de consultation (tranches)
        duration_ranges = [
            (0, 30, '15-30 min'),
            (30, 45, '30-45 min'),
            (45, 60, '45-60 min'),
            (60, float('inf'), '60+ min')
        ]
        
        duration_labels = []
        duration_counts = []
        duration_colors = ['#B0368B', '#6C2476', '#10b981', '#f59e0b']
        
        for min_duration, max_duration, label in duration_ranges:
            if max_duration == float('inf'):
                count = queryset.filter(duree_consultation__gte=min_duration).count()
            else:
                count = queryset.filter(duree_consultation__gte=min_duration, duree_consultation__lt=max_duration).count()
            
            duration_labels.append(label)
            duration_counts.append(count)
        
        chart_data_json = json.dumps({
            'statut': {
                'labels': ['Actifs', 'Inactifs'],
                'data': [active_count, inactive_count],
                'colors': ['#10b981', '#ef4444']
            },
            'prix': {
                'labels': price_labels,
                'data': price_counts,
                'colors': price_colors
            },
            'popular': {
                'labels': popular_labels,
                'data': popular_counts,
                'colors': popular_colors
            },
            'duree': {
                'labels': duration_labels,
                'data': duration_counts,
                'colors': duration_colors
            }
        })
        
        return {
            'chart_data_json': chart_data_json,
            'total_filtered_count': queryset.count()
        }

    def _render_services_pdf(self, request):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="services.pdf"'
        
        doc = SimpleDocTemplate(response, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#B0368B')
        )
        story.append(Paragraph("Liste des Services", title_style))
        story.append(Spacer(1, 20))
        
        from django.http import QueryDict
        new_get = QueryDict(mutable=True)
        for key, value in request.GET.items():
            if key != 'export':
                new_get[key] = value
        
        class FilteredRequest:
            def __init__(self, original_request, new_get):
                self.__dict__.update(original_request.__dict__)
                self.GET = new_get
                self.META = original_request.META
                self.user = original_request.user
                self.method = original_request.method
        
        filtered_request = FilteredRequest(request, new_get)
        
        cl = self.get_changelist_instance(filtered_request)
        queryset = cl.get_queryset(filtered_request)
        
        data = [['Code', 'Nom', 'Prix', 'Durée de consultation', 'Actif']]
        
        for service in queryset:
            data.append([
                service.code,
                service.nom,
                service.prix,
                service.duree_consultation,
                "Oui" if service.is_active else "Non"
            ])
        
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#B0368B')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(table)
        doc.build(story)
        return response

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
        
        LogEntry.objects.log_action(
            user_id=request.user.id,
            content_type_id=ContentType.objects.get_for_model(obj).pk,
            object_id=obj.pk,
            object_repr=str(obj),
            action_flag=CHANGE if change else ADDITION,
            change_message="Modification du patient enregistré" if change else "Enregistrement d'un nouveau patient"
        )

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('rendez_vous', 'get_patient_info', 'get_docteur_info', 'diagnostic_format', 'created_at')
    list_filter = ('created_at', 'prochain_rdv')
    search_fields = ('rendez_vous__patient__user__first_name', 'rendez_vous__patient__user__last_name', 'diagnostic')
    date_hierarchy = 'created_at'
    
    def get_patient_info(self, obj):
        if obj.rendez_vous.patient:
            return f"{obj.rendez_vous.patient.user.first_name} {obj.rendez_vous.patient.user.last_name}"
        return obj.rendez_vous.client_nom
    get_patient_info.short_description = 'Patient'
    
    def get_docteur_info(self, obj):
        return f"Dr. {obj.rendez_vous.docteur.first_name} {obj.rendez_vous.docteur.last_name}"
    get_docteur_info.short_description = 'Docteur'
    
    def diagnostic_format(self, obj):
        if obj.diagnostic:
            return obj.diagnostic[:50] + "..." if len(obj.diagnostic) > 50 else obj.diagnostic
        return "Aucun diagnostic"
    diagnostic_format.short_description = 'Diagnostic'

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('consultation', 'get_patient_info', 'medicament', 'posologie', 'duree_traitement', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('medicament', 'posologie', 'consultation__rendez_vous__patient__user__first_name')
    
    def get_patient_info(self, obj):
        if obj.consultation.rendez_vous.patient:
            return f"{obj.consultation.rendez_vous.patient.user.first_name} {obj.consultation.rendez_vous.patient.user.last_name}"
        return obj.consultation.rendez_vous.client_nom
    get_patient_info.short_description = 'Patient'

@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = ('rendez_vous', 'montant_format', 'mode_paiement', 'statut_badge', 'reference', 'date_paiement')
    list_filter = ('mode_paiement', 'statut', 'date_paiement')
    search_fields = ('reference', 'rendez_vous__patient__user__first_name', 'rendez_vous__patient__user__last_name')
    date_hierarchy = 'date_paiement'
    readonly_fields = ('reference',)
    
    def montant_format(self, obj):
        return format_html('<span style="font-weight: bold; color: #10b981;">{:,} FCFA</span>', int(obj.montant))
    montant_format.short_description = 'Montant'
    
    def statut_badge(self, obj):
        colors = {
            'paye': '#10b981',
            'en_attente': '#f59e0b',
            'echec': '#ef4444'
        }
        color = colors.get(obj.statut, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">{}</span>', color, obj.statut.replace('_', ' ').title())
    statut_badge.short_description = 'Statut'

@admin.register(DossierMedical)
class DossierMedicalAdmin(admin.ModelAdmin):
    list_display = ('patient', 'numero_dossier', 'groupe_sanguin', 'allergies_format', 'created_at')
    list_filter = ('groupe_sanguin', 'created_at')
    search_fields = ('numero_dossier', 'patient__user__first_name', 'patient__user__last_name')
    readonly_fields = ('patient', 'numero_dossier')
    
    fieldsets = (
        ('Informations Patient', {
            'fields': ('patient', 'numero_dossier')
        }),
        ('Informations Médicales', {
            'fields': ('groupe_sanguin', 'allergies', 'antecedents_personnels', 'antecedents_familiaux')
        }),
        ('Traitements', {
            'fields': ('traitements_en_cours', 'notes_medicales')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def allergies_format(self, obj):
        if obj.allergies:
            return obj.allergies[:30] + "..." if len(obj.allergies) > 30 else obj.allergies
        return "Aucune allergie connue"
    allergies_format.short_description = 'Allergies'

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('nom', 'email', 'sujet', 'statut_badge', 'date_heure_souhaitee', 'created_at')
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
    
    def statut_badge(self, obj):
        colors = {
            'nouveau': '#f59e0b',
            'lu': '#3b82f6',
            'repondu': '#10b981',
            'traite': '#6b7280'
        }
        color = colors.get(obj.statut, '#6b7280')
        return format_html('<span style="background: {}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">{}</span>', color, obj.statut.title())
    statut_badge.short_description = 'Statut'
    
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
    marquer_comme_traite.short_description = "Marquer comme traité"
