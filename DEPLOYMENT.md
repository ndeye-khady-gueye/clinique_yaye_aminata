# 🚀 Guide de Déploiement - Cabinet Yaye Aminata

Ce guide vous explique comment déployer l'application sur le domaine `cabinetyayeaminata.com`.

## 📋 Prérequis

- Serveur Ubuntu/Debian avec accès root
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Nginx
- Certificat SSL (Let's Encrypt recommandé)

## 🔧 Configuration du Serveur

### 1. Installation des dépendances

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install -y python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib nginx git

# Installation de Certbot pour SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Configuration de PostgreSQL

```bash
# Connexion à PostgreSQL
sudo -u postgres psql

# Création de la base de données
CREATE DATABASE cabinet_prod;
CREATE USER cabinet_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE cabinet_prod TO cabinet_user;
\q
```

## 🚀 Déploiement du Backend

### 1. Cloner le projet

```bash
cd /var/www
sudo git clone https://github.com/votre-repo/cabinet-yaye-aminata.git
sudo chown -R www-data:www-data cabinet-yaye-aminata
cd cabinet-yaye-aminata
```

### 2. Configuration de l'environnement

```bash
# Créer un environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install -r cabinet_backend/requirements.txt
```

### 3. Configuration des variables d'environnement

```bash
# Créer le fichier .env
cat > cabinet_backend/.env << EOF
DEBUG=False
SECRET_KEY=votre_secret_key_tres_securise
DB_NAME=cabinet_prod
DB_USER=cabinet_user
DB_PASSWORD=votre_mot_de_passe_securise
DB_HOST=localhost
DB_PORT=5432
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=votre_email@gmail.com
EMAIL_HOST_PASSWORD=votre_mot_de_passe_email
DEFAULT_FROM_EMAIL=noreply@cabinetyayeaminata.com
REDIS_URL=redis://127.0.0.1:6379/1
EOF
```

### 4. Déploiement du backend

```bash
# Exécuter le script de déploiement
chmod +x deploy-backend.sh
./deploy-backend.sh
```

### 5. Configuration de Gunicorn

```bash
# Installer Gunicorn
pip install gunicorn

# Créer le fichier de configuration
cat > cabinet_backend/gunicorn.conf.py << EOF
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
EOF
```

### 6. Créer un service systemd

```bash
sudo cat > /etc/systemd/system/cabinet-backend.service << EOF
[Unit]
Description=Cabinet Yaye Aminata Backend
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/cabinet-yaye-aminata/cabinet_backend
Environment=PATH=/var/www/cabinet-yaye-aminata/venv/bin
ExecStart=/var/www/cabinet-yaye-aminata/venv/bin/gunicorn --config gunicorn.conf.py cabinet_backend.wsgi:application
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Démarrer le service
sudo systemctl daemon-reload
sudo systemctl enable cabinet-backend
sudo systemctl start cabinet-backend
```

## 🎨 Déploiement du Frontend

### 1. Installation des dépendances

```bash
# Installer les dépendances Node.js
npm install

# Construire l'application
npm run build
```

### 2. Configuration de Nginx

```bash
# Copier la configuration Nginx
sudo cp nginx.conf /etc/nginx/sites-available/cabinetyayeaminata.com
sudo ln -s /etc/nginx/sites-available/cabinetyayeaminata.com /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### 3. Configuration SSL avec Let's Encrypt

```bash
# Obtenir le certificat SSL
sudo certbot --nginx -d cabinetyayeaminata.com -d www.cabinetyayeaminata.com

# Vérifier le renouvellement automatique
sudo certbot renew --dry-run
```

## 🔄 Scripts de Déploiement Automatique

### Frontend

```bash
# Déploiement automatique du frontend
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

### Backend

```bash
# Déploiement automatique du backend
chmod +x deploy-backend.sh
./deploy-backend.sh
```

## 📊 Monitoring et Maintenance

### 1. Vérification des services

```bash
# Vérifier le statut des services
sudo systemctl status cabinet-backend
sudo systemctl status nginx
sudo systemctl status postgresql
```

### 2. Logs

```bash
# Logs du backend
sudo journalctl -u cabinet-backend -f

# Logs de Nginx
sudo tail -f /var/log/nginx/cabinetyayeaminata.com.access.log
sudo tail -f /var/log/nginx/cabinetyayeaminata.com.error.log
```

### 3. Sauvegarde de la base de données

```bash
# Script de sauvegarde quotidienne
cat > /home/backup-db.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U cabinet_user -d cabinet_prod > /var/backups/cabinet_prod_\$DATE.sql
find /var/backups -name "cabinet_prod_*.sql" -mtime +7 -delete
EOF

chmod +x /home/backup-db.sh

# Ajouter à la crontab
echo "0 2 * * * /home/backup-db.sh" | sudo crontab -
```

## 🌐 URLs de Production

- **Site Web**: https://cabinetyayeaminata.com
- **API Backend**: https://cabinetyayeaminata.com/api
- **Admin Django**: https://cabinetyayeaminata.com/admin

## 🔧 Configuration des Variables d'Environnement

### Frontend

Les variables d'environnement sont configurées dans `src/config/environment.ts` et s'adaptent automatiquement selon l'environnement.

### Backend

Les variables d'environnement sont dans `cabinet_backend/.env` pour le développement et dans les variables d'environnement du système pour la production.

## 🚨 Dépannage

### Problèmes courants

1. **Erreur 502 Bad Gateway**: Vérifiez que le service backend est démarré
2. **Erreur CORS**: Vérifiez la configuration CORS dans `settings.py`
3. **Erreur de base de données**: Vérifiez les paramètres de connexion PostgreSQL
4. **Erreur SSL**: Vérifiez que les certificats sont valides et non expirés

### Commandes utiles

```bash
# Redémarrer tous les services
sudo systemctl restart cabinet-backend nginx

# Vérifier les logs en temps réel
sudo journalctl -u cabinet-backend -f

# Tester la configuration Nginx
sudo nginx -t

# Vérifier les ports ouverts
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :8000
```

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**Note**: Assurez-vous de remplacer tous les mots de passe et clés secrètes par des valeurs sécurisées avant le déploiement en production.
