from Matcher.models import *
import os
import unicodedata

def get_ops(request):
    #Busco la sesion que esta conectada
    login = request.user.username 
    sess = Sesion.objects.filter(login=login, conexion="1")
    usuario = checkCaseSensitive(login,sess)
    #Busco el perfil del usuario
    perfilid = usuario.usuario_idusuario.perfil_idperfil
    #Coloco las opciones segun el perfil elegido
    opciones = [opcion.opcion_idopcion.idopcion for opcion in PerfilOpcion.objects.filter(perfil_idperfil=perfilid).select_related('opcion_idopcion')]
    return opciones

def get_bancos(request):
    #Busco la sesion que esta conectada
    login = request.user.username 
    #Busco la sesion con el login para obtener el usuario
    sess = Sesion.objects.filter(login=login, conexion="1")
    sess = checkCaseSensitive(login,sess)
    #Coloco las cuentas segun el usuario encontrado
    UC = UsuarioCuenta.objects.filter(usuario_idusuario=sess.usuario_idusuario).select_related('cuenta_idcuenta')

    #Filtro el id de los bancos según las cuentas que tenga asignada la persona
    l_bancos = [cuenta.cuenta_idcuenta.banco_corresponsal_idbanco.idbanco for cuenta in UC]

    #Buscar todos los bancos corresponsales asociados a la cuenta que maneja el usuario
    bancos = BancoCorresponsal.objects.filter(idbanco__in=l_bancos).order_by('codigo') 
    return bancos

def get_codigos95():
    #Buscar todos los codigos de los mensajes mtn95 
    codigos = Codigo95.objects.all()
    return codigos

def get_codigos95Ingles():
    #Buscar todos los codigos de los mensajes mtn95 en ingles
    codigos = Codigo95Ingles.objects.all()
    return codigos

def get_archivosMT99():
    #Buscar los archivos de mensajes MT99 dado un directorio
    obj = Configuracion.objects.all()[0]
    directorio = obj.dircarga99
    archivos = os.listdir(directorio)
    return archivos

def get_archivosMT96():
    #Buscar los archivos de mensajes MT96 dado un directorio
    obj = Configuracion.objects.all()[0]
    directorio = obj.dircarga96
    archivos = os.listdir(directorio)
    return archivos

def get_archivosLicencia():
    #Buscar los archivos de mensajes MT96 dado un directorio
    obj = Configuracion.objects.all()[0]
    directorio = obj.dirlicencia
    archivos = os.listdir(directorio)
    return archivos

def get_cuentas(request):
    #Busco la sesion que esta conectada
    login = request.user.username 
    #Busco la sesion con el login para obtener el usuario
    sess = Sesion.objects.filter(login=login, conexion="1")
    sess = checkCaseSensitive(login,sess)
    #Coloco las cuentas segun el usuario encontrado
    UC = UsuarioCuenta.objects.filter(usuario_idusuario=sess.usuario_idusuario).select_related('cuenta_idcuenta')

    l_cuentas = [cuenta.cuenta_idcuenta.idcuenta for cuenta in UC]

    cuentas = Cuenta.objects.filter(idcuenta__in=l_cuentas).order_by('codigo')

    return cuentas

def get_ci(request):
    # Funcion que recibe el request, ve cual es el usr loggeado y devuelve su ci
    username = request.user.username
    sesion = Sesion.objects.filter(login=username,estado__in=["Activo","Pendiente"])
    sesion = checkCaseSensitive(username,sesion)
    return str(sesion.usuario_idusuario.ci)

def get_ldap(request):
    # Funcion que recibe el request, ve cual es el usr loggeado y devuelve su ldap
    username = request.user.username
    sesion = Sesion.objects.filter(login=username,estado__in=["Activo","Pendiente"])
    sesion = checkCaseSensitive(username,sesion)
    return (sesion.ldap == "1")

def get_idioma():
    conf = Configuracion.objects.all()[0]
    idioma = conf.idioma

    if idioma == 0:
        return "es"
    else:
        return "en"

def elimina_tildes(s):
    return ''.join((c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn'))
 
def verificarDirectorio(directorio):
    for elem in directorio:
        if not os.path.exists(elem):
            os.makedirs(elem)

def checkCaseSensitive(username,sesiones):
    elemento = None
    for elem in sesiones:
        if elem.login == username:
            return elem
    return elemento

