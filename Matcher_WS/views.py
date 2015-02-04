from django.shortcuts import render, get_object_or_404
from django.contrib import auth
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django import forms

# from Matcher.models import Cuenta, BancoCorresponsal, UsuarioCuenta, Moneda

from Matcher.models import *

from django.views.decorators.csrf import csrf_exempt

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

def test(request):
    banco = get_object_or_404(BancoCorresponsal, idbanco=request.POST.get('bancoid'))
    return JsonResponse({'bancon': banco.nombre, 'bancoc': banco.codigo})

def addbank(request):
    bancocod = request.POST.get('bancocod')
    banconom = request.POST.get('banconom')

    banco, creado = BancoCorresponsal.objects.get_or_create(codigo=bancocod, nombre=banconom)
    
    return JsonResponse({'bancon': banco.nombre, 'bancoc': banco.codigo, 'creado': creado})

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
    # #cuentas_list = l_cuentas

    paginator = Paginator(cuentas_list, 12) # Show 5 cuentas per page

    page = request.GET.get('page')
    try:
        cuentas = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        cuentas = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        cuentas = paginator.page(paginator.num_pages)

    context = {'cuentas': cuentas, 'range': paginator.page_range}
    template = "matcher/ListarCuentas.html"

    return render(request, template, context)

@login_required(login_url='/login')
def resumen_cuenta(request, cuenta_id):

    conciliacion = Conciliacionconsolidado.objects.filter(cuenta_idcuenta = cuenta_id)
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


    context = {'cuenta': cuenta, 'cons':cons, 'cod': cod}
    template = "matcher/ResumenCuenta.html"

    return render(request, template, context)

@login_required(login_url='/login')
def configuracion(request, tipo):

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
        # ARREGLAR
        if request.method == 'POST':
            form = request.POST
            print (form)

        context = {}
        return render(request, template, context)
    
    #ninguna, deberia raise 404
    return render(request, "matcher/login.html", {})
    
    

@login_required(login_url='/login')
def admin_bancos(request):
    bancos = BancoCorresponsal.objects.all()

    # Esto me crea un banco nuevo con el codigo y nombre especificado
    # bancoaux = BancoCorresponsal.objects.create(codigo="Chawau", nombre="Cha-Wa-U")

    context = {'bancos': bancos}
    template = "matcher/admin_bancos.html"

    return render(request, template, context)
    
@login_required(login_url='/login')
def admin_monedas(request):
    template = "matcher/admin_monedas.html"
    monedas = Moneda.objects.all()

    context = {'monedas': monedas}
    return render(request, template, context)