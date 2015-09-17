from django import template

def formato24hrs(value):

    nuevaFecha = value.strftime("%d/%m/%Y %I:%M %p")
    return nuevaFecha

def formato24hrsEn(value):

	nuevaFecha = value.strftime("%Y/%m/%d %I:%M %p")
	return nuevaFecha

def fechaEn(value):
	
	nuevaFecha= ("/").join(list(reversed(value.split("/"))))
	return nuevaFecha

register = template.Library()
register.filter('formato24hrs', formato24hrs)
register.filter('formato24hrsEn',formato24hrsEn)
register.filter('fechaEn',fechaEn)