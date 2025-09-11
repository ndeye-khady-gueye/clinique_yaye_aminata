from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from functools import wraps

def csrf_exempt_api(view_func):
    """
    Décorateur pour désactiver CSRF sur les vues API REST.
    Utilisé avec les ViewSets de Django REST Framework.
    """
    return csrf_exempt(view_func)

def csrf_exempt_method_decorator(view_class):
    """
    Décorateur de classe pour désactiver CSRF sur toutes les méthodes d'une ViewSet.
    """
    return method_decorator(csrf_exempt, name='dispatch')(view_class)
