from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from django.conf import settings
import uuid
import os
import psutil

from .models import User, Patient, Service, RendezVous, Consultation, Prescription, Paiement, DossierMedical
from .serializers import (
    UserSerializer, UserCreateSerializer, RegisterSerializer, LoginSerializer, PatientSerializer, PatientCreateSerializer,
    ServiceSerializer, RendezVousSerializer, RendezVousCreateSerializer, ConsultationSerializer,
    PrescriptionSerializer, PaiementSerializer, DossierMedicalSerializer, StatistiquesSerializer
)
from .permissions import (
    IsAdminUser, IsResponsableCabinet, IsDoctor, IsReceptionist, IsPatient,
    IsAdminOrResponsable, IsResponsableOrReceptionist, IsDoctorOrReceptionist, IsDoctorOrPatient,
    IsOwnerOrStaff, CanManageUsers, CanViewReports, CanManageAppointments, CanViewPatients
)

class AuthViewSet(viewsets.ViewSet):
    """Vues pour l'authentification"""
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """Connexion utilisateur"""
        print(f"Login request data: {request.data}")  # Debug log
        print(f"Login request content type: {request.content_type}")  # Debug log
        
        serializer = LoginSerializer(data=request.data)
        print(f"Serializer is valid: {serializer.is_valid()}")  # Debug log
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")  # Debug log
            
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'success': True,
                'message': 'Connexion réussie',
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        """Déconnexion utilisateur"""
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'success': True, 'message': 'Déconnexion réussie'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Récupérer les informations de l'utilisateur connecté"""
        return Response(UserSerializer(request.user).data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Inscription d'un nouvel utilisateur (patients uniquement)"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'success': True,
                'message': 'Inscription réussie',
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminViewSet(viewsets.ViewSet):
    """Vues d'administration système"""
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def system_metrics(self, request):
        """Métriques système complètes"""
        # Métriques utilisateurs
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        users_by_role = User.objects.values('role').annotate(count=Count('id'))
        
        # Métriques patients et rendez-vous
        total_patients = Patient.objects.count()
        total_appointments = RendezVous.objects.count()
        appointments_today = RendezVous.objects.filter(
            date_rdv__date=timezone.now().date()
        ).count()
        
        # Métriques système
        try:
            # Utilisation CPU et mémoire
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # Taille de la base de données (approximative)
            db_size = os.path.getsize(settings.DATABASES['default']['NAME']) if 'NAME' in settings.DATABASES['default'] else 0
            
            system_metrics = {
                'cpu_usage': cpu_percent,
                'memory_usage': memory.percent,
                'memory_total': memory.total,
                'memory_available': memory.available,
                'disk_usage': disk.percent,
                'disk_total': disk.total,
                'disk_free': disk.free,
                'database_size': db_size
            }
        except:
            system_metrics = {
                'cpu_usage': 0,
                'memory_usage': 0,
                'memory_total': 0,
                'memory_available': 0,
                'disk_usage': 0,
                'disk_total': 0,
                'disk_free': 0,
                'database_size': 0
            }
        
        # Croissance des utilisateurs (7 derniers jours)
        user_growth = []
        for i in range(7):
            date = timezone.now().date() - timedelta(days=i)
            count = User.objects.filter(date_joined__date__lte=date).count()
            user_growth.append({
                'date': date.strftime('%Y-%m-%d'),
                'count': count
            })
        user_growth.reverse()
        
        # Requêtes quotidiennes (simulation)
        daily_requests = []
        for i in range(7):
            date = timezone.now().date() - timedelta(days=i)
            # Simulation - à remplacer par de vrais logs
            requests_count = appointments_today + (i * 50) + 1000
            daily_requests.append({
                'date': date.strftime('%Y-%m-%d'),
                'requests': requests_count
            })
        daily_requests.reverse()
        
        return Response({
            'users': {
                'total': total_users,
                'active': active_users,
                'inactive': total_users - active_users,
                'by_role': list(users_by_role),
                'growth': user_growth
            },
            'patients': {
                'total': total_patients
            },
            'appointments': {
                'total': total_appointments,
                'today': appointments_today
            },
            'performance': {
                'response_time': 245,  # Simulation
                'uptime': 99.8,  # Simulation
                'errors': 12,  # Simulation
                'daily_requests': daily_requests
            },
            'system': system_metrics,
            'security': {
                'failed_logins': 45,  # Simulation
                'blocked_ips': 3,  # Simulation
                'security_events': [
                    {'type': 'Tentatives de connexion échouées', 'count': 45},
                    {'type': 'IPs bloquées', 'count': 3},
                    {'type': 'Tentatives d\'injection SQL', 'count': 2},
                    {'type': 'Accès non autorisés', 'count': 8}
                ]
            }
        })
    
    @action(detail=False, methods=['get'])
    def system_config(self, request):
        """Configuration système actuelle"""
        return Response({
            'database': {
                'type': 'SQLite' if 'sqlite' in settings.DATABASES['default']['ENGINE'] else 'PostgreSQL',
                'host': settings.DATABASES['default'].get('HOST', 'localhost'),
                'port': settings.DATABASES['default'].get('PORT', 5432),
                'name': settings.DATABASES['default'].get('NAME', 'db.sqlite3'),
                'status': 'online'
            },
            'security': {
                'jwt_expiry': 24,
                'password_min_length': 8,
                'enable_two_factor': False,
                'session_timeout': 30
            },
            'performance': {
                'cache_enabled': True,
                'cache_size': 100,
                'max_connections': 50,
                'debug_mode': settings.DEBUG
            },
            'maintenance': {
                'auto_backup': True,
                'backup_frequency': 'daily',
                'last_backup': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
                'maintenance_mode': False
            }
        })
    
    @action(detail=False, methods=['post'])
    def update_system_config(self, request):
        """Mettre à jour la configuration système"""
        try:
            # Ici vous pouvez implémenter la logique de mise à jour
            # Pour l'instant, on simule juste une sauvegarde
            return Response({
                'success': True,
                'message': 'Configuration mise à jour avec succès'
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def test_database_connection(self, request):
        """Tester la connexion à la base de données"""
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            return Response({
                'success': True,
                'message': 'Connexion à la base de données réussie'
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Erreur de connexion: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserViewSet(viewsets.ModelViewSet):
    """Vues pour les utilisateurs"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [CanManageUsers]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'responsable_cabinet':
            return User.objects.exclude(role='admin')
        else:
            return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'])
    def docteurs(self, request):
        """Récupérer tous les docteurs"""
        docteurs = User.objects.filter(role='doctor', is_active=True)
        return Response(UserSerializer(docteurs, many=True).data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def statistiques_systeme(self, request):
        """Statistiques système - Admin uniquement"""
        total_users = User.objects.count()
        users_by_role = User.objects.values('role').annotate(count=Count('id'))
        
        return Response({
            'total_users': total_users,
            'users_by_role': list(users_by_role),
            'system_info': {
                'version': '1.0.0',
                'environment': 'production' if not settings.DEBUG else 'development'
            }
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminOrResponsable])
    def statistiques_cabinet(self, request):
        """Statistiques cabinet - Admin et responsable"""
        total_patients = Patient.objects.count()
        total_doctors = User.objects.filter(role='doctor').count()
        total_appointments = RendezVous.objects.count()
        
        return Response({
            'total_patients': total_patients,
            'total_doctors': total_doctors,
            'total_appointments': total_appointments,
            'cabinet_info': {
                'name': 'Clinique Yaye Aminata',
                'address': 'Dakar, Sénégal'
            }
        })

class PatientViewSet(viewsets.ModelViewSet):
    """Vues pour les patients"""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [CanViewPatients]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PatientCreateSerializer
        return PatientSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Patient.objects.filter(user=user)
        elif user.role == 'doctor':
            # Docteurs voient leurs patients
            return Patient.objects.filter(rendez_vous__docteur=user).distinct()
        else:
            return Patient.objects.all()
    
    @action(detail=True, methods=['get'])
    def dossier_medical(self, request, pk=None):
        """Récupérer le dossier médical d'un patient"""
        try:
            dossier = DossierMedical.objects.get(patient_id=pk)
            return Response(DossierMedicalSerializer(dossier).data)
        except DossierMedical.DoesNotExist:
            return Response({'error': 'Dossier médical non trouvé'}, status=status.HTTP_404_NOT_FOUND)

class ServiceViewSet(viewsets.ModelViewSet):
    """Vues pour les services"""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def actifs(self, request):
        """Récupérer tous les services actifs"""
        services = Service.objects.filter(is_active=True)
        return Response(ServiceSerializer(services, many=True).data)

class RendezVousViewSet(viewsets.ModelViewSet):
    """Vues pour les rendez-vous"""
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousSerializer
    permission_classes = [CanManageAppointments]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RendezVousCreateSerializer
        return RendezVousSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return RendezVous.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            return RendezVous.objects.filter(docteur=user)
        else:
            return RendezVous.objects.all()
    
    @action(detail=False, methods=['get'])
    def aujourd_hui(self, request):
        """Récupérer les RDV d'aujourd'hui"""
        aujourd_hui = timezone.now().date()
        rdv = self.get_queryset().filter(date_rdv=aujourd_hui)
        return Response(RendezVousSerializer(rdv, many=True).data)
    
    @action(detail=False, methods=['get'])
    def cette_semaine(self, request):
        """Récupérer les RDV de cette semaine"""
        aujourd_hui = timezone.now().date()
        fin_semaine = aujourd_hui + timedelta(days=7)
        rdv = self.get_queryset().filter(date_rdv__range=[aujourd_hui, fin_semaine])
        return Response(RendezVousSerializer(rdv, many=True).data)
    
    @action(detail=True, methods=['post'])
    def confirmer(self, request, pk=None):
        """Confirmer un rendez-vous"""
        try:
            rdv = self.get_object()
            rdv.statut = 'confirme'
            rdv.save()
            return Response({'success': True, 'message': 'Rendez-vous confirmé'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def annuler(self, request, pk=None):
        """Annuler un rendez-vous"""
        try:
            rdv = self.get_object()
            rdv.statut = 'annule'
            rdv.save()
            return Response({'success': True, 'message': 'Rendez-vous annulé'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ConsultationViewSet(viewsets.ModelViewSet):
    """Vues pour les consultations"""
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Consultation.objects.filter(rendez_vous__patient__user=user)
        elif user.role == 'doctor':
            return Consultation.objects.filter(rendez_vous__docteur=user)
        else:
            return Consultation.objects.all()

class PrescriptionViewSet(viewsets.ModelViewSet):
    """Vues pour les prescriptions"""
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Prescription.objects.filter(consultation__rendez_vous__patient__user=user)
        elif user.role == 'doctor':
            return Prescription.objects.filter(consultation__rendez_vous__docteur=user)
        else:
            return Prescription.objects.all()

class PaiementViewSet(viewsets.ModelViewSet):
    """Vues pour les paiements"""
    queryset = Paiement.objects.all()
    serializer_class = PaiementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Paiement.objects.filter(rendez_vous__patient__user=user)
        else:
            return Paiement.objects.all()
    
    def create(self, request, *args, **kwargs):
        """Créer un paiement avec référence automatique"""
        data = request.data.copy()
        data['reference'] = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DossierMedicalViewSet(viewsets.ModelViewSet):
    """Vues pour les dossiers médicaux"""
    queryset = DossierMedical.objects.all()
    serializer_class = DossierMedicalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return DossierMedical.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            return DossierMedical.objects.filter(patient__rendez_vous__docteur=user).distinct()
        else:
            return DossierMedical.objects.all()

class StatistiquesViewSet(viewsets.ViewSet):
    """Vues pour les statistiques"""
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Statistiques du tableau de bord"""
        user = request.user
        aujourd_hui = timezone.now().date()
        debut_mois = aujourd_hui.replace(day=1)
        
        # Statistiques selon le rôle
        if user.role == 'admin':
            total_patients = Patient.objects.count()
            total_rdv_aujourd_hui = RendezVous.objects.filter(date_rdv=aujourd_hui).count()
            total_docteurs = User.objects.filter(role='doctor', is_active=True).count()
            total_consultations_mois = Consultation.objects.filter(created_at__gte=debut_mois).count()
            revenus_mois = Paiement.objects.filter(
                date_paiement__gte=debut_mois,
                statut='paye'
            ).aggregate(total=Sum('montant'))['total'] or 0
            
        elif user.role == 'responsable_cabinet':
            total_patients = Patient.objects.count()
            total_rdv_aujourd_hui = RendezVous.objects.filter(date_rdv=aujourd_hui).count()
            total_docteurs = User.objects.filter(role='doctor', is_active=True).count()
            total_consultations_mois = Consultation.objects.filter(created_at__gte=debut_mois).count()
            revenus_mois = Paiement.objects.filter(
                date_paiement__gte=debut_mois,
                statut='paye'
            ).aggregate(total=Sum('montant'))['total'] or 0
            
        elif user.role == 'doctor':
            total_patients = Patient.objects.filter(rendez_vous__docteur=user).distinct().count()
            total_rdv_aujourd_hui = RendezVous.objects.filter(docteur=user, date_rdv=aujourd_hui).count()
            total_docteurs = 1  # Le docteur lui-même
            total_consultations_mois = Consultation.objects.filter(
                rendez_vous__docteur=user,
                created_at__gte=debut_mois
            ).count()
            revenus_mois = Paiement.objects.filter(
                rendez_vous__docteur=user,
                date_paiement__gte=debut_mois,
                statut='paye'
            ).aggregate(total=Sum('montant'))['total'] or 0
            
        elif user.role == 'patient':
            total_patients = 1  # Le patient lui-même
            total_rdv_aujourd_hui = RendezVous.objects.filter(
                patient__user=user,
                date_rdv=aujourd_hui
            ).count()
            total_docteurs = User.objects.filter(role='doctor', is_active=True).count()
            total_consultations_mois = Consultation.objects.filter(
                rendez_vous__patient__user=user,
                created_at__gte=debut_mois
            ).count()
            revenus_mois = Paiement.objects.filter(
                rendez_vous__patient__user=user,
                date_paiement__gte=debut_mois,
                statut='paye'
            ).aggregate(total=Sum('montant'))['total'] or 0
            
        else:
            total_patients = 0
            total_rdv_aujourd_hui = 0
            total_docteurs = 0
            total_consultations_mois = 0
            revenus_mois = 0
        
        data = {
            'total_patients': total_patients,
            'total_rdv_aujourd_hui': total_rdv_aujourd_hui,
            'total_docteurs': total_docteurs,
            'total_consultations_mois': total_consultations_mois,
            'revenus_mois': revenus_mois,
        }
        
        serializer = StatistiquesSerializer(data)
        return Response(serializer.data)
