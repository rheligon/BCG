from django.core import serializers
from django.shortcuts import render, get_object_or_404
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django import forms

from Matcher.models import *

from django.views.decorators.csrf import csrf_exempt

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.forms import model_to_dict

def test(request):

    fields = Cargado._meta.fields
    print(fields)

    context = {}
    template = "matcher/index.html"
    return render(request, template, context)

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
        cuentas = Cuenta.objects.all()

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
def configuracion(request, tipo):
    if request.method == 'POST':
        print (request.POST)

        if tipo == "sis":
            print("sis")

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
def admin_bancos(request):

    if request.method == 'POST':
        actn = request.POST.get('action')

        if actn == 'add':
            bancocod = request.POST.get('bancocod').upper()
            banconom = request.POST.get('banconom')

            banco, creado = BancoCorresponsal.objects.get_or_create(codigo=bancocod, nombre=banconom)
        
            return JsonResponse({'bancoid': banco.idbanco, 'bancon': banco.nombre, 'bancoc': banco.codigo, 'creado': creado})

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
            monedacam = request.POST.get('monedacam')
            msg = "Moneda modificado exitosamente."

            try:
                moneda = Moneda.objects.get(idmoneda=monedaid)
            except Moneda.DoesNotExist:
                msg = "No se encontro la moneda especificada, asegurese de hacer click en la moneda a modificar."
                return JsonResponse({'msg': msg, 'monedaid': monedaid, 'modif': False})

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

def mensajesSWIFT(request):
    template = "matcher/admin_criteriosyreglas.html"
    context = {}
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
                msg = "No se encontro la cuenta especificada, asegurese de hacer click en la regla a modificar previamente."
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
            
            criterionom = request.POST.get('criterionom')
            criteriomon1 = request.POST.get('criteriomon1')
            criteriomon2 = request.POST.get('criteriomon2')
            criteriomon3 = request.POST.get('criteriomon3')
            criterioF1 = request.POST.get('criterioF1')
            criterioF2 = request.POST.get('criterioF2')
            criterioF3 = request.POST.get('criterioF3')
            criterioF4 = request.POST.get('criterioF4')
            criterioF5 = request.POST.get('criterioF5')

            criterio, creado = CriteriosMatch.objects.get_or_create(nombre=criterionom, defaults={'num_entradas': 0})

            # Es necesario ya que si se hace save() con campos vacios="" da error la funcion
            if creado:
                if criteriomon1:
                    criterio.monto1 = criteriomon1
                else:
                    criteriomon1 = "None"
                if criteriomon2:
                    criterio.monto2 = criteriomon2
                else:
                    criteriomon2 = "None"
                if criteriomon3:
                    criterio.monto3 = criteriomon3
                else:
                    criteriomon3 = "None"
                if criterioF1:
                    criterio.fecha1 = criterioF1
                else:
                    criterioF1 = "None"
                if criterioF2:
                    criterio.fecha2 = criterioF2
                else:
                    criterioF2 = "None"
                if criterioF3:
                    criterio.fecha3 = criterioF3
                else:
                    criterioF3 = "None"
                if criterioF4:
                    criterio.fecha4 = criterioF4
                else:
                    criterioF4 = "None"
                if criterioF5:
                    criterio.fecha5 = criterioF5
                else:
                    criterioF5 = "None"

                criterio.save()

            return JsonResponse({'criterioid':criterio.idcriterio,'criterionom':criterionom, 'criteriomon1':criteriomon1,'criteriomon2':criteriomon2,'criteriomon3':criteriomon3,'criterioF1':criterioF1,'criterioF2':criterioF2,'criterioF3':criterioF3,'criterioF4':criterioF4,'criterioF5':criterioF5, 'creado': creado})
                
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

            if criteriomon1 and criteriomon1!="None":
                criterio.monto1 = criteriomon1
            else:
                criterio.monto1 = None
            if criteriomon2 and criteriomon2!="None":
                criterio.monto2 = criteriomon2
            else:
                criterio.monto2 = None
            if criteriomon3 and criteriomon3!="None":
                criterio.monto3 = criteriomon3
            else:
                criterio.monto3 = None
            if criterioF1 and criterioF1!="None":
                criterio.fecha1 = criterioF1
            else:
                criterio.fecha1 = None
            if criterioF2 and criterioF2!="None":
                criterio.fecha2 = criterioF2
            else:
                criterio.fecha2 = None
            if criterioF3 and criterioF3!="None":
                criterio.fecha3 = criterioF3
            else:
                criterio.fecha3 = None
            if criterioF4 and criterioF4!="None":
                criterio.fecha5 = criterioF4
            else:
                criterio.fecha4 = None
            if criterioF5 and criterioF5!="None":
                criterio.fecha5 = criterioF5
            else:
                criterio.fecha5 = None

            criterio.save()
            return JsonResponse({'criterioid':criterio.idcriterio,'criterionom':criterionom, 'criteriomon1':criterio.monto1,'criteriomon2':criterio.monto2,'criteriomon3':criterio.monto3,'criterioF1':criterio.fecha1,'criterioF2':criterio.fecha2,'criterioF3':criterio.fecha3,'criterioF4':criterio.fecha4,'criterioF5':criterio.fecha5,'msg':msg, 'modif': True})
             

    if request.method == 'GET':
        template = "matcher/admin_criterios_reglas.html"
        criterios = CriteriosMatch.objects.all()
        context = {'criterios':criterios}
        return render(request, template, context)