# Création de comptes utilisateurs

## Commandes pour créer des comptes :

### Administrateur :
```bash
python manage.py create_admin --username admin --email admin@clinique.sn --password Admin123! --first-name Admin --last-name System
```

### Responsable Cabinet :
```bash
python manage.py create_responsable --username responsable --email responsable@clinique.sn --password Resp123! --first-name Mariama --last-name Diallo --phone 77 123 45 67
```

### Docteur :
```bash
python manage.py create_doctor --username dr.diop --email dr.diop@clinique.sn --password Doc123! --first-name Amadou --last-name Diop --phone 77 234 56 78 --speciality "Médecine Générale"
```

### Réceptionniste :
```bash
python manage.py create_receptionist --username reception --email reception@clinique.sn --password Rec123! --first-name Fatou --last-name Ndiaye --phone 77 345 67 89
```

## Connexion :
Utilisez l'email et le mot de passe pour vous connecter sur `/login`
