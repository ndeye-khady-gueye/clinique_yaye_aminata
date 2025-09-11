#!/usr/bin/env node

/**
 * Script de validation des améliorations responsive
 * Vérifie que tous les composants et styles sont correctement implémentés
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 Validation des Améliorations Responsive');
console.log('==========================================\n');

// Liste des fichiers à vérifier
const filesToCheck = [
    'src/components/ui/EnhancedMobileNavigation.tsx',
    'src/components/ui/EnhancedResponsiveGrid.tsx',
    'src/components/ui/ResponsiveButton.tsx',
    'src/components/ui/ResponsiveForm.tsx',
    'src/components/ResponsiveTestComponent.tsx',
    'src/pages/MyAppointments.tsx',
    'src/index.css'
];

// Classes CSS responsive à vérifier
const responsiveClasses = [
    'container-responsive',
    'grid-responsive',
    'text-responsive',
    'text-responsive-lg',
    'text-responsive-xl',
    'text-responsive-hero',
    'padding-responsive',
    'margin-responsive',
    'card-responsive',
    'card-responsive-compact',
    'btn-responsive',
    'btn-responsive-sm',
    'btn-responsive-lg',
    'form-responsive',
    'input-responsive',
    'label-responsive',
    'table-responsive',
    'nav-responsive',
    'nav-item-responsive',
    'img-responsive',
    'img-responsive-square',
    'img-responsive-circle',
    'icon-responsive',
    'icon-responsive-sm',
    'icon-responsive-lg',
    'space-responsive',
    'space-x-responsive',
    'space-y-responsive',
    'grid-responsive-auto',
    'grid-responsive-auto-sm',
    'grid-responsive-auto-lg',
    'modal-responsive',
    'text-responsive-mobile',
    'text-responsive-tablet',
    'text-responsive-desktop',
    'h-responsive',
    'min-h-responsive',
    'w-responsive',
    'max-w-responsive'
];

// Breakpoints à vérifier
const breakpoints = [
    'xs:', 'sm:', 'md:', 'lg:', 'xl:', '2xl:'
];

let allChecksPassed = true;

// Fonction pour vérifier l'existence d'un fichier
function checkFileExists(filePath) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${filePath} - Existe`);
        return true;
    } else {
        console.log(`❌ ${filePath} - Manquant`);
        allChecksPassed = false;
        return false;
    }
}

// Fonction pour vérifier le contenu d'un fichier
function checkFileContent(filePath, patterns) {
    if (!fs.existsSync(filePath)) {
        return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    let fileChecksPassed = true;
    
    patterns.forEach(pattern => {
        if (content.includes(pattern)) {
            console.log(`  ✅ ${pattern} - Trouvé`);
        } else {
            console.log(`  ❌ ${pattern} - Manquant`);
            fileChecksPassed = false;
            allChecksPassed = false;
        }
    });
    
    return fileChecksPassed;
}

// Fonction pour vérifier les classes CSS responsive
function checkResponsiveClasses() {
    console.log('\n📋 Vérification des Classes CSS Responsive');
    console.log('==========================================');
    
    const cssFile = 'src/index.css';
    if (!fs.existsSync(cssFile)) {
        console.log('❌ Fichier CSS manquant');
        return false;
    }
    
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    let classesFound = 0;
    
    responsiveClasses.forEach(className => {
        if (cssContent.includes(className)) {
            console.log(`  ✅ .${className}`);
            classesFound++;
        } else {
            console.log(`  ❌ .${className} - Manquant`);
            allChecksPassed = false;
        }
    });
    
    console.log(`\n📊 Classes trouvées: ${classesFound}/${responsiveClasses.length}`);
    return classesFound === responsiveClasses.length;
}

// Fonction pour vérifier les breakpoints
function checkBreakpoints() {
    console.log('\n📱 Vérification des Breakpoints');
    console.log('===============================');
    
    const cssFile = 'src/index.css';
    if (!fs.existsSync(cssFile)) {
        console.log('❌ Fichier CSS manquant');
        return false;
    }
    
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    let breakpointsFound = 0;
    
    breakpoints.forEach(breakpoint => {
        if (cssContent.includes(breakpoint)) {
            console.log(`  ✅ ${breakpoint} - Trouvé`);
            breakpointsFound++;
        } else {
            console.log(`  ❌ ${breakpoint} - Manquant`);
            allChecksPassed = false;
        }
    });
    
    console.log(`\n📊 Breakpoints trouvés: ${breakpointsFound}/${breakpoints.length}`);
    return breakpointsFound === breakpoints.length;
}

// Fonction pour vérifier les composants React
function checkReactComponents() {
    console.log('\n⚛️ Vérification des Composants React');
    console.log('====================================');
    
    const components = [
        {
            file: 'src/components/ui/EnhancedMobileNavigation.tsx',
            patterns: [
                'EnhancedMobileNavigation',
                'useState',
                'useEffect',
                'Sheet',
                'SheetContent',
                'SheetTrigger',
                'Search',
                'Badge',
                'responsive'
            ]
        },
        {
            file: 'src/components/ui/EnhancedResponsiveGrid.tsx',
            patterns: [
                'EnhancedResponsiveGrid',
                'autoFit',
                'minItemWidth',
                'equalHeight',
                'grid-cols-',
                'xs:grid-cols-',
                'sm:grid-cols-'
            ]
        },
        {
            file: 'src/components/ui/ResponsiveButton.tsx',
            patterns: [
                'ResponsiveButton',
                'responsiveSize',
                'mobileIcon',
                'hideTextOnMobile',
                'fullWidthOnMobile',
                'btn-responsive'
            ]
        },
        {
            file: 'src/components/ui/ResponsiveForm.tsx',
            patterns: [
                'ResponsiveForm',
                'ResponsiveFormField',
                'ResponsiveLabel',
                'ResponsiveInput',
                'ResponsiveTextarea',
                'ResponsiveSelect',
                'ResponsiveButtonGroup'
            ]
        },
        {
            file: 'src/components/ResponsiveTestComponent.tsx',
            patterns: [
                'ResponsiveTestComponent',
                'getCurrentBreakpoint',
                'breakpointInfo',
                'Smartphone',
                'Tablet',
                'Monitor',
                'responsive'
            ]
        }
    ];
    
    let componentsPassed = 0;
    
    components.forEach(component => {
        console.log(`\n🔍 Vérification de ${component.file}`);
        if (checkFileContent(component.file, component.patterns)) {
            console.log(`  ✅ ${component.file} - OK`);
            componentsPassed++;
        } else {
            console.log(`  ❌ ${component.file} - Problèmes détectés`);
        }
    });
    
    console.log(`\n📊 Composants validés: ${componentsPassed}/${components.length}`);
    return componentsPassed === components.length;
}

// Fonction pour vérifier la page MyAppointments
function checkMyAppointmentsPage() {
    console.log('\n📄 Vérification de la Page MyAppointments');
    console.log('=========================================');
    
    const file = 'src/pages/MyAppointments.tsx';
    const patterns = [
        'card-responsive',
        'table-responsive',
        'text-responsive',
        'btn-responsive',
        'xs:',
        'sm:',
        'md:',
        'lg:',
        'xl:',
        '2xl:',
        'grid-cols-1',
        'xs:grid-cols-2',
        'sm:grid-cols-3',
        'dark:',
        'flex-shrink-0',
        'truncate'
    ];
    
    if (checkFileContent(file, patterns)) {
        console.log(`  ✅ ${file} - Optimisé pour le responsive`);
        return true;
    } else {
        console.log(`  ❌ ${file} - Optimisations manquantes`);
        return false;
    }
}

// Fonction pour générer un rapport de validation
function generateValidationReport() {
    console.log('\n📊 Rapport de Validation');
    console.log('========================');
    
    const report = {
        timestamp: new Date().toISOString(),
        filesChecked: filesToCheck.length,
        responsiveClasses: responsiveClasses.length,
        breakpoints: breakpoints.length,
        allChecksPassed: allChecksPassed
    };
    
    // Sauvegarder le rapport
    fs.writeFileSync('responsive_validation_report.json', JSON.stringify(report, null, 2));
    console.log('📄 Rapport sauvegardé: responsive_validation_report.json');
    
    return report;
}

// Fonction principale
function main() {
    console.log('🚀 Démarrage de la validation...\n');
    
    // Vérifier l'existence des fichiers
    console.log('📁 Vérification des Fichiers');
    console.log('============================');
    filesToCheck.forEach(file => checkFileExists(file));
    
    // Vérifier les classes CSS responsive
    checkResponsiveClasses();
    
    // Vérifier les breakpoints
    checkBreakpoints();
    
    // Vérifier les composants React
    checkReactComponents();
    
    // Vérifier la page MyAppointments
    checkMyAppointmentsPage();
    
    // Générer le rapport
    const report = generateValidationReport();
    
    // Résultat final
    console.log('\n🎯 Résultat Final');
    console.log('=================');
    
    if (allChecksPassed) {
        console.log('✅ Toutes les améliorations responsive sont correctement implémentées !');
        console.log('🎉 L\'application est prête pour tous les appareils !');
        console.log('\n📱 Testez maintenant :');
        console.log('  - Ouvrez test_responsive_improvements.html dans votre navigateur');
        console.log('  - Redimensionnez la fenêtre pour voir les adaptations');
        console.log('  - Testez sur différents appareils');
    } else {
        console.log('❌ Certaines améliorations sont manquantes ou incorrectes');
        console.log('🔧 Veuillez corriger les problèmes identifiés ci-dessus');
    }
    
    console.log('\n📊 Statistiques:');
    console.log(`  - Fichiers vérifiés: ${report.filesChecked}`);
    console.log(`  - Classes responsive: ${report.responsiveClasses}`);
    console.log(`  - Breakpoints: ${report.breakpoints}`);
    console.log(`  - Validation: ${allChecksPassed ? '✅ Réussie' : '❌ Échec'}`);
    
    process.exit(allChecksPassed ? 0 : 1);
}

// Exécuter la validation
main();

