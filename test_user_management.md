# Guide de Test - Gestion des Utilisateurs

## 🎯 Objectif
Tester l'interface frontend de gestion des utilisateurs inspirée du Django Admin, entièrement connectée au backend via API.

## 🚀 Prérequis
1. Backend Django démarré sur `http://127.0.0.1:8000`
2. Frontend React démarré sur `http://localhost:5173`
3. Compte administrateur configuré

## 📋 Tests à Effectuer

### 1. Connexion Administrateur
- [ ] Se connecter avec un compte admin
- [ ] Vérifier l'accès à la page "Gestion utilisateurs"
- [ ] Vérifier que les statistiques s'affichent correctement

### 2. Création d'Utilisateur
- [ ] Cliquer sur "Nouvel Utilisateur"
- [ ] Remplir le formulaire avec :
  - Nom d'utilisateur : `test_user`
  - Email : `test@example.com`
  - Prénom : `Test`
  - Nom : `User`
  - Téléphone : `+221 77 123 45 67`
  - Rôle : `Patient`
  - Mot de passe : `Test123456`
  - Confirmation : `Test123456`
- [ ] Cliquer sur "Créer"
- [ ] Vérifier le message de succès
- [ ] Vérifier que l'utilisateur apparaît dans la liste
- [ ] Vérifier que les statistiques se mettent à jour

### 3. Validation du Formulaire
- [ ] Tester avec un mot de passe faible (moins de 8 caractères)
- [ ] Tester avec un mot de passe sans majuscule
- [ ] Tester avec un mot de passe sans chiffre
- [ ] Tester avec des mots de passe qui ne correspondent pas
- [ ] Tester avec un email invalide
- [ ] Tester avec un nom d'utilisateur déjà existant
- [ ] Vérifier que les messages d'erreur s'affichent correctement

### 4. Modification d'Utilisateur
- [ ] Cliquer sur "Modifier" pour un utilisateur existant
- [ ] Changer le prénom et le nom
- [ ] Changer le rôle
- [ ] Cliquer sur "Mettre à jour"
- [ ] Vérifier que les modifications sont sauvegardées

### 5. Changement de Mot de Passe
- [ ] Modifier un utilisateur
- [ ] Changer le mot de passe
- [ ] Sauvegarder
- [ ] Tester la connexion avec le nouveau mot de passe

### 6. Activation/Désactivation
- [ ] Utiliser le switch pour désactiver un utilisateur
- [ ] Vérifier que le statut change dans la liste
- [ ] Réactiver l'utilisateur
- [ ] Vérifier que les statistiques se mettent à jour

### 7. Suppression d'Utilisateur
- [ ] Cliquer sur "Supprimer" pour un utilisateur
- [ ] Confirmer la suppression
- [ ] Vérifier que l'utilisateur disparaît de la liste
- [ ] Vérifier que les statistiques se mettent à jour

### 8. Filtres et Recherche
- [ ] Utiliser la barre de recherche pour trouver un utilisateur
- [ ] Filtrer par rôle (Admin, Docteur, Patient, etc.)
- [ ] Filtrer par statut (Actif/Inactif)
- [ ] Réinitialiser les filtres

### 9. Mise à Jour du Dashboard
- [ ] Créer un nouvel utilisateur
- [ ] Aller sur le dashboard admin
- [ ] Vérifier que le nombre total d'utilisateurs a augmenté
- [ ] Vérifier que la répartition par rôle est mise à jour

### 10. Test de Connexion
- [ ] Créer un nouvel utilisateur avec le rôle "Patient"
- [ ] Se déconnecter
- [ ] Se connecter avec le nouvel utilisateur
- [ ] Vérifier que l'utilisateur peut accéder à son dashboard

## 🔧 Tests Techniques

### Backend API
- [ ] Vérifier que les mots de passe sont correctement hashés
- [ ] Tester l'endpoint `/api/users/` en GET
- [ ] Tester l'endpoint `/api/users/` en POST
- [ ] Tester l'endpoint `/api/users/{id}/` en PUT
- [ ] Tester l'endpoint `/api/users/{id}/` en DELETE

### Frontend
- [ ] Vérifier que les requêtes API sont correctement envoyées
- [ ] Vérifier la gestion des erreurs
- [ ] Vérifier la validation côté client
- [ ] Vérifier la mise à jour automatique des données

## 🐛 Problèmes Courants

### Si la création d'utilisateur échoue :
1. Vérifier que le backend est démarré
2. Vérifier les logs du backend pour les erreurs
3. Vérifier que l'email et le nom d'utilisateur sont uniques
4. Vérifier que le mot de passe respecte les critères

### Si les statistiques ne se mettent pas à jour :
1. Vérifier que React Query invalide correctement les requêtes
2. Vérifier que les mutations sont bien configurées
3. Vérifier les logs du navigateur pour les erreurs

### Si l'interface ne répond pas :
1. Vérifier que tous les composants sont correctement importés
2. Vérifier les erreurs dans la console du navigateur
3. Vérifier que les dépendances sont installées

## ✅ Critères de Succès

- [ ] Un administrateur peut créer un nouvel utilisateur
- [ ] Le mot de passe est correctement hashé côté backend
- [ ] L'utilisateur peut se connecter immédiatement après création
- [ ] Les statistiques du dashboard se mettent à jour automatiquement
- [ ] Toutes les validations fonctionnent (frontend et backend)
- [ ] L'interface est responsive et moderne
- [ ] Les messages d'erreur et de succès s'affichent correctement

## 📝 Notes

- L'interface s'inspire du Django Admin mais avec un design moderne
- Tous les champs sont correctement mappés avec le modèle User
- Le hashage des mots de passe est géré côté backend
- Les statistiques sont mises à jour en temps réel
- L'interface est entièrement connectée à l'API REST
