from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from functools import wraps


def csrf_exempt_method_decorator(view_class):
    """
    Décorateur pour appliquer csrf_exempt à toutes les méthodes d'une classe ViewSet
    """
    return method_decorator(csrf_exempt, name='dispatch')(view_class)

# TODO: Vérifier - Version alternative du décorateur
# def csrf_exempt_method_decorator(cls):
#     """
#     A class decorator that applies csrf_exempt to all methods of a ViewSet.
#     Useful for API ViewSets where JWT authentication is used instead of session-based CSRF.
#     """
#     for attr in dir(cls):
#         if callable(getattr(cls, attr)) and not attr.startswith('__'):
#             setattr(cls, attr, method_decorator(csrf_exempt)(getattr(cls, attr)))
#     return cls
