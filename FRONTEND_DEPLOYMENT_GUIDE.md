# 🚀 Guide de Déploiement Frontend - Cabinet Yaye Aminata

## ✅ Build Terminé

Le projet React a été construit avec succès pour la production.

### 📊 Statistiques du Build
- **Dossier de sortie** : `dist/`
- **Fichiers générés** : 16 fichiers
- **Taille totale** : ~65 MB (incluant les images et vidéos)
- **Temps de build** : ~2m 47s

## 📁 Structure du Build

```
dist/
├── index.html                    # Point d'entrée de l'application
├── assets/
│   ├── index-BrBNEyTw.js        # Bundle JavaScript principal (2.3 MB)
│   ├── index-DBug1Vmn.css       # Styles CSS (107 KB)
│   ├── index.es-teHhlcEx.js     # Bibliothèques externes (150 KB)
│   ├── purify.es-CQJ0hv7W.js    # DOMPurify (22 KB)
│   ├── Logo_page-0001-D3q8leJA.jpg
│   ├── 2149117843-Bqbnu1nM.jpg
│   ├── femmes-BhtSjSKw.jpg
│   ├── Video-xWPkJywl.mp4
│   └── ... (autres images)
├── robots.txt
├── placeholder.svg
└── deployment-info.txt
```

## 🚀 Déploiement

### Option 1: Script Automatique (Recommandé)

#### Windows (PowerShell)
```powershell
.\deploy-frontend-complete.ps1
```

#### Linux/Mac (Bash)
```bash
chmod +x deploy-frontend-complete.sh
./deploy-frontend-complete.sh
```

### Option 2: Déploiement Manuel

1. **Copier les fichiers**
   ```bash
   # Copier tout le contenu du dossier dist vers votre serveur
   scp -r dist/* user@your-server:/var/www/cabinetyayeaminata.com/
   ```

2. **Configurer le serveur web**

## ⚙️ Configuration Serveur Web

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name cabinetyayeaminata.com www.cabinetyayeaminata.com;
    
    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cabinetyayeaminata.com www.cabinetyayeaminata.com;
    
    # Configuration SSL
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Configuration pour le frontend React
    root /var/www/cabinetyayeaminata.com;
    index index.html;
    
    # Servir les fichiers statiques
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache pour les assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp4)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Configuration pour l'API Django
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Configuration pour l'admin Django
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Configuration pour les fichiers statiques Django
    location /static/ {
        alias /var/www/cabinetyayeaminata.com/backend/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Configuration pour les fichiers média Django
    location /media/ {
        alias /var/www/cabinetyayeaminata.com/backend/media/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName cabinetyayeaminata.com
    ServerAlias www.cabinetyayeaminata.com
    
    # Redirection vers HTTPS
    Redirect permanent / https://cabinetyayeaminata.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName cabinetyayeaminata.com
    ServerAlias www.cabinetyayeaminata.com
    
    # Configuration SSL
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    
    # Document root pour le frontend React
    DocumentRoot /var/www/cabinetyayeaminata.com
    
    # Configuration pour React Router
    <Directory /var/www/cabinetyayeaminata.com>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Fallback vers index.html pour React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Proxy pour l'API Django
    ProxyPreserveHost On
    ProxyPass /api/ http://127.0.0.1:8000/api/
    ProxyPassReverse /api/ http://127.0.0.1:8000/api/
    
    # Proxy pour l'admin Django
    ProxyPass /admin/ http://127.0.0.1:8000/admin/
    ProxyPassReverse /admin/ http://127.0.0.1:8000/admin/
    
    # Fichiers statiques Django
    Alias /static/ /var/www/cabinetyayeaminata.com/backend/staticfiles/
    <Directory /var/www/cabinetyayeaminata.com/backend/staticfiles/>
        Require all granted
    </Directory>
    
    # Fichiers média Django
    Alias /media/ /var/www/cabinetyayeaminata.com/backend/media/
    <Directory /var/www/cabinetyayeaminata.com/backend/media/>
        Require all granted
    </Directory>
</VirtualHost>
```

## 🔧 Optimisations

### 1. Compression Gzip
```nginx
# Dans la configuration Nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 2. Cache Headers
```nginx
# Cache pour les assets statiques
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp4)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}
```

### 3. CDN (Optionnel)
Pour améliorer les performances, vous pouvez utiliser un CDN comme Cloudflare ou AWS CloudFront.

## ✅ Vérification du Déploiement

### 1. Test de l'application
```bash
# Vérifier que l'application se charge
curl -I https://cabinetyayeaminata.com

# Vérifier les assets
curl -I https://cabinetyayeaminata.com/assets/index-BrBNEyTw.js
```

### 2. Test de l'API
```bash
# Vérifier l'API backend
curl https://cabinetyayeaminata.com/api/health/
```

### 3. Test de l'admin
```bash
# Vérifier l'admin Django
curl -I https://cabinetyayeaminata.com/admin/
```

## 🚨 Dépannage

### Problèmes courants

1. **Erreur 404 sur les routes React**
   - Vérifiez que la configuration `try_files` est correcte
   - Assurez-vous que `index.html` est servi pour toutes les routes

2. **Assets non chargés**
   - Vérifiez les permissions des fichiers
   - Vérifiez la configuration des chemins

3. **Erreurs CORS**
   - Vérifiez la configuration CORS dans Django
   - Vérifiez les headers de proxy

### Logs utiles

```bash
# Logs Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Logs Apache
tail -f /var/log/apache2/access.log
tail -f /var/log/apache2/error.log
```

## 📋 Checklist de Déploiement

- [ ] ✅ Build React terminé
- [ ] 📁 Fichiers copiés sur le serveur
- [ ] ⚙️ Serveur web configuré
- [ ] 🔒 SSL configuré
- [ ] 🔗 API backend accessible
- [ ] 🧪 Tests de fonctionnement
- [ ] 📊 Monitoring configuré
- [ ] 🔄 Sauvegarde configurée

## 🎯 URLs de Production

- **Site principal** : https://cabinetyayeaminata.com
- **API Backend** : https://cabinetyayeaminata.com/api
- **Admin Django** : https://cabinetyayeaminata.com/admin

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**Note** : Ce guide assume que vous avez déjà configuré le backend Django et la base de données. Consultez le guide de déploiement backend pour plus d'informations.
