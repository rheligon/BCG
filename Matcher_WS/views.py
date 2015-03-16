from django.core import serializers
from django.shortcuts import render, get_object_or_404
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django import forms

from Matcher.models import *

from django.db import connection

from django.views.decorators.csrf import csrf_exempt

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.contrib.auth.hashers import *
from datetime import datetime

import os
from Matcher_WS.settings import ARCHIVOS_FOLDER

def test(request):
    print(request.META.get('COMPUTERNAME'))
    path = ARCHIVOS_FOLDER+'\CONTA\CARGADO\\'
    filenames = next(os.walk(path))[2]
    print (filenames)

    #for archivo in filenames:
    archivo = path+filenames[0]
    with open(archivo,'r') as f:
        for line in f:
            print (line.replace('\n',''))

    context = {}
    template = "matcher/index.html"
    return render(request, template, context)

def timenow():
    return datetime.now().replace(microsecond=0)

@login_required(login_url='/login')
def index(request):
    context = {}
    template = "matcher/index.html"
    return render(request, template, context)

@csrf_exempt
def usr_register(request):
    template = "matcher/register.html"

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        print (form)
        if form.is_valid():
            new_user = form.save()
            return HttpResponseRedirect("/login")
    else:
        form = UserCreationForm()

    return render(request, template, {'form': form})

def usr_login(request):
    message = None

    # if the request method is POST the process the POST values otherwise just render the page
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None and user.is_active:
            # Correct password, and the user is marked "active"
            auth.login(request, user)
            message = "Login successful"
            # Redirect to dashboard
            return HttpResponseRedirect('/')
        else:
            # Show a message     
            message ='Your username and password combination are incorrect.'

    context = {'message': message}
    template = "matcher/login.html"
    return render(request, template, context)

def usr_logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/')

@login_required(login_url='/login')             
def usr_profile_details(request):
    date = timezone.now()
    email = request.user.email
    name = ' '.join([request.user.first_name, request.user.last_name])
    joined = request.user.date_joined
    username = request.user.username

    context = {'date': date, 'email':email, 'name':name, 'joined':joined, 'username':username}
    template = "matcher/profile_details.html"
    return render(request, template, context)

@login_required(login_url='/login')
def usr_profile_edit(request):
    context = {}
    template = "matcher/profile_edit.html"
    return render(request, template, context)

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

    ## ESTO ERA PARA LA PAGINACION
    # paginator = Paginator(cuentas_list, 12) # Show 5 cuentas per page

    # page = request.GET.get('page')
    # try:
    #     cuentas = paginator.page(page)
    # except PageNotAnInteger:
    #     # If page is not an integer, deliver first page.
    #     cuentas = paginator.page(1)
    # except EmptyPage:
    #     # If page is out of range (e.g. 9999), deliver last page of results.
    #     cuentas = paginator.page(paginator.num_pages)

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
        cuenta = Cuenta.objects.filter(idcuenta=cuenta_id)
        cuenta = cuenta[0]
        cons = None
        cod = ['C']*4


    context = {'cuenta': cuenta, 'cons':cons, 'cod': cod}
    template = "matcher/ResumenCuenta.html"

    return render(request, template, context)

@login_required(login_url='/login')
def estado_cuentas(request):

    if request.method == 'POST':

        cuentaid = int(request.POST.get('cuentaid'))

        if (cuentaid<0):
            msg = 'Estado de cuenta eliminado exitosamente'
            edcid = request.POST.get('edcid')
            cop = request.POST.get('cop')

            if (cop == 'carg'):
                try:
                    cargados = Cargado.objects.all()
                    edc = [cargado.estado_cuenta_idedocuenta for cargado in cargados if cargado.estado_cuenta_idedocuenta.codigo == edcid]
                    conocor = edc[0].origen
                except Cargado.DoesNotExist:
                    msg = "No se encontro el estado de cuenta especificado, asegurese de hacer click en el estado de cuenta a eliminar."
                    return JsonResponse({'msg': msg, 'elim': False, 'conocor': conocor, 'codigo': edcid})

                cargado = Cargado.objects.get(estado_cuenta_idedocuenta=edc[0].idedocuenta)
                
                cargado.delete()
                edc[0].delete()
                return JsonResponse({'msg': msg, 'elim': True, 'conocor': conocor, 'codigo': edcid})
            elif (cop == 'proc'):
                try:
                    procesados = Procesado.objects.all()
                    edc = [procesado.estado_cuenta_idedocuenta for procesado in procesados if procesado.estado_cuenta_idedocuenta.codigo == edcid]
                    conocor = edc[0].origen
                except Procesado.DoesNotExist:
                    msg = "No se encontro el estado de cuenta especificado, asegurese de hacer click en el estado de cuenta a eliminar."
                    return JsonResponse({'msg': msg, 'elim': False, 'conocor': conocor, 'codigo': edcid})
                
                procesado = Procesado.objects.get(estado_cuenta_idedocuenta=edc[0].idedocuenta)
                
                procesado.delete()
                edc[0].delete()
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
        template = "matcher/estadoCuentas.html"

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
            print(request.POST)
            print("sis")
            return JsonResponse()

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
        return render(request, "matcher/login.html", {})




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

            return JsonResponse({'msg': msg, 'pwd': True})

        if actn == "del":
            msg = "Usuario eliminado exitosamente."
            sessid = request.POST.get('sessid')

            try:
                sesion = Sesion.objects.filter(idsesion=sessid)
            except Sesion.DoesNotExist:
                msg = "No se encontro la sesion especificada, asegurese de hacer click en el usuario a eliminar."
                return JsonResponse({'msg': msg, 'usrid': usrid, 'elim': False})

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
            sesion = Sesion.objects.create(usuario_idusuario=usuario, estado="Pendiente", login=usrlogin, fecha_registro=timenow(), conexion=0, ldap=usrldap, salt=salt, pass_field=hashp)
            
            # Crear relacion usuario cuentas
            for cuenta in cuentas_asig:
                try:
                    cuenta = Cuenta.objects.filter(pk=cuenta)[0]
                    UsuarioCuenta.objects.create(usuario_idusuario=usuario, cuenta_idcuenta=cuenta)
                except:
                    msg = "No se pudo crear el usuario con las cuentas especificadas."
                    return JsonResponse({'msg': msg, 'add': False})

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

            return JsonResponse({'msg': msg, 'perfid': perfil.pk, 'perfnom':perfnom, 'add': True})

        if actn == "upd":
            msg = "Perfil modificado exitosamente."
            perfid = request.POST.get('perfid')
            perfnom = request.POST.get('perfNom')
            funcs = request.POST.getlist('perfFuncs[]')

            try:
                perfil = Perfil.objects.get(idperfil=perfid)

                #Borrar opciones anteriores
                opciones = PerfilOpcion.objects.filter(perfil_idperfil=perfil)
                for opt in opciones:
                    opt.delete()

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
def seg_backupRestore(request):
    if request.method == "POST":
        actn = request.POST.get("action")

        # https://djangosnippets.org/snippets/118/
        # http://django-mssql.readthedocs.org/en/latest/usage.html

        if actn == "res":
            # Recibe el codigo de la cuenta
            cuenta = request.POST.get("cuentacod")
            msg = "Cuenta restaurada exitosamente."

            cursor = connection.cursor()
            try:
                cursor.execute('EXEC [dbo].[restoreMatcher] %s', (cuenta,))
            finally:
                cursor.close()

            return JsonResponse({'msg': msg,'restored': True})

        if actn == "bkUp":
            # No recibe nada
            msg = "Backup realizado exitosamente."

            cursor = connection.cursor()
            try:
                cursor.execute('EXEC [dbo].[backupMatcher]')
            finally:
                cursor.close()

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
            if (len(bancoaux)>0):
                msg = "Ya existe un banco con ese codigo en la base de datos."
                return JsonResponse({'msg': msg, 'bancoid': bancoaux[0].idbanco, 'bancon':bancoaux[0].nombre , 'bancoc':bancoaux[0].codigo, 'modif': False})
            
            banco.codigo = bancocod
            banco.nombre = banconom
            banco.save()
            return JsonResponse({'msg': msg, 'bancoid': bancoid, 'bancon':banconom , 'bancoc':bancocod,'modif': True})

        elif actn == 'del':

            msg = "Banco eliminado exitosamente."
            bancoid = request.POST.get('bancoid')

            try:
                banco = BancoCorresponsal.objects.get(idbanco=bancoid)
            except BancoCorresponsal.DoesNotExist:
                msg = "No se encontro el banco especificado, asegurese de hacer click en el banco a eliminar."
                return JsonResponse({'msg': msg, 'bancoid': bancoid, 'elim': False})

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
            if (len(monedaaux)>0):
                msg = "Ya existe una moneda con ese codigo en la base de datos."
                return JsonResponse({'msg': msg, 'monedaid': monedaaux[0].idmoneda, 'monnom':monedaaux[0].nombre , 'moncod':monedaaux[0].codigo, 'moncam':monedaaux[0].cambio_usd,'modif': False})
            
            moneda.codigo = monedacod
            moneda.nombre = monedanom
            moneda.cambio_usd = monedacam
            moneda.save()
            return JsonResponse({'msg': msg, 'monedaid': monedaid, 'monnom':monedanom , 'moncod':monedacod, 'moncam':monedacam,'modif': True})

        elif actn == 'del':

            msg = "Moneda eliminada exitosamente."
            monedaid = request.POST.get('monedaid')

            try:
                moneda = Moneda.objects.get(idmoneda=monedaid)
            except Moneda.DoesNotExist:
                msg = "No se encontro la moneda especificada, asegurese de hacer click en la moneda a eliminar previamente."
                return JsonResponse({'msg': msg, 'monedaid': monedaid, 'elim': False})

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
            msg = "Cuenta creada satisfactoriamente."
            return JsonResponse({'msg':msg, 'cuentaid':cuenta.pk ,'criterioid':criterioid, 'criterionom':criterio.nombre,'codigo':codigo, 'bancoid':bancoid, 'bancocod':banco.codigo ,'monedaid':monedaid, 'monedacod':moneda.codigo ,'ref_nostro':ref_nostro, 'ref_vostro':ref_vostro, 'desc':desc, 'estado':estado, 'tretencion':tretencion, 'nsaltos':nsaltos,'tgiro':tgiro,'intraday':intraday,'mailalertas':mailalertas,'tipo_cta':tipo_cta,'tcargcont':tcargcont,'tcargcorr':tcargcorr,'tproc':tproc, 'add': True})

        if actn == 'del':
            cuentaid = int(request.POST.get('cuentaid'))
            msg = "Cuenta eliminada exitosamente."

            cuenta = Cuenta.objects.get(pk=cuentaid)
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
            msg = "Cuenta modificada satisfactoriamente."
            return JsonResponse({'msg':msg, 'cuentaid':cuenta.pk ,'criterioid':criterioid, 'criterionom':criterio.nombre,'codigo':codigo, 'bancoid':bancoid, 'bancocod':banco.codigo ,'monedaid':monedaid, 'monedacod':moneda.codigo ,'ref_nostro':ref_nostro, 'ref_vostro':ref_vostro, 'desc':desc, 'estado':estado, 'tretencion':tretencion, 'nsaltos':nsaltos,'tgiro':tgiro,'intraday':intraday,'mailalertas':mailalertas,'tipo_cta':tipo_cta,'tcargcont':tcargcont,'tcargcorr':tcargcorr,'tproc':tproc, 'modif': True})


    if request.method == 'GET':
        cuentas = Cuenta.objects.all().order_by('codigo')
        bancos = BancoCorresponsal.objects.all().order_by('codigo')
        monedas = Moneda.objects.all().order_by('codigo')
        criterios = CriteriosMatch.objects.all().order_by('nombre')
        
        template = "matcher/admin_cuentas.html"
        context = {'cuentas':cuentas, 'bancos':bancos, 'monedas':monedas, 'criterios':criterios}
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
            
            return JsonResponse({'reglaid':regla.pk, 'nombre':nombre, 'mascconta':mascconta, 'masccorr':masccorr, 'selrefconta':selrefconta, 'selrefcorr':selrefcorr, 'transconta':transconta, 'transcorr':transcorr, 'tipo':tipo, 'msg':msg, 'add': True})

        if actn == 'del':
            reglaid = request.POST.get("reglaid")
            msg = "Regla eliminada exitosamente"

            try:
                regla = ReglaTransformacion.objects.get(pk=reglaid)
            except ReglaTransformacion.DoesNotExist:
                msg = "Regla no encontrada, por favor seleccione primero una regla"
                return JsonResponse ({'msg':msg, 'elim':False})

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

            print(regla.nombre)
            regla.save()
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

            criterio.monto1 = NoneNotEmpty(criteriomon1)
            criterio.monto2 = NoneNotEmpty(criteriomon2)
            criterio.monto3 = NoneNotEmpty(criteriomon3)
            criterio.fecha1 = NoneNotEmpty(criterioF1)
            criterio.fecha2 = NoneNotEmpty(criterioF2)
            criterio.fecha3 = NoneNotEmpty(criterioF3)
            criterio.fecha4 = NoneNotEmpty(criterioF4)
            criterio.fecha5 = NoneNotEmpty(criterioF5)

            criterio.save()
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
