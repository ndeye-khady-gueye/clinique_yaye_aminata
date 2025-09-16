# 📁 Structure des Assets - Cabinet Yaye Aminata

## 🎯 Organisation des fichiers

Les images ont été déplacées du dossier `public/` vers `src/assets/images/` pour une meilleure organisation et gestion des assets.

### 📂 Structure actuelle

```
src/
├── assets/
│   ├── images/
│   │   ├── Logo_page-0001.jpg          # Logo principal du cabinet
│   │   ├── contact.png                  # Image de contact
│   │   ├── femmes.jpg                   # Image de la page À propos
│   │   ├── yaye.jpg                     # Image de l'équipe
│   │   ├── lolo2.jpg                    # Photo de l'équipe (dashboard admin)
│   │   ├── consultations.jpg            # Image des consultations
│   │   ├── vacciner.jpg                 # Image de vaccination
│   │   ├── gros-plan-d-un-garcon-se-faisant-examiner.jpg
│   │   ├── infirmiere-afro-americaine-et-femme-enceinte-parlant.jpg
│   │   ├── photo-madame-daouda.jpg      # Photo de Madame Daouda
│   │   ├── logo.jpg                     # Logo alternatif
│   │   ├── Video.mp4                    # Vidéo
│   │   └── diagramme_classePatient_files/  # Fichiers du diagramme
│   └── index.ts                         # Export des assets
```

## 🔧 Configuration

### Vite Configuration

Le fichier `vite.config.ts` a été mis à jour pour gérer correctement les assets :

```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    "/src/assets": path.resolve(__dirname, "./src/assets"),
  },
}
```

### Import des Assets

Les images sont maintenant référencées avec le chemin `/src/assets/images/` :

```tsx
// Avant
<img src="/lovable-uploads/Logo_page-0001.jpg" alt="Logo" />

// Maintenant
<img src="/src/assets/images/Logo_page-0001.jpg" alt="Logo" />
```

## 📋 Fichiers mis à jour

### Composants principaux
- `src/components/Layout.tsx` - Logo principal
- `src/components/Header.tsx` - Logo du header
- `src/components/About.tsx` - Image de la page À propos
- `src/components/Contact.tsx` - Image de contact
- `src/components/Team.tsx` - Image de l'équipe
- `src/components/dashboards/AdminDashboard.tsx` - Photo de l'équipe

### Formulaires
- `src/components/forms/AppointmentForm.tsx` - Logo dans le formulaire de RDV
- `src/components/forms/PaymentForm.tsx` - Logo dans le formulaire de paiement
- `src/components/forms/PatientForm.tsx` - Logo dans le formulaire patient
- `src/components/forms/PatientEnregistreForm.tsx` - Logo dans le formulaire patient enregistré
- `src/components/forms/ConsultationReceiptForm.tsx` - Logo dans le reçu de consultation
- `src/components/forms/ReportsGenerator.tsx` - Logo dans le générateur de rapports
- `src/components/FinancialReportsModal.tsx` - Logo dans les rapports financiers

## ✅ Vérification

Toutes les images référencées dans le code ont été vérifiées et sont présentes dans le dossier `src/assets/images/`.

### Images vérifiées :
- ✅ Logo_page-0001.jpg
- ✅ contact.png
- ✅ femmes.jpg
- ✅ yaye.jpg
- ✅ lolo2.jpg
- ✅ consultations.jpg
- ✅ vacciner.jpg
- ✅ gros-plan-d-un-garcon-se-faisant-examiner.jpg
- ✅ infirmiere-afro-americaine-et-femme-enceinte-parlant.jpg
- ✅ photo-madame-daouda.jpg
- ✅ logo.jpg
- ✅ Video.mp4

## 🚀 Avantages de cette structure

1. **Organisation** : Tous les assets sont centralisés dans `src/assets/`
2. **Gestion** : Plus facile de gérer et maintenir les images
3. **Performance** : Vite optimise automatiquement les assets
4. **TypeScript** : Support complet des types pour les imports
5. **Build** : Les assets sont correctement inclus dans le build de production

## 📝 Notes importantes

- Les chemins utilisent `/src/assets/images/` pour la compatibilité avec Vite
- Tous les assets sont automatiquement optimisés lors du build
- Les images sont servies depuis le dossier `dist/assets/` en production
- Le fichier `src/assets/index.ts` permet d'importer facilement les assets

## 🔄 Migration terminée

La migration des images du dossier `public/` vers `src/assets/images/` est terminée. Tous les composants utilisent maintenant les nouveaux chemins et la configuration Vite est optimisée pour cette structure.
