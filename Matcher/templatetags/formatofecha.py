from django import template

def formato(value):
    if value is None:
        return None

    aux = str(value).split(".")
    elemento = intPuntos(int(aux[0]))
    elemento = str(elemento) + "," + aux[1]
    return elemento