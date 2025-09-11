from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

def csrf_exempt_method_decorator(cls):
    """
    A class decorator that applies csrf_exempt to all methods of a ViewSet.
    Useful for API ViewSets where JWT authentication is used instead of session-based CSRF.
    """
    for attr in dir(cls):
        if callable(getattr(cls, attr)) and not attr.startswith('__'):
            setattr(cls, attr, method_decorator(csrf_exempt)(getattr(cls, attr)))
    return cls
