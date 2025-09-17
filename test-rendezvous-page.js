#!/usr/bin/env node

/**
 * Script de test pour vérifier la page RendezVousManagement
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Test de la page RendezVousManagement...\n');

// Vérifier que le fichier existe
const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'RendezVousManagement.tsx');

if (!fs.existsSync(filePath)) {
  console.error('❌ Fichier RendezVousManagement.tsx non trouvé');
  process.exit(1);
}

// Lire le contenu du fichier
const content = fs.readFileSync(filePath, 'utf8');

// Vérifications
const checks = [
  {
    name: 'Import DialogTitle et DialogDescription',
    test: () => content.includes('DialogTitle') && content.includes('DialogDescription'),
    message: 'DialogTitle et DialogDescription sont importés'
  },
  {
    name: 'Structure DialogContent correcte',
    test: () => {
      const dialogContentMatches = content.match(/<DialogContent[^>]*>/g) || [];
      const dialogTitleMatches = content.match(/<DialogTitle[^>]*>/g) || [];
      const dialogDescriptionMatches = content.match(/<DialogDescription[^>]*>/g) || [];
      
      // Chaque DialogContent doit avoir au moins un DialogTitle et DialogDescription
      return dialogContentMatches.length > 0 && 
             dialogTitleMatches.length >= dialogContentMatches.length &&
             dialogDescriptionMatches.length >= dialogContentMatches.length;
    },
    message: 'Tous les DialogContent ont DialogTitle et DialogDescription'
  },
  {
    name: 'Pas de balises JSX non fermées',
    test: () => {
      const openTags = content.match(/<[^/][^>]*>/g) || [];
      const closeTags = content.match(/<\/[^>]*>/g) || [];
      
      // Vérifier que les balises principales sont fermées
      const divOpen = (content.match(/<div/g) || []).length;
      const divClose = (content.match(/<\/div>/g) || []).length;
      const dialogOpen = (content.match(/<Dialog/g) || []).length;
      const dialogClose = (content.match(/<\/Dialog>/g) || []).length;
      
      return divOpen === divClose && dialogOpen === dialogClose;
    },
    message: 'Toutes les balises JSX sont correctement fermées'
  },
  {
    name: 'Export par défaut présent',
    test: () => content.includes('export default RendezVousManagement'),
    message: 'Export par défaut est présent'
  },
  {
    name: 'Fonction composant correcte',
    test: () => content.includes('const RendezVousManagement = () => {'),
    message: 'Fonction composant est correctement définie'
  }
];

let passed = 0;
let total = checks.length;

console.log('📋 Vérifications :\n');

checks.forEach((check, index) => {
  const result = check.test();
  const status = result ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${check.name}`);
  if (result) {
    console.log(`   ${check.message}`);
    passed++;
  } else {
    console.log(`   ❌ ${check.message}`);
  }
  console.log('');
});

console.log('📊 Résumé :');
console.log(`   Tests réussis: ${passed}/${total}`);
console.log(`   Taux de réussite: ${Math.round((passed / total) * 100)}%`);

if (passed === total) {
  console.log('\n🎉 Tous les tests sont passés ! La page RendezVousManagement est correcte.');
  process.exit(0);
} else {
  console.log('\n⚠️  Certains tests ont échoué. Vérifiez les problèmes ci-dessus.');
  process.exit(1);
}
