# Système de Contact - Clinique Yaye Aminata

## Vue d'ensemble

Le système de contact a été complètement implémenté pour permettre aux visiteurs du site web de contacter la clinique. Le système inclut un formulaire de contact avec validation, stockage en base de données, et une interface d'administration pour gérer les messages.

## Fonctionnalités implémentées

### 1. Modèle de données (Backend Django)

**Fichier : `cabinet_backend/cabinet/models.py`**

```python
class Contact(models.Model):
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
```

### 2. API REST (Backend Django)

**Fichiers :**
- `cabinet_backend/cabinet/serializers.py` - Sérialiseurs pour la validation et la sérialisation
- `cabinet_backend/cabinet/views.py` - Vues API avec gestion des permissions
- `cabinet_backend/cabinet/urls.py` - Routes API

**Endpoints disponibles :**
- `POST /api/contacts/create_message/` - Créer un nouveau message (public)
- `GET /api/contacts/` - Lister les messages (admin/responsable)
- `GET /api/contacts/statistiques/` - Statistiques des messages
- `POST /api/contacts/{id}/marquer_comme_lu/` - Marquer comme lu
- `POST /api/contacts/{id}/marquer_comme_repondu/` - Marquer comme répondu
- `POST /api/contacts/{id}/marquer_comme_traite/` - Marquer comme traité

### 3. Interface d'administration Django

**Fichier : `cabinet_backend/cabinet/admin.py`**

- Interface d'administration complète pour gérer les messages
- Actions en lot pour marquer plusieurs messages
- Filtres par statut, date, etc.
- Recherche dans les messages

### 4. Formulaire de contact (Frontend React)

**Fichier : `src/components/Contact.tsx`**

**Fonctionnalités :**
- Formulaire avec validation côté client
- Champs : nom, email/téléphone, sujet, message, date/heure souhaitée
- Validation en temps réel
- Connexion au backend via API
- Messages de succès/erreur
- Animation de type curseur pour le titre

**Validation :**
- Nom : 3-20 caractères
- Email : format email valide OU numéro de téléphone sénégalais
- Sujet : obligatoire
- Message : obligatoire
- Date/heure : optionnelle, doit être dans le futur

### 5. Service API (Frontend)

**Fichier : `src/services/api.ts`**

```typescript
export const contactApi = {
  createMessage: async (data) => { /* ... */ },
  getMessages: async (token) => { /* ... */ },
  getMessageStats: async (token) => { /* ... */ },
  markAsRead: async (messageId, token) => { /* ... */ },
  markAsReplied: async (messageId, token) => { /* ... */ },
  markAsProcessed: async (messageId, token) => { /* ... */ },
};
```

### 6. Interface de gestion (Frontend React)

**Fichier : `src/pages/admin/ContactManagement.tsx`**

**Fonctionnalités :**
- Tableau de bord avec statistiques
- Liste des messages avec filtres et recherche
- Gestion des statuts (nouveau → lu → répondu → traité)
- Vue détaillée des messages
- Interface responsive et moderne

**Statistiques affichées :**
- Total des messages
- Messages nouveaux
- Messages lus
- Messages répondus
- Messages traités

## Workflow d'utilisation

### Pour les visiteurs :
1. Accéder à la page de contact
2. Remplir le formulaire avec les informations requises
3. Optionnellement spécifier une date/heure souhaitée
4. Soumettre le formulaire
5. Recevoir une confirmation de succès

### Pour les administrateurs/responsables :
1. Se connecter au dashboard admin
2. Accéder à "Messages de Contact" via les actions rapides
3. Voir les statistiques et la liste des messages
4. Marquer les messages selon leur progression
5. Ajouter des notes si nécessaire

## Sécurité et permissions

- **Création de messages** : Public (pas d'authentification requise)
- **Consultation des messages** : Admin et Responsable Cabinet uniquement
- **Modification des statuts** : Admin et Responsable Cabinet uniquement
- **Validation côté serveur** : Toutes les données sont validées côté backend

## Base de données

La migration a été créée et appliquée :
- `cabinet_backend/cabinet/migrations/0004_contact.py`

## Routes frontend

- `/admin/contacts` - Interface de gestion des messages (admin/responsable)

## Intégration

Le système est entièrement intégré avec :
- Le système d'authentification existant
- Le système de permissions par rôle
- Le système de notifications (toast)
- Le design system existant (shadcn/ui)

## Tests recommandés

1. **Test du formulaire de contact :**
   - Remplir et soumettre un formulaire valide
   - Tester la validation des champs
   - Vérifier l'enregistrement en base de données

2. **Test de l'interface admin :**
   - Se connecter en tant qu'admin
   - Accéder à la gestion des contacts
   - Marquer des messages comme lus/répondus/traités
   - Utiliser les filtres et la recherche

3. **Test des permissions :**
   - Vérifier que seuls les admins et responsables peuvent accéder à la gestion
   - Vérifier que les autres rôles ne peuvent pas accéder

## Prochaines améliorations possibles

1. **Notifications par email** : Envoyer des notifications par email lors de nouveaux messages
2. **Réponses automatiques** : Envoyer des réponses automatiques de confirmation
3. **Export des messages** : Permettre l'export des messages en CSV/PDF
4. **Templates de réponse** : Créer des templates de réponse prédéfinis
5. **Assignation de messages** : Permettre d'assigner des messages à des membres du personnel
