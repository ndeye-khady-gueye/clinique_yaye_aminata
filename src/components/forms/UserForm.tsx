
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Eye, 
  EyeOff, 
  Save, 
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Schéma de validation Zod
const userSchema = z.object({
  username: z.string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(30, 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  email: z.string()
    .email('Email invalide')
    .min(1, 'Email requis'),
  first_name: z.string()
    .min(1, 'Prénom requis')
    .max(30, 'Le prénom ne peut pas dépasser 30 caractères'),
  last_name: z.string()
    .min(1, 'Nom requis')
    .max(30, 'Le nom ne peut pas dépasser 30 caractères'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'responsable_cabinet', 'doctor', 'receptionist', 'patient']),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  password_confirm: z.string(),
  is_active: z.boolean().default(true),
}).refine((data) => data.password === data.password_confirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["password_confirm"],
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: any; // Pour l'édition
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  allowedRoles?: string[]; // Rôles autorisés pour la création/modification
}

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  allowedRoles 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      role: user?.role || 'patient',
      password: '',
      password_confirm: '',
      is_active: user?.is_active ?? true,
    }
  });

  const watchedRole = watch('role');
  const watchedIsActive = watch('is_active');

  // Remplir le formulaire avec les données de l'utilisateur si en mode édition
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone || '',
        role: user.role,
        password: '',
        password_confirm: '',
        is_active: user.is_active,
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: user ? "Utilisateur mis à jour" : "Utilisateur créé",
        description: user 
          ? "Les modifications ont été enregistrées avec succès."
          : "Le nouvel utilisateur a été créé avec succès.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const getRoleInfo = (role: string) => {
    const roleInfo = {
      admin: {
        label: 'Administrateur Système',
        description: 'Accès complet au système',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: Shield
      },
      responsable_cabinet: {
        label: 'Responsable Cabinet',
        description: 'Gestion du cabinet et de l\'équipe',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: User
      },
      doctor: {
        label: 'Docteur',
        description: 'Consultations et gestion des patients',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: User
      },
      receptionist: {
        label: 'Réceptionniste',
        description: 'Accueil et gestion des RDV',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        icon: User
      },
      patient: {
        label: 'Patient',
        description: 'Accès à ses propres données',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        icon: User
      }
    };
    return roleInfo[role as keyof typeof roleInfo];
  };

  const roleInfo = getRoleInfo(watchedRole);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
          <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user ? 'Modifiez les informations de l\'utilisateur' : 'Ajoutez un nouvel utilisateur au système'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={watchedIsActive ? "default" : "secondary"}>
            {watchedIsActive ? 'Actif' : 'Inactif'}
          </Badge>
          <Badge className={roleInfo.color}>
            {roleInfo.label}
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations de base</span>
            </CardTitle>
            <CardDescription>
              Informations personnelles de l'utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Nom d'utilisateur *
                  {errors.username && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="nom_utilisateur"
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email *
                  {errors.email && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="email@exemple.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
            />
          </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">
                  Prénom *
                  {errors.first_name && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Input
                  id="first_name"
                  {...register('first_name')}
                  placeholder="Prénom"
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">
                  Nom *
                  {errors.last_name && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
            <Input 
                  id="last_name"
                  {...register('last_name')}
                  placeholder="Nom"
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.last_name.message}
                  </p>
                )}
          </div>
        </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
                  id="phone"
                  {...register('phone')}
                  placeholder="+221 77 123 45 67"
                  className="pl-10"
          />
        </div>
            </div>
          </CardContent>
        </Card>

        {/* Rôle et permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Rôle et permissions</span>
            </CardTitle>
            <CardDescription>
              Définissez le rôle et les permissions de l'utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">
                Rôle *
                {errors.role && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Select 
                value={watchedRole} 
                onValueChange={(value) => setValue('role', value as any)}
              >
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
                  {(!allowedRoles || allowedRoles.includes('admin')) && (
                    <SelectItem value="admin">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Administrateur Système</span>
                      </div>
                    </SelectItem>
                  )}
                  {(!allowedRoles || allowedRoles.includes('responsable_cabinet')) && (
                    <SelectItem value="responsable_cabinet">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Responsable Cabinet</span>
                      </div>
                    </SelectItem>
                  )}
                  {(!allowedRoles || allowedRoles.includes('doctor')) && (
                    <SelectItem value="doctor">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Docteur</span>
                      </div>
                    </SelectItem>
                  )}
                  {(!allowedRoles || allowedRoles.includes('receptionist')) && (
                    <SelectItem value="receptionist">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Réceptionniste</span>
                      </div>
                    </SelectItem>
                  )}
                  {(!allowedRoles || allowedRoles.includes('patient')) && (
                    <SelectItem value="patient">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Patient</span>
                      </div>
                    </SelectItem>
                  )}
            </SelectContent>
          </Select>
              {errors.role && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.role.message}
                </p>
              )}
              
              {/* Description du rôle */}
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium">{roleInfo.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{roleInfo.description}</p>
              </div>
        </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={watchedIsActive}
                onCheckedChange={(checked) => setValue('is_active', checked)}
              />
              <Label htmlFor="is_active">Utilisateur actif</Label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Les utilisateurs inactifs ne peuvent pas se connecter au système
            </p>
          </CardContent>
        </Card>

        {/* Mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>
              {user ? 'Laissez vide pour conserver le mot de passe actuel' : 'Définissez un mot de passe sécurisé'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Mot de passe {!user && '*'}
                  {errors.password && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <div className="relative">
          <Input 
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder={user ? 'Laisser vide pour ne pas changer' : 'Mot de passe'}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.password.message}
                  </p>
                )}
        </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirm">
                  Confirmer le mot de passe {!user && '*'}
                  {errors.password_confirm && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('password_confirm')}
                    placeholder="Confirmer le mot de passe"
                    className={errors.password_confirm ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
          </div>
                {errors.password_confirm && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.password_confirm.message}
                  </p>
                )}
              </div>
            </div>

            {/* Indicateurs de force du mot de passe */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Exigences du mot de passe :</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Au moins 8 caractères</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Une lettre minuscule</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Une lettre majuscule</span>
                </div>
        <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Un chiffre</span>
                </div>
              </div>
        </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {user ? 'Mettre à jour' : 'Créer'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
