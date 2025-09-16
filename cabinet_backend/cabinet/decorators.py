from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from functools import wraps


def csrf_exempt_method_decorator(view_class):
    """
    Décorateur pour appliquer csrf_exempt à toutes les méthodes d'une classe ViewSet
    """
    return method_decorator(csrf_exempt, name='dispatch')(view_class)
