from django.core import serializers
from django.core.mail import send_mail
from django.shortcuts import render, get_object_or_404
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django import forms
from Matcher.models import *
from django.db import connection
from django.db.models import Sum, Q
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import *
from django.contrib.auth import update_session_auth_hash
from django.contrib.sessions.models import Session
from datetime import datetime, date, time, timedelta
from Matcher_WS.settings import ARCHIVOS_FOLDER
from Matcher_WS.backend import MyAuthBackend
from Matcher_WS.edo_cuenta import edoCta, edc_list, Trans, Bal
from Matcher_WS.mailConf import enviar_mail
from Matcher_WS.cargaAutomatica import leer_linea_conta, leer_linea_corr, leer_punto_coma, validar_archivo
from socket import socket, AF_INET, SOCK_STREAM, error
from select import select
import time
import os
import re
import jsonpickle
import sys
import traceback
import shutil

def test(request):

    enviar_mail('Prueba Mail','msg','rheligon@gmail.com')

    return JsonResponse('exito', safe=False)


def timenow():
    return datetime.now().replace(microsecond=0)

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

def get_ops(login):
    #Busco la sesion que esta conectada
    sess = Sesion.objects.get(login=login, conexion="1")
    #Busco el perfil del usuario
    perfilid = sess.usuario_idusuario.perfil_idperfil
    #Coloco las opciones segun el perfil elegido
    opciones = [opcion for opcion in PerfilOpcion.objects.filter(perfil_idperfil=perfilid)]
    return opciones

def log(request,eid,detalles=None):
    # Funcion que recibe el request, ve cual es el usr loggeado y realiza el log
    username = request.user.username 
    terminal = request.META.get('COMPUTERNAME')
    fechaHora = timenow()
    evento = Evento.objects.get(pk=eid)
    sesion = Sesion.objects.get(login=username)
    nombre = sesion.usuario_idusuario.nombres+" "+sesion.usuario_idusuario.apellidos

    if detalles is not None:
        Traza.objects.create(evento_idevento=evento,usuario=nombre, fecha_hora=fechaHora, terminal=terminal, detalles=detalles)
    else:
        Traza.objects.create(evento_idevento=evento,usuario=nombre, fecha_hora=fechaHora, terminal=terminal)

def setConsolidado(codCta,request):

    #Obtengo el nombre del usuario
    username = request.user.username
    sesion = Sesion.objects.get(login=username)
    nombre = sesion.usuario_idusuario.nombres+" "+sesion.usuario_idusuario.apellidos

    try:
        # Obtengo cuenta a consolidar
        cuenta = Cuenta.objects.get(codigo=codCta)

        # Busco ultima fecha de conciliacion
        ultFC = cuenta.ultimafechaconciliacion

        # Busco ultimo edc procesado de contabilidad
        idEcCont = cuenta.ultimoedocuentaprocc

        # Busco ultimo edc procesado de corresponsal
        idEcCorr = cuenta.ultimoedocuentaprocs

        if (ultFC != None and idEcCont != None and idEcCorr != None):
            # Obtengo creditos Trans_Abiertas Contabilidad hasta la fecha indicada
            totalCredCont = TransabiertaContabilidad.objects.filter(fecha_valor__lte=ultFC,credito_debito__in=['C','RD']).aggregate(Sum('monto'))
            
            #Se devuelve un diccionario por lo que accedo al valor del primer (unico) elemento
            totalCredCont = next(iter(totalCredCont.values()))
            
            if totalCredCont is None:
                totalCredCont = 0
            
            print('credcont ' + str(totalCredCont))

            # Obtengo debitos Trans_Abiertas Contabilidad hasta la fecha indicada
            totalDebCont = TransabiertaContabilidad.objects.filter(fecha_valor__lte=ultFC,credito_debito__in=['D','RC']).aggregate(Sum('monto'))
            totalDebCont = next(iter(totalDebCont.values()))
            
            if totalDebCont is None:
                totalDebCont = 0

            print('debcont ' + str(totalDebCont))

            # Obtengo creditos Trans_Abiertas Corresponsal hasta la fecha indicada
            totalCredCorr = TransabiertaCorresponsal.objects.filter(fecha_valor__lte=ultFC,credito_debito__in=['C','RD']).aggregate(Sum('monto'))
            totalCredCorr = next(iter(totalCredCorr.values()))
            
            if totalCredCorr is None:
                totalCredCorr = 0
            
            print('credcorr ' + str(totalCredCorr))

            # Obtengo debitos Trans_Abiertas Contabilidad hasta la fecha indicada
            totalDebCorr = TransabiertaCorresponsal.objects.filter(fecha_valor__lte=ultFC,credito_debito__in=['D','RC']).aggregate(Sum('monto'))
            totalDebCorr = next(iter(totalDebCorr.values()))

            if totalDebCorr is None:
                totalDebCorr = 0

            print('debcorr ' + str(totalDebCorr))

            # Busco el balance final del ultimo edc procesado de Contabilidad
            try:
                EdcCont = EstadoCuenta.objects.get(idedocuenta=idEcCont)
            except:
                EdcCont = None

            if EdcCont is not None:
                if EdcCont.c_dfinal == 'D':
                    balanceCont = -1 * EdcCont.balance_final
                else:
                    balanceCont = EdcCont.balance_final
            else: 
                balanceCont = 0

            print('balcont ' + str(balanceCont))

            # Busco el balance final del ultimo edc procesado de SWIFT
            try:
                EdcCorr = EstadoCuenta.objects.get(idedocuenta=idEcCorr)
            except:
                EdcCorr = None

            if EdcCorr is not None:
                if EdcCorr.c_dfinal == 'D':
                    balanceCorr = -1 * EdcCorr.balance_final
                else:
                    balanceCorr = EdcCorr.balance_final
            else: 
                balanceCorr = 0

            print('balcorr ' + str(balanceCorr))

            # Busco encajes asociados a la cuenta
            encaje = cuenta.montoencajeactual

            if encaje is None:
                encaje = 0

            print('encaje ' + str(encaje))

            # Saco los totales de los saldos

            if cuenta.tipo_cta == 2:
                # Saldo real para cuentas propias
                totalCont = balanceCont
                totalCorr = totalCredCorr - totalDebCorr

                total = totalCont - totalCorr
                diferencia = round(total)
            else:
                # Se sacan los saldos reales de contabilidad y corresponsal
                totalCont = -(totalCredCorr - totalDebCorr + encaje) + balanceCont
                totalCorr = -(totalCredCont - totalDebCont) + balanceCorr

                total = totalCont + totalCorr

                diferencia = round(total,2) #Deberia ser siempre 0

            print('totcont ' + str(totalCont))
            print('totcorr ' + str(totalCorr))
            print('diferencia ' + str(diferencia))

            # Selecciono la cuenta de la tabla Consolidado para cambiar los datos de la conciliacion
            consolidado, creado = Conciliacionconsolidado.objects.get_or_create(cuenta_idcuenta=cuenta, defaults={'totalcreditoscontabilidad':totalCredCont, 'totaldebitoscontabilidad':totalDebCont, 'totalcreditoscorresponsal':totalCredCorr, 'totaldebitoscorresponsal':totalDebCorr, 'saldocontabilidad':totalCont, 'saldocorresponsal':totalCorr, 'diferencia':diferencia, 'balancefinalcontabilidad':balanceCont, 'balancefinalcorresponsal':balanceCorr, 'realizadopor':nombre})

            if not creado:
                saldoContAnt = consolidado.saldocontabilidad

                consolidado.cuenta_idcuenta = cuenta
                consolidado.totalcreditoscontabilidad = totalCredCont
                consolidado.totaldebitoscontabilidad  = totalDebCont
                consolidado.totalcreditoscorresponsal = totalCredCorr
                consolidado.totaldebitoscorresponsal = totalDebCorr
                consolidado.saldocontabilidad = totalCont
                consolidado.saldocorresponsal = totalCorr
                consolidado.diferencia = diferencia
                consolidado.balancefinalcontabilidad = balanceCont
                consolidado.balancefinalcorresponsal = balanceCorr
                consolidado.realizadopor = nombre

                consolidado.save()

            # Falta enviar correo si la diferencia != 0 
        
    except Exception as e:
        #Hubo algun error
        print (e)

@login_required(login_url='/login')
def index(request):
    context = {}
    template = "matcher/index.html"
    return render(request, template, context)

def usr_login(request):
    message = None

    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        try:
            sesion = Sesion.objects.filter(login=username, estado__in=["Activo","Pendiente"])[0]
            user = MyAuthBackend.authenticate(sesion, username=username, password=password)
            if user is not None and sesion.estado!="Inactivo":
                auth.login(request, user)
                message = "Login successful"
                sesion.conexion = 1
                sesion.save()
                # Para el log
                log(request,1)

                # Redireccionar a index
                return HttpResponseRedirect('/')
            else:
                message ='La combinacion de usuario y clave fue incorrecta.'

                # Para el log
                terminal = request.META.get('COMPUTERNAME')
                fechaHora = timenow()
                evento = Evento.objects.get(pk=37)
                nombre = sesion.usuario_idusuario.nombres+" "+sesion.usuario_idusuario.apellidos
                detalles = "Usuario: "+username
                Traza.objects.create(evento_idevento=evento,usuario=nombre, fecha_hora=fechaHora, terminal=terminal, detalles=detalles)

        except:
            # Show a message     
            message ='Ese usuario no existe en la base de datos.'

    context = {'message': message}
    template = "matcher/login.html"
    return render(request, template, context)

def usr_logout(request):

    if request.method == 'POST':
        sessid = request.POST.get('sessid')
        sesion = Sesion.objects.get(idsesion=sessid)
        sesion.conexion = 0
        sesion.save()

        username = sesion.login
        print(username)
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

@login_required(login_url='/login')
def listar_cuentas(request):

    cuentas_list = Cuenta.objects.all()

    # Filtrar a las cuentas del usuario que esta
    # uso id=1 pq es el unico que tiene en la base de datos
    
    # uc = UsuarioCuenta.objects.filter(usuario_idusuario=1)
    # l_cuentas = []
    # for cuenta in uc:
    #     l_cuentas.append(cuenta.cuenta_idcuenta)
    # cuentas_list = l_cuentas

    context = {'cuentas': cuentas_list}
    template = "matcher/listarCuentas.html"

    return render(request, template, context)


@login_required(login_url='/login')
def resumen_cuenta(request, cuenta_id):

    conciliacion = Conciliacionconsolidado.objects.filter(cuenta_idcuenta = cuenta_id)

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


    context = {'cuenta': cuenta, 'cons':cons, 'cod': cod}
    template = "matcher/ResumenCuenta.html"

    return render(request, template, context)

@login_required(login_url='/login')
def pd_estadoCuentas(request):

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


        cargados = Cargado.objects.all()
        procesados = Procesado.objects.all()

        cargado_l = [cargado.estado_cuenta_idedocuenta for cargado in cargados if cargado.estado_cuenta_idedocuenta.cuenta_idcuenta.idcuenta == cuentaid]
        procesado_l = [procesado.estado_cuenta_idedocuenta for procesado in procesados if procesado.estado_cuenta_idedocuenta.cuenta_idcuenta.idcuenta == cuentaid]

        res_json = '[' + serializers.serialize('json', cargado_l) + ',' 
        res_json += serializers.serialize('json', procesado_l)+']'

        return JsonResponse(res_json, safe=False)
        
    if request.method == 'GET':
        cuentas = Cuenta.objects.all().order_by('codigo')

        # Filtrar a las cuentas del usuario que esta
        # uso id=1 pq es el unico que tiene en la base de datos
        
        # uc = UsuarioCuenta.objects.filter(usuario_idusuario=1)
        # l_cuentas = []
        # for cuenta in uc:
        #     l_cuentas.append(cuenta.cuenta_idcuenta)
        # #cuentas_list = l_cuentas

        context = {'cuentas': cuentas}
        template = "matcher/pd_estadoCuentas.html"

        return render(request, template, context)

@login_required(login_url='/login')
def pd_cargaAutomatica(request):

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
                                        res = re.search('(?P<fecha>\d{6})(?P<fentrada>\d{4}?)(?P<DoC>R?[CD]{1})[A-Z]?(?P<monto>\d+\,\d{0,2})(?P<tipo>.{4})(?P<refNostro>.+(?=//))/?/?(?P<refVostro>.+)?', result.group(2))
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
                            fecha = re.findall('..?', tran.trans['fecha'])
                            fecha = datetime(int("20"+fecha[0]), int(fecha[1]), int(fecha[2]))
    
                            TransabiertaCorresponsal.objects.create(estado_cuenta_idedocuenta=edocta,codigo_transaccion=tran.trans['tipo'], pagina=i+1, fecha_valor=fecha, descripcion=tran.desc, monto=float(tran.trans['monto'].replace(',','.')), credito_debito=tran.trans['DoC'], referencianostro=tran.trans['refNostro'], referenciacorresponsal=tran.trans['refVostro'], codigocuenta=edc.R, numtransaccion=k, campo86_940=None, seguimiento=None)
                            k = k+1

                    cta.ultimoedocuentacargs = edocta.idedocuenta
                    cta.save()
                            
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

        context = {'filenames_corr':filenames_corr,'filenames_conta':filenames_conta }
        template = "matcher/pd_cargaAutomatica.html"
        return render(request, template, context)

@login_required(login_url='/login')
def pd_match(request):
    if request.method == 'POST':
        actn = request.POST.get('action')
        if actn == 'buscar':
            fecha = request.POST.get('fecha').split("/")
            fechaform = datetime(int(fecha[2]),int(fecha[1]),int(fecha[0]))

            # FALTA FILTRAR LAS CUENTAS QUE DEVUELVO CON LAS CUENTAS ASIGNADAS AL USUARIO
            carg = Cargado.objects.all()
            cuentas_carg = [cargado.estado_cuenta_idedocuenta.cuenta_idcuenta for cargado in carg if cargado.estado_cuenta_idedocuenta.fecha_final == fechaform]

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
        context = {}

        return render(request, template, context)


@login_required(login_url='/login')
def pd_matchesPropuestos(request, cuenta):
    if request.method == 'POST':
        my_dict = dict(request.POST)
        del my_dict['csrfmiddlewaretoken'] #Sirve para quitar el token antiforgery del diccionario
        
        print(my_dict)

        for key,value in my_dict.items():
            #hacer algo (key es el numero de iteracion, value es Matchpropuestos ID)
            mp = Matchpropuestos.objects.get(pk=value)
            print(mp)

            #Eliminar de la tabla de propuestos
            #mp.delete()

        #Llamar store proc
        #cursor = connection.cursor()
        #try:
        #    cursor.execute('EXEC [dbo].[confirmarMatches] %s', (cuenta,))
        #finally:
        #    cursor.close()

        #Llamar calculo conciliacion
        #setConsolidado(cuenta,request)
            

        template = "matcher/pd_matchesPropuestos.html"
        msg = 'Matches Confirmados Exitosamente!'
        cuentas = Cuenta.objects.all().order_by('codigo')
        context = {'cuentas':cuentas, 'matches':None, 'cta':None, 'msg':msg}
        return render(request, template, context)

    if request.method == 'GET':

        if cuenta is not None:
            matches = Matchpropuestos.objects.filter(ta_conta__codigocuenta=cuenta).order_by('idmatch')
        else:
            matches = None

        template = "matcher/pd_matchesPropuestos.html"

        cuentas = Cuenta.objects.all().order_by('codigo')

        context = {'cuentas':cuentas, 'matches':matches, 'cta':cuenta, 'msg':None}
        return render(request, template, context)


@login_required(login_url='/login')
def pd_partidasAbiertas(request):
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
                    tc = TranscerradaContabilidad.objects.create(codigo_transaccion=ta.codigo_transaccion, fecha=ta.fecha_valor,monto=ta.monto,credito_debito=ta.credito_debito,codigocuenta=ta.codigocuenta,numtransaccion=ta.numtransaccion)

                    tc.estado_cuenta_idedocuenta = ta.estado_cuenta_idedocuenta
                    tc.pagina = ta.pagina
                    tc.descripcion = ta.descripcion
                    tc.referencianostro = ta.referencianostro
                    tc.referenciacorresponsal = ta.referenciacorresponsal
                    tc.campo86_940 = ta.campo86_940
                    tc.seguimiento = ta.seguimiento
                
                if tipo == 'corr':
                    ta = TransabiertaCorresponsal.objects.get(pk=Mid)
                    tc = TranscerradaCorresponsal.objects.create(codigo_transaccion=ta.codigo_transaccion, fecha=ta.fecha_valor,monto=ta.monto,credito_debito=ta.credito_debito,codigocuenta=ta.codigocuenta,numtransaccion=ta.numtransaccion)

                    tc.estado_cuenta_idedocuenta = ta.estado_cuenta_idedocuenta
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

            return JsonResponse({'msg':'EXITO'})


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

            return JsonResponse({'r_conta':res_json_conta, 'r_corr':res_json_corr, 'r_edcn':edcN}, safe=False)


    if request.method == 'GET':

        template = "matcher/pd_partidasAbiertas.html"
        cuentas = Cuenta.objects.all().order_by('codigo')
        context = {'cuentas':cuentas}
        return render(request, template, context)

@login_required(login_url='/login')
def pd_matchesConfirmados(request,cuenta):

    if request.method == 'POST':
        actn = request.POST.get('action')

        if actn == 'buscar':
            #Obtener filtros
            jsonArray = request.POST.get('filterArray')
            filterArray = jsonpickle.decode(jsonArray)

            filtromonto = filterArray[0]
            filtromatch = filterArray[1] # No lo he usado
            filtroref = filterArray[2]
            filtrofecham = filterArray[3] # No lo he usado
            filtrofecha = filterArray[4]

            #Obtener id de la cuenta
            ctaid = request.POST.get('ctaid')
            cta = Cuenta.objects.get(codigo=ctaid)


            #No hay filtro por lo que se usan ambas
            mConf = Matchconfirmado.objects.filter(Q(tc_conta__codigocuenta=cuenta)|Q(tc_corres__codigocuenta=cuenta)).select_related('tc_corres','tc_conta')

            #Chequear si se selecciono monto
            if filtromonto:
                montod = filtromonto[0]
                montoh = filtromonto[1]

                mConf = mConf.filter(tc_conta__monto__gte=montod,tc_conta__monto__lte=montoh)
                mConf = mConf.filter(tc_corres__monto__gte=montod,tc_corres__monto__lte=montoh)

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

            '''
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

            '''

            #Chequear si se selecciono fechas desde y hasta
            if filtrofecha:
                fechad = None
                fechah = None

                if filtrofecha[0] != '':
                    fechad = datetime.strptime(filtrofecha[0], '%d/%m/%Y')

                if filtrofecha[1] != '':
                    fechah = datetime.strptime(filtrofecha[1], '%d/%m/%Y')

                if fechad is not None and fechah is not None:
                    mConf = mConf.filter(fecha__gte=fechad,fecha__lte=fechah)
                elif fechad is not None:
                    mConf = mConf.filter(fecha__gte=fechad)
                elif fechah is not None:
                    mConf = mConf.filter(fecha__lte=fechah)
            

            cuentas = Cuenta.objects.all().order_by('codigo')
            context = {'cuentas':cuentas, 'matches':mConf, 'cta':cuenta, 'fArray':filterArray, 'msg':None}
            template = "matcher/pd_matchesConfirmados.html"
            return render(request, template, context)

        if actn == 'romper':
            matchArray = request.POST.getlist('matchArray[]')
            print(matchArray)
            print(cuenta)
            msg = 'EXITO'
            return JsonResponse({'msg': msg, 'elim': True})

    if request.method == 'GET':

        if cuenta is not None:
            matches = Matchconfirmado.objects.filter(Q(tc_conta__codigocuenta=cuenta)|Q(tc_corres__codigocuenta=cuenta)).order_by('codigomatch')
        else:
            matches = None

        template = "matcher/pd_matchesConfirmados.html"

        cuentas = Cuenta.objects.all().order_by('codigo')
        context = {'cuentas':cuentas, 'matches':matches, 'cta':cuenta, 'fArray':[[],[],[],[],[]], 'msg':None}
        return render(request, template, context)

@login_required(login_url='/login')
def reportes(request):

    if request.method == 'POST':
        print(request.POST)
        reporte = request.POST.get('rep')
        respuesta = reporte+'*'


        #####
        # REPORTES DE PROCESAMIENTO DIARIO
        #####
        if reporte=='reporteconciliacion':
            codCta = request.POST.get('pd_conc_codcta')
            tipoCta = request.POST.get('pd_conc_tipocta')
            fecha = request.POST.get('pd_conc_fecha')


        if reporte=='reportematchespropuestos':
            codCta = request.POST.get('pd_mprop_codcta')


        if reporte=='reportepartidasabiertas':
            codCta = request.POST.get('pd_partab_codcta')
            radio = request.POST.get('radiopa')

            if radio=='monto':
                montod = request.POST.get('pd_partab_monto-desde')
                montoh = request.POST.get('pd_partab_monto-hasta')

            if radio=='ref':
                nostro = request.POST.get('pd_partab_nostro')
                vostro = request.POST.get('pd_partab_vostro')

            if radio=='trans':
                sl = request.POST.get('pd_partab_sl')
                edo = request.POST.get('pd_partab_edo')
                pag = request.POST.get('pd_partab_pag')
                trans = request.POST.get('pd_partab_trans')

            if radio=='fecha':
                fdesde = request.POST.get('pd_partab_f-desde')
                fhasta = request.POST.get('pd_partab_f-hasta')

        if reporte=='reportematchesconfirmados':
            codCta = request.POST.get('pd_mconf_codcta')
            radio = request.POST.get('radiomc')

            if radio=='monto':
                montod = request.POST.get('pd_mconf_monto-desde')
                montoh = request.POST.get('pd_mconf_monto-hasta')

            if radio=='ref':
                nostro = request.POST.get('pd_mconf_nostro')
                vostro = request.POST.get('pd_mconf_vostro')

            if radio=='match':
                mid = request.POST.get('pd_mconf_match')

            if radio=='fecha':
                fdesde = request.POST.get('pd_mconf_f-desde')
                fhasta = request.POST.get('pd_mconf_f-hasta')

        if reporte=='reportehistoricoconciliacion':
            codCta = request.POST.get('pd_hist_codcta')
            tipoCta = request.POST.get('pd_hist_tipocta')
            fecha = request.POST.get('pd_hist_fecha')

        if reporte=='reporteposforex':
            moneda = request.POST.get('pd_posmon_monl')
            fecha = request.POST.get('pd_posmon_fecha')

        if reporte=='reportegiros':
            codCta = request.POST.get('pd_giro_codcta')
            tipo = request.POST.get('pd_giro_tipo')

        if reporte=='reporteestadoscuenta':
            tipoCta = request.POST.get('pd_edcs_tipocta')
            fdesde = request.POST.get('pd_edcs_f-desde')
            fhasta = request.POST.get('pd_edcs_f-hasta')


        #####
        # REPORTES DE MENSAJES SWIFT
        #####
        if reporte=='reportemt95mt96':
            codCta = request.POST.get('ms_mt_codcta')


        #####
        # REPORTES DE CONFIGURACION
        #####
        if reporte=='reporteconfiguracion':
            tipo = request.POST.get('tipo')

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

        if reporte=='reporteperfiles':
            perfil = request.POST.get('seg_per_perfil')

            if perfil == '-1':
                #son todos (tipo=1)
                tipo = '1'
                print('todos')
            else:
                #detallado (tipo=0)
                tipo = '0'
                print('detallado')

        #####
        # REPORTES DE ADMINISTRACION
        #####
        if reporte=='reportecuentas':
            codCta = request.POST.get('adm_cta_codcta')

            if codCta == '-1':
                #son todos (tipo=1)
                tipo = '1'
                print('todos')
            else:
                #detallado (tipo=0)
                tipo = '0'
                print('detallado')

        if reporte=='reportecuentas':
            codCta = request.POST.get('adm_rdt_codcta')

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

        if reporte=='reportesaldos':
            tipoCta = request.POST.get('avz_sconc_tipocta')
            fecha = request.POST.get('avz_sconc_fecha')

        if reporte=='reportealgo': #preguntar el de avanzado-observaciones
            codCta = request.POST.get('avz_obs_codcta')
            fecha = request.POST.get('avz_obs_fecha')



    if request.method == 'GET':
        template = "matcher/reportes.html"
        cuentas = Cuenta.objects.all().order_by('codigo')
        usuarios = Usuario.objects.all().order_by('apellidos')
        perfiles = Perfil.objects.all().order_by('nombre')
        eventos = Evento.objects.all().order_by('accion')

        context = {'cuentas':cuentas, 'perfiles':perfiles, 'usuarios':usuarios, 'eventos':eventos}
        return render(request, template, context)

@login_required(login_url='/login')
def mensajesSWIFT(request):
    template = "matcher/admin_criteriosyreglas.html"
    context = {}
    return render(request, template, context)

@login_required(login_url='/login')
def configuracion(request, tipo):
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
                dir_s_mt95 = request.POST.get('dir_s_mt95')
                dir_c_mt96 = request.POST.get('dir_c_mt96')
                dir_s_mt99 = request.POST.get('dir_s_mt99')
                dir_c_mt99 = request.POST.get('dir_c_mt99')
                idioma = request.POST.get('Idiom-sel')

                ce = request.POST.get('ce')
                may = request.POST.get('may')
                num  = request.POST.get('num')
                alf = request.POST.get('alf')

                # Buscar empresa y configuracion
                conf = Configuracion.objects.all()[0]

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
                conf.dirsalida95 = dir_s_mt95
                conf.dircarga96 = dir_c_mt96
                conf.dirsalida99 = dir_s_mt99
                conf.dircarga99 = dir_c_mt99
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

            # ARREGLAR
            if request.method == 'POST':
                form = request.POST
                print (form)

            context = {'empresa': empresa[0], 'conf': conf[0]}
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

            context = {'archivos':archivos, 'cuentas':cuentas, 'campos_disp':campos_disp}
            return render(request, template, context)
        
        # ninguna, deberia raise 404
        return render(request, "matcher/index.html", {})


@login_required(login_url='/login')
def seg_Usuarios(request):
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
            sesion, creado = Sesion.objects.get_or_create(login=usrlogin, defaults={'usuario_idusuario':usuario, 'estado':"Pendiente", 'fecha_registro':timenow(), 'conexion':0, 'ldap':usrldap, 'salt':salt, 'pass_field':hashp})
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

            # Buscar sesion
            sesion = Sesion.objects.filter(pk=sessid)[0]
            sesion.ldap = usrldap
            sesion.save()

            # Buscar perfil asignados
            perfil = Perfil.objects.filter(pk=usrperf)[0]

            # Buscar y modificar usuario
            try:
                usuario = Usuario.objects.filter(pk=sesion.usuario_idusuario.idusuario)[0]
                usuario.ci = usrci
                usuario.perfil_idperfil = perfil
                usuario.nombres = usrnom
                usuario.apellidos = usrapell
                usuario.direccion = usrdir
                usuario.telefono = usrtlf
                usuario.mail = usrmail
                usuario.observaciones = usrobs
                usuario.save()
            except:
                msg = "No se pudo modificar el usuario especificado."
                return JsonResponse({'msg': msg, 'modif': False})

            # Buscar cuentas asignadas al usuario
            cuentas_old = UsuarioCuenta.objects.filter(usuario_idusuario=usuario)
            for cuenta in cuentas_old:
                cuenta.delete()

            # Crear relacion usuario cuentas
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
        sesion_list = Sesion.objects.all()
        perfiles = Perfil.objects.all().order_by('nombre')
        cuentas = Cuenta.objects.all().order_by('codigo')
        # filtrar por usuario
        context = {'sesiones': sesion_list, 'perfiles':perfiles, 'cuentas':cuentas }
        template = "matcher/seg_Usuarios.html"

        return render(request, template, context)

@login_required(login_url='/login')
def seg_Perfiles(request):
    if request.method == "POST":
        actn = request.POST.get('action')
        
        if actn == 'sel':
            perfid = int(request.POST.get('perfid'))
            perfil_funcs = PerfilOpcion.objects.all()
            funciones = [opcion for opcion in perfil_funcs if opcion.perfil_idperfil.idperfil == perfid]
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
        sub_index = [2,3,4,5,10]
        perfiles = Perfil.objects.all().order_by('nombre')

        opciones = Opcion.objects.exclude(funprincipal__in=sub_index).order_by('nombre')
        nosub = [opcion.nombre for opcion in opciones]
        nosubid = [str(opcion.idopcion) for opcion in opciones]

        context = {'perfiles': perfiles, 'opciones':opciones, 'nosub':nosub, 'nosubid':nosubid}
        template = "matcher/seg_Perfiles.html"

        return render(request, template, context)

@login_required(login_url='/login')
def seg_Logs(request):
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
        usuarios = Usuario.objects.all()
        eventos_acc = [evento.accion for evento in eventos]
        fecha_hoy = ("/").join(str(timenow().date()).split("-")[::-1])
        context = {'eventos':eventos, 'usuarios':usuarios, 'eventos_acc':eventos_acc, 'fecha_hoy':fecha_hoy}
        template = "matcher/seg_Logs.html"

        return render(request, template, context)


@login_required(login_url='/login')
def seg_backupRestore(request):
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
        cuentas_list = Cuenta.objects.all().order_by('codigo')
        # filtrar por usuario
        context = {'cuentas': cuentas_list}
        template = "matcher/seg_backupRestore.html"

        return render(request, template, context)

@login_required(login_url='/login')
def admin_bancos(request):

    if request.method == 'POST':
        actn = request.POST.get('action')

        if actn == 'add':
            bancocod = request.POST.get('bancocod').upper()
            banconom = request.POST.get('banconom')
            msg = "Banco agregado exitosamente."

            banco, creado = BancoCorresponsal.objects.get_or_create(codigo=bancocod, defaults={'nombre':banconom})
            
            if creado:
                log(request,30,bancocod)
            else:
                msg = "Ese banco ya existe en la Base de datos."

            return JsonResponse({'msg': msg, 'bancoid': banco.idbanco, 'bancon': banco.nombre, 'bancoc': banco.codigo, 'creado': creado})

        elif actn == 'upd':
            bancoid = request.POST.get('bancoid')
            bancocod = request.POST.get('bancocod').upper()
            banconom = request.POST.get('banconom')
            msg = "Banco modificado exitosamente."

            try:
                banco = BancoCorresponsal.objects.get(idbanco=bancoid)
            except BancoCorresponsal.DoesNotExist:
                msg = "No se encontro el banco especificado, asegurese de hacer click en el banco a modificar."
                return JsonResponse({'msg': msg, 'bancoid': bancoid, 'modif': False})

            bancoaux = BancoCorresponsal.objects.filter(codigo=bancocod)
            if (len(bancoaux)>0 and (bancoaux[0].idbanco != banco.idbanco)):
                msg = "Ya existe un banco con ese codigo en la base de datos."
                return JsonResponse({'msg': msg, 'bancoid': bancoaux[0].idbanco, 'bancon':bancoaux[0].nombre , 'bancoc':bancoaux[0].codigo, 'modif': False})
            
            banco.codigo = bancocod
            banco.nombre = banconom
            banco.save()

            #Para el log
            log(request,31,banco.codigo)

            return JsonResponse({'msg': msg, 'bancoid': bancoid, 'bancon':banconom , 'bancoc':bancocod,'modif': True})

        elif actn == 'del':

            msg = "Banco eliminado exitosamente."
            bancoid = request.POST.get('bancoid')

            try:
                banco = BancoCorresponsal.objects.get(idbanco=bancoid)
            except BancoCorresponsal.DoesNotExist:
                msg = "No se encontro el banco especificado, asegurese de hacer click en el banco a eliminar."
                return JsonResponse({'msg': msg, 'bancoid': bancoid, 'elim': False})

            #Para el log
            log(request,32,banco.codigo)

            banco.delete()
            return JsonResponse({'msg': msg, 'bancoid': bancoid, 'elim': True})

    if request.method == 'GET':
        bancos = BancoCorresponsal.objects.all()

        context = {'bancos': bancos, 'idioma': "es"}
        template = "matcher/admin_bancos.html"

        return render(request, template, context)

@login_required(login_url='/login')
def admin_monedas(request):

    if request.method == 'POST':
        actn = request.POST.get('action')

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
            msg = "Moneda modificada exitosamente."

            try:
                moneda = Moneda.objects.get(idmoneda=monedaid)
            except Moneda.DoesNotExist:
                msg = "No se encontro la moneda especificada, asegurese de hacer click en la moneda a modificar."
                return JsonResponse({'msg': msg, 'monedaid': monedaid, 'modif': False})

            monedaaux = Moneda.objects.filter(codigo=monedacod)
            if (len(monedaaux)>0 and (monedaaux[0].idmoneda != moneda.idmoneda)):
                msg = "Ya existe una moneda con ese codigo en la base de datos."
                return JsonResponse({'msg': msg, 'monedaid': monedaaux[0].idmoneda, 'monnom':monedaaux[0].nombre , 'moncod':monedaaux[0].codigo, 'moncam':monedaaux[0].cambio_usd,'modif': False})
            
            moneda.codigo = monedacod
            moneda.nombre = monedanom
            moneda.cambio_usd = monedacam
            moneda.save()

            #Para el log
            log(request,34,moneda.codigo)

            return JsonResponse({'msg': msg, 'monedaid': monedaid, 'monnom':monedanom , 'moncod':monedacod, 'moncam':monedacam,'modif': True})

        elif actn == 'del':

            msg = "Moneda eliminada exitosamente."
            monedaid = request.POST.get('monedaid')

            try:
                moneda = Moneda.objects.get(idmoneda=monedaid)
            except Moneda.DoesNotExist:
                msg = "No se encontro la moneda especificada, asegurese de hacer click en la moneda a eliminar previamente."
                return JsonResponse({'msg': msg, 'monedaid': monedaid, 'elim': False})

            #Para el log
            log(request,35,moneda.codigo)

            moneda.delete()
            return JsonResponse({'msg': msg, 'monedaid': monedaid, 'elim': True})

    if request.method == 'GET':
        template = "matcher/admin_monedas.html"
        monedas = Moneda.objects.all()

        context = {'monedas': monedas}
        return render(request, template, context)

@login_required(login_url='/login')
def admin_cuentas(request):
    if request.method == 'POST':
        actn = request.POST.get('action')

        if actn == 'encaje_S':
            cuentaid = int(request.POST.get('cuentaid'))
            encajes = Encajelegal.objects.all()
            encajeC = [encaje for encaje in encajes if encaje.cuenta_idcuenta.idcuenta == cuentaid]

            res_json = serializers.serialize('json', encajeC)
        
            return JsonResponse(res_json, safe=False)

        if actn == 'encaje_add':
            msg="Encaje agregado exitosamente."
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
                msg = "No se encontro el criterio especificado."
                return JsonResponse({'msg': msg, 'add': False})

            try:
                banco = BancoCorresponsal.objects.get(pk=bancoid)
            except BancoCorresponsal.DoesNotExist:
                msg = "No se encontro el banco especificado."
                return JsonResponse({'msg': msg, 'add': False})

            try:
                moneda = Moneda.objects.get(pk=monedaid)
            except Moneda.DoesNotExist:
                msg = "No se encontro la moneda especificada."
                return JsonResponse({'msg': msg, 'add': False})

            cuenta =  Cuenta.objects.create(criterios_match_idcriterio = criterio, banco_corresponsal_idbanco = banco, codigo=codigo, moneda_idmoneda=moneda, ref_nostro=ref_nostro, ref_vostro=ref_vostro, descripcion=desc, estado=estado, tiempo_retension=tretencion, num_saltos=nsaltos, transaccion_giro=tgiro, intraday=intraday, correo_alertas=mailalertas, tipo_cta=tipo_cta, tipo_cargacont=tcargcont, tipo_carga_corr=tcargcorr, tipo_proceso=tproc)
                       
            #Se crean las alertas seleccionadas
            if alertas:
                for elem in alertas:
                    alertaval = elem.split(',')
                    alertacod = alertaval[0]

                    alerta = Alertas.objects.get(idalertas=alertacod)
                    valor = int(alertaval[1])

                    AlertasCuenta.objects.create(alertas_idalertas=alerta,cuenta_idcuenta=cuenta,valor=valor)

            msg = "Cuenta creada satisfactoriamente."
            #Para el log
            log(request,21,codigo)
            return JsonResponse({'msg':msg, 'cuentaid':cuenta.pk ,'criterioid':criterioid, 'criterionom':criterio.nombre,'codigo':codigo, 'bancoid':bancoid, 'bancocod':banco.codigo ,'monedaid':monedaid, 'monedacod':moneda.codigo ,'ref_nostro':ref_nostro, 'ref_vostro':ref_vostro, 'desc':desc, 'estado':estado, 'tretencion':tretencion, 'nsaltos':nsaltos,'tgiro':tgiro,'intraday':intraday,'mailalertas':mailalertas,'tipo_cta':tipo_cta,'tcargcont':tcargcont,'tcargcorr':tcargcorr,'tproc':tproc, 'add': True})

        if actn == 'del':
            cuentaid = int(request.POST.get('cuentaid'))
            msg = "Cuenta eliminada exitosamente."

            cuenta = Cuenta.objects.get(pk=cuentaid)
            #Para el log
            log(request,23,cuenta.codigo)            

            cuenta.delete()
            return JsonResponse({'msg': msg, 'cuentaid': cuentaid, 'elim': True})

        if actn == 'upd':
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
                msg = "No se encontro la cuenta especificada."
                return JsonResponse({'msg': msg, 'modif': False})

            if (cuenta.criterios_match_idcriterio.idcriterio != criterioid):
                try:
                    criterio = CriteriosMatch.objects.get(pk=criterioid)
                except CriteriosMatch.DoesNotExist:
                    msg = "No se encontro el criterio especificado."
                    return JsonResponse({'msg': msg, 'modif': False})

                cuenta.criterios_match_idcriterio = criterio
            
            if (cuenta.banco_corresponsal_idbanco.idbanco!=bancoid):
                try:
                    banco = BancoCorresponsal.objects.get(pk=bancoid)
                except CriteriosMatch.DoesNotExist:
                    msg = "No se encontro el banco especificado."
                    return JsonResponse({'msg': msg, 'modif': False})

                cuenta.banco_corresponsal_idbanco = banco

            if (cuenta.moneda_idmoneda.idmoneda!=monedaid):
                try:
                    moneda = Moneda.objects.get(pk=monedaid)
                except Moneda.DoesNotExist:
                    msg = "No se encontro la moneda especificada."
                    return JsonResponse({'msg': msg, 'modif': False})

                cuenta.moneda_idmoneda = moneda

            cuenta.codigo = codigo
            cuenta.ref_nostro = ref_nostro
            cuenta.ref_vostro = ref_vostro
            cuenta.descripcion = desc
            cuenta.estado = estado
            cuenta.tiempo_retension = tretencion
            cuenta.num_saltos = nsaltos
            cuenta.transaccion_giro = tgiro
            cuenta.intraday = intraday
            cuenta.correo_alertas = mailalertas
            cuenta.tipo_cta = tipo_cta
            cuenta.tipo_cargacont = tcargcont
            cuenta.tipo_carga_corr = tcargcorr
            cuenta.tipo_proceso = tproc

            cuenta.save()

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

            msg = "Cuenta modificada satisfactoriamente."

            #Para el log
            log(request,22,cuenta.codigo)

            return JsonResponse({'msg':msg, 'cuentaid':cuenta.pk ,'criterioid':criterioid, 'criterionom':criterio.nombre,'codigo':codigo, 'bancoid':bancoid, 'bancocod':banco.codigo ,'monedaid':monedaid, 'monedacod':moneda.codigo ,'ref_nostro':ref_nostro, 'ref_vostro':ref_vostro, 'desc':desc, 'estado':estado, 'tretencion':tretencion, 'nsaltos':nsaltos,'tgiro':tgiro,'intraday':intraday,'mailalertas':mailalertas,'tipo_cta':tipo_cta,'tcargcont':tcargcont,'tcargcorr':tcargcorr,'tproc':tproc, 'modif': True})


    if request.method == 'GET':
        cuentas = Cuenta.objects.all().order_by('codigo')
        bancos = BancoCorresponsal.objects.all().order_by('codigo')
        monedas = Moneda.objects.all().order_by('codigo')
        criterios = CriteriosMatch.objects.all().order_by('nombre')
        alertas = []

        for cuenta in cuentas:
            alertC = AlertasCuenta.objects.filter(cuenta_idcuenta=cuenta).select_related('alertas_idalertas')
            alertas.append([[alerta.alertas_idalertas.idalertas,alerta.valor] for alerta in alertC])

        template = "matcher/admin_cuentas.html"
        context = {'cuentas':cuentas, 'bancos':bancos, 'monedas':monedas, 'alertas':alertas, 'criterios':criterios}
        return render(request, template, context)

@login_required(login_url='/login')
def admin_reglas_transf(request):
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
                return JsonResponse({'msg': msg, 'reglaid': reglaid, 'add': False})

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

        cuentas = Cuenta.objects.all()


        template = "matcher/admin_reglasTransf.html"
        context = {'cuentas':cuentas}
        return render(request, template, context)

@login_required(login_url='/login')
def admin_crit_reglas(request):

    if request.method == 'POST':
        actn = request.POST.get('action')

        if actn == 'add':
            msg = "Criterio creado exitosamente."
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
                msg = "Hubo un error, por favor verificar que los campos esten correctos e intente nuevamente."
                return JsonResponse({'msg':msg, 'creado':False})

            return JsonResponse({'msg':msg, 'criterioid':criterio.idcriterio,'criterionom':criterionom, 'criteriomon1':criteriomon1,'criteriomon2':criteriomon2,'criteriomon3':criteriomon3,'criterioF1':criterioF1,'criterioF2':criterioF2,'criterioF3':criterioF3,'criterioF4':criterioF4,'criterioF5':criterioF5, 'creado': True})
                
        if actn == 'del':
            msg = "Criterio eliminado exitosamente."
            criterioid = request.POST.get('criterioid')

            try:
                criterio = CriteriosMatch.objects.get(idcriterio=criterioid)
            except CriteriosMatch.DoesNotExist:
                msg = "No se encontro el criterio especificado, asegurese de hacer click en el criterio a eliminar previamente."
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
            msg = "Criterio modificado exitosamente."

            try:
               criterio = CriteriosMatch.objects.get(idcriterio=criterioid)
            except CriteriosMatch.DoesNotExist:
                msg = "No se encontro el criterio especificado, asegurese de hacer click en el criterio a modificar."
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
        context = {'criterios':criterios}
        return render(request, template, context)

def NoneNotEmpty(s):
    if s and s!="None":
        return s
    else:
        return None
