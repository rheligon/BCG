from django.conf.urls import patterns, include, url
from django.contrib import admin

from django.contrib.auth.views import login, logout

#handler404 = 'Matcher_WS.views.custom_404'
#handler500 = 'Matcher_WS.views.custom_500'
#handler403 = 'Matcher_WS.views.custom_403'
#handler400 = 'Matcher_WS.views.custom_400'

urlpatterns = patterns('',
    url(r'^test/$', 'Matcher_WS.views.test', name='test'),              

    # Admin:
    url(r'^admin/', include(admin.site.urls)),

    # Index o pagina de inicio
    url(r'^$', 'Matcher_WS.views.index', name='index'),

    # Login, Logout
    url(r'^login/$', 'Matcher_WS.views.usr_login', name='login'),
    url(r'^logout/$', 'Matcher_WS.views.usr_logout', name='logout'),

    #Cambio de clave primera vez que se logea el usuario /cambioClave/
     url(r'^cambioClave/$', 'Matcher_WS.views.cambioClave', name='cambioClave'),

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
    url(r'^procd/detallesMT/((?P<mensaje>\w+)/)((?P<tipo>\w+)/)((?P<cuenta>\w+)/)?$', 'Matcher_WS.views.pd_detallesMT', name='detallesMT'),
    url(r'^observaciones/((?P<mensaje>\w+)/)((?P<tipo>\w+)/)?$', 'Matcher_WS.views.pd_observaciones', name='observaciones'),
    
    # Reportes
    url(r'^reportes/$', 'Matcher_WS.views.reportes', name='reportes'),

    # Mensajes SWIFT (MT96-MT99)
    url(r'^mtn96/$','Matcher_WS.views.mtn96', name='mtn96'),
    url(r'^mtn99/$','Matcher_WS.views.mtn99', name='mtn99'),

    # INTRADAY
    url(r'^intraday/((?P<cuenta>\w+)/)?$', 'Matcher_WS.views.intraday', name='intraday'),
    url(r'^transIntraday/((?P<cuenta>\w+)/)?$', 'Matcher_WS.views.transIntraday', name='transIntraday'),
    
    # Configuración (Sistema-Archivo)
    url(r'^conf/(?P<tipo>\w+)/$', 'Matcher_WS.views.configuracion', name='configuracion'),

    #Seguridad
    url(r'^seguridad/usuarios/$', 'Matcher_WS.views.seg_Usuarios', name='seg_usuarios'),
    url(r'^seguridad/perfiles/$', 'Matcher_WS.views.seg_Perfiles', name='seg_perfiles'),
    url(r'^seguridad/logs/$', 'Matcher_WS.views.seg_Logs', name='seg_logs'),
    url(r'^seguridad/backup_restore/$', 'Matcher_WS.views.seg_backupRestore', name='seg_backupRestore'),
    url(r'^seguridad/licencia/$', 'Matcher_WS.views.seg_licencia', name='seg_licencia'),

    # Administración
    url(r'^admin/bancos/$', 'Matcher_WS.views.admin_bancos', name='admin_bancos'),
    url(r'^admin/monedas/$', 'Matcher_WS.views.admin_monedas', name='admin_monedas'),
    url(r'^admin/cuentas/$', 'Matcher_WS.views.admin_cuentas', name='admin_cuentas'),
    url(r'^admin/archive/$', 'Matcher_WS.views.admin_archive', name='admin_archive'),
    url(r'^admin/criterios_reglas/$', 'Matcher_WS.views.admin_crit_reglas', name='admin_crit_reglas'),
    url(r'^admin/reglas_transf/$', 'Matcher_WS.views.admin_reglas_transf', name='admin_reglas_transf'),

    #Módulo de Valores
    url(r'^valores/$', 'Matcher_WS.views.modulo_valores', name='modulo_valores'),

    #Conectividad SWIFT
    url(r'^conectividad/$', 'Matcher_WS.views.conectividadSWIFT', name='conectividadSWIFT'),

    #Ayudas
    url(r'^ayuda/usuario/$', 'Matcher_WS.views.manual_usuario', name='manual_usuario'),
    url(r'^ayuda/sistema/$', 'Matcher_WS.views.manual_sistema', name='manual_sistema'),
    url(r'^sobre/matcher$', 'Matcher_WS.views.sobre_matcher', name='sobre_matcher'),

    #SU
    url(r'^SU/licencia/$', 'Matcher_WS.views.SU_licencia', name='SU_licencia'),
    url(r'^SU/modulos/$', 'Matcher_WS.views.SU_modulos', name='SU_modulos'),

    #Macther Version
    url(r'^Matcher/version/$', 'Matcher_WS.views.Matcher_version', name='Matcher_version'),
    
)