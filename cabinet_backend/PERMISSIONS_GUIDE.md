# Guide des Permissions d'Authentification

## Vue d'ensemble

Ce guide explique comment gérer les permissions d'authentification dans votre application de clinique.

## Types de Permissions

### 1. Permissions par Rôle

```python
# Permissions individuelles
IsAdminUser          # Administrateur système uniquement
IsResponsableCabinet # Responsable cabinet uniquement
IsDoctor            # Docteur uniquement
IsReceptionist      # Réceptionniste uniquement
IsPatient           # Patient uniquement
```

### 2. Permissions Combinées

```python
# Permissions multiples
IsAdminOrResponsable        # Admin OU Responsable
IsResponsableOrReceptionist # Responsable OU Réceptionniste
IsDoctorOrReceptionist      # Docteur OU Réceptionniste
IsDoctorOrPatient          # Docteur OU Patient
```

### 3. Permissions Fonctionnelles

```python
# Permissions métier
CanManageUsers        # Gestion des utilisateurs (Admin + Responsable)
CanViewReports        # Voir les rapports (Admin + Responsable)
CanManageAppointments # Gérer les RDV (Responsable + Réceptionniste)
CanViewPatients       # Voir les patients (Docteur + Réceptionniste)
IsOwnerOrStaff        # Propriétaire OU Staff
```

## Utilisation dans les Vues

### Exemple 1 : Vue avec Permission Simple

```python
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [CanManageUsers]  # Seuls admin et responsable
    # ...
```

### Exemple 2 : Vue avec Permission Multiple

```python
class PatientViewSet(viewsets.ModelViewSet):
    permission_classes = [CanViewPatients]  # Docteur et réceptionniste
    # ...
```

### Exemple 3 : Action Spécifique

```python
@action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
def statistiques_systeme(self, request):
    """Statistiques système - Admin uniquement"""
    # ...
```

## Hiérarchie des Rôles

```
Admin (Système)
├── Accès complet à tout
├── Gestion des utilisateurs
├── Rapports système
└── Configuration

Responsable Cabinet
├── Gestion du cabinet
├── Gestion des utilisateurs (sauf admin)
├── Rapports cabinet
└── Gestion des RDV

Réceptionniste
├── Gestion des RDV
├── Accueil patients
├── Consultation des patients
└── Saisie des données

Docteur
├── Ses patients
├── Ses consultations
├── Ses RDV
└── Dossiers médicaux

Patient
├── Ses propres données
├── Ses RDV
└── Son dossier médical
```

## Exemples d'Implémentation

### 1. Gestion des Utilisateurs

```python
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [CanManageUsers]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()  # Voir tous les utilisateurs
        elif user.role == 'responsable_cabinet':
            return User.objects.exclude(role='admin')  # Sauf les admins
        return User.objects.none()
```

### 2. Gestion des Rendez-vous

```python
class RendezVousViewSet(viewsets.ModelViewSet):
    permission_classes = [CanManageAppointments]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return RendezVous.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            return RendezVous.objects.filter(docteur=user)
        else:
            return RendezVous.objects.all()  # Responsable et réceptionniste
```

### 3. Protection des Données Personnelles

```python
class PatientViewSet(viewsets.ModelViewSet):
    permission_classes = [CanViewPatients]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Patient.objects.filter(user=user)  # Ses propres données
        elif user.role == 'doctor':
            return Patient.objects.filter(rendez_vous__docteur=user).distinct()
        else:
            return Patient.objects.all()  # Réceptionniste et responsable
```

## Bonnes Pratiques

### 1. Toujours Vérifier les Permissions

```python
# ✅ Bon
permission_classes = [CanManageUsers]

# ❌ Éviter
permission_classes = [permissions.IsAuthenticated]  # Trop permissif
```

### 2. Filtrer les Données par Rôle

```python
def get_queryset(self):
    user = self.request.user
    if user.role == 'admin':
        return Model.objects.all()
    elif user.role == 'doctor':
        return Model.objects.filter(doctor=user)
    return Model.objects.none()
```

### 3. Utiliser des Permissions Spécifiques

```python
# ✅ Bon - Permission métier
permission_classes = [CanViewReports]

# ❌ Éviter - Permission générique
permission_classes = [permissions.IsAuthenticated]
```

### 4. Tester les Permissions

```python
# Test unitaire
def test_admin_can_access_all_users(self):
    user = User.objects.create(role='admin')
    self.client.force_authenticate(user=user)
    response = self.client.get('/api/users/')
    self.assertEqual(response.status_code, 200)

def test_patient_cannot_access_users(self):
    user = User.objects.create(role='patient')
    self.client.force_authenticate(user=user)
    response = self.client.get('/api/users/')
    self.assertEqual(response.status_code, 403)
```

## Sécurité

### 1. Validation Côté Serveur

- Les permissions sont toujours vérifiées côté serveur
- Ne jamais faire confiance aux validations côté client
- Utiliser `IsOwnerOrStaff` pour les données personnelles

### 2. Logs de Sécurité

```python
import logging
logger = logging.getLogger('security')

def has_permission(self, request, view):
    if not super().has_permission(request, view):
        logger.warning(f"Accès refusé: {request.user} -> {view.__class__.__name__}")
        return False
    return True
```

### 3. Tokens JWT

- Tokens d'accès : 24h
- Tokens de rafraîchissement : 7 jours
- Blacklist après rotation
- Validation automatique

## Dépannage

### Erreur 403 Forbidden

```python
# Vérifier les permissions
print(f"User role: {request.user.role}")
print(f"Required permissions: {view.permission_classes}")
```

### Erreur 401 Unauthorized

```python
# Vérifier l'authentification
print(f"User authenticated: {request.user.is_authenticated}")
print(f"Token valid: {request.auth}")
```

## Conclusion

Ce système de permissions garantit que :
- Chaque utilisateur n'accède qu'aux données autorisées
- La sécurité est maintenue à tous les niveaux
- Le code est maintenable et extensible
- Les bonnes pratiques sont respectées
