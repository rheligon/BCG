from django.conf.urls import patterns, include, url
from django.contrib import admin

from django.contrib.auth.views import login, logout

urlpatterns = patterns('',
    url(r'^test/$', 'Matcher_WS.views.test', name='test'),              

    # Admin:
    url(r'^admin/', include(admin.site.urls)),

    # Index o pagina de inicio
    url(r'^$', 'Matcher_WS.views.index', name='index'),

    # Login, Logout
    url(r'^login/$', 'Matcher_WS.views.usr_login', name='login'),
    url(r'^logout/$', 'Matcher_WS.views.usr_logout', name='logout'),

    # Resumen Cuentas
    url(r'^cuentas/$', 'Matcher_WS.views.listar_cuentas', name='listar_cuentas'),
   	url(r'^resumen/(?P<cuenta_id>\d+)/$', 'Matcher_WS.views.resumen_cuenta', name='resumen_cuenta'),

    # Estado Cuenta
    url(r'^cuentas/estado$', 'Matcher_WS.views.pd_estadoCuentas', name='estado_cuenta'),

    # Procesamiento diario
    url(r'^procd/cargAut/$', 'Matcher_WS.views.pd_cargaAutomatica', name='cargaAutomatica'),
    url(r'^procd/cargMan/$', 'Matcher_WS.views.pd_cargaManual', name='cargaManual'),
    url(r'^procd/match/$', 'Matcher_WS.views.pd_match', name='match'),
    url(r'^procd/mPropuestos/((?P<cuenta>\w+)/)?$', 'Matcher_WS.views.pd_matchesPropuestos', name='matchesPropuestos'),
    url(r'^procd/pAbiertas/$', 'Matcher_WS.views.pd_partidasAbiertas', name='partidasAbiertas'),
    url(r'^procd/mConfirmados/((?P<cuenta>\w+)/)?$', 'Matcher_WS.views.pd_matchesConfirmados', name='matchesConfirmados'),
    url(r'^procd/rep_conc/$', 'Matcher_WS.views.pd_conciliacion', name='pd_conciliacion'),
    url(r'^procd/detallesMT/((?P<mensaje>\w+)/)((?P<tipo>\w+)/)?$', 'Matcher_WS.views.pd_detallesMT', name='detallesMT'),
    
    # Reportes
    url(r'^reportes/$', 'Matcher_WS.views.reportes', name='reportes'),

    # Mensajes SWIFT (MT96-MT99)
    url(r'^mtn96/$','Matcher_WS.views.mtn96', name='mtn96'),
    url(r'^mtn99/$','Matcher_WS.views.mtn99', name='mtn99'),

    # INTRADAY
    url(r'^intraday/$', 'Matcher_WS.views.intraday', name='intraday'),
    
    # Configuración (Sistema-Archivo)
    url(r'^conf/(?P<tipo>\w+)/$', 'Matcher_WS.views.configuracion', name='configuracion'),

    #Seguridad
    url(r'^seguridad/usuarios/$', 'Matcher_WS.views.seg_Usuarios', name='seg_usuarios'),
    url(r'^seguridad/perfiles/$', 'Matcher_WS.views.seg_Perfiles', name='seg_perfiles'),
    url(r'^seguridad/logs/$', 'Matcher_WS.views.seg_Logs', name='seg_logs'),
    url(r'^seguridad/backup_restore/$', 'Matcher_WS.views.seg_backupRestore', name='seg_backupRestore'),

    # Administración
    url(r'^admin/bancos/$', 'Matcher_WS.views.admin_bancos', name='admin_bancos'),
    url(r'^admin/monedas/$', 'Matcher_WS.views.admin_monedas', name='admin_monedas'),
    url(r'^admin/cuentas/$', 'Matcher_WS.views.admin_cuentas', name='admin_cuentas'),
    url(r'^admin/archive/$', 'Matcher_WS.views.admin_archive', name='admin_archive'),
    url(r'^admin/criterios_reglas/$', 'Matcher_WS.views.admin_crit_reglas', name='admin_crit_reglas'),
    url(r'^admin/reglas_transf/$', 'Matcher_WS.views.admin_reglas_transf', name='admin_reglas_transf'),

    #Ayudas
    url(r'^ayuda/usuario/$', 'Matcher_WS.views.manual_usuario', name='manual_usuario'),
    url(r'^ayuda/sistema/$', 'Matcher_WS.views.manual_sistema', name='manual_sistema'),
    url(r'^sobre/matcher$', 'Matcher_WS.views.sobre_matcher', name='sobre_matcher'),

)