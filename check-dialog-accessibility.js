#!/usr/bin/env node

/**
 * Script de vérification de l'accessibilité des composants Dialog
 * Vérifie que tous les DialogContent ont DialogTitle et DialogDescription
 */

const fs = require('fs');
const path = require('path');

// Fonction pour lire récursivement les fichiers .tsx
function findTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fonction pour vérifier un fichier
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const issues = [];
  let inDialogContent = false;
  let hasDialogTitle = false;
  let hasDialogDescription = false;
  let dialogContentLine = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Détecter l'ouverture de DialogContent
    if (line.includes('<DialogContent') && !line.includes('</DialogContent>')) {
      inDialogContent = true;
      hasDialogTitle = false;
      hasDialogDescription = false;
      dialogContentLine = i + 1;
    }
    
    // Détecter la fermeture de DialogContent
    if (inDialogContent && line.includes('</DialogContent>')) {
      if (!hasDialogTitle) {
        issues.push({
          file: filePath,
          line: dialogContentLine,
          type: 'missing-title',
          message: 'DialogContent sans DialogTitle'
        });
      }
      if (!hasDialogDescription) {
        issues.push({
          file: filePath,
          line: dialogContentLine,
          type: 'missing-description',
          message: 'DialogContent sans DialogDescription'
        });
      }
      inDialogContent = false;
    }
    
    // Détecter DialogTitle dans DialogContent
    if (inDialogContent && line.includes('<DialogTitle')) {
      hasDialogTitle = true;
    }
    
    // Détecter DialogDescription dans DialogContent
    if (inDialogContent && line.includes('<DialogDescription')) {
      hasDialogDescription = true;
    }
  }
  
  return issues;
}

// Fonction principale
function main() {
  console.log('🔍 Vérification de l\'accessibilité des composants Dialog...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const files = findTsxFiles(srcDir);
  
  let totalIssues = 0;
  const allIssues = [];
  
  for (const file of files) {
    const issues = checkFile(file);
    if (issues.length > 0) {
      allIssues.push(...issues);
      totalIssues += issues.length;
    }
  }
  
  if (totalIssues === 0) {
    console.log('✅ Tous les composants Dialog sont accessibles !');
    console.log(`📊 ${files.length} fichiers vérifiés`);
  } else {
    console.log(`❌ ${totalIssues} problème(s) d'accessibilité trouvé(s) :\n`);
    
    // Grouper par fichier
    const issuesByFile = {};
    for (const issue of allIssues) {
      if (!issuesByFile[issue.file]) {
        issuesByFile[issue.file] = [];
      }
      issuesByFile[issue.file].push(issue);
    }
    
    for (const [file, issues] of Object.entries(issuesByFile)) {
      console.log(`📁 ${file}:`);
      for (const issue of issues) {
        console.log(`   Ligne ${issue.line}: ${issue.message}`);
      }
      console.log('');
    }
  }
  
  console.log('\n📋 Résumé:');
  console.log(`   Fichiers vérifiés: ${files.length}`);
  console.log(`   Problèmes trouvés: ${totalIssues}`);
  
  if (totalIssues > 0) {
    process.exit(1);
  }
}

main();
