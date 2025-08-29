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
from django.core.mail import send_mail
import json

from .models import User, Patient, Service, RendezVous, Consultation, Prescription, Paiement, DossierMedical, Contact
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer, RegisterSerializer, LoginSerializer, PatientSerializer, PatientCreateSerializer,
    ServiceSerializer, RendezVousSerializer, RendezVousCreateSerializer, ConsultationSerializer,
    PrescriptionSerializer, PaiementSerializer, DossierMedicalSerializer, StatistiquesSerializer,
    ContactSerializer, ContactCreateSerializer, RendezVousResponsableSerializer, RendezVousConfirmationSerializer, RendezVousModificationSerializer, PatientCreationFromRendezVousSerializer
)
from .permissions import (
    IsAdminUser, IsResponsableCabinet, IsDoctor, IsReceptionist, IsPatient,
    IsAdminOrResponsable, IsResponsableOrReceptionist, IsDoctorOrReceptionist, IsDoctorOrPatient,
    IsOwnerOrStaff, CanManageUsers, CanViewReports, CanManageAppointments, CanViewPatients,
    CanViewUsersForAppointments
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
    
    def get_permissions(self):
        """
        Permissions personnalisées selon l'action
        """
        if self.action in ['list', 'retrieve']:
            # Pour la lecture, permettre aux médecins et réceptionnistes de voir les utilisateurs
            permission_classes = [CanViewUsersForAppointments]
        else:
            # Pour la création/modification/suppression, admin et responsable uniquement
            permission_classes = [CanManageUsers]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = User.objects.all()
        
        # Appliquer les filtres de l'URL
        role_filter = self.request.query_params.get('role')
        if role_filter:
            queryset = queryset.filter(role=role_filter)
        
        # Appliquer les restrictions selon le rôle de l'utilisateur connecté
        if user.role == 'admin':
            return queryset
        elif user.role == 'responsable_cabinet':
            return queryset.exclude(role='admin')
        elif user.role in ['doctor', 'receptionist']:
            # Les médecins et réceptionnistes peuvent voir les utilisateurs selon les filtres
            return queryset
        else:
            # Pour les autres rôles, ne voir que leur propre utilisateur
            return queryset.filter(id=user.id)
    
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
            # Docteurs voient tous les patients (pour créer des rendez-vous)
            return Patient.objects.all()
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
        elif self.action in ['update', 'partial_update']:
            return RendezVousResponsableSerializer
        return RendezVousSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            # Les patients voient leurs propres RDV
            return RendezVous.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            # Les médecins voient les RDV qui leur sont assignés
            return RendezVous.objects.filter(docteur=user)
        elif user.role in ['responsable_cabinet', 'admin']:
            # Les responsables voient tous les RDV
            return RendezVous.objects.all()
        else:
            return RendezVous.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Créer un RDV (pour clients/visiteurs)"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rdv = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Demande de rendez-vous envoyée avec succès. Nous vous contacterons bientôt.',
            'rdv': RendezVousSerializer(rdv).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Mettre à jour un RDV (Responsable/Médecin)"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Sauvegarder l'ancien statut pour la notification
        old_status = instance.statut
        
        rdv = serializer.save()
        
        # Envoyer notification si le statut a changé
        if old_status != rdv.statut and rdv.statut in ['confirme', 'assigne']:
            self._send_notification(rdv)
        
        return Response({
            'success': True,
            'message': 'Rendez-vous mis à jour avec succès',
            'rdv': RendezVousSerializer(rdv).data
        })
    
    def _send_notification(self, rdv):
        """Envoyer notification email/SMS au client"""
        try:
            # Pour l'instant, on simule l'envoi
            # TODO: Implémenter l'envoi réel d'email/SMS
            print(f"📧 Notification envoyée pour RDV {rdv.id}")
            print(f"   Client: {rdv.client_nom or rdv.patient}")
            print(f"   Contact: {rdv.client_email or rdv.client_telephone}")
            print(f"   Statut: {rdv.statut}")
            print(f"   Date confirmée: {rdv.date_confirmee}")
        except Exception as e:
            print(f"❌ Erreur envoi notification: {e}")
    
    @action(detail=False, methods=['get'])
    def en_attente(self, request):
        """Récupérer les RDV en attente (pour Responsable)"""
        if request.user.role not in ['responsable_cabinet', 'admin']:
            return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        rdv_en_attente = RendezVous.objects.filter(statut='en_attente')
        return Response(RendezVousSerializer(rdv_en_attente, many=True).data)
    
    @action(detail=False, methods=['get'])
    def aujourd_hui(self, request):
        """Récupérer les RDV d'aujourd'hui"""
        aujourd_hui = timezone.now().date()
        rdv = self.get_queryset().filter(date_confirmee__date=aujourd_hui)
        return Response(RendezVousSerializer(rdv, many=True).data)
    
    @action(detail=False, methods=['get'])
    def cette_semaine(self, request):
        """Récupérer les RDV de cette semaine"""
        aujourd_hui = timezone.now().date()
        fin_semaine = aujourd_hui + timedelta(days=7)
        rdv = self.get_queryset().filter(date_confirmee__date__range=[aujourd_hui, fin_semaine])
        return Response(RendezVousSerializer(rdv, many=True).data)
    
    @action(detail=True, methods=['post'])
    def confirmer(self, request, pk=None):
        """Confirmer un rendez-vous (Responsable)"""
        if request.user.role not in ['responsable_cabinet', 'admin']:
            return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            rdv = self.get_object()
            date_confirmee = request.data.get('date_confirmee')
            
            if not date_confirmee:
                return Response({'error': 'Date confirmée requise'}, status=status.HTTP_400_BAD_REQUEST)
            
            rdv.date_confirmee = date_confirmee
            rdv.statut = 'confirme'
            rdv.save()
            
            # Envoyer notification
            self._send_notification(rdv)
            
            return Response({
                'success': True, 
                'message': 'Rendez-vous confirmé et notification envoyée'
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def assigner_medecin(self, request, pk=None):
        """Assigner un médecin à un RDV (Responsable)"""
        if request.user.role not in ['responsable_cabinet', 'admin']:
            return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            rdv = self.get_object()
            docteur_id = request.data.get('docteur_id')
            
            if not docteur_id:
                return Response({'error': 'ID du médecin requis'}, status=status.HTTP_400_BAD_REQUEST)
            
            docteur = User.objects.filter(id=docteur_id, role='doctor').first()
            if not docteur:
                return Response({'error': 'Médecin non trouvé'}, status=status.HTTP_404_NOT_FOUND)
            
            rdv.docteur = docteur
            rdv.statut = 'assigne'
            rdv.save()
            
            return Response({
                'success': True, 
                'message': f'Rendez-vous assigné au Dr. {docteur.first_name} {docteur.last_name}'
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def marquer_realise(self, request, pk=None):
        """Marquer un RDV comme réalisé (Médecin)"""
        if request.user.role != 'doctor':
            return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            rdv = self.get_object()
            if rdv.docteur != request.user:
                return Response({'error': 'Vous ne pouvez marquer que vos propres RDV'}, status=status.HTTP_403_FORBIDDEN)
            
            rdv.statut = 'realise'
            rdv.save()
            
            return Response({
                'success': True, 
                'message': 'Rendez-vous marqué comme réalisé'
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def annuler(self, request, pk=None):
        """Annuler un rendez-vous"""
        try:
            rdv = self.get_object()
            rdv.statut = 'annule'
            rdv.save()
            
            # Envoyer notification d'annulation
            self._send_notification(rdv)
            
            return Response({
                'success': True, 
                'message': 'Rendez-vous annulé et notification envoyée'
            })
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
            total_rdv_aujourd_hui = RendezVous.objects.filter(date_confirmee__date=aujourd_hui).count()
            total_docteurs = User.objects.filter(role='doctor', is_active=True).count()
            total_consultations_mois = Consultation.objects.filter(created_at__gte=debut_mois).count()
            revenus_mois = Paiement.objects.filter(
                date_paiement__gte=debut_mois,
                statut='paye'
            ).aggregate(total=Sum('montant'))['total'] or 0
            
        elif user.role == 'responsable_cabinet':
            total_patients = Patient.objects.count()
            total_rdv_aujourd_hui = RendezVous.objects.filter(date_confirmee__date=aujourd_hui).count()
            total_docteurs = User.objects.filter(role='doctor', is_active=True).count()
            total_consultations_mois = Consultation.objects.filter(created_at__gte=debut_mois).count()
            revenus_mois = Paiement.objects.filter(
                date_paiement__gte=debut_mois,
                statut='paye'
            ).aggregate(total=Sum('montant'))['total'] or 0
            
        elif user.role == 'doctor':
            total_patients = Patient.objects.filter(rendez_vous__docteur=user).distinct().count()
            total_rdv_aujourd_hui = RendezVous.objects.filter(docteur=user, date_confirmee__date=aujourd_hui).count()
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
                date_confirmee__date=aujourd_hui
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

class ContactViewSet(viewsets.ModelViewSet):
    """Vues pour les messages de contact"""
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ContactCreateSerializer
        return ContactSerializer
    
    def get_queryset(self):
        user = self.request.user
        # Seuls les admins et responsables peuvent voir tous les messages
        if user.role in ['admin', 'responsable_cabinet']:
            return Contact.objects.all()
        # Les autres rôles ne peuvent pas voir les messages de contact
        return Contact.objects.none()
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def create_message(self, request):
        """Créer un nouveau message de contact et le transformer en demande de rendez-vous"""
        serializer = ContactCreateSerializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()
            
            # Créer automatiquement un rendez-vous à partir du message de contact
            try:
                # Trouver le service correspondant au sujet
                service = None
                sujet = contact.sujet.lower()
                
                # Mapping des sujets vers les services
                service_mapping = {
                    'suivi de grossesse': 'SUIVI_GROSSESSE',
                    'préparation à la naissance': 'PREP_NAISSANCE',
                    'monitoring fœtal': 'MONITORING_FOETAL',
                    'éducation à la santé durant la grossesse': 'EDUC_SANTE',
                    'soin post natal': 'SOIN_POST_NATAL',
                    'echographie': 'ECHOGRAPHIE',
                    'planification familiale': 'PLANIF_FAMILIALE',
                    'dépistage cancer': 'DEPISTAGE_CANCER',
                    'traitement des ist': 'TRAITEMENT_IST',
                    'vaccination': 'VACCINATION',
                    'consultation générale': 'CONSULT_GENERALE',
                    'consultation en ligne': 'CONSULT_LIGNE',
                }
                
                # Chercher le service correspondant
                for key, code in service_mapping.items():
                    if key in sujet:
                        try:
                            service = Service.objects.get(code=code)
                            break
                        except Service.DoesNotExist:
                            continue
                
                # Si aucun service trouvé, utiliser un service par défaut
                if not service:
                    service = Service.objects.first()  # Premier service disponible
                
                # Créer le rendez-vous
                rendez_vous = RendezVous.objects.create(
                    client_nom=contact.nom,
                    client_email=contact.email if '@' in contact.email else None,
                    client_telephone=contact.email if '@' not in contact.email else None,
                    service=service,
                    message=contact.message,
                    date_souhaitee=contact.date_heure_souhaitee,
                    statut='en_attente',
                    notes=f"Demande créée automatiquement depuis le formulaire de contact. Sujet: {contact.sujet}"
                )
                
                # Marquer le contact comme traité
                contact.statut = 'traite'
                contact.save()
                
                return Response({
                    'success': True,
                    'message': 'Votre demande de rendez-vous a été envoyée avec succès. Nous vous contacterons pour confirmer.',
                    'data': ContactSerializer(contact).data,
                    'rendez_vous_id': rendez_vous.id
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                # En cas d'erreur, sauvegarder quand même le contact
                return Response({
                    'success': True,
                    'message': 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
                    'data': ContactSerializer(contact).data,
                    'warning': 'Erreur lors de la création du rendez-vous, mais le message a été sauvegardé.'
                }, status=status.HTTP_201_CREATED)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def marquer_comme_lu(self, request, pk=None):
        """Marquer un message comme lu"""
        contact = self.get_object()
        contact.statut = 'lu'
        contact.save()
        return Response({'success': True, 'message': 'Message marqué comme lu'})
    
    @action(detail=True, methods=['post'])
    def marquer_comme_repondu(self, request, pk=None):
        """Marquer un message comme répondu"""
        contact = self.get_object()
        contact.statut = 'repondu'
        contact.save()
        return Response({'success': True, 'message': 'Message marqué comme répondu'})
    
    @action(detail=True, methods=['post'])
    def marquer_comme_traite(self, request, pk=None):
        """Marquer un message comme traité"""
        contact = self.get_object()
        contact.statut = 'traite'
        contact.save()
        return Response({'success': True, 'message': 'Message marqué comme traité'})
    
    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Statistiques des messages de contact"""
        total_messages = Contact.objects.count()
        nouveaux_messages = Contact.objects.filter(statut='nouveau').count()
        messages_lus = Contact.objects.filter(statut='lu').count()
        messages_repondus = Contact.objects.filter(statut='repondu').count()
        messages_traites = Contact.objects.filter(statut='traite').count()
        
        return Response({
            'total_messages': total_messages,
            'nouveaux_messages': nouveaux_messages,
            'messages_lus': messages_lus,
            'messages_repondus': messages_repondus,
            'messages_traites': messages_traites,
        })

class RendezVousResponsableViewSet(viewsets.ModelViewSet):
    """Vues pour la gestion des rendez-vous par le responsable de cabinet"""
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousResponsableSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Seuls les responsables et admins peuvent gérer les rendez-vous
        if user.role in ['responsable_cabinet', 'admin']:
            return RendezVous.objects.all().order_by('-created_at')
        return RendezVous.objects.none()
    
    @action(detail=False, methods=['get'])
    def demandes_en_attente(self, request):
        """Récupérer toutes les demandes de rendez-vous en attente"""
        demandes = RendezVous.objects.filter(statut='en_attente').order_by('-created_at')
        serializer = RendezVousResponsableSerializer(demandes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def confirmer_rendez_vous(self, request):
        """Confirmer un rendez-vous et envoyer une notification"""
        serializer = RendezVousConfirmationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                rdv = RendezVous.objects.get(id=serializer.validated_data['rendez_vous_id'])
                
                # Mettre à jour le rendez-vous
                if serializer.validated_data.get('docteur_id'):
                    docteur = User.objects.get(id=serializer.validated_data['docteur_id'], role='doctor')
                    rdv.docteur = docteur
                
                if serializer.validated_data.get('date_confirmee'):
                    rdv.date_confirmee = serializer.validated_data['date_confirmee']
                else:
                    rdv.date_confirmee = rdv.date_souhaitee
                
                rdv.statut = 'confirme'
                if serializer.validated_data.get('notes'):
                    rdv.notes = serializer.validated_data['notes']
                rdv.save()
                
                # Envoyer notification si demandé
                if serializer.validated_data.get('envoyer_notification', True):
                    self._envoyer_notification_confirmation(rdv)
                
                return Response({
                    'success': True,
                    'message': 'Rendez-vous confirmé avec succès',
                    'data': RendezVousResponsableSerializer(rdv).data
                })
                
            except RendezVous.DoesNotExist:
                return Response({'error': 'Rendez-vous non trouvé'}, status=404)
            except User.DoesNotExist:
                return Response({'error': 'Médecin non trouvé'}, status=404)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        
        return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=['post'])
    def modifier_rendez_vous(self, request):
        """Modifier un rendez-vous et envoyer une notification"""
        serializer = RendezVousModificationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                rdv = RendezVous.objects.get(id=serializer.validated_data['rendez_vous_id'])
                
                # Sauvegarder l'ancienne date pour la notification
                ancienne_date = rdv.date_confirmee
                
                # Mettre à jour le rendez-vous
                rdv.date_confirmee = serializer.validated_data['date_confirmee']
                if serializer.validated_data.get('docteur_id'):
                    docteur = User.objects.get(id=serializer.validated_data['docteur_id'], role='doctor')
                    rdv.docteur = docteur
                
                rdv.statut = 'confirme'
                if serializer.validated_data.get('notes'):
                    rdv.notes = serializer.validated_data['notes']
                rdv.save()
                
                # Envoyer notification de modification
                self._envoyer_notification_modification(rdv, ancienne_date, serializer.validated_data.get('raison_modification'))
                
                return Response({
                    'success': True,
                    'message': 'Rendez-vous modifié avec succès',
                    'data': RendezVousResponsableSerializer(rdv).data
                })
                
            except RendezVous.DoesNotExist:
                return Response({'error': 'Rendez-vous non trouvé'}, status=404)
            except User.DoesNotExist:
                return Response({'error': 'Médecin non trouvé'}, status=404)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        
        return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=['post'])
    def creer_patient(self, request):
        """Créer un compte patient à partir d'un rendez-vous"""
        serializer = PatientCreationFromRendezVousSerializer(data=request.data)
        if serializer.is_valid():
            try:
                rdv = RendezVous.objects.get(id=serializer.validated_data['rendez_vous_id'])
                
                # Créer l'utilisateur
                user_data = {
                    'username': serializer.validated_data['username'],
                    'email': rdv.client_email or f"{serializer.validated_data['username']}@example.com",
                    'first_name': rdv.client_nom.split()[0] if rdv.client_nom else '',
                    'last_name': ' '.join(rdv.client_nom.split()[1:]) if rdv.client_nom and len(rdv.client_nom.split()) > 1 else '',
                    'phone': rdv.client_telephone,
                    'role': 'patient',
                    'password': serializer.validated_data['password'],
                    'password_confirm': serializer.validated_data['password_confirm'],
                }
                
                user_serializer = UserCreateSerializer(data=user_data)
                user_serializer.is_valid(raise_exception=True)
                user = user_serializer.save()
                
                # Créer le patient
                patient_data = {
                    'user': user,
                    'date_naissance': serializer.validated_data['date_naissance'],
                    'profession': serializer.validated_data.get('profession', ''),
                    'situation_matrimoniale': serializer.validated_data.get('situation_matrimoniale', ''),
                    'nombre_enfants': serializer.validated_data.get('nombre_enfants', 0),
                    'personne_contact': serializer.validated_data.get('personne_contact', ''),
                    'telephone_urgence': serializer.validated_data.get('telephone_urgence', ''),
                    'adresse': serializer.validated_data.get('adresse', ''),
                    'groupe_sanguin': serializer.validated_data.get('groupe_sanguin', ''),
                    'allergies': serializer.validated_data.get('allergies', ''),
                    'antecedents_medicaux': serializer.validated_data.get('antecedents_medicaux', ''),
                }
                
                patient = Patient.objects.create(**patient_data)
                
                # Lier le rendez-vous au patient
                rdv.patient = patient
                rdv.client_nom = None
                rdv.client_email = None
                rdv.client_telephone = None
                rdv.save()
                
                return Response({
                    'success': True,
                    'message': 'Compte patient créé avec succès',
                    'patient_id': patient.id,
                    'user_id': user.id,
                    'data': RendezVousResponsableSerializer(rdv).data
                })
                
            except RendezVous.DoesNotExist:
                return Response({'error': 'Rendez-vous non trouvé'}, status=404)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        
        return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Statistiques des rendez-vous"""
        total_rdv = RendezVous.objects.count()
        en_attente = RendezVous.objects.filter(statut='en_attente').count()
        confirmes = RendezVous.objects.filter(statut='confirme').count()
        realises = RendezVous.objects.filter(statut='realise').count()
        annules = RendezVous.objects.filter(statut='annule').count()
        
        return Response({
            'total_rdv': total_rdv,
            'en_attente': en_attente,
            'confirmes': confirmes,
            'realises': realises,
            'annules': annules,
        })
    
    def _envoyer_notification_confirmation(self, rdv):
        """Envoyer une notification de confirmation par email"""
        try:
            if rdv.client_email:
                sujet = "Confirmation de votre rendez-vous"
                message = f"""
                Bonjour {rdv.client_nom},
                
                Votre rendez-vous a été confirmé.
                
                Détails :
                - Service : {rdv.service.nom}
                - Date : {rdv.date_confirmee.strftime('%d/%m/%Y à %H:%M')}
                - Médecin : {rdv.docteur.get_full_name() if rdv.docteur else 'À déterminer'}
                
                Merci de votre confiance.
                """
                
                send_mail(
                    sujet,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [rdv.client_email],
                    fail_silently=False,
                )
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'email: {e}")
    
    def _envoyer_notification_modification(self, rdv, ancienne_date, raison=None):
        """Envoyer une notification de modification par email"""
        try:
            if rdv.client_email:
                sujet = "Modification de votre rendez-vous"
                message = f"""
                Bonjour {rdv.client_nom},
                
                Votre rendez-vous a été modifié.
                
                Nouvelle date : {rdv.date_confirmee.strftime('%d/%m/%Y à %H:%M')}
                """
                
                if ancienne_date:
                    message += f"Ancienne date : {ancienne_date.strftime('%d/%m/%Y à %H:%M')}\n"
                
                if raison:
                    message += f"Raison : {raison}\n"
                
                message += f"""
                Service : {rdv.service.nom}
                Médecin : {rdv.docteur.get_full_name() if rdv.docteur else 'À déterminer'}
                
                Nous nous excusons pour ce changement.
                """
                
                send_mail(
                    sujet,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [rdv.client_email],
                    fail_silently=False,
                )
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'email: {e}")
