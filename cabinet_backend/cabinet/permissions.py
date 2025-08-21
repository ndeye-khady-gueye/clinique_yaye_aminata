from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permission pour les administrateurs système uniquement
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )

class IsResponsableCabinet(permissions.BasePermission):
    """
    Permission pour les responsables de cabinet
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'responsable_cabinet'
        )

class IsDoctor(permissions.BasePermission):
    """
    Permission pour les docteurs
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'doctor'
        )

class IsReceptionist(permissions.BasePermission):
    """
    Permission pour les réceptionnistes
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'receptionist'
        )

class IsPatient(permissions.BasePermission):
    """
    Permission pour les patients
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'patient'
        )

class IsAdminOrResponsable(permissions.BasePermission):
    """
    Permission pour admin ou responsable cabinet
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['admin', 'responsable_cabinet']
        )

class IsResponsableOrReceptionist(permissions.BasePermission):
    """
    Permission pour responsable ou réceptionniste
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['responsable_cabinet', 'receptionist']
        )

class IsDoctorOrReceptionist(permissions.BasePermission):
    """
    Permission pour docteur ou réceptionniste
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['doctor', 'receptionist']
        )

class IsDoctorOrPatient(permissions.BasePermission):
    """
    Permission pour docteur ou patient
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['doctor', 'patient']
        )

class IsOwnerOrStaff(permissions.BasePermission):
    """
    Permission pour le propriétaire de la ressource ou le staff
    """
    def has_object_permission(self, request, view, obj):
        # Si c'est un admin ou responsable, accès complet
        if request.user.role in ['admin', 'responsable_cabinet']:
            return True
        
        # Si c'est un docteur ou réceptionniste, accès limité
        if request.user.role in ['doctor', 'receptionist']:
            return True
        
        # Pour les patients, vérifier si c'est leur ressource
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'patient'):
            return obj.patient.user == request.user
        
        return False

class CanManageUsers(permissions.BasePermission):
    """
    Permission pour gérer les utilisateurs (admin et responsable uniquement)
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['admin', 'responsable_cabinet']
        )

class CanViewReports(permissions.BasePermission):
    """
    Permission pour voir les rapports (admin et responsable uniquement)
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['admin', 'responsable_cabinet']
        )

class CanManageAppointments(permissions.BasePermission):
    """
    Permission pour gérer les rendez-vous (responsable et réceptionniste)
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['responsable_cabinet', 'receptionist']
        )

class CanViewPatients(permissions.BasePermission):
    """
    Permission pour voir les patients (docteur et réceptionniste)
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['doctor', 'receptionist']
        )
