from django import template

register = template.Library()

@register.filter
def carga(value):
    return value.lower()