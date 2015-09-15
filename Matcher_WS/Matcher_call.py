from Matcher.models import Configuracion
from Matcher_WS.intraday import eliminarIntraday
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

def matcher(idioma,cuenta,millis,funciones='1'):
    # Buscar host y puerto de matcher
    idm = idioma
    try:
        conf = Configuracion.objects.all()[0]
        host = conf.matcherhost
        port = int(conf.matcherpuerto)
    except:
        # No existe una configuracion previa
        if idm == 0:
            return("No hay configuracion previa en la BD")
        else:
            return("There is not previous configuration on DB")
    message = cuenta+"*"+str(millis)+"*"+funciones+"\r\n"

    # Crear socket y conectarse
    sock = socket(AF_INET, SOCK_STREAM)
    sock.connect((host, port))

    # Enviar mensaje
    try :
        sock.sendall(message.encode())
    except error:
        if idm == 0:
            return("No se pudo realizar la llamada a matcher")
        else:
            return("Matcher call could not be make")
    data = ''

    while True:
        readable, writable, exceptional = select([sock], [], [], 5)
        if readable:
            data = sock.recv(4096)
            break
        # Codigo mientras se espera
    sock.close()
    eliminarIntraday()
    return data.decode()