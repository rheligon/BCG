from django import template

def formato24hrs(value):

    nuevaFecha = value.strftime("%d/%m/%Y %I:%M %p")
    return nuevaFecha

register = template.Library()
register.filter('formato24hrs', formato24hrs)