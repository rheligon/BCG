from Matcher.models import *
from socket import socket, AF_INET, SOCK_STREAM, error
from django.http import HttpResponse, HttpResponseNotFound
import os
def generarReporte(message):
    # Buscar host y puerto
    try:
        conf = Configuracion.objects.all()[0]
        host = conf.matcherhost
        port = int(conf.matcherpuerto)
    except:
        # No existe una configuracion previa
        return("No hay configuracion previa en la BD")

    #ip del servidor de reportes
    host = '190.168.1.166'
    port = 9999
    message += '\r\n'

    # Crear socket y conectarse
    sock = socket(AF_INET, SOCK_STREAM)
    try:
        sock.connect((host, port))
    except:
        return("errorconn")

    # Enviar mensaje
    try :
        sock.sendall(message.encode())
    except error:
        return("No se pudo conectar con el server de reportes")

    buf = 1024


    # Lee el nombre del reporte
    myfile = sock.makefile('r')
    nombrerep = myfile.readline().replace('\n','')

    

    # Comienza a recibir el reporte
    BASE_DIR = os.path.dirname(os.path.dirname(__file__))
    directorioRep = BASE_DIR + '\\archivos\\REPORTES' 
    archivo = BASE_DIR + '\\archivos\\REPORTES\\'+nombrerep
    if not os.path.exists(directorioRep):
        os.makedirs(directorioRep)
    with open(archivo,'wb') as f:
        
        data, addr = sock.recvfrom(buf)
        
        try:
            while(data):
                f.write(data)
                sock.settimeout(2)
                data, addr = sock.recvfrom(buf)
        except:
            f.close()
            sock.close()
            print ("Error File")

    return nombrerep

def pdfView(nombre):
    try:
        BASE_DIR = os.path.dirname(os.path.dirname(__file__))
        direccion = BASE_DIR + '\\archivos\\REPORTES\\'+nombre
        with open(direccion, 'rb') as pdf:
            response = HttpResponse(pdf.read(),content_type='application/pdf')
            response['Content-Disposition'] = 'filename='+nombre
            return response
    except:
        return HttpResponseNotFound('<h1>Report Not Found</h1>')

def xlsView(nombre):
    try:
        BASE_DIR = os.path.dirname(os.path.dirname(__file__))
        direccion = BASE_DIR + '\\archivos\\REPORTES\\'+nombre
        with open(direccion, 'rb') as xls:
            response = HttpResponse(xls.read(),content_type='application/vnd.ms-excel')
            response['Content-Disposition'] = 'attachment;filename='+nombre
            return response
    except:
        return HttpResponseNotFound('<h1>Report Not Found</h1>')
