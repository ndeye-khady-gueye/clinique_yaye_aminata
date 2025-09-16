# Script de déploiement complet pour le frontend React (PowerShell)
# Usage: .\deploy-frontend-complete.ps1

Write-Host "🚀 Déploiement complet du frontend React - Cabinet Yaye Aminata" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet." -ForegroundColor Red
    exit 1
}

# Vérifier que Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: Node.js n'est pas installé." -ForegroundColor Red
    exit 1
}

# Vérifier que npm est installé
try {
    $npmVersion = npm --version
    Write-Host "✅ NPM détecté: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: npm n'est pas installé." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm ci --production=false

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances." -ForegroundColor Red
    exit 1
}

Write-Host "🔨 Construction de l'application pour la production..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la construction de l'application." -ForegroundColor Red
    exit 1
}

# Vérifier que le build a réussi
if (-not (Test-Path "dist")) {
    Write-Host "❌ Erreur: Le build a échoué. Le dossier dist n'existe pas." -ForegroundColor Red
    exit 1
}

# Calculer la taille du build
$buildSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
$buildSizeMB = [math]::Round($buildSize / 1MB, 2)
Write-Host "📊 Taille du build: $buildSizeMB MB" -ForegroundColor Cyan

# Compter les fichiers
$fileCount = (Get-ChildItem -Path "dist" -Recurse -File).Count
Write-Host "📁 Nombre de fichiers: $fileCount" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ Build terminé avec succès!" -ForegroundColor Green
Write-Host "📁 Dossier de déploiement: .\dist" -ForegroundColor Green
Write-Host ""

# Créer un fichier de vérification
$deploymentInfo = @"
Cabinet Yaye Aminata - Frontend React
=====================================

Date de build: $(Get-Date)
Version: $(Get-Content package.json | ConvertFrom-Json | Select-Object -ExpandProperty version)
Node.js: $nodeVersion
NPM: $npmVersion

Fichiers inclus:
- index.html (point d'entrée)
- assets/ (CSS, JS, images, vidéos)
- robots.txt
- placeholder.svg

Instructions de déploiement:
1. Copiez tout le contenu du dossier 'dist' vers votre serveur web
2. Configurez votre serveur web pour servir index.html pour toutes les routes
3. Configurez les redirections pour l'API backend
4. Testez l'application

URLs importantes:
- Site principal: https://cabinetyayeaminata.com
- API Backend: https://cabinetyayeaminata.com/api
- Admin Django: https://cabinetyayeaminata.com/admin

Support: Contactez l'équipe de développement
"@

$deploymentInfo | Out-File -FilePath "dist\deployment-info.txt" -Encoding UTF8

Write-Host "📋 Informations de déploiement créées: dist\deployment-info.txt" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Uploadez le contenu du dossier 'dist' vers votre serveur web" -ForegroundColor White
Write-Host "2. Configurez votre serveur web (Nginx/Apache) pour servir les fichiers statiques" -ForegroundColor White
Write-Host "3. Configurez les redirections pour l'API backend" -ForegroundColor White
Write-Host "4. Testez l'application en production" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URL de production: https://cabinetyayeaminata.com" -ForegroundColor Cyan
Write-Host "🔗 API Backend: https://cabinetyayeaminata.com/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Déploiement du frontend prêt !" -ForegroundColor Green
