from django import template

def intpunto(value):
    if value is None:
        return None

    aux = str(value).split(".")
    elemento = intPuntos(int(aux[0]))
    elemento = str(elemento) + "," + aux[1]
    return elemento

def intPuntos(x):
    if x < 0:
        return '-' + intPuntos(-x)
    result = ''
    while x >= 1000:
        x, r = divmod(x, 1000)
        result = ".%03d%s" % (r, result)
    return "%d%s" % (x, result)

def intpuntoI(value):
    if value is None:
        return None

    aux = str(value).split(",")
    elemento = intPuntos(int(aux[0]))
    elemento = str(elemento) + "," + aux[1]
    return elemento

def intCommas(x):
    if x < 0:
        return '-' + intCommas(-x)
    result = ''
    while x >= 1000:
        x, r = divmod(x, 1000)
        result = ",%03d%s" % (r, result)
    return "%d%s" % (x, result)

def intcomaI(value):
    if value is None:
        return None

    aux = str(value).split(",")
    elemento = intCommas(int(aux[0]))
    elemento = str(elemento) + "." + aux[1]
    return elemento
register = template.Library()
register.filter('intpunto', intpunto)
register.filter('intpuntoI', intpuntoI)
register.filter('intcomaI', intcomaI)