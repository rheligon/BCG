from Matcher.models import Configuracion
from socket import socket, AF_INET, SOCK_STREAM, error
from select import select
from datetime import datetime, date, time, timedelta
import time

def dma_millis(dia,mes,ano):
    d = date(ano, mes, dia)
    t = datetime.now().time()
    dt = datetime.combine(d,t)

    millis = time.mktime(dt.timetuple()) * 1000 + dt.microsecond / 1000
    return int(millis)

def matcher(cuenta,millis,funciones='1'):
    # Buscar host y puerto de matcher
    try:
        conf = Configuracion.objects.all()[0]
        host = conf.matcherhost
        port = int(conf.matcherpuerto)
    except:
        # No existe una configuracion previa
        return("No hay configuracion previa en la BD")

    message = cuenta+"*"+str(millis)+"*"+funciones+"\r\n"

    # Crear socket y conectarse
    sock = socket(AF_INET, SOCK_STREAM)
    sock.connect((host, port))

    # Enviar mensaje
    try :
        sock.sendall(message.encode())
    except error:
        return("No se pudo realizar la llamada a matcher")

    data = ''

    while True:
        readable, writable, exceptional = select([sock], [], [], 5)
        if readable:
            data = sock.recv(4096)
            break
        # Codigo mientras se espera
    sock.close()
    return data.decode()