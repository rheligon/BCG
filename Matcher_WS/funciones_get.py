from Matcher.models import *
import os

def get_ops(request):
    #Busco la sesion que esta conectada
    login = request.user.username 
    sess = Sesion.objects.get(login=login, conexion="1")
    #Busco el perfil del usuario
    perfilid = sess.usuario_idusuario.perfil_idperfil
    #Coloco las opciones segun el perfil elegido
    opciones = [opcion.opcion_idopcion.idopcion for opcion in PerfilOpcion.objects.filter(perfil_idperfil=perfilid).select_related('opcion_idopcion')]
    return opciones

def get_bancos():
    #Buscar todos los bancos corresponsales 
    bancos = BancoCorresponsal.objects.all().order_by('codigo')
    return bancos

def get_archivosMT99():
    #Buscar los archivos de mensajes MT99 dado un directorio
    obj = Configuracion.objects.all()[0]
    directorio = obj.dircarga99
    archivos = os.listdir(directorio)
    return archivos

def get_cuentas(request):
    #Busco la sesion que esta conectada
    login = request.user.username 
    #Busco la sesion con el login para obtener el usuario
    sess = Sesion.objects.get(login=login, conexion="1")
    #Coloco las cuentas segun el usuario encontrado
    UC = UsuarioCuenta.objects.filter(usuario_idusuario=sess.usuario_idusuario).select_related('cuenta_idcuenta')

    l_cuentas = [cuenta.cuenta_idcuenta.idcuenta for cuenta in UC]

    cuentas = Cuenta.objects.filter(idcuenta__in=l_cuentas).order_by('codigo')

    return cuentas

def get_ci(request):
    # Funcion que recibe el request, ve cual es el usr loggeado y devuelve su ci
    username = request.user.username
    sesion = Sesion.objects.get(login=username)
    return str(sesion.usuario_idusuario.ci)

def get_idioma():
    conf = Configuracion.objects.all()[0]
    idioma = conf.idioma

    if idioma == 0:
        return "es"
    else:
        return "en"