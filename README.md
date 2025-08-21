# Cabinet Yaye Aminata - Système de Gestion Médicale

Application web complète pour la gestion d'un cabinet médical avec authentification multi-rôles, gestion des patients, rendez-vous, consultations et paiements.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Django 5.2 + Django REST Framework + JWT Authentication
- **Base de données**: SQLite (développement) / PostgreSQL (production)

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+ et npm/yarn
- Python 3.8+ et pip
- Git

### 1. Cloner le projet

```bash
git clone <repository-url>
cd clinique-rendez-vous-web
```

### 2. Configuration du Backend Django

```bash
# Aller dans le dossier backend
cd cabinet_backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py makemigrations
python manage.py migrate

# Créer un superuser (optionnel)
python manage.py createsuperuser

# Initialiser les données de base (utilisateurs de test, services)
python manage.py init_data

# Démarrer le serveur backend
python manage.py runserver 0.0.0.0:8000
```

### 3. Configuration du Frontend React

```bash
# Retourner à la racine du projet
cd ..

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🔐 Comptes de Test

Après avoir exécuté `python manage.py init_data`, les comptes suivants sont créés :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@dev.clinique.sn | 123456 |
| Responsable Cabinet | responsable@clinique.sn | 123456 |
| Docteur | dr.diop@clinique.sn | 123456 |
| Réceptionniste | reception@clinique.sn | 123456 |
| Patient | patient@example.com | 123456 |

## 📋 Fonctionnalités

### 🔐 Authentification Multi-Rôles
- **Admin**: Accès complet au système
- **Responsable Cabinet**: Gestion du cabinet, équipe, rapports
- **Docteur**: Ses patients, consultations, prescriptions
- **Réceptionniste**: Gestion des RDV, patients
- **Patient**: Ses RDV, profil personnel

### 👥 Gestion des Patients
- Inscription et profil complet
- Historique médical
- Dossiers médicaux numériques
- Suivi des traitements

### 📅 Gestion des Rendez-vous
- Prise de RDV en ligne
- Planning des médecins
- Confirmation/annulation
- Rappels automatiques

### 💊 Consultations et Prescriptions
- Diagnostic et traitement
- Prescriptions numériques
- Suivi des consultations
- Historique médical

### 💰 Gestion Financière
- Paiements multiples (espèces, carte, mobile money)
- Facturation automatique
- Rapports financiers
- Suivi des revenus

### 📊 Tableaux de Bord
- Statistiques en temps réel
- Graphiques et rapports
- Indicateurs de performance
- Export de données

## 🛠️ API Endpoints

### Authentification
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/logout/` - Déconnexion
- `GET /api/auth/me/` - Informations utilisateur

### Utilisateurs
- `GET /api/users/` - Liste des utilisateurs
- `POST /api/users/` - Créer un utilisateur
- `GET /api/users/docteurs/` - Liste des docteurs

### Patients
- `GET /api/patients/` - Liste des patients
- `POST /api/patients/` - Créer un patient
- `GET /api/patients/{id}/dossier_medical/` - Dossier médical

### Rendez-vous
- `GET /api/rendez-vous/` - Liste des RDV
- `POST /api/rendez-vous/` - Créer un RDV
- `GET /api/rendez-vous/aujourd_hui/` - RDV d'aujourd'hui
- `POST /api/rendez-vous/{id}/confirmer/` - Confirmer un RDV
- `POST /api/rendez-vous/{id}/annuler/` - Annuler un RDV

### Services
- `GET /api/services/` - Liste des services
- `GET /api/services/actifs/` - Services actifs

### Consultations
- `GET /api/consultations/` - Liste des consultations
- `POST /api/consultations/` - Créer une consultation

### Paiements
- `GET /api/paiements/` - Liste des paiements
- `POST /api/paiements/` - Créer un paiement

### Statistiques
- `GET /api/statistiques/dashboard/` - Statistiques du tableau de bord

## 🎨 Interface Utilisateur

### Design System
- **Couleurs**: Violet (#6C2476) + Rose (#B0368B)
- **Typographie**: Moderne et lisible
- **Mode sombre/clair** automatique
- **Responsive design** mobile-first

### Composants
- 46 composants shadcn/ui réutilisables
- Animations fluides
- Accessibilité complète
- Thème adaptatif

## 🔧 Configuration

### Variables d'environnement Backend
```bash
# .env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### Configuration Frontend
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://localhost:8000/api';
```

## 📁 Structure du Projet

```
clinique-rendez-vous-web/
├── cabinet_backend/          # Backend Django
│   ├── cabinet/             # App principale
│   │   ├── models.py        # Modèles de données
│   │   ├── views.py         # Vues API
│   │   ├── serializers.py   # Sérialiseurs
│   │   └── urls.py          # URLs API
│   ├── cabinet_backend/     # Configuration Django
│   ├── requirements.txt     # Dépendances Python
│   └── manage.py           # Script Django
├── src/                     # Frontend React
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   ├── contexts/          # Contextes React
│   ├── services/          # Services API
│   └── hooks/             # Hooks personnalisés
├── public/                # Assets statiques
└── package.json           # Dépendances Node.js
```

## 🚀 Déploiement

### Backend (Production)
```bash
# Installer gunicorn
pip install gunicorn

# Collecter les fichiers statiques
python manage.py collectstatic

# Démarrer avec gunicorn
gunicorn cabinet_backend.wsgi:application --bind 0.0.0.0:8000
```

### Frontend (Production)
```bash
# Build de production
npm run build

# Servir avec nginx ou serveur web
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email: cabinetyayeaminata25@gmail.com
- Téléphone: +221 33 893 47 89 / +221 78 437 01 01

---

**Cabinet Yaye Aminata** - Un espace d'écoute, de bienveillance et d'accompagnement pour vous et votre famille. 🏥✨
