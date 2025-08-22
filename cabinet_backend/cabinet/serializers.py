from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Patient, Service, RendezVous, Consultation, Prescription, Paiement, DossierMedical
import re

class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les utilisateurs"""
    
    class Meta:
        model = User
        fields = ['id', 'user_id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'speciality', 'avatar', 'is_active', 'created_at']
        read_only_fields = ['id', 'user_id', 'created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création d'utilisateurs"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'role', 'phone', 'speciality', 'password', 'password_confirm', 'is_active']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas")
        
        # Vérifier que l'email n'existe pas déjà
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("Un utilisateur avec cet email existe déjà")
        
        # Vérifier que le nom d'utilisateur n'existe pas déjà
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris")
        
        # Validation du mot de passe
        password = attrs['password']
        if len(password) < 8:
            raise serializers.ValidationError("Le mot de passe doit contenir au moins 8 caractères")
        
        # Vérifier la complexité du mot de passe
        if not any(c.isupper() for c in password):
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une lettre majuscule")
        if not any(c.islower() for c in password):
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une lettre minuscule")
        if not any(c.isdigit() for c in password):
            raise serializers.ValidationError("Le mot de passe doit contenir au moins un chiffre")
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Créer l'utilisateur avec is_active=True par défaut
        validated_data.setdefault('is_active', True)
        
        user = User(**validated_data)
        # Hashage sécurisé du mot de passe
        user.set_password(password)
        user.save()
        
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la mise à jour d'utilisateurs"""
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'role', 'phone', 'speciality', 'password', 'password_confirm', 'is_active']
        read_only_fields = ['username']  # Le nom d'utilisateur ne peut pas être modifié
    
    def validate(self, attrs):
        # Vérifier les mots de passe seulement s'ils sont fournis
        if 'password' in attrs and 'password_confirm' in attrs:
            if attrs['password'] != attrs['password_confirm']:
                raise serializers.ValidationError("Les mots de passe ne correspondent pas")
            
            # Validation du mot de passe
            password = attrs['password']
            if len(password) < 8:
                raise serializers.ValidationError("Le mot de passe doit contenir au moins 8 caractères")
            
            # Vérifier la complexité du mot de passe
            if not any(c.isupper() for c in password):
                raise serializers.ValidationError("Le mot de passe doit contenir au moins une lettre majuscule")
            if not any(c.islower() for c in password):
                raise serializers.ValidationError("Le mot de passe doit contenir au moins une lettre minuscule")
            if not any(c.isdigit() for c in password):
                raise serializers.ValidationError("Le mot de passe doit contenir au moins un chiffre")
        
        # Vérifier que l'email n'existe pas déjà (sauf pour l'utilisateur actuel)
        if 'email' in attrs:
            user_id = self.instance.id if self.instance else None
            if User.objects.filter(email=attrs['email']).exclude(id=user_id).exists():
                raise serializers.ValidationError("Un utilisateur avec cet email existe déjà")
        
        return attrs
    
    def update(self, instance, validated_data):
        # Gérer le mot de passe séparément
        password = validated_data.pop('password', None)
        validated_data.pop('password_confirm', None)
        
        # Mettre à jour les autres champs
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Mettre à jour le mot de passe si fourni
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

class RegisterSerializer(serializers.ModelSerializer):
    """Sérialiseur pour l'inscription publique (patients uniquement)"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas")
        
        # Vérifier que l'email n'existe pas déjà
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("Un utilisateur avec cet email existe déjà")
        
        # Vérifier que le nom d'utilisateur n'existe pas déjà
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris")
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Créer un utilisateur avec le rôle 'patient' par défaut
        user = User(**validated_data, role='patient')
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    """Sérialiseur pour la connexion - accepte username, email, phone ou identifier"""
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    identifier = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Récupérer l'identifiant depuis n'importe quel champ
        identifier = data.get('identifier') or data.get('email') or data.get('phone') or data.get('username')
        password = data.get('password')

        print(f"🔍 LoginSerializer validate - Données reçues: {data}")  # Debug log
        print(f"🔍 LoginSerializer validate - identifier: '{identifier}', password: '{password}'")  # Debug log

        if not identifier:
            raise serializers.ValidationError('Identifiant requis (email, téléphone, username ou identifier)')
        
        if not password:
            raise serializers.ValidationError('Mot de passe requis')

        # Déterminer le type d'identifiant et construire les kwargs appropriés
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        phone_regex = r'^(77|76|78|70|75)[0-9]{7}$'
        
        if re.match(email_regex, identifier):
            print(f"📧 Détecté comme EMAIL: {identifier}")  # Debug log
            kwargs = {'email': identifier}
        elif re.match(phone_regex, identifier):
            print(f"📱 Détecté comme TÉLÉPHONE: {identifier}")  # Debug log
            kwargs = {'phone': identifier}
        else:
            print(f"⚠️ Non reconnu, essai par email: {identifier}")  # Debug log
            kwargs = {'email': identifier}

        print(f"🔍 Recherche avec kwargs: {kwargs}")  # Debug log

        # Essayer de trouver l'utilisateur
        user = None
        # Utiliser filter().first() pour éviter l'erreur MultipleObjectsReturned
        user = User.objects.filter(**kwargs).first()
        if user:
            print(f"✅ Utilisateur trouvé: {user.username} (Email: {user.email}, Phone: {user.phone})")  # Debug log
        else:
            print(f"❌ Utilisateur non trouvé pour: {identifier}")  # Debug log
            # Essayer de trouver l'utilisateur par email ou téléphone
            user = User.objects.filter(email=identifier).first()
            if user:
                print(f"✅ Utilisateur trouvé par email: {user.username}")  # Debug log
            else:
                user = User.objects.filter(phone=identifier).first()
                if user:
                    print(f"✅ Utilisateur trouvé par téléphone: {user.username}")  # Debug log
                else:
                    print(f"❌ Aucun utilisateur trouvé avec email ou téléphone: {identifier}")  # Debug log
                    raise serializers.ValidationError('Email/téléphone ou mot de passe incorrect')

        # Authentifier l'utilisateur
        authenticated_user = authenticate(username=user.username, password=password)
        print(f"🔐 Résultat authentification: {authenticated_user}")  # Debug log
        
        if not authenticated_user:
            print("❌ Échec de l'authentification")  # Debug log
            raise serializers.ValidationError('Email/téléphone ou mot de passe incorrect')
        
        if not authenticated_user.is_active:
            print("❌ Utilisateur inactif")  # Debug log
            raise serializers.ValidationError('Compte désactivé')
        
        data['user'] = authenticated_user
        return data

class PatientSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les patients"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class PatientCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création de patients"""
    user_data = UserCreateSerializer()
    
    class Meta:
        model = Patient
        fields = ['user_data', 'date_naissance', 'profession', 'situation_matrimoniale', 
                 'nombre_enfants', 'personne_contact', 'telephone_urgence', 'adresse', 
                 'groupe_sanguin', 'allergies', 'antecedents_medicaux']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user_data')
        user_data['role'] = 'patient'  # Forcer le rôle patient
        user_serializer = UserCreateSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        
        patient = Patient.objects.create(user=user, **validated_data)
        return patient

class ServiceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les services"""
    
    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class RendezVousSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les rendez-vous"""
    patient = PatientSerializer(read_only=True)
    docteur = UserSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    
    class Meta:
        model = RendezVous
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class RendezVousCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création de rendez-vous"""
    
    class Meta:
        model = RendezVous
        fields = ['patient', 'docteur', 'service', 'date_rdv', 'heure_rdv', 'motif', 'prix_consultation']

class ConsultationSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les consultations"""
    rendez_vous = RendezVousSerializer(read_only=True)
    
    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class PrescriptionSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les prescriptions"""
    
    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class PaiementSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les paiements"""
    rendez_vous = RendezVousSerializer(read_only=True)
    
    class Meta:
        model = Paiement
        fields = '__all__'
        read_only_fields = ['id', 'date_paiement']

class DossierMedicalSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les dossiers médicaux"""
    patient = PatientSerializer(read_only=True)
    
    class Meta:
        model = DossierMedical
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

# Sérialiseurs pour les statistiques
class StatistiquesSerializer(serializers.Serializer):
    """Sérialiseur pour les statistiques"""
    total_patients = serializers.IntegerField()
    total_rdv_aujourd_hui = serializers.IntegerField()
    total_docteurs = serializers.IntegerField()
    total_consultations_mois = serializers.IntegerField()
    revenus_mois = serializers.DecimalField(max_digits=10, decimal_places=2)

