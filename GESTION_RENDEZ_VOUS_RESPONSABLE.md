# 🏥 Système de Gestion des Rendez-vous - Responsable de Cabinet

## 📋 Vue d'ensemble

Ce système permet au **Responsable de Cabinet** de gérer efficacement toutes les demandes de rendez-vous provenant des clients/visiteurs via le formulaire de contact du site web.

## 🔄 Workflow complet

### 1. **Demande initiale (Client/Visiteur)**
- Le client remplit le formulaire de contact sur le site
- Les données sont automatiquement transformées en demande de rendez-vous
- Le statut est défini à `en_attente`

### 2. **Gestion par le Responsable**
- Le responsable voit toutes les demandes en attente
- Il peut : confirmer, modifier, créer un compte patient, ou supprimer
- Chaque action déclenche des notifications automatiques

### 3. **Confirmation et suivi**
- Le rendez-vous confirmé devient visible dans l'admin Django
- Le client reçoit une notification par email
- Le patient peut être créé à partir du rendez-vous

## 🛠️ Architecture technique

### Backend (Django)

#### Modèles
```python
# Modèle RendezVous existant (adapté)
class RendezVous(models.Model):
    # Champs pour les patients avec compte
    patient = models.ForeignKey(Patient, ...)
    
    # Champs pour les clients/visiteurs sans compte
    client_nom = models.CharField(...)
    client_email = models.EmailField(...)
    client_telephone = models.CharField(...)
    
    # Champs communs
    service = models.ForeignKey(Service, ...)
    message = models.TextField(...)
    date_souhaitee = models.DateTimeField(...)
    date_confirmee = models.DateTimeField(...)
    docteur = models.ForeignKey(User, ...)
    statut = models.CharField(choices=STATUT_CHOICES, ...)
    notes = models.TextField(...)
```

#### API Endpoints
```
GET    /api/rdv-responsable/demandes_en_attente/     # Liste des demandes en attente
POST   /api/rdv-responsable/confirmer_rendez_vous/   # Confirmer un RDV
POST   /api/rdv-responsable/modifier_rendez_vous/    # Modifier un RDV
POST   /api/rdv-responsable/creer_patient/           # Créer un patient
GET    /api/rdv-responsable/statistiques/            # Statistiques
DELETE /api/rdv-responsable/{id}/                    # Supprimer un RDV
```

#### Fonctionnalités clés
- **Transformation automatique** : Les messages de contact deviennent des RDV
- **Mapping intelligent** : Les sujets sont mappés vers les services appropriés
- **Notifications automatiques** : Emails de confirmation/modification
- **Création de patients** : Transformation des visiteurs en patients

### Frontend (React)

#### Composant principal
```typescript
// RendezVousManagement.tsx
interface RendezVous {
  id: number;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  service: { id: number; nom: string; };
  message: string;
  date_souhaitee: string;
  date_confirmee: string | null;
  docteur: { id: number; first_name: string; last_name: string; } | null;
  statut: string;
  notes: string;
  created_at: string;
}
```

#### Fonctionnalités UI
- **Tableau des demandes** avec recherche et filtres
- **Statistiques en temps réel** (total, en attente, confirmés, etc.)
- **Modals d'action** :
  - Confirmation avec sélection de médecin et date
  - Modification avec raison et nouvelle date
  - Création de patient avec formulaire complet
- **Actions rapides** : Confirmer, Modifier, Créer Patient, Supprimer

## 🎯 Fonctionnalités détaillées

### 1. **Vue des demandes en attente**
- Liste complète avec informations client
- Statuts visuels (badges colorés)
- Recherche par nom, email, service
- Tri par date de création

### 2. **Confirmation de rendez-vous**
- Sélection du médecin (optionnel)
- Modification de la date (optionnel)
- Ajout de notes
- Notification automatique au client

### 3. **Modification de rendez-vous**
- Nouvelle date obligatoire
- Raison de la modification
- Notification avec ancienne/nouvelle date
- Sélection de médecin

### 4. **Création de compte patient**
- Formulaire complet de création
- Données pré-remplies depuis le RDV
- Validation des mots de passe
- Informations médicales (allergies, antécédents)

### 5. **Statistiques**
- Total des rendez-vous
- Répartition par statut
- Graphiques et métriques
- Mise à jour en temps réel

## 📧 Système de notifications

### Emails automatiques
```python
def _envoyer_notification_confirmation(self, rdv):
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
```

### Emails de modification
```python
def _envoyer_notification_modification(self, rdv, ancienne_date, raison=None):
    sujet = "Modification de votre rendez-vous"
    message = f"""
    Bonjour {rdv.client_nom},
    
    Votre rendez-vous a été modifié.
    
    Nouvelle date : {rdv.date_confirmee.strftime('%d/%m/%Y à %H:%M')}
    Ancienne date : {ancienne_date.strftime('%d/%m/%Y à %H:%M')}
    Raison : {raison}
    
    Nous nous excusons pour ce changement.
    """
```

## 🔐 Sécurité et permissions

### Rôles autorisés
- `responsable_cabinet` : Accès complet
- `admin` : Accès complet
- Autres rôles : Accès refusé

### Validation des données
- Vérification des dates (futur uniquement)
- Validation des emails/téléphones
- Contrôle des mots de passe
- Validation des champs obligatoires

## 🚀 Utilisation

### 1. **Accès à l'interface**
```
URL : /admin/rendez-vous
Rôle requis : responsable_cabinet ou admin
```

### 2. **Workflow typique**
1. Le client remplit le formulaire de contact
2. Le responsable voit la demande dans `/admin/rendez-vous`
3. Le responsable confirme/modifie le RDV
4. Le client reçoit une notification
5. Le RDV apparaît dans l'admin Django

### 3. **Actions disponibles**
- **Confirmer** : Valider la demande avec médecin/date
- **Modifier** : Changer la date/heure/médecin
- **Créer Patient** : Transformer le visiteur en patient
- **Supprimer** : Annuler la demande

## 📊 Intégration avec l'existant

### Admin Django
- Les RDV confirmés apparaissent dans `/admin/cabinet/rendezvous/`
- Gestion complète via l'interface Django
- Export et reporting intégrés

### Système de patients
- Création automatique de comptes patients
- Liaison avec les dossiers médicaux
- Historique complet des RDV

### Services
- Mapping automatique des sujets vers services
- Gestion des prix et durées
- Attribution des médecins

## 🔧 Configuration

### Variables d'environnement
```bash
# Email (Django settings)
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'clinique@example.com'
```

### Services par défaut
```python
# Mapping des sujets vers services
service_mapping = {
    'suivi de grossesse': 'SUIVI_GROSSESSE',
    'préparation à la naissance': 'PREP_NAISSANCE',
    'monitoring fœtal': 'MONITORING_FOETAL',
    # ... autres services
}
```

## 🧪 Tests

### Script de test
```bash
python cabinet_backend/test_rdv_responsable.py
```

### Tests inclus
- Récupération des demandes en attente
- Confirmation de RDV
- Modification de RDV
- Création de patient
- Statistiques
- Gestion des erreurs

## 📈 Évolutions futures

### Fonctionnalités prévues
- **SMS** : Notifications par SMS via Twilio
- **Calendrier** : Interface calendrier pour la gestion
- **Rappels** : Rappels automatiques avant RDV
- **Reporting** : Rapports détaillés et analytics
- **Mobile** : Application mobile pour le responsable

### Améliorations techniques
- **Webhooks** : Intégration avec systèmes externes
- **API REST** : Documentation complète avec Swagger
- **Cache** : Mise en cache des données fréquentes
- **Monitoring** : Logs et métriques de performance

---

## ✅ Résumé

Le système de gestion des rendez-vous par le responsable de cabinet offre :

1. **Interface complète** pour gérer les demandes
2. **Workflow automatisé** de la demande à la confirmation
3. **Notifications intelligentes** par email
4. **Création de patients** à partir des visiteurs
5. **Intégration parfaite** avec l'admin Django existant
6. **Sécurité et permissions** appropriées
7. **Statistiques et reporting** en temps réel

Le système remplace efficacement la gestion manuelle par un processus automatisé et professionnel. 🎯
