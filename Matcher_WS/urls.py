from django.conf.urls import patterns, include, url
from django.contrib import admin

from django.contrib.auth.views import login, logout

urlpatterns = patterns('',
    url(r'^test/$', 'Matcher_WS.views.test', name='test'),              

    # Admin:
    url(r'^admin/', include(admin.site.urls)),

    # Registrar, Login, Logout
	url(r'^register/$', 'Matcher_WS.views.usr_register', name='register'),
    url(r'^login/$', 'Matcher_WS.views.usr_login', name='login'),
    url(r'^logout/$', 'Matcher_WS.views.usr_logout', name='logout'),

    # User Profile
    url(r'^profile/$', 'Matcher_WS.views.usr_profile_details', name='profile_details'),
    url(r'^profile/edit$', 'Matcher_WS.views.usr_profile_edit', name='profile_edit'),

    # Resumen Cuentas
    url(r'^cuentas/$', 'Matcher_WS.views.listar_cuentas', name='listar_cuentas'),
    url(r'^cuentas/estado$', 'Matcher_WS.views.estado_cuentas', name='estado_cuenta'),
   	url(r'^resumen/(?P<cuenta_id>\d+)$', 'Matcher_WS.views.resumen_cuenta', name='resumen_cuenta'),

    # Configuración
    url(r'^conf/(?P<tipo>\w+)$', 'Matcher_WS.views.configuracion', name='configuracion'),

    # Administración Bancos, (falta moneda, etc.)
    url(r'^admin/bancos/$', 'Matcher_WS.views.admin_bancos', name='admin_bancos'),
    url(r'^admin/monedas/$', 'Matcher_WS.views.admin_monedas', name='admin_monedas'),

    

    url(r'^$', 'Matcher_WS.views.index', name='index'),
    


)