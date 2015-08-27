from django.core import serializers
from django.core.mail import send_mail
from django.shortcuts import render, get_object_or_404
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse, HttpResponseNotFound, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.db import connection
from django.db.models import Sum, Q
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import *
from django.contrib.auth import update_session_auth_hash
from django.contrib.sessions.models import Session
from datetime import datetime, date, time, timedelta
from decimal import Decimal
from itertools import chain

from Matcher.models import *

from Matcher_WS.settings import ARCHIVOS_FOLDER
from Matcher_WS.backend import MyAuthBackend
from Matcher_WS.edo_cuenta import edoCta, edc_list, Trans, Bal
from Matcher_WS.mailConf import enviar_mail
from Matcher_WS.cargaAutomatica import leer_linea_conta, leer_linea_corr, leer_punto_coma, validar_archivo
from Matcher_WS.Matcher_call import matcher, dma_millis
from Matcher_WS.funciones_get import get_ops, get_cuentas, get_ci, get_idioma, get_bancos, get_archivosMT99, get_archivosMT96, get_codigos95,elimina_tildes, get_archivosLicencia,verificarDirectorio, get_ldap
from Matcher_WS.generar_reporte import generarReporte, pdfView, xlsView
from Matcher_WS.setConsolidado import setConsolidado
from Matcher_WS.parsers import parsearTipoMT,parseo103,parseo202,parseo942

import time
import os
import re
import jsonpickle
import sys
import traceback
import shutil


def test(request):
    
    #enviar_mail('Prueba Mail','Prueba','religon@gmail.com')
    
    #ops = get_ops(request)
    #print (ops)

    #setConsolidado('BMARCH',request)

    hora = timenow()
    hora = str(hora)

    sessions = Session.objects.filter(expire_date__gte=timezone.now())
    uid_list = []

    # Build a list of user ids from that query
    for session in sessions:
        data = session.get_decoded()
        uid_list.append(data.get('_auth_user_id', None))

    uid_list = set(uid_list)
    uid_list.remove(None)
    uid_list = sorted(uid_list)

    #todos = User.objects.all()
    ensesion = [u.username for u in User.objects.all() if u.id in uid_list] 

    for i in uid_list:
        print("usuario: " + str(i))

    for j in ensesion:
        print("name: " + j)

    en1 = Sesion.objects.filter(conexion="1")
    
    for s in en1:
        if s.login not in ensesion:
            s.conexion = "0"
            s.save()
            #ensesion.remove(s.login)
    
    return JsonResponse(hora, safe=False)

@login_required(login_url='/login')
def index(request):

    idioma = Configuracion.objects.all()[0].idioma  
    mensaje = None
    licencia = Licencia.objects.all()[0]
    fecha_expira = str(licencia.fecha_expira)[:10]
    ahora = str(timenow())[:10]
    a1, m1, d1 = ahora.split("-")
    a2, m2, d2 = fecha_expira.split("-")
    m1 = int(m1)
    m2 = int (m2)

    if a1 == a2 and (m2 - m1) <= 1:
        if idioma == 0:
            mensaje = "Su licencia vencerá en la fecha (YYYY-MM-DD): " + fecha_expira
        else:
            mensaje = "Your license will expire on (YYYY-MM-DD): " + fecha_expira

    username = request.user.username
    sesion = Sesion.objects.get(login=username)
    nombre = sesion.usuario_idusuario.nombres+" "+sesion.usuario_idusuario.apellidos
  
    context = {'idioma':idioma, 'ops':get_ops(request),'mensaje':mensaje,'ldap':get_ldap(request),'nombre':nombre}
    template = "matcher/index.html"
    return render(request, template, context)

def usr_login(request):
    
    message = None
    idioma = Configuracion.objects.all()[0].idioma

    expirarSesion(request)
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == "login":
            username = request.POST.get('user','')
            password = request.POST.get('pass','')

            #Verificación de licencia
            licencia = Licencia.objects.all()[0]
            bic = licencia.bic
            num_usuarios = licencia.num_usuarios
            fecha_expira = licencia.fecha_expira
            llave = licencia.llave
            salt = licencia.salt
            ahora = str(timenow())[:10]
            ahora = datetime.strptime(ahora, '%Y-%m-%d')
            fecha_aux = str(fecha_expira)[:10]
            a , b, c = fecha_aux.split("-")
            fecha_aux = c + "/" + b + "/" + a

            pwd = bic + "$" + str(num_usuarios) + "$" + fecha_aux
            newp = make_password(pwd, salt=salt, hasher='pbkdf2_sha256')
            x, x, saltnuevo, hashp = newp.split("$")

            if saltnuevo != salt or llave != hashp:   
                
                if idioma == 0:
                    message ='Datos de licencia corruptos. Por favor contacte a BCG.'

                else:
                    message ='Corrupt license data. Contact BCG please.'

                return JsonResponse({'mens':message})
            
            elif fecha_expira < ahora :

                if idioma == 0:
                    message ='Su licencia a expirado. Por favor contacte a BCG.'
                else:
                    message ='Your license has expired. Contact BCG please.'
                
                return JsonResponse({'mens':message})

            else:

                try:

                    '''
                    usr = 'PRUEBA1'
                    usrpwd = 'prueba1'

                    # Hash password
                    newp = make_password(usrpwd, hasher='pbkdf2_sha1')
                    x, x, salt, hashp = newp.split("$")

                    #Crear usuario de django
                    user, created = User.objects.get_or_create(username=usr, defaults={'password':newp})

                    #Cambiar clave guardada por nueva
                    sess = Sesion.objects.get(pk=9)
                    sess.pass_field = hashp
                    sess.salt = salt
                    sess.save()
                    '''

                    #Verificar si el usuario ya esta logueado para expropiarlo
                    vieja = Sesion.objects.filter(login=username, conexion="1")
                    userAux = User.objects.get(username=username)

                    if vieja:

                        #Cerrar sesion anterior del mismo usuario
                        user = User.objects.get(username=username)
                        [s.delete() for s in Session.objects.all() if s.get_decoded().get('_auth_user_id') == user.id]
                        U_name = user.username
                        U_terminal = request.META.get('COMPUTERNAME')
                        logAux(U_name,U_terminal,"Logout por sesión expropiativa")

                    #Verificación de usuarios concurrentes
                    sessions = Session.objects.filter(expire_date__gte=timezone.now())
                    uid_list = []

                    # Build a list of user ids from that query
                    for session in sessions:
                        data = session.get_decoded()
                        uid_list.append(data.get('_auth_user_id', None))

                    uid_list = set(uid_list)
                    uid_list.remove(None)
                    uid_list = sorted(uid_list)

                    ensesion = [u.username for u in User.objects.all() if u.id in uid_list] 

                    en1 = Sesion.objects.filter(conexion="1")
                    
                    for s in en1:
                        if s.login not in ensesion:
                            s.conexion = "0"
                            s.save()

                    logedcount = len(ensesion)

                    if logedcount >= num_usuarios and username != "SysAdminBCG":

                        if idioma == 0:
                            message ='Cantidad de usuarios concurrentes a tope. Por favor, cierre alguna otra sesión e intente nuevamente.'
                        else:
                            message ='Butt number of concurrent users. Close another session and try again please.'
                        
                        # Para el log
                        terminal = request.META.get('COMPUTERNAME')
                        fechaHora = timenow()
                        evento = Evento.objects.get(pk=37)
                        nombre = username
                        detalles = "Usuario: "+username + ". " + "Login fallido por: Cantidad de usuarios concurrentes a tope."
                        if username == "SysAdminBCG":
                            print("")
                        else:
                            Traza.objects.create(evento_idevento=evento,usuario=nombre, fecha_hora=fechaHora, terminal=terminal, detalles=detalles)
                        return JsonResponse({'mens':message})

                    #Continuacion de flujo
                    sesion = Sesion.objects.filter(login=username, estado__in=["Activo","Pendiente"])[0]
                    user = MyAuthBackend.authenticate(sesion, username=username, password=password)

                    if user is not None and sesion.estado!="Inactivo":

                        if sesion.ldap != "1" and sesion.estado == "Pendiente":

                            auth.login(request, user)
                            message = "Login successful"
                            sesion.conexion = 1
                            sesion.save()
                            # Para el log
                            log(request,1)
                            return HttpResponseRedirect('/cambioClave/')

                        else:

                            auth.login(request, user)
                            message = "Login successful"
                            sesion.conexion = 1
                            sesion.save()
                            # Para el log
                            log(request,1)

                        message ='Login exitoso'
                        return JsonResponse({'mens':message})

                    else:
                        if idioma == 0:
                            message ='La combinacion de usuario y clave fue incorrecta.'
                        else:
                            message ='Incorrect user and password combination.'
                        
                        # Para el log
                        terminal = request.META.get('COMPUTERNAME')
                        fechaHora = timenow()
                        evento = Evento.objects.get(pk=37)
                        nombre = sesion.usuario_idusuario.nombres+" "+sesion.usuario_idusuario.apellidos
                        detalles = "Usuario: "+username
                        if username == "SysAdminBCG":
                            print("")
                        else:
                            Traza.objects.create(evento_idevento=evento,usuario=nombre, fecha_hora=fechaHora, terminal=terminal, detalles=detalles)
                        return JsonResponse({'mens':message})

                except Exception as e:
                    # Show a message  
                    print (e)

                    if idioma == 0:   
                        message ='Ese usuario no existe en la base de datos.'
                    else:
                        message ='User is not registered on date base.'

                    return JsonResponse({'mens':message}) 

    if request.method == 'GET':

        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma,'message': message}
        template = "matcher/login.html"
        return render(request, template, context)

def usr_logout(request):

    if request.method == 'POST':
        sessid = request.POST.get('sessid')
        sesion = Sesion.objects.get(idsesion=sessid)
        sesion.conexion = 0
        sesion.save()

        username = sesion.login
        # Buscar el usuario
        user = User.objects.get(username=username)
        [s.delete() for s in Session.objects.all() if s.get_decoded().get('_auth_user_id') == user.id]

        return JsonResponse({'sessid':sessid})

    if request.method == 'GET':
        if request.user.is_authenticated():
            username = request.user.username
            sesion = Sesion.objects.filter(login=username, estado="Activo")
            if sesion:
                sess = sesion[0]
                sess.conexion = 0
                sess.save()

                # Para el log
                log(request,2)
        auth.logout(request)
        return HttpResponseRedirect('/')

def cambioClave(request):

    expirarSesion(request)

    if request.method == 'GET':

        ops = []
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'ops':ops,'ldap':get_ldap(request)}
        template = "matcher/cambioClave.html"
    
        return render(request, template, context)

    if request.method == 'POST':

        clave = request.POST.get('clave')
        newp = make_password(clave, hasher='pbkdf2_sha1')
        x, x, salt, hashp = newp.split("$")
        try:
            #Busco la sesion que esta conectada
            login = request.user.username 
            actual = Sesion.objects.get(login=login, conexion="1")
            actual.salt = salt
            actual.pass_field = hashp
            actual.estado = "Activo"
            actual.save()
            msg = "Contraseña actualizada exitosamente"
        except:
            msg = "Error al tratar de encontrar el usuario especificado."
            return JsonResponse({'mens': msg})    

        #Para las tablas propias de django
        user = User.objects.get(username=actual.login)
        user.password = newp
        user.save()

        update_session_auth_hash(request, user)

        # Para el log
        log(request,36,actual.login)

        return JsonResponse({'mens': msg})



@login_required(login_url='/login')
def listar_cuentas(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    idioma = Configuracion.objects.all()[0].idioma    
    context = {'idioma':idioma, 'cuentas': get_cuentas(request), 'ops':get_ops(request),'ldap':get_ldap(request)}
    template = "matcher/listarCuentas.html"
    
    return render(request, template, context)


@login_required(login_url='/login')
def resumen_cuenta(request, cuenta_id):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)

    conciliacion = Conciliacionconsolidado.objects.filter(cuenta_idcuenta = cuenta_id)
    empresa = Empresa.objects.all()[0]

    if conciliacion:
        cons = conciliacion[0]
        cuenta = cons.cuenta_idcuenta
        bfcon = cons.balancefinalcontabilidad
        bfcor = cons.balancefinalcorresponsal
        scon = cons.saldocontabilidad
        scor = cons.saldocorresponsal
        cod = ['C']*4

        if bfcon < 0:
            cod[0] = "D"
        if bfcor < 0:
            cod[1] = "D"
        if scon < 0:
            cod[2] = "D"
        if scor < 0:
            cod[3] = "D"
    else:
        cuenta = Cuenta.objects.filter(idcuenta=cuenta_id)[0]
        cons = None
        cod = ['C']*4


    idioma = Configuracion.objects.all()[0].idioma    
    context = {'idioma':idioma, 'cuenta': cuenta, 'cons':cons, 'cod': cod, 'ops':get_ops(request), 'empresa':empresa,'ldap':get_ldap(request)}
    template = "matcher/ResumenCuenta.html"

    return render(request, template, context)

@login_required(login_url='/login')
def pd_estadoCuentas(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)

    if request.method == 'POST':

        cuentaid = int(request.POST.get('cuentaid'))

        if (cuentaid<0):
            msg = 'Estado de cuenta eliminado exitosamente'
            edcid = request.POST.get('edcid')
            cop = request.POST.get('cop')

            if (cop == 'carg'):
                try:
                    cargado = Cargado.objects.get(estado_cuenta_idedocuenta=edcid)
                    edc = cargado.estado_cuenta_idedocuenta
                except Cargado.DoesNotExist:
                    msg = "No se encontro el estado de cuenta especificado, asegurese de hacer click en el estado de cuenta a eliminar."
                    return JsonResponse({'msg': msg, 'elim': False, 'conocor': cop, 'codigo': edcid})
                
                conocor = edc.origen
                edc.delete()
                return JsonResponse({'msg': msg, 'elim': True, 'conocor': conocor, 'codigo': edcid})
            
            elif (cop == 'proc'):
                try:
                    procesado = Procesado.objects.get(estado_cuenta_idedocuenta=edcid)
                    edc = procesado.estado_cuenta_idedocuenta
                except Procesado.DoesNotExist:
                    msg = "No se encontro el estado de cuenta especificado, asegurese de hacer click en el estado de cuenta a eliminar."
                    return JsonResponse({'msg': msg, 'elim': False, 'conocor': conocor, 'codigo': edcid})

                conocor = edc.origen
                edc.delete()
                return JsonResponse({'msg': msg, 'elim': True, 'conocor': conocor, 'codigo': edcid})
            
            msg = "No se encontro el estado de cuenta especificado, asegurese de hacer click en el estado de cuenta a eliminar." 
            return JsonResponse({'msg': msg, 'elim':False})


        cargados = Cargado.objects.all().order_by('-estado_cuenta_idedocuenta__fecha_final')
        procesados = Procesado.objects.all().order_by('-estado_cuenta_idedocuenta__fecha_final')

        cargado_l = [cargado.estado_cuenta_idedocuenta for cargado in cargados if cargado.estado_cuenta_idedocuenta.cuenta_idcuenta.idcuenta == cuentaid]
        procesado_l = [procesado.estado_cuenta_idedocuenta for procesado in procesados if procesado.estado_cuenta_idedocuenta.cuenta_idcuenta.idcuenta == cuentaid]

        res_json = '[' + serializers.serialize('json', cargado_l) + ',' 
        res_json += serializers.serialize('json', procesado_l)+']'

        return JsonResponse(res_json, safe=False)
        
    if request.method == 'GET':

        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas': get_cuentas(request), 'ops':get_ops(request),'ldap':get_ldap(request)}
        template = "matcher/pd_estadoCuentas.html"

        return render(request, template, context)

@login_required(login_url='/login')
def pd_cargaAutomatica(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        actn = request.POST.get('action')
        msg = ""

        if actn == 'prevconta':

            filename = request.POST.get('archivo_nom')
            path = Configuracion.objects.all()[0].archcontabilidadcarg+'\\'
            archivo = path+filename
            msg=""
            msgpc = ""
            msgcta = ""
            incorrecto = False

            edc_l = edc_list()

            with open(archivo,'r') as f:

                ncta = next(f).replace("\n","")
                result = re.match("[$,{]",ncta)

                if result is not None:
                    prevLine = ""
                    ult_edc = None # Edo de cuenta actual
                    ult_pag = (-1)
                    
                    for line in f:
                        cod, group = leer_linea_conta(line)

                        if cod == "25":
                            try:
                                # Se busca la cuenta a ver si se encuentra registrada
                                cta = Cuenta.objects.filter(ref_nostro=group)[0]
                            except:
                                # No existe la cuenta
                                cta = None
                            
                            if cta is not None:
                                tipoarch = cta.tipo_cargacont
                                if tipoarch == 2:
                                    msgcta = '$La cuenta posee como formato el ; pero se esta tratando de leer un archivo MT950'
                                    cta = None
                                    incorrecto = True

                            if cta is not None and not incorrecto:
                                esta, ult_edc = edc_l.esta(cta.ref_nostro)
                                if not esta:
                                    # No se encontraba en la lista
                                    edo = edoCta(cta.ref_nostro)
                                    edo.R = cta.codigo
                                    edc_l.add_edc(edo)
                                    ult_edc = edo
                            elif not incorrecto:
                                # La cuenta no esta registrada, informar al usuario
                                # Cuenta no existe
                                esta, ult_edc = edc_l.esta(group)
                                if not esta:
                                    # No se encontraba en la lista
                                    edo = edoCta(group)
                                    edo.R = "---------"
                                    edc_l.add_edc(edo)
                                    ult_edc = edo
                            else:
                                ult_edc = None

                        elif cod == "28C":
                            if ult_edc is not None:
                                # Si existia la cuenta en la base de datos
                                ult_edc = edc_l.add_28c(ult_edc, group)

                        elif cod == "()":
                            # Era una linea entre parentesis
                            if ult_edc is not None:
                                # Chequear si la linea anterior era 28C, o era una descripcion de transaccion
                                result = re.search('\[([^]]+)\](.*)', prevLine)

                                if (result.group(1)=="28C"):
                                    # Es un numero de pagina
                                    ult_pag = int(group)-1

                                elif (result.group(1)=="61"):
                                    # Es la descripcion de una transaccion existente
                                    # Se vuelve a parsear la linea anterior para sacar la transaccion y poder comparar
                                    res = re.search('(?P<fecha>\d{6})(?P<DoC>[D,C])(?P<monto>.+\,\d{2})(?P<tipo>.{4})(?P<refNostro>[^(]+)\(?(?P<refVostro>[^)]+)?\)?', result.group(2))
                                    # Se crea una tupla transaccion
                                    trans = Trans(res,group)
                                    # Se agrega a la lista
                                    edc_l.add_trans_existe(ult_edc,trans)


                        elif cod == "60F" or cod == "60M":
                            if ult_edc is not None:
                                # Si existia la cuenta en la base de datos
                                bal = Bal(group, None)
                                edc_l.add_bal_ini(ult_edc,bal,ult_pag,cod[2:])

                        elif cod == "62M" or cod == "62F":
                            if ult_edc is not None:
                                # Si existia la cuenta en la base de datos
                                bal = Bal(None, group)
                                edc_l.add_bal_fin(ult_edc,bal,ult_pag,cod[2:])

                        elif cod == "61":
                            if ult_edc is not None:
                                trans = Trans(group)
                                edc_l.add_trans(ult_edc,trans,ult_pag)

                        prevLine = line

                else:
                    # Es un archivo punto y coma
                    edc_l,msgpc = leer_punto_coma(ncta,'conta',f)

            # En esta identacion ya se termino de leer el archivo, se procede a validar
            msg,cod = validar_archivo(edc_l,'conta')

            if msgpc!="":
                msg = msg+msgpc
                cod.append('1')

            if incorrecto:
                msg = msgcta+msg
                cod.append('1')

            res_json = jsonpickle.encode(edc_l)
            cod_json = jsonpickle.encode(cod)
            return JsonResponse({'exito':True, 'res':res_json, 'msg':msg, 'cod':cod_json}, safe=False)

        if actn == 'prevcorr':
            try:
                filename = request.POST.get('archivo_nom')
                path = Configuracion.objects.all()[0].archswiftcarg+'\\'
                archivo = path+filename
                msg=""
                msgpc = ""
                msgcta = ""
                incorrecto = False

                edc_l = edc_list()

                with open(archivo,'r') as f:

                    ncta = next(f).replace("\n","")
                    result = re.match("[$,{]",ncta)

                    if result is not None:

                        prevLine = ""  # Linea anterior
                        ult_edc = None # Edo de cuenta actual
                        ult_pag = (-1) # Pagina actual
                        
                        for line in f:
                            # Se parsea una linea del archivo en "cod" queda el codigo entre :: 
                            # y en "group" los grupos de campos en el resto de la linea
                            cod, group = leer_linea_corr(line)

                            if cod == "25":
                                try:
                                    # Se busca la cuenta a ver si se encuentra registrada
                                    cta = Cuenta.objects.filter(ref_vostro=group)[0]
                                except:
                                    # No existe la cuenta
                                    cta = None

                                if cta is not None:
                                    formato = cta.tipo_carga_corr
                                    if formato != 0:
                                        cta = None
                                        incorrecto = True
                                        msgcta = '$La cuenta posee como formato el ; pero se esta tratando de leer un archivo MT950'

                                if cta is not None and not incorrecto:
                                    esta, ult_edc = edc_l.esta(cta.ref_vostro)

                                    if not esta:
                                        # No se encontraba en la lista
                                        edo = edoCta(cta.ref_vostro)
                                        edo.R = cta.codigo
                                        edc_l.add_edc(edo)
                                        ult_edc = edo

                                elif not incorrecto:
                                    # La cuenta no esta registrada, informar al usuario
                                    # Cuenta no existe
                                    esta, ult_edc = edc_l.esta(group)
                                    if not esta:
                                        # No se encontraba en la lista
                                        edo = edoCta(group)
                                        edo.R = "---------"
                                        edc_l.add_edc(edo)
                                        ult_edc = edo

                                else:
                                    ult_edc = None

                            elif cod == "28C":
                                if ult_edc is not None:
                                    dic = group.groupdict()

                                    if dic["pag"] is not None:
                                        ult_pag = int(dic["pag"])-1
                                    else:
                                        ult_pag = edc_l.sinpag(ult_edc,dic["nroedc"])

                                    # Si existia la cuenta en la base de datos
                                    ult_edc = edc_l.add_28c(ult_edc,dic["nroedc"])
                                    
                            elif cod == "60F" or cod == "60M":
                                if ult_edc is not None:
                                    # Si existia la cuenta en la base de datos
                                    bal = Bal(group, None)
                                    edc_l.add_bal_ini(ult_edc,bal,ult_pag,cod[2:])

                            elif cod == "62M" or cod == "62F":
                                if ult_edc is not None:
                                    # Si existia la cuenta en la base de datos
                                    bal = Bal(None, group)
                                    edc_l.add_bal_fin(ult_edc,bal,ult_pag,cod[2:])

                            elif cod == "61":
                                if ult_edc is not None:
                                    trans = Trans(group)
                                    edc_l.add_trans(ult_edc,trans,ult_pag)

                            elif cod == "$":
                                # Era una linea de descripcion o de bloque
                                if ult_edc is not None:
                                    # Chequear si la linea anterior era un codigo 61 u 86
                                    result = re.search('^:([^:]{2,3})\:(.+)', prevLine)
                                    
                                    if result is not None:
                                        #La linea anterior contenia un codigo
                                        if (result.group(1)=="61"):
                                            # Es la descripcion de una transaccion existente
                                            # Se vuelve a parsear la linea anterior para sacar la transaccion y poder comparar
                                            res = re.search('(?P<fecha>^\d{6})(?P<fentrada>\d{4})?(?P<DoC>R?[CD]{1})[A-Z]?(?P<monto>\d+\,\d{0,2})(?P<tipo>.{4})(?P<refNostro>.+?(?=(//|$)))/?/?(?P<refVostro>.+)?', result.group(2))
                                            # Se crea una tupla transaccion
                                            trans = Trans(res,group)
                                            # Se agrega a la lista
                                            edc_l.add_trans_existe(ult_edc,trans)

                                        if (result.group(1)=="86"):
                                        # Es la descripcion de una transaccion existente
                                            print("era 86: "+ line)

                            # Se guarda la linea anterior en caso de conseguir parentesis
                            prevLine = line
                    else:
                        # Es un archivo punto y coma
                        edc_l,msgpc = leer_punto_coma(ncta,'corr',f)

                # En esta identacion ya se termino de leer el archivo
                msg,cod = validar_archivo(edc_l,'corr')

                if msgpc!="":
                    msg = msgpc+msg
                    cod.append('1')

                if incorrecto:
                    msg = msgcta+msg
                    cod.append('1')

                res_json = jsonpickle.encode(edc_l)
                cod_json = jsonpickle.encode(cod)
                return JsonResponse({'exito':True, 'res':res_json, 'msg':msg, 'cod':cod_json}, safe=False)
            except Exception as e:
                print (e)

        if actn == 'cargconta':
            msg = "Archivo cargado con exito"
            edcl_json = request.POST.get('edcl')
            filename = request.POST.get('filename')
            edcl = jsonpickle.decode(edcl_json)

            for edc in edcl:
                try:
                    cta = Cuenta.objects.filter(ref_nostro=edc.cod25)[0]
                except:
                    cta = None

                if cta is not None:
                    numpags = len(edc.pagsBal)
                    # Se usa expresion regular para sacar la fecha inicial
                    fecha = re.findall('..?', edc.pagsBal[0].inicial["fecha"])
                    fechaI = datetime(int("20"+fecha[0]), int(fecha[1]), int(fecha[2]))

                    # Se usa expresion regular para sacar la fecha final
                    fecha = re.findall('..?', edc.pagsBal[numpags-1].final["fecha"])
                    fechaF = datetime(int("20"+fecha[0]), int(fecha[1]), int(fecha[2]))

                    # Se crea la instancia de Estado de Cuenta en la base de datos
                    edocta = EstadoCuenta.objects.create(cuenta_idcuenta=cta,codigo=edc.cod28c,origen='L',pagina=numpags,balance_inicial=edc.pagsBal[0].inicial["monto"].replace(',','.'), balance_final=edc.pagsBal[numpags-1].final["monto"].replace(',','.'), m_finicial=edc.pagsBal[0].MoFi, m_ffinal=edc.pagsBal[numpags-1].MoFf,fecha_inicial=fechaI ,fecha_final=fechaF,  c_dinicial=edc.pagsBal[0].inicial["DoC"], c_dfinal=edc.pagsBal[numpags-1].final["DoC"])
                    
                    # Se crea la instancia en la tabla Cargado
                    Cargado.objects.create(estado_cuenta_idedocuenta=edocta)

                    for i,transL in enumerate(edc.pagsTrans):
                        k = 1
                        for tran in transL:
                            # Se usa expresion regular para sacar la fecha final
                            fecha = re.findall('..?', tran.trans['fecha'])
                            fecha = datetime(int("20"+fecha[0]), int(fecha[1]), int(fecha[2]))
                            
                            TransabiertaContabilidad.objects.create(estado_cuenta_idedocuenta=edocta,codigo_transaccion=tran.trans['tipo'], pagina=i+1, fecha_valor=fecha, descripcion=tran.desc, monto=float(tran.trans['monto'].replace(',','.')), credito_debito=tran.trans['DoC'], referencianostro=tran.trans['refNostro'], referenciacorresponsal=tran.trans['refVostro'], codigocuenta=edc.R, numtransaccion=k, campo86_940=None, seguimiento=None)
                            k = k+1

                    cta.ultimoedocuentacargc = edocta.idedocuenta
                    cta.save()

                    #Para el log
                    detalle = cta.codigo+' - No. '+edc.cod28c +' - L'
                    log(request,3,detalle)

            #Mover archivo a procesado
            pathsrc = Configuracion.objects.all()[0].archcontabilidadcarg+'\\'+filename
            pathdest = Configuracion.objects.all()[0].archcontabilidadproc+'\\'+filename
            shutil.move(pathsrc,pathdest)

            return JsonResponse({'exito':True, 'msg':msg})

        if actn == 'cargcorr':
            msg = "Archivo cargado con exito"
            filename = request.POST.get('filename')
            edcl_json = request.POST.get('edcl')
            edcl = jsonpickle.decode(edcl_json)

            for edc in edcl:
                try:
                    cta = Cuenta.objects.filter(ref_vostro=edc.cod25)[0]
                except:
                    cta = None

                if cta is not None:
                    numpags = len(edc.pagsBal)
                    # Se usa expresion regular para sacar la fecha inicial
                    fecha = re.findall('..?', edc.pagsBal[0].inicial["fecha"])
                    fechaI = datetime(int("20"+fecha[0]), int(fecha[1]), int(fecha[2]))

                    # Se usa expresion regular para sacar la fecha final
                    fecha = re.findall('..?', edc.pagsBal[numpags-1].final["fecha"])
                    fechaF = datetime(int("20"+fecha[0]), int(fecha[1]), int(fecha[2]))

                    # Se crea la instancia de Estado de Cuenta en la base de datos
                    edocta = EstadoCuenta.objects.create(cuenta_idcuenta=cta,codigo=edc.cod28c,origen='S',pagina=numpags,balance_inicial=edc.pagsBal[0].inicial["monto"].replace(',','.'), balance_final=edc.pagsBal[numpags-1].final["monto"].replace(',','.'), m_finicial=edc.pagsBal[0].MoFi, m_ffinal=edc.pagsBal[numpags-1].MoFf,fecha_inicial=fechaI ,fecha_final=fechaF,  c_dinicial=edc.pagsBal[0].inicial["DoC"], c_dfinal=edc.pagsBal[numpags-1].final["DoC"])
                    
                    # Se crea la instancia en la tabla Cargado
                    Cargado.objects.create(estado_cuenta_idedocuenta=edocta)


                    for i,transL in enumerate(edc.pagsTrans):
                        k = 1
                        for tran in transL:
                            # Se usa expresion regular para sacar la fecha final
                            if tran.trans['fentrada']:
                                fechaaux = re.findall('..?', tran.trans['fecha'])
                                fecha = re.findall('..?', tran.trans['fentrada'])
                                fecha = datetime(int("20"+fechaaux[0]), int(fecha[0]), int(fecha[1]))
                            else:
                                fecha = re.findall('..?', tran.trans['fecha'])
                                fecha = datetime(int("20"+fecha[0]), int(fecha[1]), int(fecha[2]))
    
                            TransabiertaCorresponsal.objects.create(estado_cuenta_idedocuenta=edocta,codigo_transaccion=tran.trans['tipo'], pagina=i+1, fecha_valor=fecha, descripcion=tran.desc, monto=float(tran.trans['monto'].replace(',','.')), credito_debito=tran.trans['DoC'], referencianostro=tran.trans['refNostro'], referenciacorresponsal=tran.trans['refVostro'], codigocuenta=edc.R, numtransaccion=k, campo86_940=None, seguimiento=None)
                            k = k+1

                    cta.ultimoedocuentacargs = edocta.idedocuenta
                    cta.save()

                    #Para el Log
                    detalle = cta.codigo+' - No. '+edc.cod28c +' - S'
                    log(request,3,detalle)
                            
            # Mover el archivo a procesado
            pathsrc = Configuracion.objects.all()[0].archswiftcarg+'\\'+filename
            pathdest = Configuracion.objects.all()[0].archswiftproc+'\\'+filename
            shutil.move(pathsrc,pathdest)

            return JsonResponse({'exito':True, 'msg':msg})

    if request.method == 'GET':
        path_conta = Configuracion.objects.all()[0].archcontabilidadcarg+'\\'
        filenames_conta = next(os.walk(path_conta))[2]

        path_corr = Configuracion.objects.all()[0].archswiftcarg+'\\'
        filenames_corr = next(os.walk(path_corr))[2]

        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'filenames_corr':filenames_corr,'filenames_conta':filenames_conta, 'ops':get_ops(request),'ldap':get_ldap(request)}
        template = "matcher/pd_cargaAutomatica.html"
        return render(request, template, context)

@login_required(login_url='/login')
def pd_cargaManual(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)

    if request.method == 'POST':

        actn = request.POST.get('action')

        if actn == 'buscar':
            
            cuentaid =int(request.POST.get('cuentaid'))
            moneda = request.POST.get('moneda')
            tipo = request.POST.get('tipo')
            
            cargados = Cargado.objects.all().order_by('-estado_cuenta_idedocuenta__fecha_final')
            procesados = Procesado.objects.all().order_by('-estado_cuenta_idedocuenta__fecha_final')

            cargado_l = [cargado.estado_cuenta_idedocuenta for cargado in cargados if cargado.estado_cuenta_idedocuenta.cuenta_idcuenta.idcuenta == cuentaid]
            procesado_l = [procesado.estado_cuenta_idedocuenta for procesado in procesados if procesado.estado_cuenta_idedocuenta.cuenta_idcuenta.idcuenta == cuentaid]

            res_json2 = '[' + serializers.serialize('json', cargado_l) + ',' 
            res_json2 += serializers.serialize('json', procesado_l)+']'
        
            return JsonResponse({'query':res_json2, 'tipo':tipo,'moneda':moneda})

        if actn == 'cargar':

            msg = "El Edo. de Cuenta se ha cargado con exito"
            numTrans = int(request.POST.get('numTrans'))

            listaCuenta = request.POST.getlist('listaCuenta')[0]
            listaCuenta = jsonpickle.decode(listaCuenta)

            nroCuenta = listaCuenta[0]
            codigo = listaCuenta[1]
            origen = listaCuenta[2]
            pag = int(listaCuenta[3])
            
            balIni = listaCuenta[4]
            balIni = float(balIni.replace(",",""))
            
            balFin = listaCuenta[5]
            balFin = float(balFin.replace(",",""))
            
            mIni = listaCuenta[6]
            mFin = listaCuenta[7]
            
            fechaIni = listaCuenta[8]
            arreglo = fechaIni.split('/')
            fechaIni= datetime(int(arreglo[2]), int(arreglo[1]), int(arreglo[0]))
            
            fechaFin = listaCuenta[9]
            arreglo2 = fechaFin.split('/')
            fechaFin= datetime(int(arreglo2[2]), int(arreglo2[1]), int(arreglo2[0]))
            
            cdIni = listaCuenta[10]
            cdFin = listaCuenta[11]
            
            listaTrans = request.POST.getlist('listaTrans')[0]
            listaTrans = jsonpickle.decode(listaTrans)

            #Corresponsal
            if(origen=="S"):

                try:
                    cta = Cuenta.objects.filter(idcuenta=nroCuenta)[0]
                except:
                    cta = None

                if cta is not None:
                    # Se crea la instancia de Estado de Cuenta en la base de datos
                    edocta = EstadoCuenta.objects.create(cuenta_idcuenta=cta, codigo=codigo, origen=origen,pagina=pag, balance_inicial=balIni, balance_final=balFin, m_finicial=mIni, m_ffinal=mFin, fecha_inicial=fechaIni , fecha_final=fechaFin, c_dinicial=cdIni, c_dfinal=cdFin)
                    
                    # Se crea la instancia en la tabla Cargado
                    Cargado.objects.create(estado_cuenta_idedocuenta=edocta)

                    #Por cada transaccion la insertamos a la tabla de transaccion abierta Corresponsal
                    for i in range(0,numTrans):
                        pagina = (i // 15)+1
                        
                        fechaS = listaTrans[i][2]
                        arregloTrans = fechaS.split('/')
                        fechaT = datetime(int(arregloTrans[2]), int(arregloTrans[1]), int(arregloTrans[0]))
                        
                        monto = listaTrans[i][4]
                        monto = float(monto.replace(",",""))
                        
                        TransabiertaCorresponsal.objects.create(estado_cuenta_idedocuenta=edocta,codigo_transaccion=listaTrans[i][5], pagina=pagina, fecha_valor=fechaT, descripcion=listaTrans[i][8], monto=monto, credito_debito=listaTrans[i][3], referencianostro=listaTrans[i][6], referenciacorresponsal=listaTrans[i][7], codigocuenta=cta.codigo, numtransaccion=int(listaTrans[i][1]), campo86_940=None, seguimiento=None)
                    
                    cta.ultimoedocuentacargs = edocta.idedocuenta
                    cta.save()

                    #Para el Log
                    detalle = cta.codigo+' - No. '+codigo +' - S'
                    log(request,4,detalle)

            #Contabilidad
            if(origen=="L"):

                try:
                    cta = Cuenta.objects.filter(idcuenta=nroCuenta)[0]
                except:
                    cta = None

                if cta is not None:
                    # Se crea la instancia de Estado de Cuenta en la base de datos
                    edocta = EstadoCuenta.objects.create(cuenta_idcuenta=cta, codigo=codigo, origen=origen,pagina=pag, balance_inicial=balIni, balance_final=balFin, m_finicial=mIni, m_ffinal=mFin, fecha_inicial=fechaIni , fecha_final=fechaFin, c_dinicial=cdIni, c_dfinal=cdFin)
                    
                    # Se crea la instancia en la tabla Cargado
                    Cargado.objects.create(estado_cuenta_idedocuenta=edocta)

                    #Por cada transaccion la insertamos a la tabla de transaccion abierta Corresponsal
                    for i in range(0,numTrans):
                        pagina = (i // 15)+1
                        
                        fechaS = listaTrans[i][2]
                        arregloTrans = fechaS.split('/')
                        fechaT = datetime(int(arregloTrans[2]), int(arregloTrans[1]), int(arregloTrans[0]))
                        
                        monto = listaTrans[i][4]
                        monto = float(monto.replace(",",""))
                        
                        TransabiertaContabilidad.objects.create(estado_cuenta_idedocuenta=edocta,codigo_transaccion=listaTrans[i][5], pagina=pagina, fecha_valor=fechaT, descripcion=listaTrans[i][8], monto=monto, credito_debito=listaTrans[i][3], referencianostro=listaTrans[i][6], referenciacorresponsal=listaTrans[i][7], codigocuenta=cta.codigo, numtransaccion=int(listaTrans[i][1]), campo86_940=None, seguimiento=None)
                    
                    cta.ultimoedocuentacargc = edocta.idedocuenta
                    cta.save()

                    #Para el Log
                    detalle = cta.codigo+' - No. '+codigo +' - L'
                    log(request,4,detalle)
                            
            return JsonResponse({'exito':True, 'msg':msg})


    if request.method == 'GET':
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas': get_cuentas(request), 'ops':get_ops(request),'ldap':get_ldap(request)}
        template = "matcher/pd_cargaManual.html"
        return render(request, template, context)


@login_required(login_url='/login')
def pd_match(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        actn = request.POST.get('action')
        if actn == 'buscar':
            fecha = request.POST.get('fecha').split("/")
            fechaform = datetime(int(fecha[2]),int(fecha[1]),int(fecha[0]))

            # Cuentas asignadas al usuario
            cuentas = get_cuentas(request)
            
            carg = Cargado.objects.all()
            cuentas_carg = [cargado.estado_cuenta_idedocuenta.cuenta_idcuenta for cargado in carg if cargado.estado_cuenta_idedocuenta.fecha_final == fechaform]

            # Se eliminan las cuentas que no estan asignadas al usuario
            for elem in cuentas_carg:
                if elem not in cuentas:
                    cuentas_carg.remove(elem)

            res_json = serializers.serialize('json', cuentas_carg)
            
            return JsonResponse(res_json, safe=False)

        if actn == 'match':
            cuentaid = request.POST.get('ctaid')
            fecha = request.POST.get('fecha').split("/")

            cta = Cuenta.objects.get(idcuenta=cuentaid)
            millis = dma_millis(int(fecha[0]),int(fecha[1]),int(fecha[2]))
            procesos = str(cta.tipo_proceso)

            # Checkear si la cuenta esta tomada
            conc = cta.concurrencia

            # Checkear si hay elementos en la tabla propuestos
            mprop = Matchpropuestos.objects.all()
            matches = [prop for prop in mprop if prop.ta_conta.codigocuenta == cta.codigo]

            if not matches and conc is None:
                # Lista vacia, por lo que no hay propuestos en la BD para la cuenta
                msg = matcher(cta.codigo,millis,procesos)
                match = True

                #Para el log
                log(request,5,cta.codigo)
            else:
                # Checkear si la cuenta esta tomada
                if conc is not None:
                    msg = '*La cuenta se encuentra tomada, liberar antes de matchear.'
                else:
                    # La cuenta no esta tomada, pero posee elementos en propuestos
                    msg = '*Existen elementos en la tabla propuestos para la cuenta especificada.'
                match = False

            return JsonResponse({'msg':msg, 'match':match})

        if actn == 'matchcp':
            fecha = request.POST.get('fecha').split("/")
            millis = dma_millis(int(fecha[0]),int(fecha[1]),int(fecha[2]))

            msg = matcher('CuentasPropias',millis,'2')

            #Para el log
            log(request,5,'CuentasPropias')

            return JsonResponse({'msg':msg, 'match':True})

        if actn == 'liberar':
            cuentaid = request.POST.get('ctaid')
            cta = Cuenta.objects.get(idcuenta=cuentaid)

            cta.concurrencia = None
            cta.save()

            msg = 'Cuenta liberada exitosamente'

            return JsonResponse({'msg':msg})


    if request.method == 'GET':
        template = "matcher/pd_match.html"
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'ops':get_ops(request),'ldap':get_ldap(request)}

        return render(request, template, context)


@login_required(login_url='/login')
def pd_matchesPropuestos(request, cuenta):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        my_dict = dict(request.POST)
        del my_dict['csrfmiddlewaretoken'] #Sirve para quitar el token antiforgery del diccionario
        
        #print(my_dict)

        for key,value in my_dict.items():
            #hacer algo (key es el numero de iteracion, value es Matchpropuestos ID)
            mp = Matchpropuestos.objects.get(pk=value[0])

            #Eliminar de la tabla de propuestos
            mp.delete()

        #Llamar store proc
        cursor = connection.cursor()
        try:
            cursor.execute('EXEC [dbo].[confirmarMatches] %s', (cuenta,))
        finally:
            cursor.close()

        #Llamar calculo conciliacion
        setConsolidado(cuenta,request)

        #Para el log
        log(request,6,cuenta)

        template = "matcher/pd_matchesPropuestos.html"
        msg = 'Matches Confirmados Exitosamente!'
        cuentas = Cuenta.objects.all().order_by('codigo')
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas':cuentas, 'matches':None, 'cta':None, 'msg':msg, 'ops':get_ops(request),'ldap':get_ldap(request)}
        return render(request, template, context)

    if request.method == 'GET':

        if cuenta is not None:
            matches = Matchpropuestos.objects.filter(ta_conta__codigocuenta=cuenta).order_by('puntaje')
        else:
            matches = None

        template = "matcher/pd_matchesPropuestos.html"

        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'matches':matches, 'cta':cuenta, 'msg':None, 'ops':get_ops(request),'ldap':get_ldap(request)}
        return render(request, template, context)

@login_required(login_url='/login')
def pd_detallesMT(request, mensaje,tipo):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'GET':

        msj = ""
        tranMT = mensaje
        claseMT = tipo

        if claseMT == "conta":

            try:
                # Buscar los mensajes MT95 de contabilidad para la transaccion dada
                ta = TransabiertaContabilidad.objects.filter(idtransaccion=tranMT)
                MTs = Mt95.objects.filter(ta_conta=ta)
                msj = "MTs listados exitosamente"
                MT96s = Mt96.objects.filter(mt95_idmt95=MTs)
                template = "matcher/pd_detallesMT.html"
                idioma = Configuracion.objects.all()[0].idioma    
                context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'msg':msj, 'ops':get_ops(request), 'mensajes95': MTs, 'mensaje':mensaje, 'mensajes96':MT96s,'ldap':get_ldap(request)}
                return render(request, template, context)
            except:
                msj = "No hay mensajes relacionados a la transacción"
                MTs = None
                MT96s = None
                template = "matcher/pd_detallesMT.html"
                idioma = Configuracion.objects.all()[0].idioma    
                context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'msg':msj, 'ops':get_ops(request), 'mensajes95': MTs, 'mensaje':mensaje, 'mensajes96':MT96s,'ldap':get_ldap(request)}
                return render(request, template, context) 

        try:
            # Buscar los mensajes MT95 de corresponsal para la transaccion dada
            ta = TransabiertaCorresponsal.objects.filter(idtransaccion=tranMT)
            MTs = Mt95.objects.filter(ta_corres=ta)
            msj = "MTs listados exitosamente"
            MT96s = Mt96.objects.filter(mt95_idmt95=MTs)
            template = "matcher/pd_detallesMT.html"
            idioma = Configuracion.objects.all()[0].idioma    
            context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'msg':msj, 'ops':get_ops(request), 'mensajes95': MTs, 'mensaje':mensaje, 'mensajes96':MT96s,'ldap':get_ldap(request)}
            return render(request, template, context)
        except:
            msj = "No hay mensajes relacionados a la transacción"
            MTs = None
            MT96s = None
            template = "matcher/pd_detallesMT.html"
            idioma = Configuracion.objects.all()[0].idioma    
            context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'msg':msj, 'ops':get_ops(request), 'mensajes95': MTs, 'mensaje':mensaje, 'mensajes96':MT96s,'ldap':get_ldap(request)}
            return render(request, template, context)

@login_required(login_url='/login')
def pd_partidasAbiertas(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        actn = request.POST.get('action')

        if actn == 'match':
            matchArray = request.POST.getlist('matchArray[]')
            justificacion = request.POST.get('justificacion')

            codigoMatch = ''
            codigoCuenta = None
            primeraVuelta = True

            for match in matchArray:
                m_split = match.split('-')
                tipo = m_split[1]  # conta o corr
                Mid = m_split[2] # Match id

                if tipo == 'conta':
                    ta = TransabiertaContabilidad.objects.get(pk=Mid)
                    tc = TranscerradaContabilidad.objects.create(estado_cuenta_idedocuenta = ta.estado_cuenta_idedocuenta, codigo_transaccion=ta.codigo_transaccion, fecha=ta.fecha_valor,monto=ta.monto,credito_debito=ta.credito_debito,codigocuenta=ta.codigocuenta,numtransaccion=ta.numtransaccion)

                    tc.pagina = ta.pagina
                    tc.descripcion = ta.descripcion
                    tc.referencianostro = ta.referencianostro
                    tc.referenciacorresponsal = ta.referenciacorresponsal
                    tc.campo86_940 = ta.campo86_940
                    tc.seguimiento = ta.seguimiento
                
                if tipo == 'corr':
                    ta = TransabiertaCorresponsal.objects.get(pk=Mid)
                    tc = TranscerradaCorresponsal.objects.create(estado_cuenta_idedocuenta = ta.estado_cuenta_idedocuenta ,codigo_transaccion=ta.codigo_transaccion, fecha_valor=ta.fecha_valor,monto=ta.monto,credito_debito=ta.credito_debito,codigocuenta=ta.codigocuenta,numtransaccion=ta.numtransaccion)

                    tc.pagina = ta.pagina
                    tc.descripcion = ta.descripcion
                    tc.referencianostro = ta.referencianostro
                    tc.referenciacorresponsal = ta.referenciacorresponsal
                    tc.campo86_940 = ta.campo86_940
                    tc.seguimiento = ta.seguimiento

                #Se calcula el codigomatch si es la primera vuelta
                if primeraVuelta:
                    edc = ta.estado_cuenta_idedocuenta
                    codigoMatch = edc.codigo + str(ta.pagina) + str(ta.numtransaccion) + str(ta.fecha_valor)[:2]
                    codigoCuenta = ta.codigocuenta
                    primeraVuelta = False

                #Se guardan los valores en trans cerrada
                tc.save()

                # Se crea la instancia Matchconfirmado
                mc = Matchconfirmado.objects.create(fecha=ta.fecha_valor, auto_manual=1, justificacion=justificacion, codigomatch=codigoMatch)
                if tipo == 'conta':
                    mc.tc_conta = tc
                if tipo == 'corr':
                    mc.tc_corres = tc
                mc.save()


                #Se borra de trans abierta
                ta.delete()

            # Se llama la funcion de poner consolidado
            setConsolidado(codigoCuenta,request)

            return JsonResponse({'msg':'Éxito'}, safe=False )


        if actn == 'buscar':
            #Obtener filtros
            filtromonto = request.POST.getlist('filterArray[0][]')
            filtroref = request.POST.getlist('filterArray[1][]')
            filtrocod = request.POST.getlist('filterArray[2][]')
            filtrofecha = request.POST.getlist('filterArray[3][]')
            filtrotipo = request.POST.getlist('filterArray[4][]')
            filtroorigen = request.POST.getlist('filterArray[5][]')

            #Obtener id de la cuenta
            ctaid = request.POST.get('ctaid')
            cta = Cuenta.objects.get(idcuenta=ctaid)

            #Chequear si se selecciono un filtro de origen
            if filtroorigen:
                origen = filtroorigen[0]

                if origen == 'S':
                    ta_conta = TransabiertaContabilidad.objects.none()
                    ta_corr = TransabiertaCorresponsal.objects.filter(codigocuenta=cta.codigo).select_related('estado_cuenta_idedocuenta')

                if origen == 'L':
                    ta_corr = TransabiertaCorresponsal.objects.none()
                    ta_conta = TransabiertaContabilidad.objects.filter(codigocuenta=cta.codigo).select_related('estado_cuenta_idedocuenta')
            else:
                #No hay filtro por lo que se usan ambas
                ta_conta = TransabiertaContabilidad.objects.filter(codigocuenta=cta.codigo).select_related('estado_cuenta_idedocuenta')
                ta_corr = TransabiertaCorresponsal.objects.filter(codigocuenta=cta.codigo).select_related('estado_cuenta_idedocuenta')

            #Chequear si se selecciono monto
            if filtromonto:
                montod = filtromonto[0]
                montoh = filtromonto[1]

                ta_conta = ta_conta.filter(monto__gte=montod,monto__lte=montoh)
                ta_corr = ta_corr.filter(monto__gte=montod,monto__lte=montoh)

            #Chequear si se selecciono referencia
            if filtroref:
                reftipo = filtroref[0]
                reftxt = filtroref[1]

                if reftipo == 'N':
                    ta_conta = ta_conta.filter(referencianostro=reftxt)
                    ta_corr = ta_corr.filter(referencianostro=reftxt)

                if reftipo == 'V':
                    ta_conta = ta_conta.filter(referenciacorresponsal=reftxt)
                    ta_corr = ta_corr.filter(referenciacorresponsal=reftxt)

                if reftipo == 'D':
                    ta_conta = ta_conta.filter(descripcion=reftxt)
                    ta_corr = ta_corr.filter(descripcion=reftxt)                 

            #Chequear si se selecciono Credito/debito
            if filtrocod:
                cod = filtrocod[0]

                ta_conta = ta_conta.filter(credito_debito=cod)
                ta_corr = ta_corr.filter(credito_debito=cod)

            #Chequear si se selecciono fechas desde y hasta
            if filtrofecha:
                fechad = None
                fechah = None

                if filtrofecha[0] != '':
                    fechad = datetime.strptime(filtrofecha[0], '%d/%m/%Y')

                if filtrofecha[1] != '':
                    fechah = datetime.strptime(filtrofecha[1], '%d/%m/%Y')

                if fechad is not None and fechah is not None:
                    ta_conta = ta_conta.filter(fecha_valor__gte=fechad,fecha_valor__lte=fechah)
                    ta_corr = ta_corr.filter(fecha_valor__gte=fechad,fecha_valor__lte=fechah)
                elif fechad is not None:
                    ta_conta = ta_conta.filter(fecha_valor__gte=fechad)
                    ta_corr = ta_corr.filter(fecha_valor__gte=fechad)
                elif fechah is not None:
                    ta_conta = ta_conta.filter(fecha_valor__lte=fechah)
                    ta_corr = ta_corr.filter(fecha_valor__lte=fechah)

            #Chequear si se selecciono tipo transferencia
            if filtrotipo:
                tipo = filtrotipo[0]

                ta_conta = ta_conta.filter(codigo_transaccion=tipo)
                ta_corr = ta_corr.filter(codigo_transaccion=tipo)

            edcN = [[],[]]

            edcN[0] = [ta.estado_cuenta_idedocuenta.codigo for ta in ta_conta]
            edcN[1] = [ta.estado_cuenta_idedocuenta.codigo for ta in ta_corr]

            res_json_conta = serializers.serialize('json', ta_conta)
            res_json_corr = serializers.serialize('json', ta_corr) #, use_natural_foreign_keys=True

            # Buscar los mensajes MT95
            mt95 = Mt95.objects.all()
            res_json_mt95 = serializers.serialize('json',mt95) 

            return JsonResponse({'r_conta':res_json_conta, 'r_corr':res_json_corr, 'r_edcn':edcN, 'r_95':res_json_mt95}, safe=False)
        
        if actn =="crearMT95":
            ref95 = request.POST.get('ref95')
            refOrg95 = request.POST.get('refOrg95')
            tipo95 = request.POST.get('tipo95')
            fecha95 = request.POST.get('fecha95')
            fecha952 = request.POST.get('fecha95')
            fecha953 = request.POST.get('fecha95')
            cod95 = request.POST.get('cod95')
            cod2 = request.POST.get('codigo2')
            preg95 = request.POST.get('preg95')
            narra95 = request.POST.get('narrativa95')
            original95 = request.POST.get('original95')
            trans95 = request.POST.get('transaccion')
            clase95 = request.POST.get('clase')
            cuenta95 = request.POST.get('cuenta')
            tipoOriginal = request.POST.get('tipoOriginal')
            mensajeMT = ""
            query = preg95

            codAux = Codigo95.objects.filter(idcodigo95=cod95)[0]
            if fecha95 != "":
                fechad = datetime.strptime(fecha95, '%d/%m/%Y')
            else:
                fechad = None

            if tipo95 == "" or tipo95 =="-1":
                tipo95a = None
            else:
                if tipo95 == "103":
                    tipo95a = "195"
                if tipo95 == "202":
                    tipo95a = "295"
                if tipo95 == "950":
                    tipo95a = "995"

            if clase95 == "conta":

                tra = TransabiertaContabilidad.objects.filter(idtransaccion=trans95)[0]
                Mt95.objects.create(ta_conta=tra,codigo=ref95,codigo95_idcodigo95=codAux,ref_relacion=refOrg95,query=query,narrativa=narra95,num_mt=tipo95a,fecha_msg_original=fechad,campo79=original95)
                mensajeMT = "exito"

            if clase95 == "corres":
                
                tra = TransabiertaCorresponsal.objects.filter(idtransaccion=trans95)[0]
                Mt95.objects.create(ta_corres=tra,codigo=ref95,codigo95_idcodigo95=codAux,ref_relacion=refOrg95,query=query,narrativa=narral95,num_mt=tipo95a,fecha_msg_original=fechad,campo79=original95) 
                mensajeMT = "exito"

            tn = str(timenow())
            hora = tn[11:]
            auxhora = hora.split(':')
            hora = auxhora[0]+auxhora[1]+auxhora[2]
            aux = tn[:10]
            aux2 = aux.split('-')
            aux = aux2[2]+aux2[1]+aux2[0]
            fechaNombre = aux + "_" + hora

            #Buscar directorio de salida de los mensajes MT95
            obj = Configuracion.objects.all()[0]
            sender = obj.bic
            directorio = obj.dirsalida95
            directorio = directorio + "\\"

            #Nombre del archivo a crear
            archivo = directorio + sender + "_" + fechaNombre + ".txt"

            fechaArchivo = ""
            #Formato de fecha YYMMDD
            if fecha95 != "":
                auxd = fecha95[:2]
                auxm = (fecha952[3:])[:2]
                auxy = (fecha953)[6:]
                auxy = auxy[2:]
                fechaArchivo = auxy + auxm + auxd


            cod2 = int(preg95)
            #abrir archivo
            fo = open(archivo, 'w')
            fo.write( "$\n")
            if tipo95!="-1":
                if tipo95 == "103":
                    fo.write( "[M]"+"195"+"\n")
                if tipo95 == "202":
                    fo.write( "[M]"+"295"+"\n")
                if tipo95 == "950":
                    fo.write( "[M]"+"995"+"\n")
            else:
                fo.write( "[M]\n")
            fo.write( "[S]"+sender+"\n")
            fo.write( "[R]"+cuenta95+"\n")
            fo.write( "[20]"+ref95+"\n")
            fo.write( "[21]"+refOrg95+"\n")
            if cod2 == 7 or cod2 == 11 or cod2 == 12 or cod2 == 13 or cod2 == 17 or cod2 == 19 or cod2 == 20 or cod2 == 22 or (23<=cod2<=29) or (30<=cod2<=35) or cod2 == 38 or (40 <= cod2 <=45) or (48 <= cod2 <= 52): 
                cod2 = str(cod2)
                fo.write( "[75]"+cod2+"/"+original95+"\n")
            else:
                cod2 = str(cod2)
                fo.write("[75]"+cod2+"\n")
            if narra95 != "":
                fo.write( "[77A]"+narra95+"\n")
            if tipo95!="-1":
                if tipoOriginal == "R":
                    fo.write( "[11R]"+tipo95+fechaArchivo+"\n")    
                elif tipoOriginal == "S":
                    fo.write( "[11S]"+tipo95+fechaArchivo+"\n")
                else:
                    fo.write( "[11a]"+tipo95+fechaArchivo+"\n")
            if original95!="":
                fo.write( "[79]"+original95+"\n");
            fo.write( "@@")

            #cerrar archivo
            fo.close()

            #Se agrega el evento al log
            log(request,8)

            return JsonResponse({'mens':mensajeMT})

    if request.method == 'GET':

        template = "matcher/pd_partidasAbiertas.html"
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'ops':get_ops(request), 'codigos':get_codigos95(),'ldap':get_ldap(request)}
        return render(request, template, context)

@login_required(login_url='/login')
def pd_matchesConfirmados(request,cuenta):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        actn = request.POST.get('action')

        if actn == 'buscar':
            #Obtener filtros
            jsonArray = request.POST.get('filterArray')
            filterArray = jsonpickle.decode(jsonArray)

            filtromonto = filterArray[0]
            filtromatch = filterArray[1]
            filtroref = filterArray[2]
            filtrofecham = filterArray[3]
            filtrofecha = filterArray[4]

            #Obtener id de la cuenta
            ctaid = request.POST.get('ctaid')
            cta = Cuenta.objects.get(codigo=ctaid)


            #No hay filtro por lo que se usan ambas
            mConf = Matchconfirmado.objects.filter(Q(tc_conta__codigocuenta=cuenta)|Q(tc_corres__codigocuenta=cuenta)).select_related('tc_corres','tc_conta').order_by('codigomatch')

            #Chequear si se selecciono monto
            if filtromonto:
                montod = filtromonto[0]
                montoh = filtromonto[1]

                mConf = mConf.filter(tc_conta__monto__gte=montod,tc_conta__monto__lte=montoh)
                mConf = mConf.filter(tc_corres__monto__gte=montod,tc_corres__monto__lte=montoh)
            
            #Chequear si se selecciono matchid
            if filtromatch:
                filtromatchid = filtromatch[0]
                mConf = mConf.filter(codigomatch__contains=filtromatchid)
            
            #Chequear si se selecciono referencia
            if filtroref:
                reftipo = filtroref[0]
                reftxt = filtroref[1]

                if reftipo == 'N':
                    mConf = mConf.filter(tc_conta__referencianostro=reftxt)
                    mConf = mConf.filter(tc_corres__referencianostro=reftxt)

                if reftipo == 'V':
                    mConf = mConf.filter(tc_conta__referenciacorresponsal=reftxt)
                    mConf = mConf.filter(tc_corres__referenciacorresponsal=reftxt)

                if reftipo == 'D':
                    mConf = mConf.filter(tc_conta__descripcion=reftxt)
                    mConf = mConf.filter(tc_corres__descripcion=reftxt)

            #Chequear si se selecciono fechas de match desde y hasta
            if filtrofecham:
                fechad = None
                fechah = None

                if filtrofecham[0] != '':
                    fechad = datetime.strptime(filtrofecha[0], '%d/%m/%Y')

                if filtrofecham[1] != '':
                    fechah = datetime.strptime(filtrofecha[1], '%d/%m/%Y')

                if fechad is not None and fechah is not None:
                    mConf = mConf.filter(fecha__gte=fechad,fecha__lte=fechah)
                elif fechad is not None:
                    mConf = mConf.filter(fecha__gte=fechad)
                elif fechah is not None:
                    mConf = mConf.filter(fecha__lte=fechah)


            #Chequear si se selecciono fechas desde y hasta
            if filtrofecha:
                fechad = None
                fechah = None

                if filtrofecha[0] != '':
                    fechad = datetime.strptime(filtrofecha[0], '%d/%m/%Y')

                if filtrofecha[1] != '':
                    fechah = datetime.strptime(filtrofecha[1], '%d/%m/%Y')

                if fechad is not None and fechah is not None:
                    mConf = mConf.filter(Q(tc_conta__fecha__gte=fechad,tc_conta__fecha__lte=fechah)|Q(tc_corres__fecha_valor__gte=fechad,tc_corres__fecha_valor__lte=fechah))
                elif fechad is not None:
                    mConf = mConf.filter(Q(tc_conta__fecha__gte=fechad)|Q(tc_corres__fecha_valor__gte=fechad))
                elif fechah is not None:
                    mConf = mConf.filter(Q(tc_conta__fecha__lte=fechah)|Q(tc_corres__fecha_valor__lte=fechah))
            
            cuentas = Cuenta.objects.all().order_by('codigo')
            
            idioma = Configuracion.objects.all()[0].idioma    
            context = {'idioma':idioma, 'cuentas':cuentas, 'matches':mConf, 'cta':cuenta, 'fArray':filterArray, 'msg':None, 'ops':get_ops(request),'ldap':get_ldap(request)}
            template = "matcher/pd_matchesConfirmados.html"
            return render(request, template, context)

        if actn == 'romper':
            matchArray = request.POST.getlist('matchArray[]')
            codcta = request.POST.get('codcta')

            for cod in matchArray:
                mco = Matchconfirmado.objects.filter(codigomatch=cod).select_related('tc_corres','tc_conta')

                for mc in mco:
                    # Tengo en mc una instancia de match confirmado
                    # Se pasa a transaccion abierta
                    if mc.tc_conta is not None and mc.tc_corres is not None:
                        tc = mc.tc_conta
                        TransabiertaContabilidad.objects.create(estado_cuenta_idedocuenta = tc.estado_cuenta_idedocuenta, codigo_transaccion=tc.codigo_transaccion, pagina=tc.pagina, fecha_valor=tc.fecha, descripcion = tc.descripcion, monto=tc.monto,credito_debito=tc.credito_debito, referencianostro = tc.referencianostro, referenciacorresponsal = tc.referenciacorresponsal, campo86_940 = tc.campo86_940, codigocuenta=tc.codigocuenta, numtransaccion=tc.numtransaccion, seguimiento=tc.seguimiento)

                        tc2 = mc.tc_corres
                        TransabiertaCorresponsal.objects.create(estado_cuenta_idedocuenta = tc2.estado_cuenta_idedocuenta, codigo_transaccion=tc2.codigo_transaccion, pagina=tc2.pagina, fecha_valor=tc2.fecha_valor, descripcion = tc2.descripcion, monto=tc2.monto,credito_debito=tc2.credito_debito, referencianostro = tc2.referencianostro, referenciacorresponsal = tc2.referenciacorresponsal, campo86_940 = tc2.campo86_940, codigocuenta=tc2.codigocuenta, numtransaccion=tc2.numtransaccion, seguimiento=tc2.seguimiento)
                        
                        tc.delete()
                        tc2.delete()

                    elif mc.tc_conta is not None and mc.tc_corres is None:
                        tc = mc.tc_conta
                        TransabiertaContabilidad.objects.create(estado_cuenta_idedocuenta = tc.estado_cuenta_idedocuenta, codigo_transaccion=tc.codigo_transaccion, pagina=tc.pagina, fecha_valor=tc.fecha, descripcion = tc.descripcion, monto=tc.monto,credito_debito=tc.credito_debito, referencianostro = tc.referencianostro, referenciacorresponsal = tc.referenciacorresponsal, campo86_940 = tc.campo86_940, codigocuenta=tc.codigocuenta, numtransaccion=tc.numtransaccion, seguimiento=tc.seguimiento)
                        tc.delete()

                    elif mc.tc_corres is not None and mc.tc_conta is None:
                        tc = mc.tc_corres
                        TransabiertaCorresponsal.objects.create(estado_cuenta_idedocuenta = tc.estado_cuenta_idedocuenta, codigo_transaccion=tc.codigo_transaccion, pagina=tc.pagina, fecha_valor=tc.fecha_valor, descripcion = tc.descripcion, monto=tc.monto,credito_debito=tc.credito_debito, referencianostro = tc.referencianostro, referenciacorresponsal = tc.referenciacorresponsal, campo86_940 = tc.campo86_940, codigocuenta=tc.codigocuenta, numtransaccion=tc.numtransaccion, seguimiento=tc.seguimiento)
                        tc.delete()

                    #Se borra de la tabla de match confirmado
                    mc.delete()
                    
            if matchArray:
                setConsolidado(codcta,request)

            msg = 'Matches rotos con éxito'
            return JsonResponse({'msg': msg, 'elim': True})

    if request.method == 'GET':

        if cuenta is not None:
            matches = Matchconfirmado.objects.filter(Q(tc_conta__codigocuenta=cuenta)|Q(tc_corres__codigocuenta=cuenta)).order_by('codigomatch')
        else:
            matches = None

        template = "matcher/pd_matchesConfirmados.html"

        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'matches':matches, 'cta':cuenta, 'fArray':[[],[],[],[],[]], 'msg':None, 'ops':get_ops(request),'ldap':get_ldap(request)}
        return render(request, template, context)

@login_required(login_url='/login')
def pd_conciliacion(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 1 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    template = "matcher/pd_conciliacion.html"
    fecha_hoy = ("/").join(str(timenow().date()).split("-")[::-1])

    idioma = Configuracion.objects.all()[0].idioma    
    context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'fecha_hoy':fecha_hoy, 'ops':get_ops(request),'ldap':get_ldap(request)}
    return render(request, template, context)

@login_required(login_url='/login')
def reportes(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 2 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        reporte = request.POST.get('rep')
        tipoarch = request.POST.get('tipoArch')
        respuesta = reporte+'*'+tipoarch+'*'

        #####
        # REPORTES DE PROCESAMIENTO DIARIO
        #####
        if reporte=='reporteconciliacion':
            codCta = request.POST.get('pd_conc_codcta')
            tipoCta = request.POST.get('pd_conc_tipocta')
            fecha = request.POST.get('pd_conc_fecha')
            tipo = request.POST.get('tipo')
            usuario = get_ci(request)

            codCP = request.POST.get('pd_conc_codcp')

            if tipoarch == 'autcon':
                # Pasar conciliacion a historico
                pagina = request.POST.get('pagina')
                
                cuenta = Cuenta.objects.get(codigo=codCta)
                fecha = cuenta.ultimafechaconciliacion
                print(request.POST)
                
                cursor = connection.cursor()
                try:
                    cursor.execute('EXEC [dbo].[autorizarConciliacion] %s, %s', (codCta,fecha))
                finally:
                    cursor.close()

                if pagina == 'reportes':
                    return HttpResponseRedirect('/reportes/')
                else:
                    return HttpResponseRedirect('/procd/rep_conc/')

                # Para el log
                #log(request,10)

            if tipo == '0':
                if codCta == '-1':
                    zona=''
                    tipo='1'
                else:
                    zona = Cuenta.objects.get(codigo=codCta)
                    zona = zona.zona
                    zona = notnone(zona)

            if tipo == '3':
                Cta = Cuenta.objects.get(codigo=codCta)
                tipoCta = str(Cta.tipo_cta)
                zona = notnone(Cta.zona)
            
            respuesta += fecha+','+codCta+','+tipo+','+tipoCta+','+zona+','+notnone(codCP)+','+usuario


        if reporte=='reportematchespropuestos':
            codCta = request.POST.get('pd_mprop_codcta')

            respuesta += codCta


        if reporte=='reportepartabiertas':
            codCta = request.POST.get('pd_partab_codcta')
            radio = request.POST.get('radiopa')

            respuesta += codCta+','

            if radio=='todas':
                tipo='0'

                respuesta += tipo

            if radio=='monto':
                montod = request.POST.get('pd_partab_monto-desde')
                montoh = request.POST.get('pd_partab_monto-hasta')
                tipo = '1'

                respuesta += tipo+','+montod+','+montoh

            if radio=='fecha':
                fdesde = request.POST.get('pd_partab_f-desde')
                fhasta = request.POST.get('pd_partab_f-hasta')
                tipo = '2'

                respuesta += tipo+','+fdesde+','+fhasta

            if radio=='ref':
                nostro = request.POST.get('pd_partab_nostro')
                vostro = request.POST.get('pd_partab_vostro')

                if vostro == '':
                    tipo = '3'
                    respuesta += tipo+','+nostro

                elif nostro == '':
                    tipo = '4'
                    respuesta += tipo+','+vostro

                else:
                    tipo = '5'
                    respuesta += tipo+','+nostro+','+vostro

            if radio=='trans':
                sl = request.POST.get('pd_partab_sl')
                edo = request.POST.get('pd_partab_edo')
                pag = request.POST.get('pd_partab_pag')
                trans = request.POST.get('pd_partab_trans')
                tipo = '6'

                respuesta += tipo+','+sl+','+edo+','+pag+','+trans


        if reporte=='reportematchesconfirmados':
            codCta = request.POST.get('pd_mconf_codcta')
            radio = request.POST.get('radiomc')

            respuesta += codCta+','

            if radio=='todas':
                respuesta += '0'
            
            if radio=='monto':
                montod = request.POST.get('pd_mconf_monto-desde')
                montoh = request.POST.get('pd_mconf_monto-hasta')

                respuesta += '1,'+montod+','+montoh

            if radio=='fecha':
                fdesde = request.POST.get('pd_mconf_f-desde')
                fhasta = request.POST.get('pd_mconf_f-hasta')

                respuesta += '2,'+fdesde+','+fhasta

            if radio=='match':
                mid = request.POST.get('pd_mconf_match')

                respuesta += '3,'+mid

            if radio=='ref':
                nostro = request.POST.get('pd_mconf_nostro')
                vostro = request.POST.get('pd_mconf_vostro')

                if vostro == '':
                    tipo = '4'
                    respuesta += tipo+','+nostro

                elif nostro == '':
                    tipo = '5'
                    respuesta += tipo+','+vostro
                else:
                    tipo = '4'
                    respuesta += tipo+','+nostro

        if reporte=='reportehistoricoconciliacion':
            codCta = request.POST.get('pd_hist_codcta')
            tipoCta = request.POST.get('pd_hist_tipocta')
            fecha = request.POST.get('pd_hist_fecha')

            if tipoCta == '2':
                zona = Cuenta.objects.get(codigo=codCta)
                zona = zona.zona
                zona = notnone(zona)
                codCP = ''
            else:
                zona = ''
                codCP = ''

            usuario = get_ci(request)

            respuesta += fecha+','+codCta+','+tipoCta+','+zona+','+codCP+','+usuario

        if reporte=='reporteposforex':
            moneda = request.POST.get('pd_posmon_monl')
            fecha = request.POST.get('pd_posmon_fecha')

            respuesta += fecha+','+moneda

        if reporte=='reportegiros':
            codCta = request.POST.get('pd_giro_codcta')
            tipo = request.POST.get('pd_giro_tipo')

            respuesta += codCta+','+tipo

        if reporte=='reporteedoscuenta':
            tipoCta = request.POST.get('pd_edcs_tipocta')
            fdesde = request.POST.get('pd_edcs_f-desde')
            fhasta = request.POST.get('pd_edcs_f-hasta')
            usuario = get_ci(request)

            respuesta += tipoCta+','+fdesde+','+fhasta+','+usuario


        #####
        # REPORTES DE MENSAJES SWIFT
        #####
        if reporte=='reportemt95mt96':
            codCta = request.POST.get('ms_mt_codcta')

            respuesta += codCta


        #####
        # REPORTES DE CONFIGURACION
        #####
        if reporte=='reporteconfiguracion':
            tipo = request.POST.get('tipo')
            respuesta += tipo

        #####
        # REPORTES DE SEGURIDAD
        #####
        if reporte=='reporteusuarios':
            usuario = request.POST.get('seg_usr_usuario') #tiene la CI

            if usuario == '-1':
                # son todos (tipo=1)
                tipo = '1'
                print('todos')
            else:
                # detallado (tipo=0)
                tipo = '0'
                print('detallado')

            respuesta += usuario+','+tipo

        if reporte=='reporteperfiles':
            perfil = request.POST.get('seg_per_perfil')

            if perfil == '-1':
                #son todos (tipo=1)
                tipo = '1'
            else:
                #detallado (tipo=0)
                tipo = '0'
            
            respuesta += perfil+','+tipo

        if reporte == 'reportelog':
            usuario = request.POST.get('seg_log_usuario')
            evento = request.POST.get('seg_log_ev-sel')

            fdesde = request.POST.get('seg_log_f-desde')
            hdesde = request.POST.get('seg_log_h-desde')

            fhasta = request.POST.get('seg_log_f-hasta')
            hhasta = request.POST.get('seg_log_h-hasta')

            bhoras = request.POST.get('seg_log_bhoras')

            if bhoras is None:
                bhoras = '0'

            hdesde = hdesde.split(' ')[0]
            hhasta = hhasta.split(' ')[0]

            respuesta = 'reportelogsporfechas'

            if usuario == '-1' and evento == '-1':
                respuesta += '*'+fdesde+','+fhasta+','+hdesde+','+hhasta+','+bhoras
            
            elif usuario == '-1' and evento != '-1':
                respuesta += 'event*'+fdesde+','+fhasta+','+hdesde+','+hhasta+','+bhoras+','+evento

            elif usuario != '-1' and evento == '-1':
                respuesta += 'usuarios*'+fdesde+','+fhasta+','+hdesde+','+hhasta+','+bhoras+','+usuario

            else:
                respuesta += 'usuariosevent*'+fdesde+','+fhasta+','+hdesde+','+hhasta+','+bhoras+','+usuario+','+evento

        #####
        # REPORTES DE ADMINISTRACION
        #####
        if reporte=='reportecuentas':
            codCta = request.POST.get('adm_cta_codcta')
            usuario = get_ci(request)

            if codCta == '-1':
                #son todos (tipo=1)
                tipo = '1'
            else:
                #detallado (tipo=0)
                tipo = '0'

            respuesta += usuario+','+codCta+','+tipo

        if reporte=='reportereglastransf':
            codCta = request.POST.get('adm_rdt_codcta')

            respuesta += codCta

        if reporte=='reportecriteriosmatch':
            print('cdm')

        if reporte=='reportebancos':
            print('ban')

        if reporte=='reportemonedas':
            print('mon')

        #####
        # REPORTES Avanzados
        #####
        if reporte=='reportectassobregiradas':
            fecha = request.POST.get('avz_ctas_fecha')
            usuario = get_ci(request)
            
            respuesta += fecha+','+usuario

        if reporte=='reportesaldos':
            tipoCta = request.POST.get('avz_sconc_tipocta')
            fecha = request.POST.get('avz_sconc_fecha')
            usuario = get_ci(request)
            
            respuesta += tipoCta+','+fecha+','+usuario

        # El de observaciones es de conciliacion tipo 3

        if reporte=='reportepartabiertasavz':
            tipoCta = request.POST.get('avz_paavz_tipocta')
            tipo = request.POST.get('radiopaavz')
            codCP = request.POST.get('avz_paavz_codCP')
            orden = request.POST.get('avz_paavz_ord')

            respuesta += tipoCta+','

            if tipo=='todas':
                respuesta += '0'
            
            if tipo=='monto':
                montod = request.POST.get('avz_paavz_monto-desde')
                montoh = request.POST.get('avz_paavz_monto-hasta')

                respuesta += '1,'+montod+','+montoh

            if tipo=='fecha':
                fdesde = request.POST.get('avz_paavz_f-desde')
                fhasta = request.POST.get('avz_paavz_f-hasta')

                respuesta += '2,'+fdesde+','+fhasta

            if tipo=='ref':
                nostro = request.POST.get('avz_paavz_nostro')
                vostro = request.POST.get('avz_paavz_vostro')

                respuesta += '3,'+nostro+','+vostro

        #####
        # REPORTES Estadísticas
        #####
        if reporte=='reporteestpartidasabiertas':
            codCta = request.POST.get('est_pa_codcta')
            tipoCta = request.POST.get('est_pa_tipocta')
            fuente = request.POST.get('est_pa_fuente')
            fdesde = request.POST.get('est_pa_f-desde')
            fhasta = request.POST.get('est_pa_f-hasta')
            usuario = get_ci(request)

            if fuente == '0':
                fdesde = fhasta

            respuesta += tipoCta+','+codCta+','+fdesde+','+fhasta+','+usuario+','+fuente

        if reporte=='reporteestmatchconf':
            codCta = request.POST.get('est_pcon_codcta')
            tipoCta = request.POST.get('est_pcon_tipocta')
            fdesde = request.POST.get('est_pcon_f-desde')
            fhasta = request.POST.get('est_pcon_f-hasta')
            usuario = get_ci(request)

            respuesta += tipoCta+','+codCta+','+fdesde+','+fhasta+','+usuario

        if reporte=='reporteestpartcarg':
            codCta = request.POST.get('est_pcar_codcta')
            tipoCta = request.POST.get('est_pcar_tipocta')
            fdesde = request.POST.get('est_pcar_f-desde')
            fhasta = request.POST.get('est_pcar_f-hasta')
            usuario = get_ci(request)
            
            respuesta += tipoCta+','+codCta+','+fdesde+','+fhasta+','+usuario


        nombreRep = generarReporte(respuesta)

        if nombreRep == "errorconn":
            return HttpResponseNotFound('<h1>Error de conexion, verificar que el servidor de reportes este funcionando.</h1>')

        # Si es pdf retorno pdf, sino retorno excel
        if tipoarch == 'pdf':
            return (pdfView(nombreRep))
        elif tipoarch == 'xls':
            return (xlsView(nombreRep))

    if request.method == 'GET':
        template = "matcher/reportes.html"
        usuarios = Usuario.objects.all().order_by('apellidos')
        perfiles = Perfil.objects.all().order_by('nombre')
        eventos = Evento.objects.all().order_by('accion')
        fecha_hoy = ("/").join(str(timenow().date()).split("-")[::-1])

        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'perfiles':perfiles, 'usuarios':usuarios, 'eventos':eventos, 'fecha_hoy':fecha_hoy, 'ops':get_ops(request),'ldap':get_ldap(request)}
        return render(request, template, context)

@login_required(login_url='/login')
def mensajesSWIFT(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 3 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    template = "matcher/admin_criteriosyreglas.html"
    idioma = Configuracion.objects.all()[0].idioma    
    context = {'idioma':idioma, 'ops':get_ops(request),'ldap':get_ldap(request)}
    return render(request, template, context)

@login_required(login_url='/login')
def mtn96(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 3 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'GET':
        template = "matcher/mtn96.html"
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'ops':get_ops(request), 'archivos':get_archivosMT96(),'ldap':get_ldap(request)}
        
        return render(request, template, context)

    if request.method == "POST":

        action = request.POST.get('action')
        if action == "cargar":

            archivoCarga = request.POST.get('archivo96')
            mt95 = []
            codigos=[]
            codigos96=[]
            refRelaciones=[]
            respuestas = []
            narrativas = []
            numerosMT = []
            fechas = []
            campos79 = []

            #Buscar directorio de carga de los mensajes MT96
            obj = Configuracion.objects.all()[0]
            reciver = obj.bic
            directorio = obj.dircarga96
            directorio = directorio + "\\"

            #ruta del archivo a cargar
            ruta = directorio + archivoCarga

            #ruta de archivos procesados
            #rutaProcesados = "C:\Matcher\PROCESADO96" 
            rutaProcesados = obj.dirprocesado96

            #abrir archivo
            fo = open(ruta, 'r')

            mensaje = ""

            auxCuenta = 0
            lines = fo.readlines()
            i = 0
            while i < len(lines):
                
                tipoCargar = ""
                refCargar = ""
                refOrgCargar = ""
                respuestaCargar = ""
                narrativaCargar = ""
                fechaCargar = ""
                cargar79 = ""
                consultaCodigo96 = ""

                for j in range(0,8):
                    line = lines[i+auxCuenta]
                    if j%8 == 1:
                        opcion = line[:3]
                        if opcion != "[M]":
                            mensaje = "Caracter inesperado en campo tipo, en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        tipoCargar = line[3:]
                        tipoCargar = tipoCargar[:3].strip()
                        print("eeeeees: " + tipoCargar[-2:].strip())
                        if tipoCargar[-2:].strip() != "96":
                            mensaje = "El tipo del mensaje no corresponde a un MTn96,error en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                    if j%8 == 2:
                        opcion = line[:3]
                        if opcion != "[S]":
                            mensaje = "Caracter inesperado en campo bic del banco emisor, en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        bancoCargar = line[3:]
                        largoaux = len(bancoCargar)-1
                        bancoCargar = bancoCargar[:largoaux]
                    if j%8 == 3:
                        opcion = line[:3]
                        if opcion != "[R]":
                            mensaje = "Caracter inesperado en campo bic del banco receptor, en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        bancoR = line[3:]
                        largoaux = len(bancoR)-1
                        bancoR = bancoR[:largoaux]
                        if bancoR != reciver :
                            mensaje = "Caracter inesperado en campo bic del banco receptor, en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                    if j%8 == 4:
                        opcion = line[:4]
                        if opcion != "[20]":
                            mensaje = "Caracter inesperado en campo referencia del mensaje,  en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        refCargar = line[4:].strip()
                    if j%8 == 5:
                        opcion = line[:4]
                        if opcion != "[21]":
                            mensaje = "Caracter inesperado en campo referencia del mensaje original,  en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        refOrgCargar = line[4:].strip()
                        try:
                            consulta = Mt95.objects.filter(ref_relacion=refCargar).filter(codigo=refOrgCargar)[0]
                        except:
                            #no hay mensajes mt95 con esas referencias
                            mensaje = "No se tienen registrados las referencias del mensaje que se encuentra en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                    if j%8 == 6:
                        opcion = line[:4]
                        if opcion != "[76]":
                            mensaje = "Caracter inesperado en codigo de respuesta del mensaje,  en la linea numero " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        respuestaCargar = line[4:].strip()
                        rc = int(respuestaCargar)
                        #codigo no esta entre los validos para swift
                        if rc < 0 or rc > 33:
                            mensaje = "El código de respuesta, que se encuentra en la línea número " +str(i+auxCuenta+1)+ " del archivo no es válido"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        
                        consultaCodigo96 = Codigo96.objects.filter(codigo=respuestaCargar)[0]
                        #no hay codigos mt96 con esas referencias
                        if consultaCodigo96 is None:
                            mensaje = "No se tienen registrados los codigos del mensaje que se encuentra en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                    if j%8 == 7:
                        opcion = line[:5]
                        if opcion != "[77A]":
                            mensaje = "Caracter inesperado en la forma narrativa de la respuesta,  en la linea numero " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})

                        line = lines [i+j+1]
                        cuenta = i+j+1
                        cargar79=""

                        narrativaCargar = line[5:]
                        cuenta+=1
                        auxCuenta+=1
                        line = lines[cuenta]

                        while (line[:5] != "[11a]" and line[:5] != "[11R]" and line[:5] != "[11S]" and line[:4] != "[79]" and line[:2] != "@@"):
                                    
                            narrativaCargar = narrativaCargar + line
                            cuenta+=1
                            auxCuenta+=1
                            line = lines[cuenta]

                        if line[:5] == "[11a]" or line[:5] == "[11R]" or line[:5] == "[11S]":
                            fechaCargar = line[8:].strip()
                            cuenta+=1
                            auxCuenta+=1
                            line = lines[cuenta]

                        if line [:4] != "[79]" and line [:2] != "@@" :

                            mensaje = "Caracter inesperado luego de la respuesta del mensaje,  en la linea numero " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})

                        if line [:4] != "[79]" and line [:2] == "@@" :

                                auxCuenta+=1

                        if line[:4] == "[79]":
                                
                            cargar79 = line[4:]
                            cuenta+=1
                            auxCuenta+=1
                            line = lines[cuenta]

                            while line[:2] != "@@":
                                    
                                cargar79 = cargar79 + line
                                cuenta+=1
                                auxCuenta+=1
                                line = lines[cuenta]
                    auxCuenta+=1
                auxCuenta+=1
                i = i + auxCuenta
                auxCuenta = 0
        
                # Se agregan los campos a las estructuras auxiliares para al finalarizar el recorrido del archivo 
                # y ver que no haya errores, agregar los datos a la base de datos
                mt95.append(consulta)
                codigos.append(refCargar)
                codigos96.append(consultaCodigo96)
                refRelaciones.append(refOrgCargar)
                respuestas.append(respuestaCargar)
                narrativas.append(narrativaCargar)
                
                if tipoCargar != "":
                    numerosMT.append(tipoCargar)
                else:
                    numerosMT.append(None)
                if fechaCargar != "":
                    dia = fechaCargar[:2]
                    mes = fechaCargar[2:][:2]
                    anio = fechaCargar[4:]
                    dia = "20" + dia
                    fechad = anio + "/" + mes +"/"+ dia
                    fechad = datetime.strptime(fechad, '%d/%m/%Y')
                    fechas.append(fechad)
                else:
                    fechas.append(None)
                if cargar79 != "": 
                    campos79.append(cargar79)
                else:
                    campos79.append(None)

            #cerrar archivo
            fo.close()

            # Se hacen los creates en la base de datos
            k=0
            print("Esta antes del mt: ")
            for mt in mt95:
                Mt96.objects.create(mt95_idmt95=mt95[k],codigo=codigos[k],codigo96_idcodigo96=codigos96[k], ref_relacion=refRelaciones[k],answer=respuestas[k], narrativa=narrativas[k], num_mt=numerosMT[k], fecha_msg_original=fechas[k],campo79 =campos79[k])
                k+=1        

            #Se agrega el evento al log
            log(request,42)

            #Se mueve el archivo de directorio
            shutil.move(ruta,rutaProcesados)

            return JsonResponse({'mens':mensaje})

@login_required(login_url='/login')
def mtn99(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 3 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'GET':
        template = "matcher/mtn99.html"
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'ops':get_ops(request), 'bancos':get_bancos(), 'archivos':get_archivosMT99(),'ldap':get_ldap(request)}
        
        return render(request, template, context)

    if request.method == "POST":

        # Variables traidas desde el html
        action = request.POST.get('action')
        banco = request.POST.get('banco99')
        tipo = request.POST.get('tipo99')
        ref_mensaje = request.POST.get('ref_mensaje99')
        ref_mensaje_original = request.POST.get('ref_mensaje_original99')
        narrativa = request.POST.get('narrativa99')
        desde = request.POST.get('fechaDesde99')
        hasta = request.POST.get('fechaHasta99')
        archivoCarga = request.POST.get('archivo99')
        mensaje = "Esta entrando en cargar"

        if action == "buscar":
            if desde == "" and hasta == "":
                
                #buscar los mensajes mtn99 del tipo y banco seleccionados
                mensajes = Mt99.objects.filter(bic = banco).filter(tipo_mt = tipo)
                res_json = serializers.serialize('json', mensajes)
                return JsonResponse({'mens':res_json})

            else:

                fechad = datetime.strptime(desde, '%d/%m/%Y')
                fechah = datetime.strptime(hasta, '%d/%m/%Y')

                #buscar los mensajes mtx99 del tipo y banco seleccionados, en el rango de fechas suministrado
                mensajes = Mt99.objects.filter(bic = banco).filter(tipo_mt = tipo)

                if fechad is not None and fechah is not None:
                    mensajes = mensajes.filter(fecha__gte=fechad).filter(fecha__lte=fechah)
                    
                res_json = serializers.serialize('json', mensajes)
                return JsonResponse({'mens':res_json})

        if action == "crear":

            #Se crea el nuevo mensaje en base da datos
            nuevomt99 = Mt99.objects.create(codigo=ref_mensaje, ref_relacion=ref_mensaje_original, narrativa=narrativa, bic=banco, fecha=timenow(),tipo_mt=tipo,origen="0" )
            
            #Se crea el archivo de texto con la copia del mensaje en el formato SWIFT
            tn = str(timenow())
            hora = tn[11:]
            auxhora = hora.split(':')
            hora = auxhora[0]+auxhora[1]+auxhora[2]
            aux = tn[:10]
            aux2 = aux.split('-')
            aux = aux2[2]+aux2[1]+aux2[0]
            fechaNombre = aux + "_" + hora

            #Buscar directorio de salida de los mensajes MT99
            obj = Configuracion.objects.all()[0]
            sender = obj.bic
            directorio = obj.dirsalida99
            directorio = directorio + "\\"

            #Nombre del archivo a crear
            archivo = directorio + banco + "_" + fechaNombre + "_" + tipo + ".txt"

            #abrir archivo
            fo = open(archivo, 'w')
            fo.write( "$\n")
            fo.write( "[M]"+tipo+"\n")
            fo.write( "[S]"+sender+"\n")
            fo.write( "[R]"+banco+"\n")
            fo.write( "[20]"+ref_mensaje+"\n")
            fo.write( "[21]"+ref_mensaje_original+"\n")
            fo.write( "[79]"+narrativa+"\n")
            fo.write( "@@")

            #cerrar archivo
            fo.close()

            #Se agrega el evento al log
            log(request,40)

            return JsonResponse({'mens':"Mensaje MT agregado correctamente"})

        if action == "cargar":

            tipoCargar = ""
            bancoCargar = ""
            refCargar = ""
            refOrgCargar = ""
            narrativaCargar = ""
            origenCargar = "1"
            codigos=[]
            relaciones=[]
            narrativas=[]
            bics=[]
            #Buscar directorio de carga de los mensajes MT99
            obj = Configuracion.objects.all()[0]
            reciver = obj.bic
            directorio = obj.dircarga99
            directorio = directorio + "\\"

            #ruta del archivo a cargar
            ruta = directorio + archivoCarga

            #ruta de archivos procesados
            #rutaProcesados = "C:\Matcher\PROCESADO99" 
            rutaProcesados = obj.dirprocesado99

            #abrir archivo
            fo = open(ruta, 'r')

            auxCuenta = 0
            lines = fo.readlines()
            i = 0
            while i < len(lines):
                for j in range(0,7):
                    line = lines[i+auxCuenta]
                    if j%7 == 1:
                        opcion = line[:3]
                        if opcion != "[M]":
                            mensaje = "Caracter inesperado en campo tipo, en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        tipoCargar = line[3:]
                        tipoCargar = tipoCargar[:3]
                    if j%7 == 2:
                        opcion = line[:3]
                        if opcion != "[S]":
                            mensaje = "Caracter inesperado en campo bic del banco emisor, en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        bancoCargar = line[3:]
                        largoaux = len(bancoCargar)-1
                        bancoCargar = bancoCargar[:largoaux]
                    if j%7 == 3:
                        opcion = line[:3]
                        if opcion != "[R]":
                            mensaje = "Caracter inesperado en campo bic del banco receptor, en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        bancoR = line[3:]
                        largoaux = len(bancoR)-1
                        bancoR = bancoR[:largoaux]
                        if bancoR != reciver :
                            mensaje = "Caracter inesperado en campo bic del banco receptor, en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                    if j%7 == 4:
                        opcion = line[:4]
                        if opcion != "[20]":
                            mensaje = "Caracter inesperado en campo referencia del mensaje,  en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        refCargar = line[4:]
                    if j%7 == 5:
                        opcion = line[:4]
                        if opcion != "[21]":
                            mensaje = "Caracter inesperado en campo referencia del mensaje original,  en la línea número " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        refOrgCargar = line[4:]
                    if j%7 == 6:
                        opcion = line[:4]
                        if opcion != "[79]":
                            mensaje = "Caracter inesperado en la narrativa del mensaje,  en la linea numero " +str(i+auxCuenta+1)+ " del archivo"
                            #cerrar archivo
                            fo.close()
                            return JsonResponse({'mens':mensaje})
                        narrativaCargar = line[4:]
                        line = lines [i+j+1]
                        cuenta = i+j+1
                        while line[:2] != "@@":
                            narrativaCargar = narrativaCargar + line
                            cuenta+=1
                            auxCuenta+=1
                            line = lines[cuenta]
                    auxCuenta+=1
                auxCuenta+=1
                i = i + auxCuenta
                auxCuenta = 0
        
                # Se agregan los campos a las estructuras auxiliares para al finalarizar el recorrido del archivo 
                # y ver que no haya errores, agregar los datos a la base de datos
                codigos.append(refCargar)
                relaciones.append(refOrgCargar)
                narrativas.append(narrativaCargar)
                bics.append(bancoCargar)

            #cerrar archivo
            fo.close()

            # Se hacen los creates en la base de datos
            k=0
            for codigo in codigos:
                Mt99.objects.create(codigo=codigo, ref_relacion=relaciones[k], narrativa=narrativas[k], bic=bics[k], fecha=timenow(),tipo_mt=tipoCargar,origen=origenCargar)
                k+=1        

            #Se agrega el evento al log
            log(request,41)



            

            #Se mueve el archivo de directorio
            shutil.move(ruta,rutaProcesados)

            return JsonResponse({'mens':mensaje})


@login_required(login_url='/login')
def intraday(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)

    if not 16 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)

    if request.method == 'GET':
        empresa = Empresa.objects.all()[0]
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas':get_cuentas(request),'ops':get_ops(request),'empresa':empresa,'ldap':get_ldap(request)}
        template = "matcher/intraday.html"

        return render(request, template, context)

    if request.method == 'POST':
        actn = request.POST.get('action')

        if actn == 'buscarConci':
            msg = ""
            res = ""
            cuenta_id = request.POST.get('cuenta')
            conciliacion = Conciliacionconsolidado.objects.filter(cuenta_idcuenta = cuenta_id)
            json_cons =""
            exitoconci = False
            exito = False
            exitoParseo = True
            fecha = ""
            fechaActual = ""
    
            if conciliacion:
                exitoconci =True
                cons = conciliacion[0]
                cuenta = cons.cuenta_idcuenta
                fecha = cuenta.ultimafechaconciliacion.strftime("%d/%m/%Y")
                fechaActual = datetime.now().strftime("%d/%m/%Y %H:%M %p")
                bfcon = cons.balancefinalcontabilidad
                bfcor = cons.balancefinalcorresponsal
                scon = cons.saldocontabilidad
                scor = cons.saldocorresponsal
                json_cons = serializers.serialize('json', [cons])
                cod = ['C']*4

                if bfcon < 0:
                    cod[0] = "D"
                if bfcor < 0:
                    cod[1] = "D"
                if scon < 0:
                    cod[2] = "D"
                if scor < 0:
                    cod[3] = "D"
            else:
                cuenta = Cuenta.objects.filter(idcuenta=cuenta_id)[0]
                cons = None
                cod = ['C']*4
                exitoconci = False

            json_cuenta = serializers.serialize('json', [cuenta])

            archivos942 = ""
            
            obj = Configuracion.objects.all()[0]
            directorio = obj.dirintraday
            directorioSalida = obj.dirintradaysalida

            try:
                archivos = os.listdir(directorio)
            except OSError:
                os.makedirs(directorio)
                archivos = os.listdir(directorio)
            
            for elem in archivos:
                direct = directorio + "\\" + elem
                if (not os.path.isdir(direct)):
                    tipo = parsearTipoMT(elem,directorio)
                    if (tipo[0] != "error"):
                        print(tipo[0])
                        exito = True
                        if (tipo[0] == "103"):
                            
                            res = parseo103(elem,directorio)

                            if(res[0] == "True"):
                                print("True")
                                #Mover archivo a procesado
                                pathsrc = direct 
                                nuevo = directorioSalida +"\\MT" + tipo[0]  
                                
                                if not os.path.exists(nuevo):
                                    os.makedirs(nuevo)
                                
                                pathdest = nuevo + '\\' + elem
                                shutil.move(pathsrc,pathdest)
                            else:
                                exitoParseo = False
                                msg = res[1]
                                continue

                        elif (tipo[0] == "202"):
                            
                            res = parseo202(elem,directorio)
                            
                            if(res[0] == "True"):
                                print("True")
                                
                                #Mover archivo a procesado
                                pathsrc = direct 
                                nuevo = directorioSalida +"\\MT" + tipo[0]  
                                
                                if not os.path.exists(nuevo):
                                    os.makedirs(nuevo)
                                
                                pathdest = nuevo + '\\' + elem
                                shutil.move(pathsrc,pathdest)
                            else:
                                exitoParseo = False
                                msg = res[1]
                                continue

                        elif (tipo[0] == "942"):
                            
                            res = parseo942(elem,directorio)
                            
                            if(res[0] == "True"):
                                print("True")
                                
                                #Mover archivo a procesado
                                #pathsrc = direct 
                                #nuevo = directorioSalida +"\\MT" + tipo[0]  
                                
                                #if not os.path.exists(nuevo):
                                #    os.makedirs(nuevo)
                                
                                #pathdest = nuevo + '\\' + elem
                                #shutil.move(pathsrc,pathdest)
                            else:
                                exitoParseo = False
                                msg = res[1]
                                continue

                    else:
                        exito = False
                        msg = tipo[1]
                        break
                
            return JsonResponse({'exitoParseo':exitoParseo,'exitoconci':exitoconci,'msg':msg,'fecha':fecha,'fechaActual':fechaActual, 'exito':exito, 'cuenta': json_cuenta, 'cons':json_cons, 'cod': cod})


@login_required(login_url='/login')
def transIntraday(request,cuenta):       
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)

    if not 16 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)

    cuentaId = Cuenta.objects.filter(idcuenta=cuenta)[0]
    fecha = cuentaId.ultimafechaconciliacion.strftime("%d/%m/%Y")
    fechaActual = datetime.now().strftime("%d/%m/%Y %H:%M %p")
                
    idioma = Configuracion.objects.all()[0].idioma    
    
    context = {'idioma':idioma,'ops':get_ops(request),'cuenta':cuentaId,'fecha':fecha , 'fechaActual':fechaActual}
    template = "matcher/transIntraday.html"

    return render(request, template, context)

@login_required(login_url='/login')
def configuracion(request, tipo):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 4 or not 14 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':

        if tipo == "sis":
            tipoconf = request.POST.get('conf_form_name')

            if tipoconf=='conf_empresa':
                nombre = request.POST.get('nombre')
                g_fin = request.POST.get('g_fin')
                direccion = request.POST.get('dir')
                logo = request.POST.get('logo')
                bic = request.POST.get('bic')
                pais = request.POST.get('pais')
                c_conta = request.POST.get('c_conta')
                d_conta = request.POST.get('d_conta')
                d_corr = request.POST.get('d_corr')
                c_corr = request.POST.get('c_corr')
                p_aut = request.POST.get('p_aut')
                p_fir = request.POST.get('p_fir')
                cargo = request.POST.get('cargo')

                # Buscar empresa y configuracion
                conf = Configuracion.objects.all()[0]
                empresa = Empresa.objects.all()[0]

                # Se asignan los cambios
                empresa.nombre = nombre
                empresa.dir_logo = logo
                empresa.nombregrupo = g_fin
                empresa.direccion = direccion
                empresa.creditoscontabilidad = c_conta
                empresa.debitoscontabilidad = d_conta
                empresa.creditoscorresponsal = c_corr
                empresa.debitoscorresponsal = d_corr
                empresa.pais = pais
                empresa.autorizadopor = p_aut 
                empresa.firmadopor = p_fir
                empresa.cargofirmante = cargo

                conf.bic = bic

                # Se guarda la empresa y configuracion
                empresa.save()
                conf.save()

                # Para el log
                log(request,11)


            if tipoconf=='conf_gral':

                cont_carg = request.POST.get('cont_carg')
                corr_carg = request.POST.get('corr_carg')
                cont_procs = request.POST.get('cont_procs')
                corr_procs = request.POST.get('corr_procs')
                m_host = request.POST.get('m-host')
                m_puerto = request.POST.get('m-puerto')
                ldap_ip = request.POST.get('ldap_ip')
                ldap_puerto = request.POST.get('ldap_puerto')
                ldap_dominio = request.POST.get('ldap-dominio')
                a_mail = request.POST.get('a-mail')
                a_puerto = request.POST.get('a-puerto')
                a_usrn = request.POST.get('a-usrn')
                a_contr = request.POST.get('a-contr')
                t_cad = request.POST.get('t_cad')
                long_min = request.POST.get('long_min')
                num_fall = request.POST.get('num_fall')
                rec_ult = request.POST.get('rec_ult')
                t_ret_log = request.POST.get('t_ret_log')
                arch = request.POST.get('arch')
                archconfirm = request.POST.get('archconfirm')
                dirIntraday = request.POST.get('dirIntraday')
                dirIntradaySalida = request.POST.get('dirIntradaySalida')
                tiempoIntraday = request.POST.get('tiempoAct')
                dir_s_mt95 = request.POST.get('dir_s_mt95')
                dir_c_mt96 = request.POST.get('dir_c_mt96')
                dir_s_mt99 = request.POST.get('dir_s_mt99')
                dir_c_mt99 = request.POST.get('dir_c_mt99')
                dir_p_mt96 = request.POST.get('dir_p_mt96')
                dir_p_mt99 = request.POST.get('dir_p_mt99')
                dirlicencia = request.POST.get('dirlicencia')
                expiracion = request.POST.get('expiracion')
                idioma = request.POST.get('Idiom-sel')

                ce = request.POST.get('ce')
                may = request.POST.get('may')
                num  = request.POST.get('num')
                alf = request.POST.get('alf')

                # Buscar empresa y configuracion
                conf = Configuracion.objects.all()[0]

                #Crear directorios si no existen
                arregloDir = [cont_carg,cont_procs,corr_carg,corr_procs,arch,dir_s_mt95,dir_c_mt96,dir_s_mt99,dir_c_mt99,dir_p_mt96,dir_p_mt99,archconfirm,dirlicencia,dirIntraday,dirIntradaySalida]
                verificarDirectorio(arregloDir)

                # Asignar los cambios
                conf.archcontabilidadcarg = cont_carg
                conf.archswiftcarg = corr_carg
                conf.archcontabilidadproc = cont_procs
                conf.archswiftproc = corr_procs
                conf.matcherhost = m_host
                conf.matcherpuerto = m_puerto
                conf.ldap_ip = ldap_ip
                conf.ldap_puerto = ldap_puerto
                conf.ldap_dominio = ldap_dominio
                conf.alertasservidor = a_mail
                conf.alertaspuerto = a_puerto
                conf.alertasusuario = a_usrn
                conf.alertaspass = a_contr
                conf.caducidad = t_cad
                conf.longitud_minima = long_min
                conf.num_intentos = num_fall
                conf.num_passrecordar = rec_ult
                conf.tiemporetentrazas = t_ret_log
                conf.dirarchive = arch
                conf.dirarchiveconfirmados = archconfirm
                conf.dirintraday = dirIntraday
                conf.dirintradaysalida = dirIntradaySalida
                conf.tiempointraday = tiempoIntraday
                conf.dirsalida95 = dir_s_mt95
                conf.dircarga96 = dir_c_mt96
                conf.dirsalida99 = dir_s_mt99
                conf.dircarga99 = dir_c_mt99
                conf.dirprocesado96 = dir_p_mt96
                conf.dirprocesado99 = dir_p_mt99
                conf.dirlicencia = dirlicencia
                conf.expiracion_sesion = expiracion
                conf.idioma = int(idioma)

                # Chequeando checkboxes
                if ce is not None:
                    conf.caracteresespeciales = 1
                else:
                    conf.caracteresespeciales = 0

                if num is not None:
                    conf.numeros = 1
                else:
                    conf.numeros = 0

                if may is not None:
                    conf.mayusculas = 1
                else:
                    conf.mayusculas = 0

                if alf is not None:
                    conf.alfabeticos = 1
                else:
                    conf.alfabeticos = 0

                conf.save()

                #Para el log
                log(request,12)

            return HttpResponseRedirect('/conf/sis/')

        if tipo == "arc":
            actn = request.POST.get('action')

            if actn == "add":
                formcuenta = int(request.POST.get('formcuenta'))
                formnom = request.POST.get('formnom')
                formcarsep = request.POST.get('formcarsep')
                formtipo = request.POST.get('formtipo')
                formcampsel = request.POST.get('formcampsel')
                msg = "Formato creado exitosamente."

                try:
                    cuenta = Cuenta.objects.get(pk=formcuenta)
                except Cuenta.DoesNotExist:
                    msg = "No se encontro la cuenta especificada, asegurese de elegir una cuenta primero."
                    return JsonResponse({'msg': msg, 'add': False})

                formato =  Formatoarchivo.objects.create(cuenta_idcuenta = cuenta, nombre = formnom, separador = formcarsep, tipo = formtipo, formato=formcampsel)
            
                return JsonResponse({'formid':formato.pk, 'formnom':formnom, "formcuentaid":cuenta.pk, "formcuentanom": cuenta.codigo , "formcarsep":formcarsep, "formtipo": formtipo, "formcampsel": formcampsel, 'msg':msg, 'add': True})

            elif actn == "del":
                formid = request.POST.get('formid')
                msg = "Formato eliminado exitosamente."

                try:
                    formato = Formatoarchivo.objects.get(idformato=formid)
                except Formatoarchivo.DoesNotExist:
                    msg = "No se encontro el formato especificado, asegurese de hacer click en el formato de archivo a eliminar." 
                    return JsonResponse({'msg': msg, 'formid': formid, 'elim': False})

                formato.delete()
                return JsonResponse({'msg': msg, 'formid': formid, 'elim': True})

            elif actn == "upd":

                formid = request.POST.get('formid')
                formnom = request.POST.get('formnom')
                formcarsep = request.POST.get('formcarsep')
                formtipo = request.POST.get('formtipo')
                formcampsel = request.POST.get('formcampsel')

                msg = "Formato modificado exitosamente."
                
                try:
                    formato = Formatoarchivo.objects.get(idformato=formid)
                except Formatoarchivo.DoesNotExist:
                    msg = "No se encontro el formato especificado, asegurese de hacer click en el formato de archivo a modificar." 
                    return JsonResponse({'msg': msg, 'formid': formid, 'modif': False})
 
                formato.nombre = formnom
                formato.separador = formcarsep
                formato.tipo = formtipo
                formato.formato = formcampsel
                formato.save()
                return JsonResponse({'msg': msg, 'formid': formid, "formnom":formnom, "formcarsep":formcarsep, "formtipo": formtipo, "formcampsel": formcampsel,'modif': True})


    if request.method == 'GET':

        if tipo == "sis":
            template = "matcher/conf_sistema.html"
            empresa = Empresa.objects.all()
            conf = Configuracion.objects.all()

            idioma = Configuracion.objects.all()[0].idioma    
            context = {'idioma':idioma, 'empresa': empresa[0], 'conf': conf[0], 'ops':get_ops(request),'ldap':get_ldap(request)}
            return render(request, template, context)

        if tipo == "arc":
            template = "matcher/conf_archivo.html"
            campos_disp = ['Nro. Cuenta *','Nro. Estado de Cuenta','Moneda', 'Fecha *','Credito/Débito Partida', 'Monto *', 'Tipo Transacción *', 'Ref. Nostro', 'Ref. Vostro', 'Detalle', 'Saldo *', 'Credito/Débito Saldo']
            archivos = Formatoarchivo.objects.all()
            cuentas = Cuenta.objects.all()
            # ARREGLAR
            if request.method == 'POST':
                form = request.POST
                print (form)

            idioma = Configuracion.objects.all()[0].idioma    
            context = {'idioma':idioma, 'archivos':archivos, 'cuentas':cuentas, 'campos_disp':campos_disp, 'ops':get_ops(request),'ldap':get_ldap(request)}
            return render(request, template, context)
        
        # ninguna, deberia raise 404
        return render(request, "matcher/index.html", {})


@login_required(login_url='/login')
def seg_Usuarios(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 5 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == "POST":
        actn = request.POST.get('action')

        if actn == 'desb':
            sessid = request.POST.get('sessid')
            msg = "Usuario desbloqueado exitosamente."
            try:
                sesion = Sesion.objects.filter(idsesion=sessid)[0]
                sesion.estado = "Activo"
                sesion.save()
            except:
                msg = "No se encontro la sesion especificada, asegurese de hacer click en el usuario desbloquear."
                return JsonResponse({'msg': msg, 'desb': False})

            return JsonResponse({'msg': msg, 'sessid':sessid, 'desb': True})

        if actn == 'sel':
            usrid = int(request.POST.get('usrid'))
            cuentasT = UsuarioCuenta.objects.all()
            cuentas = [cuenta for cuenta in cuentasT if cuenta.usuario_idusuario.idusuario == usrid]

            res_json = serializers.serialize('json', cuentas)
        
            return JsonResponse(res_json, safe=False)

        if actn == "pwd":
            msg = "Contraseña modificada exitosamente."
            pwd = request.POST.get('newpass')
            sessid = request.POST.get('sessid')
            newp = make_password(pwd, hasher='pbkdf2_sha1')
            x, x, salt, hashp = newp.split("$")
            try:
                sesion = Sesion.objects.filter(pk=sessid)[0]
                sesion.salt = salt
                sesion.pass_field = hashp
                sesion.save()
            except:
                msg = "No se pudo encontrar el usuario especificado."
                return JsonResponse({'msg': msg, 'pwd': False})

            user = User.objects.get(username=sesion.login)
            user.password = newp
            user.save()

            update_session_auth_hash(request, user)

            return JsonResponse({'msg': msg, 'pwd': True})

        if actn == "del":
            msg = "Usuario eliminado exitosamente."
            sessid = request.POST.get('sessid')

            try:
                sesion = Sesion.objects.filter(idsesion=sessid)
            except Sesion.DoesNotExist:
                msg = "No se encontro la sesion especificada, asegurese de hacer click en el usuario a eliminar."
                return JsonResponse({'msg': msg, 'usrid': usrid, 'elim': False})

            django_usr = User.objects.get(username=sesion[0].login)
            django_usr.delete()

            # Para el log
            log(request,15,sesion[0].login)

            # Se borra el usuario
            user = sesion[0].usuario_idusuario
            user.delete()

            
            return JsonResponse({'msg': msg, 'sessid': sessid, 'elim': True})

        if actn == "add":
            usrnom = request.POST.get('usrnom')
            usrapell = request.POST.get('usrapell')
            usrci = request.POST.get('usrci')
            usrtlf = request.POST.get('usrtlf')
            usrmail = request.POST.get('usrmail')
            usrdir = request.POST.get('usrdir')
            usrperf = request.POST.get('usrperf')
            usrobs = request.POST.get('usrobs')
            usrctas = request.POST.getlist('usrctas[]')
            usrlogin = request.POST.get('usrlogin')
            usrpwd = request.POST.get('usrpwd')
            usrldap = request.POST.get('usrldap')
            msg = "Usuario creado exitosamente."

            # Obtener cuentas asignadas
            cuentas_asig =[cta.split('-')[1] for cta in usrctas]

            # Buscar empresa y perfil asignados
            empresa = Empresa.objects.all()[0]
            perfil = Perfil.objects.filter(pk=usrperf)[0]

            # Hash password
            newp = make_password(usrpwd, hasher='pbkdf2_sha1')
            x, x, salt, hashp = newp.split("$")

            # Crear usuario
            try:
                usuario = Usuario.objects.create(empresa_id_empresa=empresa, perfil_idperfil=perfil, nombres=usrnom, apellidos=usrapell, ci=usrci)
                usuario.direccion = usrdir
                usuario.telefono = usrtlf
                usuario.mail = usrmail
                usuario.observaciones = usrobs
                usuario.save()
            except:
                msg = "No se pudo crear el usuario especificado."
                return JsonResponse({'msg': msg, 'usrid': usuario.idusuario, 'add': False})

            # Crear sesion
            if usrldap == "0":
                estadoAux = "Pendiente"
            else:
                estadoAux = "Activo"
            sesion, creado = Sesion.objects.get_or_create(login=usrlogin, defaults={'usuario_idusuario':usuario, 'estado':estadoAux, 'fecha_registro':timenow(), 'conexion':0, 'ldap':usrldap, 'salt':salt, 'pass_field':hashp})
            if not creado:
                msg = "No se pudo crear el usuario especificado, debido a que ese login ya existe para otro usuario."
                usuario.delete()
                return JsonResponse({'msg': msg, 'add': False})

            # Crear relacion usuario cuentas
            for cuenta in cuentas_asig:
                try:
                    cuenta = Cuenta.objects.filter(pk=cuenta)[0]
                    UsuarioCuenta.objects.create(usuario_idusuario=usuario, cuenta_idcuenta=cuenta)
                except:
                    msg = "No se pudo crear el usuario con las cuentas especificadas."
                    return JsonResponse({'msg': msg, 'add': False})

            user, created = User.objects.get_or_create(username=usrlogin, defaults={'password':newp})

            # Para el log
            log(request,13,usrlogin)

            return JsonResponse({'msg': msg, 'sessid':sesion.pk , 'usrid': usuario.idusuario, 'usrnom':usrnom, 'usrapell':usrapell, 'usrci':usrci, 'usrtlf':usrtlf, 'usrmail':usrmail, 'usrdir':usrdir, 'usrperf':usrperf, 'usrobs':usrobs, 'usrlogin':usrlogin, 'usrldap':usrldap, 'add': True})

        if actn == "upd":
            ops = get_ops(request) # Obtener opciones permitidas al usuario

            sessid = request.POST.get('sessid')
            usrnom = request.POST.get('usrnom')
            usrapell = request.POST.get('usrapell')
            usrci = request.POST.get('usrci')
            usrtlf = request.POST.get('usrtlf')
            usrmail = request.POST.get('usrmail')
            usrdir = request.POST.get('usrdir')
            usrperf = request.POST.get('usrperf')
            usrobs = request.POST.get('usrobs')
            usrctas = request.POST.getlist('usrctas[]')
            usrldap = request.POST.get('usrldap')
            msg = "Usuario modificado exitosamente."

            # Obtener cuentas asignadas
            cuentas_asig =[cta.split('-')[1] for cta in usrctas]

            try:
                # Buscar sesion
                sesion = Sesion.objects.filter(pk=sessid)[0]
                # Buscar usuario
                usuario = Usuario.objects.filter(pk=sesion.usuario_idusuario.idusuario)[0]
                # Buscar perfil asignados
                perfil = Perfil.objects.filter(pk=usrperf)[0]
            except:
                msg = "No se pudo modificar el usuario especificado."
                return JsonResponse({'msg': msg, 'modif': False})

            # Chequear si el usuario posee permiso para modificar los datos
            if 14 in ops:
                # modificar usuario
                usuario.ci = usrci
                usuario.perfil_idperfil = perfil
                usuario.nombres = usrnom
                usuario.apellidos = usrapell
                usuario.direccion = usrdir
                usuario.telefono = usrtlf
                usuario.mail = usrmail
                usuario.observaciones = usrobs
                usuario.save()

                # Guardar el checkbox de ldap, en caso de haberse cambiado
                sesion.ldap = usrldap
                sesion.save()

            # Chequear si el usuario posee permiso para modificar cuentas
            if 32 in ops:
                # Buscar cuentas asignadas al usuario y borrarlas
                cuentas_old = UsuarioCuenta.objects.filter(usuario_idusuario=usuario)
                for cuenta in cuentas_old:
                    cuenta.delete()

                # Crear relacion usuario cuentas nuevas
                for cuenta in cuentas_asig:
                    try:
                        cuenta = Cuenta.objects.filter(pk=cuenta)[0]
                        UsuarioCuenta.objects.create(usuario_idusuario=usuario, cuenta_idcuenta=cuenta)
                    except:
                        msg = "No se pudo crear el usuario con las cuentas especificadas."
                        return JsonResponse({'msg': msg, 'modif': False})

            # Para el log
            log(request,14,sesion.login)


            return JsonResponse({'msg': msg, 'sessid':sesion.pk , 'usrid': usuario.idusuario, 'usrnom':usrnom, 'usrapell':usrapell, 'usrci':usrci, 'usrtlf':usrtlf, 'usrmail':usrmail, 'usrdir':usrdir, 'usrperf':usrperf, 'usrobs':usrobs, 'usrlogin':sesion.login, 'usrldap':usrldap, 'usrestado':sesion.estado, 'modif': True})

    if request.method == "GET":
        exlcuir0 = Perfil.objects.filter(nombre="SysAdmin")[0]
        excluir = Usuario.objects.filter(perfil_idperfil= exlcuir0.idperfil)[0]
        sesion_list = Sesion.objects.exclude(usuario_idusuario = excluir.idusuario)
        perfiles = Perfil.objects.exclude(nombre="SysAdmin").order_by('nombre')
        cuentas = Cuenta.objects.all().order_by('codigo')
        # filtrar por usuario
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'sesiones': sesion_list, 'perfiles':perfiles, 'cuentas':cuentas, 'ops':get_ops(request),'ldap':get_ldap(request)}
        template = "matcher/seg_Usuarios.html"

        return render(request, template, context)

@login_required(login_url='/login')
def seg_Perfiles(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 6 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == "POST":
        actn = request.POST.get('action')
        
        if actn == 'sel':
            perfid = int(request.POST.get('perfid'))
            perfil_funcs = PerfilOpcion.objects.filter(perfil_idperfil=perfid)
            funciones = [opcion for opcion in perfil_funcs]
            res_json = serializers.serialize('json', funciones)
        
            return JsonResponse(res_json, safe=False)

        if actn == "del":
            msg = "Perfil eliminado exitosamente."
            perfid = request.POST.get('perfid')

            try:
                perfil = Perfil.objects.get(idperfil=perfid)
            except Perfil.DoesNotExist:
                msg = "No se encontro el perfil especificado, asegurese de hacer click en el perfil a eliminar."
                return JsonResponse({'msg': msg, 'perfid': perfid, 'elim': False})

            #Para el log
            log(request,18,perfil.nombre)

            perfil.delete()
            return JsonResponse({'msg': msg, 'perfid': perfid, 'elim': True})

        if actn == "add":
            msg = "Perfil agregado exitosamente."
            perfnom = request.POST.get('perfNom')
            funcs = request.POST.getlist('perfFuncs[]')

            try:
                perfil = Perfil.objects.create(nombre=perfnom)
                for functid in funcs:
                    opcion = Opcion.objects.get(idopcion=functid)
                    PerfilOpcion.objects.create(opcion_idopcion=opcion, perfil_idperfil=perfil)
            except:
                msg = "No se pudo crear el perfil especificado."
                return JsonResponse({'msg': msg, 'add': False})

            #Para el log
            log(request,16,perfil.nombre)

            return JsonResponse({'msg': msg, 'perfid': perfil.pk, 'perfnom':perfnom, 'add': True})

        if actn == "upd":
            msg = "Perfil modificado exitosamente."
            perfid = request.POST.get('perfid')
            perfnom = request.POST.get('perfNom')
            funcs = request.POST.getlist('perfFuncs[]')
            funcs = list(set(funcs))
            funcs.sort()
            
            try:
                perfil = Perfil.objects.get(idperfil=perfid)
               
                #Borrar opciones anteriores
                opciones = PerfilOpcion.objects.filter(perfil_idperfil=perfil).delete()

                #Crear las nuevas
                for functid in funcs:
                    opcion = Opcion.objects.get(idopcion=functid)
                    PerfilOpcion.objects.create(opcion_idopcion=opcion, perfil_idperfil=perfil)

                #Cambiar el nombre
                perfil.nombre = perfnom
                perfil.save()

            except:
                msg = "No se pudo modificar el perfil especificado."
                return JsonResponse({'msg': msg, 'modif': False})

            #Para el log
            log(request,17,perfil.nombre)

            return JsonResponse({'msg': msg, 'perfid': perfil.pk, 'perfnom':perfnom, 'modif': True})

    if request.method == "GET":
        modExc = Modulos.objects.filter(activo=0)
        sub_index2 = [mod.opcion for mod in modExc]
        sub_index = [2,3,4,5,10,15]

        perfiles = Perfil.objects.exclude(nombre="SysAdmin").order_by('nombre')

        opciones = Opcion.objects.exclude(funprincipal__in=sub_index2).exclude(funprincipal__in=sub_index).order_by('nombre')
        nosub = [opcion.nombre for opcion in opciones]
        nosubid = [str(opcion.idopcion) for opcion in opciones]

        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'perfiles': perfiles, 'opciones':opciones, 'nosub':nosub, 'nosubid':nosubid, 'ops':get_ops(request), 'subindex':sub_index2,'ldap':get_ldap(request)}
        template = "matcher/seg_Perfiles.html"

        return render(request, template, context)

@login_required(login_url='/login')
def seg_Logs(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 7 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == "POST":
        desde = request.POST.get('desde')
        hasta = request.POST.get('hasta')
        horas = request.POST.get('horas')
        usr = request.POST.get('usr')
        evento = int(request.POST.get('evento'))

        if horas=="0":
            #Busqueda por horas desactivada
            fechad = datetime.strptime(desde, '%d/%m/%Y')
            fechah = datetime.strptime(hasta, '%d/%m/%Y') + timedelta(days=1)
        else:
            #Busqueda por horas activada
            fechad = datetime.strptime(desde, '%d/%m/%Y-%I:%M %p')
            fechah = datetime.strptime(hasta, '%d/%m/%Y-%I:%M %p')

        trazas = Traza.objects.filter(fecha_hora__gte=fechad, fecha_hora__lte=fechah)

        # Si se selecciono un evento
        if evento > 0:
            ev = Evento.objects.get(pk=evento)
            trazas = trazas.filter(evento_idevento=ev)


        # Sacar un arreglo del nombre del usuario
        usr_split = usr.split(", ")

        # Si el arreglo tiene tamaño 2 (mayor que 1)
        if (len(usr_split)>1):
            usr = usr_split[1]+" "+usr_split[0]
            trazas = trazas.filter(usuario=usr)


        res_json = serializers.serialize('json', trazas)
        
        return JsonResponse(res_json, safe=False)

    if request.method == "GET":
        eventos = Evento.objects.all()
        exc = Perfil.objects.get(nombre = "SysAdmin")
        usuarios = Usuario.objects.exclude(perfil_idperfil = exc)
        eventos_acc = [evento.accion for evento in eventos]
        fecha_hoy = ("/").join(str(timenow().date()).split("-")[::-1])
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'eventos':eventos, 'usuarios':usuarios, 'eventos_acc':eventos_acc, 'fecha_hoy':fecha_hoy, 'ops':get_ops(request),'ldap':get_ldap(request)}
        template = "matcher/seg_Logs.html"

        return render(request, template, context)


@login_required(login_url='/login')
def seg_backupRestore(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 13 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == "POST":
        actn = request.POST.get("action")

        # https://djangosnippets.org/snippets/118/
        # http://django-mssql.readthedocs.org/en/latest/usage.html

        if actn == "fecha":
            # Recibe el codigo de la cuenta
            cod = request.POST.get("cuentacod")

            try:
                cta = CuentaBk.objects.filter(codigo=cod)[0]
                fcons = cta.ultimafechaconciliacion
                fhist = cta.ultimafechahistorico
            except:
                cta = None
                fcons = None
                fhist = None

            return JsonResponse({'fcons':fcons, 'fhist':fhist})

        if actn == "res":
            # Recibe el codigo de la cuenta
            cuenta = request.POST.get("cuentacod")
            msg = "Cuenta restaurada exitosamente."

            cursor = connection.cursor()
            try:
                cursor.execute('EXEC [dbo].[restoreMatcher] %s', (cuenta,))
            finally:
                cursor.close()

            #Para el log
            log(request,20,cuenta)

            return JsonResponse({'msg': msg,'restored': True})

        if actn == "bkUp":
            # No recibe nada
            msg = "Backup realizado exitosamente."

            cursor = connection.cursor()
            try:
                cursor.execute('EXEC [dbo].[backupMatcher]')
            finally:
                cursor.close()

            #Para el log
            log(request,19)

            return JsonResponse({'msg': msg,'bkUp': True})

    if request.method == "GET":
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas': get_cuentas(request), 'ops':get_ops(request),'ldap':get_ldap(request)}
        template = "matcher/seg_backupRestore.html"

        return render(request, template, context)

@login_required(login_url='/login')
def admin_bancos(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 8 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        actn = request.POST.get('action')
        idioma = Configuracion.objects.all()[0].idioma

        if actn == 'add':
            bancocod = request.POST.get('bancocod').upper()
            banconom = request.POST.get('banconom')

            if idioma == 0:
                msg = "Banco agregado exitosamente."
            else:
                msg = "Successful aggregated bank."

            banco, creado = BancoCorresponsal.objects.get_or_create(codigo=bancocod, defaults={'nombre':banconom})
            
            if creado:
                log(request,30,bancocod)
            else:
                if idioma == 0:
                    msg = "Ese banco ya existe en la Base de datos."
                else:
                    msg = "Bank already exist in data base."

            return JsonResponse({'msg': msg, 'bancoid': banco.idbanco, 'bancon': banco.nombre, 'bancoc': banco.codigo, 'creado': creado})

        elif actn == 'upd':
            bancoid = request.POST.get('bancoid')
            bancocod = request.POST.get('bancocod').upper()
            banconom = request.POST.get('banconom')
            if idioma == 0:
                msg = "Banco modificado exitosamente."
            else:
                msg = "Successful modified bank."
            try:
                banco = BancoCorresponsal.objects.get(idbanco=bancoid)
            except BancoCorresponsal.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro el banco especificado, asegurese de hacer click en el banco a modificar."
                else:
                    msg = "Bank not found, be sure to click a bank."
                
                return JsonResponse({'msg': msg, 'bancoid': bancoid, 'modif': False})

            bancoaux = BancoCorresponsal.objects.filter(codigo=bancocod)
            if (len(bancoaux)>0 and (bancoaux[0].idbanco != banco.idbanco)):
                if idioma == 0:
                    msg = "Ya existe un banco con ese codigo en la base de datos."
                else:
                    msg = "There is already a bank in the data base with this code."
                
                return JsonResponse({'msg': msg, 'bancoid': bancoaux[0].idbanco, 'bancon':bancoaux[0].nombre , 'bancoc':bancoaux[0].codigo, 'modif': False})
            
            banco.codigo = bancocod
            banco.nombre = banconom
            banco.save()

            #Para el log
            log(request,31,banco.codigo)

            return JsonResponse({'msg': msg, 'bancoid': bancoid, 'bancon':banconom , 'bancoc':bancocod,'modif': True})

        elif actn == 'del':

            if idioma == 0:
                msg = "Banco eliminado exitosamente."
            else:
                msg = "Successful deleted bank."
            
            bancoid = request.POST.get('bancoid')

            try:
                banco = BancoCorresponsal.objects.get(idbanco=bancoid)
            except BancoCorresponsal.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro el banco especificado, asegurese de hacer click en el banco a eliminar."
                else:
                    msg = "Bank not found, be sure to click a bank."
                 
                return JsonResponse({'msg': msg, 'bancoid': bancoid, 'elim': False})

            #Para el log
            log(request,32,banco.codigo)

            banco.delete()
            return JsonResponse({'msg': msg, 'bancoid': bancoid, 'elim': True})

    if request.method == 'GET':
        bancos = BancoCorresponsal.objects.all()

        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'bancos': bancos, 'ops':get_ops(request),'ldap':get_ldap(request)}
        template = "matcher/admin_bancos.html"

        return render(request, template, context)

@login_required(login_url='/login')
def admin_monedas(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 9 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        actn = request.POST.get('action')
        idioma = Configuracion.objects.all()[0].idioma 

        if actn == 'add':
            monedacod = request.POST.get('moncod').upper()
            monedanom = request.POST.get('monnom')
            monedacam = float(request.POST.get('moncam'))
            moneda, creado = Moneda.objects.get_or_create(codigo=monedacod, defaults={'nombre':monedanom, 'cambio_usd':monedacam})

            if creado:
                #Para el log
                log(request,33,monedacod)

            return JsonResponse({'monedaid': moneda.idmoneda, 'monnom': moneda.nombre, 'moncod': moneda.codigo, 'moncam':moneda.cambio_usd, 'creado': creado})
        
        elif actn == 'upd':
            monedaid = request.POST.get('monedaid')
            monedacod = request.POST.get('monedacod').upper()
            monedanom = request.POST.get('monedanom')
            monedacam = float(request.POST.get('monedacam'))

            if idioma == 0:
                msg = "Moneda modificada exitosamente."
            else:
                msg = "Successful modified currency."

            try:
                moneda = Moneda.objects.get(idmoneda=monedaid)
            except Moneda.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro la moneda especificada, asegurese de hacer click en la moneda a modificar."
                else:
                    msg = "Currency not found, be sure to click a currency first."
                
                return JsonResponse({'msg': msg, 'monedaid': monedaid, 'modif': False})

            monedaaux = Moneda.objects.filter(codigo=monedacod)
            if (len(monedaaux)>0 and (monedaaux[0].idmoneda != moneda.idmoneda)):
                if idioma == 0:
                    msg = "Ya existe una moneda con ese codigo en la base de datos."
                else:
                    msg = "There is already a currency with that code in the data base."
                
                return JsonResponse({'msg': msg, 'monedaid': monedaaux[0].idmoneda, 'monnom':monedaaux[0].nombre , 'moncod':monedaaux[0].codigo, 'moncam':monedaaux[0].cambio_usd,'modif': False})
            
            moneda.codigo = monedacod
            moneda.nombre = monedanom
            moneda.cambio_usd = monedacam
            moneda.save()

            #Para el log
            log(request,34,moneda.codigo)

            return JsonResponse({'msg': msg, 'monedaid': monedaid, 'monnom':monedanom , 'moncod':monedacod, 'moncam':monedacam,'modif': True})

        elif actn == 'del':

            if idioma == 0:
                msg = "Moneda eliminada exitosamente."
            else:
                msg = "Successful deleted currency."

            monedaid = request.POST.get('monedaid')

            try:
                moneda = Moneda.objects.get(idmoneda=monedaid)
            except Moneda.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro la moneda especificada, asegurese de hacer click en la moneda a eliminar previamente."
                else:
                    msg = "Currency not found, be sure to click a currency first."
                
                return JsonResponse({'msg': msg, 'monedaid': monedaid, 'elim': False})

            #Para el log
            log(request,35,moneda.codigo)

            moneda.delete()
            return JsonResponse({'msg': msg, 'monedaid': monedaid, 'elim': True})

    if request.method == 'GET':
        template = "matcher/admin_monedas.html"
        monedas = Moneda.objects.all()

        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'monedas': monedas, 'ops':get_ops(request),'ldap':get_ldap(request)}
        return render(request, template, context)

@login_required(login_url='/login')
def admin_cuentas(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 10 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        actn = request.POST.get('action')
        idioma = Configuracion.objects.all()[0].idioma 

        if actn == 'encaje_S':
            cuentaid = int(request.POST.get('cuentaid'))
            encajes = Encajelegal.objects.all()
            encajeC = [encaje for encaje in encajes if encaje.cuenta_idcuenta.idcuenta == cuentaid]

            res_json = serializers.serialize('json', encajeC)
        
            return JsonResponse(res_json, safe=False)

        if actn == 'encaje_add':
            if idioma == 0:
                msg="Encaje agregado exitosamente."
            else:
                msg="Successful aggregated cash."
            cuentaid = int(request.POST.get('cuentaid'))
            monto = request.POST.get('monto')
            fechapost = request.POST.get('fecha')
            fecha = datetime.strptime(fechapost, '%d/%m/%Y')
            cuenta = Cuenta.objects.get(pk=cuentaid)
            encaje = Encajelegal.objects.create(cuenta_idcuenta=cuenta, monto=monto, fecha=fecha)

            cuenta.montoencajeactual = monto
            cuenta.fechaencajeactual = fecha
            cuenta.save()

            # Para el log
            log(request,38)

            return JsonResponse({'msg':msg, 'encajeid':encaje.pk, 'monto':monto, 'fecha':fechapost, 'add':True})


        if actn == 'add':
            criterioid = request.POST.get('criterioid')
            codigo = request.POST.get('ctacod').upper()
            bancoid = request.POST.get('bancoid')
            monedaid = request.POST.get('monedaid')
            ref_nostro = request.POST.get('ref_nostro')
            ref_vostro = request.POST.get('ref_vostro')
            desc = request.POST.get('desc')
            estado = request.POST.get('estado')
            tretencion = request.POST.get('tretencion')
            nsaltos = request.POST.get('nsaltos')
            tgiro = request.POST.get('tgiro')
            intraday = request.POST.get('intraday')
            mailalertas = request.POST.get('amail')
            tipo_cta = request.POST.get('tipocta')
            tcargcont = request.POST.get('tcargcont')
            tcargcorr = request.POST.get('tcargcorr')
            tproc = request.POST.get('tproc')
            alertas = request.POST.getlist('alertas[]')

            try:
                criterio = CriteriosMatch.objects.get(pk=criterioid)
            except CriteriosMatch.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro el criterio especificado."
                else:
                    msg = "Criteria not found."
                
                return JsonResponse({'msg': msg, 'add': False})

            try:
                banco = BancoCorresponsal.objects.get(pk=bancoid)
            except BancoCorresponsal.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro el banco especificado."
                else:
                    msg = "Bank not found."
                return JsonResponse({'msg': msg, 'add': False})

            try:
                moneda = Moneda.objects.get(pk=monedaid)
            except Moneda.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro la moneda especificada."
                else:
                    msg = "Currency not found."
                
                return JsonResponse({'msg': msg, 'add': False})

            cuenta, creado = Cuenta.objects.get_or_create(codigo=codigo, defaults={'criterios_match_idcriterio':criterio, 'banco_corresponsal_idbanco': banco, 'moneda_idmoneda':moneda, 'ref_nostro':ref_nostro, 'ref_vostro':ref_vostro, 'descripcion':desc, 'estado':estado, 'tiempo_retension':tretencion, 'num_saltos':nsaltos, 'transaccion_giro':tgiro, 'intraday':intraday, 'correo_alertas':mailalertas, 'tipo_cta':tipo_cta, 'tipo_cargacont':tcargcont, 'tipo_carga_corr':tcargcorr, 'tipo_proceso':tproc})
            
            if not creado:
                if idioma == 0:
                    msg = "Ya existe un banco con ese codigo en la base de datos."
                else:
                    msg = "There ir alredy a bank in the data base with the introduced code."
                
                return JsonResponse({'msg': msg, 'add': False}) 

            #Se crean las alertas seleccionadas
            if alertas:
                for elem in alertas:
                    alertaval = elem.split(',')
                    alertacod = alertaval[0]

                    alerta = Alertas.objects.get(idalertas=alertacod)
                    valor = int(alertaval[1])

                    AlertasCuenta.objects.create(alertas_idalertas=alerta,cuenta_idcuenta=cuenta,valor=valor)

            if idioma == 0:
                msg = "Cuenta creada satisfactoriamente."
            else:
                msg = "Successful created account."
            
            #Para el log
            log(request,21,codigo)
            return JsonResponse({'msg':msg, 'cuentaid':cuenta.pk ,'criterioid':criterioid, 'criterionom':criterio.nombre,'codigo':codigo, 'bancoid':bancoid, 'bancocod':banco.codigo ,'monedaid':monedaid, 'monedacod':moneda.codigo ,'ref_nostro':ref_nostro, 'ref_vostro':ref_vostro, 'desc':desc, 'estado':estado, 'tretencion':tretencion, 'nsaltos':nsaltos,'tgiro':tgiro,'intraday':intraday,'mailalertas':mailalertas,'tipo_cta':tipo_cta,'tcargcont':tcargcont,'tcargcorr':tcargcorr,'tproc':tproc, 'add': True})

        if actn == 'del':
            cuentaid = int(request.POST.get('cuentaid'))
            if idioma == 0:
                msg = "Cuenta eliminada exitosamente."
            else:
                msg = "Successful deleted account."
            
            cuenta = Cuenta.objects.get(pk=cuentaid)
            #Para el log
            log(request,23,cuenta.codigo)            

            cuenta.delete()
            return JsonResponse({'msg': msg, 'cuentaid': cuentaid, 'elim': True})

        if actn == 'upd':

            ops = get_ops(request) # Obtener opciones permitidas

            cuentaid = request.POST.get('cuentaid')
            criterioid = request.POST.get('criterioid')
            codigo = request.POST.get('ctacod')
            bancoid = request.POST.get('bancoid')
            monedaid = request.POST.get('monedaid')
            ref_nostro = request.POST.get('ref_nostro')
            ref_vostro = request.POST.get('ref_vostro')
            desc = request.POST.get('desc')
            estado = request.POST.get('estado')
            tretencion = request.POST.get('tretencion')
            nsaltos = request.POST.get('nsaltos')
            tgiro = request.POST.get('tgiro')
            intraday = request.POST.get('intraday')
            mailalertas = request.POST.get('amail')
            tipo_cta = request.POST.get('tipocta')
            tcargcont = request.POST.get('tcargcont')
            tcargcorr = request.POST.get('tcargcorr')
            tproc = request.POST.get('tproc')
            alertas = request.POST.getlist('alertas[]')

            try:
                cuentaobj = Cuenta.objects.filter(pk=cuentaid)
                cuenta = cuentaobj[0]
            except Cuenta.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro la cuenta especificada."
                else:
                    msg = "Account not found."
                
                return JsonResponse({'msg': msg, 'modif': False})

            # Obtener criterio para asignar a la cuenta
            if (cuenta.criterios_match_idcriterio.idcriterio != criterioid):
                try:
                    criterio = CriteriosMatch.objects.get(pk=criterioid)
                except CriteriosMatch.DoesNotExist:
                    if idioma == 0:
                        msg = "No se encontro el criterio especificado."
                    else:
                        msg = "Criteria not found."
                    
                    return JsonResponse({'msg': msg, 'modif': False})

            # Checkeo si el usuario tiene permitida la opcion de modif criterio
            if 23 in ops:
                cuenta.criterios_match_idcriterio = criterio


            # Datos Generales
            #################
            # Checkeo si el usuario tiene permitida la opcion de modif param generales
            if 6 in ops:
                # Obtener banco para asignar a la cuenta
                if (cuenta.banco_corresponsal_idbanco.idbanco!=bancoid):
                    try:
                        banco = BancoCorresponsal.objects.get(pk=bancoid)
                    except CriteriosMatch.DoesNotExist:
                        if idioma == 0:
                            msg = "No se encontro el banco especificado."
                        else:
                            msg = "Bank not found."
                        
                        return JsonResponse({'msg': msg, 'modif': False})

                    cuenta.banco_corresponsal_idbanco = banco

                # Obtener moneda para asignar a la cuenta
                if (cuenta.moneda_idmoneda.idmoneda!=monedaid):
                    try:
                        moneda = Moneda.objects.get(pk=monedaid)
                    except Moneda.DoesNotExist:
                        if idioma == 0:
                            msg = "No se encontro la moneda especificada."
                        else:
                            msg = "Currency not found."

                        return JsonResponse({'msg': msg, 'modif': False})

                    cuenta.moneda_idmoneda = moneda

                cuenta.codigo = codigo
                cuenta.ref_nostro = ref_nostro
                cuenta.ref_vostro = ref_vostro
                cuenta.descripcion = desc

                # Pestaña Formatos y procesos
                #############################
                cuenta.correo_alertas = mailalertas
                cuenta.tipo_cta = tipo_cta
                cuenta.tipo_cargacont = tcargcont
                cuenta.tipo_carga_corr = tcargcorr
                cuenta.tipo_proceso = tproc
            
                # Pestaña Parametros
                ####################
                cuenta.estado = estado
                cuenta.tiempo_retension = tretencion
                cuenta.num_saltos = nsaltos
                cuenta.transaccion_giro = tgiro
                cuenta.intraday = intraday


            cuenta.save()

            # Checkeo si el usuario tiene permitida la opcion de modif alertas
            if 12 in ops:
                #Se eliminan las alertas que existian anteriormente
                alertasExist = AlertasCuenta.objects.filter(cuenta_idcuenta=cuenta)
                [alerta.delete() for alerta in alertasExist]

                #Se crean las alertas seleccionadas
                if alertas:
                    for elem in alertas:
                        alertaval = elem.split(',')
                        alertacod = alertaval[0]

                        alerta = Alertas.objects.get(idalertas=alertacod)
                        valor = int(alertaval[1])

                        AlertasCuenta.objects.create(alertas_idalertas=alerta,cuenta_idcuenta=cuenta,valor=valor)

            if idioma == 0:
                msg = "Cuenta modificada satisfactoriamente."
            else:
                msg = "Successful modified account."

            #Para el log
            log(request,22,cuenta.codigo)

            return JsonResponse({'msg':msg, 'cuentaid':cuenta.pk ,'criterioid':criterioid, 'criterionom':criterio.nombre,'codigo':codigo, 'bancoid':bancoid, 'bancocod':banco.codigo ,'monedaid':monedaid, 'monedacod':moneda.codigo ,'ref_nostro':ref_nostro, 'ref_vostro':ref_vostro, 'desc':desc, 'estado':estado, 'tretencion':tretencion, 'nsaltos':nsaltos,'tgiro':tgiro,'intraday':intraday,'mailalertas':mailalertas,'tipo_cta':tipo_cta,'tcargcont':tcargcont,'tcargcorr':tcargcorr,'tproc':tproc, 'modif': True})


    if request.method == 'GET':
        cuentas = get_cuentas(request)
        bancos = BancoCorresponsal.objects.all().order_by('codigo')
        monedas = Moneda.objects.all().order_by('codigo')
        criterios = CriteriosMatch.objects.all().order_by('nombre')
        alertas = []

        for cuenta in cuentas:
            alertC = AlertasCuenta.objects.filter(cuenta_idcuenta=cuenta).select_related('alertas_idalertas')
            alertas.append([[alerta.alertas_idalertas.idalertas,alerta.valor] for alerta in alertC])

        template = "matcher/admin_cuentas.html"
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas':cuentas, 'bancos':bancos, 'monedas':monedas, 'alertas':alertas, 'criterios':criterios, 'ops':get_ops(request),'ldap':get_ldap(request)}
        return render(request, template, context)

@login_required(login_url='/login')
def admin_archive(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)

    if not 17 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)

    if request.method == 'GET':
        
        template = "matcher/admin_archive.html"
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'ops':get_ops(request),'ldap':get_ldap(request)}
        
        return render(request, template, context)
    
    if request.method == 'POST':
        
        idioma = Configuracion.objects.all()[0].idioma
        actn = request.POST.get('action')
        
        if actn == 'consultar':
            
            cuenta = request.POST.get('cuenta')
            fechaMinima = ""
            msg = ""
            
            consulta = Matchconfirmado.objects.filter(tc_corres__codigocuenta=cuenta).order_by('fecha')
            
            if (not consulta):
                exito = False
                if idioma == 0:
                    msg = "No existen Matches Confirmados para esta cuenta"
                else: 
                    msg = "There are not confirmed matches for the account"
            else:
                fechaMinima = consulta[0].fecha.strftime("%d/%m/%Y")
                exito = True

            return JsonResponse({'exito':exito,'cuenta':cuenta, 'msg':msg, 'fechaMinima':fechaMinima})

        if actn == 'buscarArchivos':

            cuenta = request.POST.get('cuenta')
            archivos = ""
            
            obj = Configuracion.objects.all()[0]
            directorio = obj.dirarchiveconfirmados +"\\"+ cuenta

            try:
                archivos = os.listdir(directorio)
            except OSError:
                os.makedirs(directorio)
                archivos = os.listdir(directorio)

            exito = True

            return JsonResponse({'exito':exito,'archivos':archivos})

        if actn == 'buscarEnArchivo':
           
            cuenta = request.POST.get('cuenta')
            archivo = request.POST.get('archivo')
            fechaIni = request.POST.get('fechaIni')
            fechaFin = request.POST.get('fechaFin')

            arregloMin = fechaIni.split('/')
            fechaMin = datetime(int(arregloMin[2]), int(arregloMin[1]), int(arregloMin[0]),0,0,0)
            
            arregloMax = fechaFin.split('/')
            fechaMax = datetime(int(arregloMax[2]), int(arregloMax[1]), int(arregloMax[0]),23,59,59)
            
            print(fechaMin)
            print(fechaMax)
            
            obj = Configuracion.objects.all()[0]
            directorio = obj.dirarchiveconfirmados +"\\"+ cuenta +"\\"
            dirArch = directorio + archivo
            
            #abrir archivo
            info = open(dirArch, 'r')

            lines = info.readlines()
            numLineas = len(lines)
            for i in range(0,numLineas):
                lines[i]=lines[i].strip()
            
            contador = 0
            numTrans = 0
            lineaError = 0

            arregloAux = []
            arregloTrans = []
            arregloCabecera = []
            arregloTotal = []

            transacciones = dict()
            transacciones['auto'] = [] 
            transacciones['manual'] = [] 
            transacciones['contabilidad'] = [] 
            transacciones['corresponsal'] = [] 

            automatico = False
            manual = False
            contabilidad = False
            corresponsal = False
            exito = False
            pertenece = False
            msg = ""
            
            infoLinea =lines[contador]
            
            if ( infoLinea == "***** Match Automatico *****"):
                contador += 1
                infoLinea =lines[contador]
                
                while(infoLinea != "***** Match Manual *****"):
                    
                    if (infoLinea == "@@"):
                        contador += 1
                        infoLinea= lines[contador]
                       
                    else:
                        arregloAux = infoLinea.split(";")
                        arregloCabecera.append(arregloAux)
                        contador += 1
                        infoLinea =lines[contador]
                        
                        while (infoLinea != "@@" and infoLinea != "***** Match Manual *****"):
                            arregloAux = infoLinea.split(";")
                            fechaPartida = arregloAux[2]
                            arregloPartida = fechaPartida.split('/')
                            fechaPartida = datetime(int(arregloPartida[2]), int(arregloPartida[1]), int(arregloPartida[0]),0,0,0)
                            
                            if(fechaPartida <= fechaMax and fechaPartida >= fechaMin and not pertenece):
                                pertenece = True

                            arregloTrans.append(arregloAux)
                            contador += 1
                            infoLinea =lines[contador]

                        if(pertenece):    
                            arregloTotal.append([arregloCabecera,arregloTrans])
                            pertenece = False

                        arregloTrans = []
                        arregloCabecera = []

                transacciones['auto'] = arregloTotal
                arregloAux = []
                arregloTrans = []
                arregloCabecera = [] 
                arregloTotal = []
                contador += 1
                infoLinea =lines[contador]
                
                while(infoLinea != "***** Reversos Contabilidad *****"):
                    
                    if (infoLinea == "@@"):
                        contador += 1
                        infoLinea= lines[contador]   
                    else:
                        arregloAux = infoLinea.split(";")
                        arregloCabecera.append(arregloAux)
                        contador += 1
                        infoLinea =lines[contador]
                        
                        while (infoLinea != "@@" and infoLinea != "***** Reversos Contabilidad *****"):
                            arregloAux = infoLinea.split(";")
                            fechaPartida = arregloAux[2]
                            arregloPartida = fechaPartida.split('/')
                            fechaPartida = datetime(int(arregloPartida[2]), int(arregloPartida[1]), int(arregloPartida[0]),0,0,0)
                            
                            if(fechaPartida <= fechaMax and fechaPartida >= fechaMin and not pertenece):
                                pertenece = True
                            arregloTrans.append(arregloAux)
                            contador += 1
                            infoLinea =lines[contador]
                           
                        if(pertenece):    
                            arregloTotal.append([arregloCabecera,arregloTrans])
                            pertenece = False

                        arregloTrans = []
                        arregloCabecera = []

                transacciones['manual'] = arregloTotal
                arregloAux = []
                arregloTrans = []
                arregloCabecera = [] 
                arregloTotal = []
                contador += 1
                infoLinea =lines[contador]
                
                while(infoLinea != "***** Reversos Corresponsal *****"):
                   
                    if (infoLinea == "@@"):
                        contador += 1
                        infoLinea= lines[contador] 
                    else:
                        arregloAux = infoLinea.split(";")
                        arregloCabecera.append(arregloAux)
                        contador += 1
                        infoLinea =lines[contador]
                       
                        while (infoLinea != "@@" and infoLinea != "***** Reversos Corresponsal *****"):
                            arregloAux = infoLinea.split(";")
                            fechaPartida = arregloAux[2]
                            arregloPartida = fechaPartida.split('/')
                            fechaPartida = datetime(int(arregloPartida[2]), int(arregloPartida[1]), int(arregloPartida[0]),0,0,0)
                            
                            if(fechaPartida <= fechaMax and fechaPartida >= fechaMin and not pertenece):
                                pertenece = True
                            arregloTrans.append(arregloAux)
                            contador += 1
                            infoLinea =lines[contador]
                            
                        if(pertenece):    
                            arregloTotal.append([arregloCabecera,arregloTrans])
                            pertenece = False
                        arregloTrans = []
                        arregloCabecera = []

                transacciones['contabilidad'] = arregloTotal
                arregloAux = []
                arregloTrans = []
                arregloCabecera = [] 
                arregloTotal = []

                if (contador < numLineas-1):
                    contador += 1
                    infoLinea =lines[contador]
                else: 
                    exito = True

                    return JsonResponse({'exito':exito,'msg':msg,'transacciones':transacciones})

                while(contador < numLineas-1):
                    
                    if (infoLinea == "@@"):
                        contador += 1
                        infoLinea= lines[contador]
                        
                    else:
                        arregloAux = infoLinea.split(";")
                        arregloCabecera.append(arregloAux)
                        contador += 1
                        infoLinea =lines[contador]
                        
                        while (infoLinea != "@@" and contador < numLineas-1):
                            arregloAux = infoLinea.split(";")
                            fechaPartida = arregloAux[2]
                            arregloPartida = fechaPartida.split('/')
                            fechaPartida = datetime(int(arregloPartida[2]), int(arregloPartida[1]), int(arregloPartida[0]),0,0,0)
                            
                            if(fechaPartida <= fechaMax and fechaPartida >= fechaMin and not pertenece):
                                pertenece = True

                            arregloTrans.append(arregloAux)
                            contador += 1
                            infoLinea =lines[contador]
                            
                        if(pertenece):    
                            arregloTotal.append([arregloCabecera,arregloTrans])
                            pertenece = False
                        arregloTrans = []
                        arregloCabecera = []

                transacciones['corresponsal'] = arregloTotal
                arregloAux = []
                arregloTrans = []
                arregloCabecera = [] 
                arregloTotal = []
                exito = True

                #cerrar archivo
                info.close()

                return JsonResponse({'exito':exito,'msg':msg,'transacciones':transacciones})

            else:
                #cerrar archivo
                info.close()

                exito = False
                if idioma == 0:
                    msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
                else:
                    msg = "Unexpected character, at the line " +str(contador+1)+ " of file " + archivo
                
                return JsonResponse({'exito':exito,'msg':msg})

        if actn == 'ejecutarArchive':

            rNostroConta = ""
            rVostroConta = ""
            detConta = ""
            rNostroCorr = ""
            rVostroCorr = ""
            detCorr = ""

            cuenta = request.POST.get('cuenta')
            fechaMinima = request.POST.get('fechaMinima')
            fechaMaxima = request.POST.get('fechaMaxima')

            arrD = fechaMinima.split('/')
            fechaMinArch = arrD[0] + arrD[1] + arrD[2]   

            arrH = fechaMaxima.split('/')
            fechaMaxArch = arrH[0] + arrH[1] + arrH[2]   

            obj = Configuracion.objects.all()[0]
            directorio = obj.dirarchiveconfirmados +"\\"+ cuenta +"\\"
            dirArch =directorio + "ArchMConf_" + fechaMinArch + "_" + fechaMaxArch + ".txt"
            
            #abrir archivo
            nuevoArch = open(dirArch, 'w')
            nuevoArch.write('***** Match Automatico *****\n')
            
            arregloMin = fechaMinima.split('/')
            fechaMin= datetime(int(arregloMin[2]), int(arregloMin[1]), int(arregloMin[0]))
            
            arregloMax = fechaMaxima.split('/')
            fechaMax= datetime(int(arregloMax[2]), int(arregloMax[1]), int(arregloMax[0]),23,59,59)
            
            matchesConf = Matchconfirmado.objects.filter(fecha__range=(fechaMin,fechaMax),auto_manual=0,tc_conta__codigocuenta=cuenta)
            
            #Escribimos en el archivo los Matches Automaticos
            for elem in matchesConf:

                nuevoArch.write('@@\n')
            
                fecha = datetime.strftime(elem.fecha, '%d/%m/%Y')
                linea1 = fecha + ";" + elem.codigomatch + "\n"

                nuevoArch.write(linea1)

                a = elem.tc_conta

                if (a.referencianostro == None):
                    rNostroConta = "null"
                else:
                    rNostroConta = a.referencianostro 
                if (a.referenciacorresponsal == None):
                    rVostroConta = "null"
                else:
                    rVostroConta = a.referenciacorresponsal
                if (a.descripcion == None):
                    detConta = "null"
                else: 
                    detConta = a.descripcion

                fechaT = datetime.strftime(a.fecha, '%d/%m/%Y')
                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";L\n"
                
                nuevoArch.write(linea2)

                b = elem.tc_corres

                if (b.referencianostro == None):
                    rNostroCorr = "null"
                else:
                    rNostroCorr = b.referencianostro
                if (b.referenciacorresponsal == None):
                    rVostroCorr = "null"
                else:
                    rVostroCorr = b.referenciacorresponsal
                if (b.descripcion == None):
                    detCorr = "null"
                else:
                    detCorr = b.descripcion

                fechaT = datetime.strftime(b.fecha_valor, '%d/%m/%Y')
                linea3 = str(b.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(b.pagina) + ";" + fechaT + ";" + b.codigo_transaccion + ";" + rNostroCorr + ";" + rVostroCorr + ";" + detCorr + ";" + b.credito_debito + ";" + str(b.monto) + ";S\n"
                
                nuevoArch.write(linea3)

            nuevoArch.write('***** Match Manual *****\n')

            matchesConfMan = Matchconfirmado.objects.filter(Q(tc_corres__codigocuenta=cuenta) | Q(tc_conta__codigocuenta=cuenta),fecha__range=(fechaMin,fechaMax),auto_manual=1).order_by('codigomatch')

            if(matchesConfMan):

                contador = 0
                largo = len(matchesConfMan)

                while(contador < largo):
                    if (matchesConfMan[contador].tc_corres == None and matchesConfMan[contador].tc_conta.codigocuenta == cuenta):
                        
                        codigo = matchesConfMan[contador].codigomatch

                        nuevoArch.write('@@\n')

                        fecha = datetime.strftime(matchesConfMan[contador].fecha, '%d/%m/%Y')
                        linea1 = fecha + ";" + matchesConfMan[contador].codigomatch + "\n"

                        nuevoArch.write(linea1)
                       
                        if (contador < largo+1):
                            siguiente = matchesConfMan[contador+1].codigomatch
                        else:
                            siguiente = ""

                        while(codigo == siguiente):
                            if(matchesConfMan[contador].tc_conta == None):


                                a = matchesConfMan[contador].tc_corres
                                
                                if (a.referencianostro == None):
                                    rNostroConta = "null"
                                else:
                                    rNostroConta = a.referencianostro 
                                if (a.referenciacorresponsal == None):
                                    rVostroConta = "null"
                                else:
                                    rVostroConta = a.referenciacorresponsal
                                if (a.descripcion == None):
                                    detConta = "null"
                                else: 
                                    detConta = a.descripcion
                               
                                fechaT = datetime.strftime(a.fecha_valor, '%d/%m/%Y')
                                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";S\n"
                                
                                nuevoArch.write(linea2)

                            else:
                                a = matchesConfMan[contador].tc_conta
                                
                                if (a.referencianostro == None):
                                    rNostroConta = "null"
                                else:
                                    rNostroConta = a.referencianostro 
                                if (a.referenciacorresponsal == None):
                                    rVostroConta = "null"
                                else:
                                    rVostroConta = a.referenciacorresponsal
                                if (a.descripcion == None):
                                    detConta = "null"
                                else: 
                                    detConta = a.descripcion
                                
                                fechaT = datetime.strftime(a.fecha, '%d/%m/%Y')
                                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";L\n"
                                
                                nuevoArch.write(linea2)

                            contador += 1

                            codigo = matchesConfMan[contador].codigomatch

                            if (contador < largo-1):
                                siguiente = matchesConfMan[contador+1].codigomatch
                            else:
                                siguiente = ""

                        if(contador < largo):
                            if(matchesConfMan[contador].tc_conta == None):

                                a = matchesConfMan[contador].tc_corres
                                
                                if (a.referencianostro == None):
                                    rNostroConta = "null"
                                else:
                                    rNostroConta = a.referencianostro 
                                if (a.referenciacorresponsal == None):
                                    rVostroConta = "null"
                                else:
                                    rVostroConta = a.referenciacorresponsal
                                if (a.descripcion == None):
                                    detConta = "null"
                                else: 
                                    detConta = a.descripcion
                                
                                fechaT = datetime.strftime(a.fecha_valor, '%d/%m/%Y')
                                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";S\n"
                                
                                nuevoArch.write(linea2)

                            else:
                                a = matchesConfMan[contador].tc_conta
                               
                                if (a.referencianostro == None):
                                    rNostroConta = "null"
                                else:
                                    rNostroConta = a.referencianostro 
                                if (a.referenciacorresponsal == None):
                                    rVostroConta = "null"
                                else:
                                    rVostroConta = a.referenciacorresponsal
                                if (a.descripcion == None):
                                    detConta = "null"
                                else: 
                                    detConta = a.descripcion
                                
                                fechaT = datetime.strftime(a.fecha, '%d/%m/%Y')
                                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";L\n"
                                
                                nuevoArch.write(linea2)
                            contador += 1

                    elif(matchesConfMan[contador].tc_conta == None and matchesConfMan[contador].tc_corres.codigocuenta == cuenta):

                        codigo = matchesConfMan[contador].codigomatch

                        nuevoArch.write('@@\n')

                        fecha = datetime.strftime(matchesConfMan[contador].fecha, '%d/%m/%Y')
                        linea1 = fecha + ";" + matchesConfMan[contador].codigomatch + "\n"

                        nuevoArch.write(linea1)
                        
                        if (contador < largo-1):
                            siguiente = matchesConfMan[contador+1].codigomatch
                        else:
                            siguiente = ""

                        while(codigo == siguiente):
                            if(matchesConfMan[contador].tc_conta == None):

                                a = matchesConfMan[contador].tc_corres
                               
                                if (a.referencianostro == None):
                                    rNostroConta = "null"
                                else:
                                    rNostroConta = a.referencianostro 
                                if (a.referenciacorresponsal == None):
                                    rVostroConta = "null"
                                else:
                                    rVostroConta = a.referenciacorresponsal
                                if (a.descripcion == None):
                                    detConta = "null"
                                else: 
                                    detConta = a.descripcion
                                
                                fechaT = datetime.strftime(a.fecha_valor, '%d/%m/%Y')
                                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";S\n"
                                
                                nuevoArch.write(linea2)

                            else:
                                a = matchesConfMan[contador].tc_conta
                                
                                if (a.referencianostro == None):
                                    rNostroConta = "null"
                                else:
                                    rNostroConta = a.referencianostro 
                                if (a.referenciacorresponsal == None):
                                    rVostroConta = "null"
                                else:
                                    rVostroConta = a.referenciacorresponsal
                                if (a.descripcion == None):
                                    detConta = "null"
                                else: 
                                    detConta = a.descripcion
                                
                                fechaT = datetime.strftime(a.fecha, '%d/%m/%Y')
                                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";L\n"
                                
                                nuevoArch.write(linea2)

                            contador += 1

                            codigo = matchesConfMan[contador].codigomatch

                            if (contador < largo+1):
                                siguiente = matchesConfMan[contador+1].codigomatch
                            else:
                                siguiente = ""

                        if(contador < largo):
                            if(matchesConfMan[contador].tc_conta == None):

                                a = matchesConfMan[contador].tc_corres
                                
                                if (a.referencianostro == None):
                                    rNostroConta = "null"
                                else:
                                    rNostroConta = a.referencianostro 
                                if (a.referenciacorresponsal == None):
                                    rVostroConta = "null"
                                else:
                                    rVostroConta = a.referenciacorresponsal
                                if (a.descripcion == None):
                                    detConta = "null"
                                else: 
                                    detConta = a.descripcion
                                
                                fechaT = datetime.strftime(a.fecha_valor, '%d/%m/%Y')
                                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";S\n"
                                
                                nuevoArch.write(linea2)

                            else:
                                a = matchesConfMan[contador].tc_conta
                                
                                if (a.referencianostro == None):
                                    rNostroConta = "null"
                                else:
                                    rNostroConta = a.referencianostro 
                                if (a.referenciacorresponsal == None):
                                    rVostroConta = "null"
                                else:
                                    rVostroConta = a.referenciacorresponsal
                                if (a.descripcion == None):
                                    detConta = "null"
                                else: 
                                    detConta = a.descripcion
                                
                                fechaT = datetime.strftime(a.fecha, '%d/%m/%Y')
                                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";L\n"
                                
                                nuevoArch.write(linea2)
                            contador += 1
                            
            nuevoArch.write('***** Reversos Contabilidad *****\n')

            reversosConta = ReversocerradaContabilidad.objects.filter(fecha__range=(fechaMin,fechaMax),tc_conta__codigocuenta=cuenta)
            
            for elem in reversosConta:
                
                nuevoArch.write('@@\n')

                fecha = datetime.strftime(elem.fecha, '%d/%m/%Y')
                linea1 = fecha + ";" + elem.codigomatch + "\n"

                nuevoArch.write(linea1)

                a = elem.tc_conta
                
                if (a.referencianostro == None):
                    rNostroConta = "null"
                else:
                    rNostroConta = a.referencianostro 
                if (a.referenciacorresponsal == None):
                    rVostroConta = "null"
                else:
                    rVostroConta = a.referenciacorresponsal
                if (a.descripcion == None):
                    detConta = "null"
                else: 
                    detConta = a.descripcion
                
                fechaT = datetime.strftime(a.fecha, '%d/%m/%Y')
                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";L\n"
                
                nuevoArch.write(linea2)

                b = elem.tc_conta_id_2
                
                if (b.referencianostro == None):
                    rNostroCorr = "null"
                else:
                    rNostroCorr = b.referencianostro
                if (b.referenciacorresponsal == None):
                    rVostroCorr = "null"
                else:
                    rVostroCorr = b.referenciacorresponsal
                if (b.descripcion == None):
                    detCorr = "null"
                else:
                    detCorr = b.descripcion
                
                fechaT = datetime.strftime(b.fecha_valor, '%d/%m/%Y')
                linea3 = str(b.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(b.pagina) + ";" + fechaT + ";" + b.codigo_transaccion + ";" + rNostroCorr + ";" + rVostroCorr + ";" + detCorr + ";" + b.credito_debito + ";" + str(b.monto) + ";L\n"
                
                nuevoArch.write(linea3)

            reversosCorr = ReversocerradaCorresponsal.objects.filter(fecha__range=(fechaMin,fechaMax),tc_corres__codigocuenta=cuenta)

            if(not reversosCorr):
                nuevoArch.write('***** Reversos Corresponsal *****')
            else:
                nuevoArch.write('***** Reversos Corresponsal *****\n')
            
            for elem in reversosCorr:
                
                nuevoArch.write('@@\n')

                fecha = datetime.strftime(elem.fecha, '%d/%m/%Y')
                linea1 = fecha + ";" + elem.codigomatch + "\n"

                nuevoArch.write(linea1)

                a = elem.tc_corres
                
                if (a.referencianostro == None):
                    rNostroConta = "null"
                else:
                    rNostroConta = a.referencianostro 
                if (a.referenciacorresponsal == None):
                    rVostroConta = "null"
                else:
                    rVostroConta = a.referenciacorresponsal
                if (a.descripcion == None):
                    detConta = "null"
                else: 
                    detConta = a.descripcion
                
                fechaT = datetime.strftime(a.fecha, '%d/%m/%Y')
                linea2 = str(a.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(a.pagina) + ";" + fechaT + ";" + a.codigo_transaccion + ";" + rNostroConta + ";" + rVostroConta + ";" + detConta + ";" + a.credito_debito + ";" + str(a.monto) + ";S\n"
                
                nuevoArch.write(linea2)

                b = elem.tc_corres_id_2
                
                if (b.referencianostro == None):
                    rNostroCorr = "null"
                else:
                    rNostroCorr = b.referencianostro
                if (b.referenciacorresponsal == None):
                    rVostroCorr = "null"
                else:
                    rVostroCorr = b.referenciacorresponsal
                if (b.descripcion == None):
                    detCorr = "null"
                else:
                    detCorr = b.descripcion
                
                fechaT = datetime.strftime(b.fecha_valor, '%d/%m/%Y')
                linea3 = str(b.estado_cuenta_idedocuenta.idedocuenta) + ";" + str(b.pagina) + ";" + fechaT + ";" + b.codigo_transaccion + ";" + rNostroCorr + ";" + rVostroCorr + ";" + detCorr + ";" + b.credito_debito + ";" + str(b.monto) + ";S\n"
                
                nuevoArch.write(linea3)

            #Para el log
            detalle = "Cuenta: " + cuenta
            log(request,43,detalle)
            
            exito = True

            #Llamar store proc
            #cursor = connection.cursor()
            #try:
            #    cursor.execute('EXEC [dbo].[archiveMatches] %s, %s', (cuenta,fechaMax))
            #finally:
            #    cursor.close()

            #cerrar archivo
            nuevoArch.close()

            archivos = ""
            
            obj = Configuracion.objects.all()[0]
            directorio = obj.dirarchiveconfirmados +"\\"+ cuenta

            try:
                archivos = os.listdir(directorio)
            except OSError:
                os.makedirs(directorio)
                archivos = os.listdir(directorio)
            return JsonResponse({'exito':exito,'archivos':archivos})


@login_required(login_url='/login')
def admin_reglas_transf(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 11 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'POST':
        
        actn = request.POST.get('action')

        if actn == 'sel':
            cuentaid = int(request.POST.get('cuentaid'))
            reglasT = ReglaTransformacion.objects.all()
            reglas = [regla for regla in reglasT if regla.cuenta_idcuenta.idcuenta == cuentaid]

            res_json = serializers.serialize('json', reglas)
        
            return JsonResponse(res_json, safe=False)

        if actn == 'add':
            cuentaid = int(request.POST.get('cuentaid'))
            nombre = request.POST.get("nombre")
            tipo = request.POST.get("tipo")
            transconta = request.POST.get("transconta")
            transcorr = request.POST.get("transcorr")
            selrefconta = request.POST.get("selrefconta")
            selrefcorr = request.POST.get("selrefcorr")
            mascconta = request.POST.get("mascconta")
            masccorr = request.POST.get("masccorr")
            msg = "Regla creada exitosamente"

            try:
                cuenta = Cuenta.objects.get(pk=cuentaid)
            except Cuenta.DoesNotExist:
                msg = "No se encontro la cuenta especificada."
                return JsonResponse({'msg': msg, 'add': False})

            regla =  ReglaTransformacion.objects.create(nombre = nombre, cuenta_idcuenta = cuenta, transaccion_corresponsal = transcorr, ref_corresponsal = selrefcorr, mascara_corresponsal = masccorr, transaccion_contabilidad = transconta, ref_contabilidad = selrefconta, mascara_contabilidad = mascconta, tipo = tipo)
            
            #Para el log
            log(request,24,nombre)

            return JsonResponse({'reglaid':regla.pk, 'nombre':nombre, 'mascconta':mascconta, 'masccorr':masccorr, 'selrefconta':selrefconta, 'selrefcorr':selrefcorr, 'transconta':transconta, 'transcorr':transcorr, 'tipo':tipo, 'msg':msg, 'add': True})

        if actn == 'del':
            reglaid = request.POST.get("reglaid")
            msg = "Regla eliminada exitosamente"

            try:
                regla = ReglaTransformacion.objects.get(pk=reglaid)
            except ReglaTransformacion.DoesNotExist:
                msg = "Regla no encontrada, por favor seleccione primero una regla"
                return JsonResponse ({'msg':msg, 'elim':False})
            
            #Para el log
            log(request,26,regla.nombre)

            regla.delete()

            return JsonResponse ({'msg':msg, 'reglaid':reglaid ,'elim':True})

        if actn == 'upd':

            msg = 'Regla modificada exitosamente'
            reglaid = request.POST.get("reglaid")
            nombre = request.POST.get("nombre")
            tipo = request.POST.get("tipo")
            transconta = request.POST.get("transconta")
            transcorr = request.POST.get("transcorr")
            selrefconta = request.POST.get("selrefconta")
            selrefcorr = request.POST.get("selrefcorr")
            mascconta = request.POST.get("mascconta")
            masccorr = request.POST.get("masccorr")

            try:
                regla = ReglaTransformacion.objects.get(pk=reglaid)
            except ReglaTransformacion.DoesNotExist:
                msg = "No se encontro la regla especificada, asegurese de hacer click en la regla a modificar previamente."
                return JsonResponse({'msg': msg, 'reglaid': reglaid, 'modif': False})
        
            regla.nombre = nombre
            regla.transaccion_corresponsal = transcorr
            regla.ref_corresponsal = selrefcorr
            regla.mascara_corresponsal = masccorr
            regla.transaccion_contabilidad = transconta
            regla.ref_contabilidad = selrefconta
            regla.mascara_contabilidad = mascconta
            regla.tipo = tipo

            regla.save()
            
            #Para el log
            log(request,25,regla.nombre)

            return JsonResponse({'reglaid':reglaid, 'nombre':nombre, 'mascconta':mascconta, 'masccorr':masccorr, 'selrefconta':selrefconta, 'selrefcorr':selrefcorr, 'transconta':transconta, 'transcorr':transcorr, 'tipo':tipo, 'msg':msg, 'modif':True})

    if request.method == 'GET':
        template = "matcher/admin_reglasTransf.html"
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'cuentas':get_cuentas(request), 'ops':get_ops(request),'ldap':get_ldap(request)}
        return render(request, template, context)

@login_required(login_url='/login')
def admin_crit_reglas(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 12 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)
    
    expirarSesion(request)
    if request.method == 'POST':
        actn = request.POST.get('action')
        idioma = Configuracion.objects.all()[0].idioma 

        if actn == 'add':
            if idioma == 0:
                msg = "Criterio creado exitosamente."
            else:
                msg = "Successful created criteria."
            
            criterionom = request.POST.get('criterionom')
            criteriomon1 = request.POST.get('criteriomon1')
            criteriomon2 = request.POST.get('criteriomon2')
            criteriomon3 = request.POST.get('criteriomon3')
            criterioF1 = request.POST.get('criterioF1')
            criterioF2 = request.POST.get('criterioF2')
            criterioF3 = request.POST.get('criterioF3')
            criterioF4 = request.POST.get('criterioF4')
            criterioF5 = request.POST.get('criterioF5')

            try:
                criterio = CriteriosMatch.objects.create(nombre=criterionom, num_entradas = 0)

                # Es necesario ya que si se hace save() con campos vacios="" da error la funcion
                criterio.monto1 = NoneNotEmpty(criteriomon1)
                criterio.monto2 = NoneNotEmpty(criteriomon2)
                criterio.monto3 = NoneNotEmpty(criteriomon3)
                criterio.fecha1 = NoneNotEmpty(criterioF1)
                criterio.fecha2 = NoneNotEmpty(criterioF2)
                criterio.fecha3 = NoneNotEmpty(criterioF3)
                criterio.fecha4 = NoneNotEmpty(criterioF4)
                criterio.fecha5 = NoneNotEmpty(criterioF5)
            
                criterio.save()

                #Para el log
                log(request,27,criterionom)

            except:
                if idioma == 0:
                    msg = "Hubo un error, por favor verificar que los campos esten correctos e intente nuevamente."
                else:
                    msg = "Error occurred, verifi fields and try again please."
                
                return JsonResponse({'msg':msg, 'creado':False})

            return JsonResponse({'msg':msg, 'criterioid':criterio.idcriterio,'criterionom':criterionom, 'criteriomon1':criteriomon1,'criteriomon2':criteriomon2,'criteriomon3':criteriomon3,'criterioF1':criterioF1,'criterioF2':criterioF2,'criterioF3':criterioF3,'criterioF4':criterioF4,'criterioF5':criterioF5, 'creado': True})
                
        if actn == 'del':
            if idioma == 0:
                msg = "Criterio eliminado exitosamente."
            else:
                msg = "Successful deleted criteria."
            
            criterioid = request.POST.get('criterioid')

            try:
                criterio = CriteriosMatch.objects.get(idcriterio=criterioid)
            except CriteriosMatch.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro el criterio especificado, asegurese de hacer click en el criterio a eliminar previamente."
                else:
                    msg = "Criteria not found, be sure to click a criteria."
                
                return JsonResponse({'msg': msg, 'criterioid': criterioid, 'elim': False})

            #Para el log
            log(request,29,criterio.nombre)

            criterio.delete()
            return JsonResponse({'msg': msg, 'criterioid': criterioid, 'elim': True})

        if actn == 'upd':
            criterioid = request.POST.get('criterioid')
            criterionom = request.POST.get('criterionom')
            criteriomon1 = request.POST.get('criteriomon1')
            criteriomon2 = request.POST.get('criteriomon2')
            criteriomon3 = request.POST.get('criteriomon3')
            criterioF1 = request.POST.get('criterioF1')
            criterioF2 = request.POST.get('criterioF2')
            criterioF3 = request.POST.get('criterioF3')
            criterioF4 = request.POST.get('criterioF4')
            criterioF5 = request.POST.get('criterioF5')

            if idioma == 0:
                msg = "Criterio modificado exitosamente."
            else:
                msg = "Successful modified criteria."

            try:
               criterio = CriteriosMatch.objects.get(idcriterio=criterioid)
            except CriteriosMatch.DoesNotExist:
                if idioma == 0:
                    msg = "No se encontro el criterio especificado, asegurese de hacer click en el criterio a modificar."
                else:
                    msg = "Criteria not found, be sure to click a criteria."
                
                return JsonResponse({'msg': msg, 'criterioid': criterioid, 'modif': False})

            criterio.nombre = criterionom
            criterio.monto1 = NoneNotEmpty(criteriomon1)
            criterio.monto2 = NoneNotEmpty(criteriomon2)
            criterio.monto3 = NoneNotEmpty(criteriomon3)
            criterio.fecha1 = NoneNotEmpty(criterioF1)
            criterio.fecha2 = NoneNotEmpty(criterioF2)
            criterio.fecha3 = NoneNotEmpty(criterioF3)
            criterio.fecha4 = NoneNotEmpty(criterioF4)
            criterio.fecha5 = NoneNotEmpty(criterioF5)

            criterio.save()

            #Para el log
            log(request,28,criterio.nombre)

            return JsonResponse({'criterioid':criterio.idcriterio,'criterionom':criterionom, 'criteriomon1':criterio.monto1,'criteriomon2':criterio.monto2,'criteriomon3':criterio.monto3,'criterioF1':criterio.fecha1,'criterioF2':criterio.fecha2,'criterioF3':criterio.fecha3,'criterioF4':criterio.fecha4,'criterioF5':criterio.fecha5,'msg':msg, 'modif': True})
             

    if request.method == 'GET':
        template = "matcher/admin_criteriosReglas.html"
        criterios = CriteriosMatch.objects.all()
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'criterios':criterios, 'ops':get_ops(request),'ldap':get_ldap(request)}
        return render(request, template, context)

@login_required(login_url='/login')
def seg_licencia(request):
    
    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 6 or not 5 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'GET':
        prev = Licencia.objects.all()[0] 
        numU = prev.num_usuarios
        Exp = prev.fecha_expira
        template = "matcher/seg_licencia.html"
        criterios = CriteriosMatch.objects.all()
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'ops':get_ops(request),'archivos':get_archivosLicencia(),'numU':numU,'Exp':Exp,'ldap':get_ldap(request)}
        return render(request, template, context)

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == "cargarLicencia":
            archivo = request.POST.get('archivo')
            
            #Buscar directorio de licencia
            obj = Configuracion.objects.all()[0]
            directorio = obj.dirlicencia
            directorio = directorio + "\\"

            #ruta del archivo a cargar
            ruta = directorio + archivo
            bicLicencia = obj.bic
            fechaLicencia = ""
            usuariosLicencia = ""
            numeroModulos = 0
            modulosLicencia = []
            llaveLicencia = ""

            #abrir archivo
            fo = open(ruta, 'r')
            for line in fo:
                if line[:17] == "<FechaExpiracion>":
                    fechaLicencia = line.strip()
                    fechaLicencia = fechaLicencia[17:][:-18]
                if line[:13] == "<NumUsuarios>":
                    usuariosLicencia = line.strip()
                    usuariosLicencia = usuariosLicencia[13:][:-14]
                if line[:12] == "<NumModulos>":
                    aux = line.strip()
                    numeroModulos = int(aux[12:][:-13])
                if line[:2] == "- ":
                    aux = line.strip()
                    aux = aux[2:] 
                    modulosLicencia.append(aux)
                if line[:7] == "<Llave>":
                    llaveLicencia = line.strip()
                    llaveLicencia = llaveLicencia[7:][:-8]

            fo.close()
            
            if fechaLicencia == "" or usuariosLicencia == "" or numeroModulos == 0 or modulosLicencia == [] or llaveLicencia == "":
                mensaje = "Problemas con el archivo"
                return JsonResponse({'mens':mensaje})

            try:
                # Buscar licencia
                previa = Licencia.objects.all()[0]
                previa.bic = bicLicencia
                previa.num_usuarios = int(usuariosLicencia)
                fechaAux = datetime.strptime(fechaLicencia, '%Y-%m-%d')
                previa.fecha_expira = fechaAux
                previa.llave = llaveLicencia
                previa.salt = "BCG.bcg+2015"
                previa.save()

                #modulos
                modulosemail = "\n"
                for mod in modulosLicencia:
                    moduloQuery = Modulos.objects.get(descripcion=mod)
                    moduloQuery.activo = 1
                    moduloQuery.save()
                    modulosemail =  modulosemail + "- " + mod + "\n"

                #Enviar mail
                msg = "Bic: " + bicLicencia + "\nUsuarios: " + usuariosLicencia +"\n Expiración (YY-MM-DD): "+ str(fechaLicencia) +"\n Llave: " + llaveLicencia+ "\nSalt : BCG.bcg+2015" +"\n Modulos: " +str(numeroModulos)+ modulosemail
                enviar_mail('Licencia del banco: '+bicLicencia,msg,'jotha41@gmail.com')

                mensaje = "Licencia modificada exitosamente"
                return JsonResponse({'mens':mensaje})

            except:

                #Si es la primera vez que se carga la licencia
                fechaAux = datetime.strptime(fechaLicencia, '%Y-%m-%d')
                nuevalicencia = Licencia.objects.create(bic=bicLicencia,num_usuarios=int(usuariosLicencia),fecha_expira=fechaAux,llave=llaveLicencia,salt="BCG.bcg+2015")
                
                #modulos
                modulosemail = "\n"
                for mod in modulosLicencia:
                    moduloQuery = Modulos.objects.get(descripcion=mod)
                    moduloQuery.activo = 1
                    moduloQuery.save()
                    modulosemail =  modulosemail + "- " + mod + "\n"

                #Enviar mail
                msg = "Bic: " + bicLicencia + "\nUsuarios: " + usuariosLicencia +"\n Expiración (YY-MM-DD): "+ str(fechaLicencia) +"\n Llave: " + llaveLicencia+ "\nSalt : BCG.bcg+2015" +"\n Modulos: " +str(numeroModulos)+ modulosemail
                enviar_mail('Licencia del banco: '+bicLicencia,msg,'jotha41@gmail.com')
                
                mensaje = "La agregada exitosamente"
                return JsonResponse({'mens':mensaje})
                

@login_required(login_url='/login')
def manual_usuario(request):
    expirarSesion(request)
    try:
        with open('static/Manuales/Manual del Usuario/Manual del Usuario.pdf', 'rb') as pdf:
            response = HttpResponse(pdf.read(),content_type='application/pdf')
            response['Content-Disposition'] = 'filename=Manual del Usuario.pdf'
            return response
    except:
        return HttpResponseNotFound('<h1>Report Not Found</h1>')

@login_required(login_url='/login')
def manual_sistema(request):
    expirarSesion(request)
    try:
        with open('static/Manuales/Manual del Sistema/Manual del Sistema.pdf', 'rb') as pdf:
            response = HttpResponse(pdf.read(),content_type='application/pdf')
            response['Content-Disposition'] = 'filename=Manual del Sistema.pdf'
            return response
    except:
        return HttpResponseNotFound('<h1>Report Not Found</h1>')

@login_required(login_url='/login')
def sobre_matcher(request):
    expirarSesion(request)
    try:
        with open('static/Manuales/Manual del Sistema/Manual del Sistema.pdf', 'rb') as pdf:
            response = HttpResponse(pdf.read(),content_type='application/pdf')
            response['Content-Disposition'] = 'filename=Manual del Sistema.pdf'
            return response
    except:
        return HttpResponseNotFound('<h1>Report Not Found</h1>')

@login_required(login_url='/login')
def SU_licencia(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 15 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)

    if request.method == "GET":
        try:
            prev = Licencia.objects.all()[0] 
            numU = prev.num_usuarios
            Exp = prev.fecha_expira
            bicB = Configuracion.objects.all()[0].bic
            template = "matcher/SU_licencia.html"
            idioma = Configuracion.objects.all()[0].idioma    
            context = {'idioma':idioma, 'ops':get_ops(request),'bic':bicB,'numU':numU,'Exp':Exp,'ldap':get_ldap(request)}
            return render(request, template, context)

        except:
            template = "matcher/SU_licencia.html"
            bicB = Configuracion.objects.all()[0].bic
            idioma = Configuracion.objects.all()[0].idioma    
            context = {'idioma':idioma, 'ops':get_ops(request),'bic':bicB,'numU':0,'Exp':None,'ldap':get_ldap(request)}
            return render(request, template, context)

    if request.method == "POST":
       action = request.POST.get('action')

       if action == "guardarCambios":
        numUsers = request.POST.get('numUsers') 
        fecha = request.POST.get('fecha')
        bic = Configuracion.objects.all()[0].bic
           
        try:
            
            # Buscar licencia
            previa = Licencia.objects.all()[0]
            pwd = bic + "$" + numUsers + "$" + fecha
            newp = make_password(pwd, salt='BCG.bcg+2015', hasher='pbkdf2_sha256')
            x, x, salt, hashp = newp.split("$")
            fecha = datetime.strptime(fecha, '%d/%m/%Y')
            previa.num_usuarios = numUsers
            previa.fecha_expira = fecha
            previa.salt = salt
            previa.llave = hashp
            previa.save()
            modulos = Modulos.objects.exclude(opcion=15).exclude(activo=0).order_by('descripcion')
            modulosemail = "\n"
            cuentamod = 0
            for i in modulos:
                modulosemail =  modulosemail + "- " + i.descripcion + "\n"
                cuentamod += 1

            #Se crea el archivo de texto con la copia de la licencia
            tn = str(timenow())
            aux = tn[:10]
            aux2 = aux.split('-')
            aux = aux2[2]+aux2[1]+aux2[0]
            fechaNombre = aux


            #Buscar directorio de la licencia
            obj = Configuracion.objects.all()[0]
            directorio = obj.dirlicencia
            directorio = directorio + "\\"

            #Nombre del archivo a crear
            archivo = directorio + "Licencia" + "_" + bic + "_" + fechaNombre + ".txt"

            #abrir archivo
            fo = open(archivo, 'w')
            fo.write( "Licencia Matcher\n")
            fo.write( "<BIC>"+bic+"</BIC>"+"\n")
            fo.write( "<FechaExpiracion>"+str(fecha).split(" ")[0]+"</FechaExpiracion>"+"\n")
            fo.write( "<NumUsuarios>"+numUsers+"</NumUsuarios>"+"\n")
            fo.write( "<NumModulos>"+str(cuentamod)+"</NumModulos>"+"\n")
            fo.write( "<Modulos>"+modulosemail+"</Modulos>"+"\n")
            fo.write( "<Llave>"+hashp+"</Llave>\n")
            fo.write( "\n@BCG")

            #cerrar archivo
            fo.close()

            #Enviar mail
            msg = "Bic: " +bic + "\nUsuarios: " + numUsers +"\n Expiración (YY-MM-DD): "+ str(fecha).split(" ")[0] +"\n Llave: " + hashp+ "\nSalt : " + salt  +"\n Modulos: " + str(cuentamod) + modulosemail
            enviar_mail('Licencia del banco: '+bic,msg,'jotha41@gmail.com')
            
            mensaje = "Licencia modificada exitosamente"
            return JsonResponse({'mens':mensaje})
               
        except:

            #Si es la primera vez que se agrega la licencia
            pwd = bic + "$" + numUsers + "$" + fecha
            newp = make_password(pwd, salt='BCG.bcg+2015', hasher='pbkdf2_sha256')
            x, x, salt, hashp = newp.split("$")
            fecha = datetime.strptime(fecha, '%d/%m/%Y')
            nuevalicencia = Licencia.objects.create(bic=bic,num_usuarios=numUsers,fecha_expira=fecha,llave=hashp,salt=salt)
            modulos = Modulos.objects.exclude(opcion=15).exclude(activo=0).order_by('descripcion')
            modulosemail = "\n"
            cuentamod = 0
            for i in modulos:
                modulosemail =  modulosemail + "- " + i.descripcion + "\n"
                cuentamod += 1

            #Se crea el archivo de texto con la copia de la licencia
            tn = str(timenow())
            aux = tn[:10]
            aux2 = aux.split('-')
            aux = aux2[2]+aux2[1]+aux2[0]
            fechaNombre = aux


            #Buscar directorio de la licencia
            obj = Configuracion.objects.all()[0]
            directorio = obj.dirlicencia
            directorio = directorio + "\\"

            #Nombre del archivo a crear
            archivo = directorio + "Licencia" + "_" + bic + "_" + fechaNombre + ".txt"

            #abrir archivo
            fo = open(archivo, 'w')
            fo.write( "Licencia Matcher\n")
            fo.write( "<BIC>"+bic+"</BIC>"+"\n")
            fo.write( "<FechaExpiracion>"+str(fecha).split(" ")[0]+"</FechaExpiracion>"+"\n")
            fo.write( "<NumUsuarios>"+numUsers+"</NumUsuarios>"+"\n")
            fo.write( "<NumModulos>"+str(cuentamod)+"</NumModulos>"+"\n")
            fo.write( "<Modulos>"+modulosemail+"</Modulos>"+"\n")
            fo.write( "\n")
            fo.write( "<Llave>"+hashp+"</Llave>\n")
            fo.write( "\n@BCG")

            #cerrar archivo
            fo.close()

            #Enviar mail
            msg = "Bic: " +bic + "\nUsuarios: " + numUsers +"\n Expiración (YY-MM-DD): "+ str(fecha).split(" ")[0] +"\n Llave: " + hashp+ "\nSalt : " + salt +"\n Modulos: " +str(cuentamod)+ modulosemail
            enviar_mail('Licencia del banco: '+bic,msg,'jotha41@gmail.com')
            
            mensaje = "Licencia agregada exitosamente"
            return JsonResponse({'mens':mensaje})



@login_required(login_url='/login')
def SU_modulos(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 15 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'GET':
        template = "matcher/SU_modulos.html"
        modulos = Modulos.objects.exclude(opcion=15)
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'ops':get_ops(request), 'modulos':modulos,'ldap':get_ldap(request)}
        return render(request, template, context)

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'quitarModulos':
            Array = request.POST.getlist('arrayQuitar[]')
            for i in Array:
                busqueda = Modulos.objects.filter(pk=i)[0]
                busqueda.activo = 0
                busqueda.save()
            return JsonResponse({'mensa':"mensaje"})  

        if action == 'agregarModulos':
            Array = request.POST.getlist('arrayAgregar[]')
            for i in Array:
                busqueda = Modulos.objects.filter(pk=i)[0]
                busqueda.activo = 1
                busqueda.save()
            return JsonResponse({'mensa':"mensaje"})   

@login_required(login_url='/login')
def SU_version(request):

    permisos = get_ops(request)
    lista = [Opcion.objects.get(idopcion=p).funprincipal for p in permisos]
    lista.sort()
    lista = set(lista)
    if not 15 in lista:
        retour = custom_403(request)
        return HttpResponseForbidden(retour)

    expirarSesion(request)
    if request.method == 'GET':
        template = "matcher/SU_version.html"
        version = Version.objects.all()[0]
        idioma = Configuracion.objects.all()[0].idioma    
        context = {'idioma':idioma, 'ops':get_ops(request), 'version':version,'ldap':get_ldap(request)}
        return render(request, template, context)

def custom_404(request):
    expirarSesion(request)
    template = "matcher/404.html"
    idioma = Configuracion.objects.all()[0].idioma    
    context = {'idioma':idioma, 'ops':get_ops(request),'ldap':get_ldap(request)}
    return render(request,template, context)

def custom_500(request):
    expirarSesion(request)
    template = "matcher/500.html"
    idioma = Configuracion.objects.all()[0].idioma    
    context = {'idioma':idioma, 'ops':get_ops(request),'ldap':get_ldap(request)}
    return render(request,template, context)

def custom_403(request):
    expirarSesion(request)
    template = "matcher/403.html"
    idioma = Configuracion.objects.all()[0].idioma    
    context = {'idioma':idioma, 'ops':get_ops(request),'ldap':get_ldap(request)}
    return render(request,template, context)

def custom_400(request):
    expirarSesion(request)
    template = "matcher/400.html"
    idioma = Configuracion.objects.all()[0].idioma    
    context = {'idioma':idioma, 'ops':get_ops(request),'ldap':get_ldap(request)}
    return render(request,template, context)

#################################################################################################
## Otras funciones

def NoneNotEmpty(s):
    if s and s!="None":
        return s
    else:
        return None

def notnone(string):
    if string == None:
        return ''
    else:
        return string

def timenow():
    return datetime.now().replace(microsecond=0)

def log(request,eid,detalles=None):
    # Funcion que recibe el request, ve cual es el usr loggeado y realiza el log
    username = request.user.username
    terminal = request.META.get('COMPUTERNAME')
    fechaHora = timenow()
    evento = Evento.objects.get(pk=eid)
    sesion = Sesion.objects.get(login=username)
    nombre = sesion.usuario_idusuario.nombres+" "+sesion.usuario_idusuario.apellidos

    if sesion.login == "SysAdminBCG":
        print("")
    elif detalles is not None:

        pattern = re.compile("^.*'SysAdmin'.*$")
        m = pattern.match(detalles)

        if m == False: 

            Traza.objects.create(evento_idevento=evento,usuario=nombre, fecha_hora=fechaHora, terminal=terminal, detalles=detalles)
    
    else:
        Traza.objects.create(evento_idevento=evento,usuario=nombre, fecha_hora=fechaHora, terminal=terminal)

def logAux(name,terminal,detalles):
    # Funcion que recibe el nombre del usuario y guarda su traza
    username = name
    fechaHora = timenow()
    evento = Evento.objects.get(pk=2)
    sesion = Sesion.objects.get(login=username)
    nombre = sesion.usuario_idusuario.nombres+" "+sesion.usuario_idusuario.apellidos

    if sesion.login == "SysAdminBCG": 
        print("")
    else:
        Traza.objects.create(evento_idevento=evento,usuario=nombre, fecha_hora=fechaHora, terminal=terminal, detalles=detalles)


def expirarSesion(request):
    config = Configuracion.objects.all()[0]
    tiempo = config.expiracion_sesion * 60 
    request.session.set_expiry(tiempo)
