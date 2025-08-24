from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    AuthViewSet, AdminViewSet, UserViewSet, PatientViewSet, ServiceViewSet, RendezVousViewSet,
    ConsultationViewSet, PrescriptionViewSet, PaiementViewSet, DossierMedicalViewSet,
    StatistiquesViewSet, ContactViewSet, RendezVousResponsableViewSet
)

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'admin', AdminViewSet, basename='admin')
router.register(r'users', UserViewSet, basename='user')
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'rendez-vous', RendezVousViewSet, basename='rendez-vous')
router.register(r'consultations', ConsultationViewSet, basename='consultation')
router.register(r'prescriptions', PrescriptionViewSet, basename='prescription')
router.register(r'paiements', PaiementViewSet, basename='paiement')
router.register(r'dossiers-medicaux', DossierMedicalViewSet, basename='dossier-medical')
router.register(r'statistiques', StatistiquesViewSet, basename='statistiques')
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'rdv-responsable', RendezVousResponsableViewSet, basename='rdv-responsable')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

