# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [app_label]'
# into your database.
from __future__ import unicode_literals

from django.db import models

from django.conf import settings

from django.contrib.auth.models import User

import sqlserver_ado.fields


# FIELD NAMES MADE LOWERCASE

class Alertas(models.Model):
    idalertas = sqlserver_ado.fields.BigAutoField(db_column='idAlertas', primary_key=True)   
    tipo = models.CharField(db_column='Tipo', max_length=60, blank=True)  

    class Meta:
        db_table = 'Alertas'


class AlertasCuenta(models.Model):
    idalertascuenta = sqlserver_ado.fields.BigAutoField(db_column='idAlertasCuenta', primary_key=True)  
    alertas_idalertas = models.ForeignKey(Alertas, db_column='Alertas_idAlertas')  
    cuenta_idcuenta = models.ForeignKey('Cuenta', db_column='Cuenta_idCuenta')  
    valor = models.BigIntegerField(db_column='Valor')  

    class Meta:
        db_table = 'Alertas_Cuenta'


class AlertasCuentaBk(models.Model):
    idalertascuenta = models.BigIntegerField(db_column='idAlertasCuenta', primary_key=True)  
    alertas_bk_idalertas = models.BigIntegerField(db_column='Alertas_BK_idAlertas')  
    cuenta_bk_idcuenta = models.ForeignKey('CuentaBk', db_column='Cuenta_BK_idCuenta')  
    valor = models.BigIntegerField(db_column='Valor')  

    class Meta:
        db_table = 'Alertas_Cuenta_BK'


class BancoCorresponsal(models.Model):
    idbanco = sqlserver_ado.fields.BigAutoField(db_column='idBanco', primary_key=True)  
    codigo = models.CharField(db_column='Codigo', max_length=10)  
    nombre = models.CharField(db_column='Nombre', max_length=45)  

    class Meta:
        db_table = 'Banco_Corresponsal'


class BancoCorresponsalMt99(models.Model):
    banco_corresponsal_idbanco = models.ForeignKey(BancoCorresponsal, db_column='Banco_Corresponsal_idBanco', primary_key=True)  
    mt99_idmt99 = models.ForeignKey('Mt99', db_column='MT99_idMT99', primary_key=True)  

    class Meta:
        db_table = 'Banco_Corresponsal_MT99'


class Cargado(models.Model):
    estado_cuenta_idedocuenta = models.ForeignKey('EstadoCuenta', db_column='Estado_Cuenta_idEdoCuenta', primary_key=True)  

    class Meta:
        db_table = 'Cargado'


class CargadoBk(models.Model):
    estado_cuenta_bk_idedocuenta = models.ForeignKey('EstadoCuentaBk', db_column='Estado_Cuenta_BK_idEdoCuenta', primary_key=True)  

    class Meta:
        db_table = 'Cargado_BK'


class Codigo95(models.Model):
    idcodigo95 = sqlserver_ado.fields.BigAutoField(db_column='idCodigo95', primary_key=True)  
    codigo = models.BigIntegerField(db_column='Codigo', blank=True, null=True)  
    help = models.TextField(db_column='Help')  

    class Meta:
        db_table = 'Codigo95'


class Codigo96(models.Model):
    idcodigo96 = sqlserver_ado.fields.BigAutoField(db_column='idCodigo96', primary_key=True)  
    codigo = models.BigIntegerField(db_column='Codigo')  
    help = models.TextField(db_column='Help')  

    class Meta:
        db_table = 'Codigo96'


class Conciliacionconsolidado(models.Model):
    idconciliacionconsolidado = sqlserver_ado.fields.BigAutoField(db_column='idConciliacionConsolidado', primary_key=True)  
    cuenta_idcuenta = models.ForeignKey('Cuenta', db_column='Cuenta_idCuenta')  
    totalcreditoscontabilidad = models.FloatField(db_column='TotalCreditosContabilidad')  
    totaldebitoscontabilidad = models.FloatField(db_column='TotalDebitosContabilidad')  
    totalcreditoscorresponsal = models.FloatField(db_column='TotalCreditosCorresponsal')  
    totaldebitoscorresponsal = models.FloatField(db_column='TotalDebitosCorresponsal')  
    saldocontabilidad = models.FloatField(db_column='SaldoContabilidad')  
    saldocorresponsal = models.FloatField(db_column='SaldoCorresponsal')  
    balancefinalcontabilidad = models.FloatField(db_column='BalanceFinalContabilidad')  
    balancefinalcorresponsal = models.FloatField(db_column='BalanceFinalCorresponsal')  
    diferencia = models.FloatField(db_column='Diferencia')  
    realizadopor = models.CharField(db_column='RealizadoPor', max_length=60, blank=True)  

    class Meta:
        db_table = 'ConciliacionConsolidado'


class ConciliacionconsolidadoBk(models.Model):
    idconciliacionconsolidado = models.BigIntegerField(db_column='idConciliacionConsolidado', primary_key=True)  
    cuenta_bk_idcuenta = models.ForeignKey('CuentaBk', db_column='Cuenta_BK_idCuenta')  
    totalcreditoscontabilidad = models.FloatField(db_column='TotalCreditosContabilidad')  
    totaldebitoscontabilidad = models.FloatField(db_column='TotalDebitosContabilidad')  
    totalcreditoscorresponsal = models.FloatField(db_column='TotalCreditosCorresponsal')  
    totaldebitoscorresponsal = models.FloatField(db_column='TotalDebitosCorresponsal')  
    saldocontabilidad = models.FloatField(db_column='SaldoContabilidad')  
    saldocorresponsal = models.FloatField(db_column='SaldoCorresponsal')  
    balancefinalcontabilidad = models.FloatField(db_column='BalanceFinalContabilidad')  
    balancefinalcorresponsal = models.FloatField(db_column='BalanceFinalCorresponsal')  
    diferencia = models.FloatField(db_column='Diferencia')  
    realizadopor = models.CharField(db_column='RealizadoPor', max_length=60, blank=True)  

    class Meta:
        db_table = 'ConciliacionConsolidado_BK'


class Configuracion(models.Model):
    idconfiguracion = sqlserver_ado.fields.BigAutoField(db_column='idConfiguracion', primary_key=True)  
    idioma = models.IntegerField(db_column='Idioma')  
    archcontabilidadcarg = models.CharField(db_column='ArchContabilidadCarg', max_length=200)  
    archcontabilidadproc = models.CharField(db_column='ArchContabilidadProc', max_length=200)  
    archswiftcarg = models.CharField(db_column='ArchSwiftCarg', max_length=200)  
    archswiftproc = models.CharField(db_column='ArchSwiftProc', max_length=200)  
    bdhost = models.CharField(db_column='BDHost', max_length=200)  
    bddriver = models.CharField(db_column='BDDriver', max_length=200)  
    bdnombre = models.CharField(db_column='BDNombre', max_length=50)  
    bdpuerto = models.IntegerField(db_column='BDPuerto')  
    bdusuario = models.CharField(db_column='BDUsuario', max_length=50)  
    bdpass = models.CharField(db_column='BDPass', max_length=50)  
    alertasservidor = models.CharField(db_column='AlertasServidor', max_length=200, blank=True)  
    alertaspuerto = models.IntegerField(db_column='AlertasPuerto', blank=True, null=True)  
    alertasusuario = models.CharField(db_column='AlertasUsuario', max_length=50, blank=True)  
    alertaspass = models.CharField(db_column='AlertasPass', max_length=50, blank=True)  
    tiemporetentrazas = models.IntegerField(db_column='TiempoRetenTrazas', blank=True, null=True)  
    matcherhost = models.CharField(db_column='MatcherHost', max_length=200, blank=True)  
    matcherpuerto = models.IntegerField(db_column='MatcherPuerto', blank=True, null=True)  
    caducidad = models.IntegerField(db_column='Caducidad', blank=True, null=True)  
    longitud_minima = models.IntegerField(db_column='Longitud_Minima', blank=True, null=True)  
    num_intentos = models.IntegerField(db_column='Num_Intentos', blank=True, null=True)  
    num_passrecordar = models.IntegerField(db_column='Num_PassRecordar', blank=True, null=True)  
    caracteresespeciales = models.IntegerField(db_column='CaracteresEspeciales', blank=True, null=True)  
    numeros = models.IntegerField(db_column='Numeros', blank=True, null=True)  
    mayusculas = models.IntegerField(db_column='Mayusculas', blank=True, null=True)  
    alfabeticos = models.IntegerField(db_column='Alfabeticos', blank=True, null=True)  
    dirarchive = models.CharField(db_column='DirArchive', max_length=200, blank=True) 
    dirarchiveconfirmados = models.CharField(db_column='DirArchiveConfirmados', max_length=200, blank=True)  
    dirsalida95 = models.CharField(db_column='DirSalida95', max_length=200, blank=True)  
    dircarga96 = models.CharField(db_column='DirCarga96', max_length=200, blank=True)  
    dircarga99 = models.CharField(db_column='DirCarga99', max_length=200, blank=True)  
    dirsalida99 = models.CharField(db_column='DirSalida99', max_length=200, blank=True)  
    bic = models.CharField(db_column='Bic', max_length=200, blank=True)  
    ldap_ip = models.CharField(db_column='LDAP_IP', max_length=20, blank=True)  
    ldap_puerto = models.CharField(db_column='LDAP_Puerto', max_length=15, blank=True)  
    ldap_dominio = models.CharField(db_column='LDAP_Dominio', max_length=50, blank=True)
    dirprocesado96 = models.CharField(db_column='DirProcesado96', max_length=200, blank=True)  
    dirprocesado99 = models.CharField(db_column='DirProcesado99', max_length=200, blank=True)  
    dirlicencia = models.CharField(db_column='DirLicencia', max_length=200, blank=True)  
    expiracion_sesion = models.IntegerField(db_column='ExpiraSesion', blank=True, null=True)
    dirintraday = models.CharField(db_column='DirIntraday', max_length=200, blank=True)
    tiempointraday = models.IntegerField(db_column='TiempoIntraday', blank=True, null=True)
    dirintradaysalida = models.CharField(db_column='DirIntradaySalida', max_length=200, blank=True)
     
    
    class Meta:
        db_table = 'Configuracion'


class CriteriosMatch(models.Model):
    idcriterio = sqlserver_ado.fields.BigAutoField(db_column='idCriterio', primary_key=True)  
    nombre = models.CharField(db_column='Nombre', max_length=20)  
    num_entradas = models.BigIntegerField(db_column='Num_Entradas')  
    monto1 = models.FloatField(db_column='Monto1', blank=True, null=True)  
    monto2 = models.FloatField(db_column='Monto2', blank=True, null=True)  
    monto3 = models.FloatField(db_column='Monto3', blank=True, null=True)  
    fecha1 = models.IntegerField(db_column='Fecha1', blank=True, null=True)  
    fecha2 = models.IntegerField(db_column='Fecha2', blank=True, null=True)  
    fecha3 = models.IntegerField(db_column='Fecha3', blank=True, null=True)  
    fecha4 = models.IntegerField(db_column='Fecha4', blank=True, null=True)  
    fecha5 = models.IntegerField(db_column='Fecha5', blank=True, null=True)  

    class Meta:
        db_table = 'Criterios_Match'


class Cuenta(models.Model):
    idcuenta = sqlserver_ado.fields.BigAutoField(db_column='idCuenta', primary_key=True)  
    criterios_match_idcriterio = models.ForeignKey(CriteriosMatch, db_column='Criterios_Match_idCriterio')  
    banco_corresponsal_idbanco = models.ForeignKey(BancoCorresponsal, db_column='Banco_Corresponsal_idBanco')  
    codigo = models.CharField(db_column='Codigo', max_length=10)  
    moneda_idmoneda = models.ForeignKey('Moneda', db_column='Moneda_idMoneda', blank=True, null=True)  
    ref_nostro = models.CharField(db_column='Ref_Nostro', max_length=35)  
    ref_vostro = models.CharField(db_column='Ref_Vostro', max_length=35)  
    descripcion = models.CharField(db_column='Descripcion', max_length=45, blank=True)  
    estado = models.CharField(db_column='Estado', max_length=10)  
    tiempo_retension = models.IntegerField(db_column='Tiempo_Retension')  
    num_saltos = models.IntegerField(db_column='Num_Saltos')  
    transaccion_giro = models.CharField(db_column='Transaccion_Giro', max_length=20, blank=True)  
    intraday = models.CharField(db_column='Intraday', max_length=1, blank=True)  
    correo_alertas = models.CharField(db_column='Correo_Alertas', max_length=45, blank=True)  
    montoencajeactual = models.FloatField(db_column='MontoEncajeActual', blank=True, null=True)  
    fechaencajeactual = models.DateTimeField(db_column='FechaEncajeActual', blank=True, null=True)  
    ultimafechaconciliacion = models.DateTimeField(db_column='UltimaFechaConciliacion', blank=True, null=True)  
    ultimoedocuentacargs = models.BigIntegerField(db_column='UltimoEdoCuentaCargS', blank=True, null=True)  
    ultimoedocuentaprocs = models.BigIntegerField(db_column='UltimoEdoCuentaProcS', blank=True, null=True)  
    ultimoedocuentacargc = models.BigIntegerField(db_column='UltimoEdoCuentaCargC', blank=True, null=True)  
    ultimoedocuentaprocc = models.BigIntegerField(db_column='UltimoEdoCuentaProcC', blank=True, null=True)  
    concurrencia = models.IntegerField(db_column='Concurrencia', blank=True, null=True)  
    ultimafechahistorico = models.DateTimeField(db_column='UltimaFechaHistorico', blank=True, null=True)  
    tipo_cta = models.IntegerField(db_column='Tipo_Cta', blank=True, null=True)  
    tipo_cargacont = models.IntegerField(db_column='Tipo_CargaCont', blank=True, null=True)  
    tipo_carga_corr = models.IntegerField(db_column='Tipo_Carga_Corr', blank=True, null=True)  
    tipo_proceso = models.IntegerField(db_column='Tipo_Proceso', blank=True, null=True)  
    zona = models.CharField(db_column='Zona', max_length=100, blank=True)  

    class Meta:
        db_table = 'Cuenta'


class CuentaBk(models.Model):
    idcuenta = models.BigIntegerField(db_column='idCuenta', primary_key=True)  
    criterios_match_bk_idcriterio = models.BigIntegerField(db_column='Criterios_Match_BK_idCriterio')  
    banco_corresponsal_bk_idbanco = models.BigIntegerField(db_column='Banco_Corresponsal_BK_idBanco')  
    codigo = models.CharField(db_column='Codigo', max_length=10)  
    moneda_bk_idmoneda = models.BigIntegerField(db_column='Moneda_BK_idMoneda', blank=True, null=True)  
    ref_nostro = models.CharField(db_column='Ref_Nostro', max_length=35)  
    ref_vostro = models.CharField(db_column='Ref_Vostro', max_length=35)  
    descripcion = models.CharField(db_column='Descripcion', max_length=45, blank=True)  
    estado = models.CharField(db_column='Estado', max_length=10)  
    tiempo_retension = models.IntegerField(db_column='Tiempo_Retension')  
    num_saltos = models.IntegerField(db_column='Num_Saltos')  
    transaccion_giro = models.CharField(db_column='Transaccion_Giro', max_length=20, blank=True)  
    intraday = models.CharField(db_column='Intraday', max_length=1, blank=True)  
    correo_alertas = models.CharField(db_column='Correo_Alertas', max_length=45, blank=True)  
    montoencajeactual = models.FloatField(db_column='MontoEncajeActual', blank=True, null=True)  
    fechaencajeactual = models.DateTimeField(db_column='FechaEncajeActual', blank=True, null=True)  
    ultimafechaconciliacion = models.DateTimeField(db_column='UltimaFechaConciliacion', blank=True, null=True)  
    ultimoedocuentacargs = models.BigIntegerField(db_column='UltimoEdoCuentaCargS', blank=True, null=True)  
    ultimoedocuentaprocs = models.BigIntegerField(db_column='UltimoEdoCuentaProcS', blank=True, null=True)  
    ultimoedocuentacargc = models.BigIntegerField(db_column='UltimoEdoCuentaCargC', blank=True, null=True)  
    ultimoedocuentaprocc = models.BigIntegerField(db_column='UltimoEdoCuentaProcC', blank=True, null=True)  
    concurrencia = models.IntegerField(db_column='Concurrencia', blank=True, null=True)  
    ultimafechahistorico = models.DateTimeField(db_column='UltimaFechaHistorico', blank=True, null=True)  
    tipo_cta = models.IntegerField(db_column='Tipo_Cta', blank=True, null=True)  
    tipo_cargacont = models.IntegerField(db_column='Tipo_CargaCont', blank=True, null=True)  
    tipo_carga_corr = models.IntegerField(db_column='Tipo_Carga_Corr', blank=True, null=True)  
    tipo_proceso = models.IntegerField(db_column='Tipo_Proceso', blank=True, null=True)  
    zona = models.CharField(db_column='Zona', max_length=100, blank=True)  

    class Meta:
        db_table = 'Cuenta_BK'



class Encajelegal(models.Model):
    idencajelegal = sqlserver_ado.fields.BigAutoField(db_column='idEncajeLegal', primary_key=True)  
    cuenta_idcuenta = models.ForeignKey(Cuenta, db_column='Cuenta_idCuenta')  
    monto = models.FloatField(db_column='Monto')  
    fecha = models.DateTimeField(db_column='Fecha')  

    class Meta:
        db_table = 'EncajeLegal'


class EncajelegalBk(models.Model):
    idencajelegal = models.BigIntegerField(db_column='idEncajeLegal', primary_key=True)  
    cuenta_bk_idcuenta = models.ForeignKey(CuentaBk, db_column='Cuenta_BK_idCuenta')  
    monto = models.FloatField(db_column='Monto')  
    fecha = models.DateTimeField(db_column='Fecha')  

    class Meta:
        db_table = 'EncajeLegal_BK'

class EstadoCuenta(models.Model):
    idedocuenta = sqlserver_ado.fields.BigAutoField(db_column='idEdoCuenta', primary_key=True)  
    cuenta_idcuenta = models.ForeignKey(Cuenta, db_column='Cuenta_idCuenta', blank=True, null=True)  
    codigo = models.CharField(db_column='Codigo', max_length=35)  
    origen = models.CharField(db_column='Origen', max_length=1)  
    pagina = models.BigIntegerField(db_column='Pagina')  
    balance_inicial = models.FloatField(db_column='Balance_Inicial')  
    balance_final = models.FloatField(db_column='Balance_Final')  
    m_finicial = models.CharField(db_column='M_Finicial', max_length=1)  
    m_ffinal = models.CharField(db_column='M_Ffinal', max_length=1)  
    fecha_inicial = models.DateTimeField(db_column='Fecha_Inicial')  
    fecha_final = models.DateTimeField(db_column='Fecha_Final')  
    c_dinicial = models.CharField(db_column='C_DInicial', max_length=1)  
    c_dfinal = models.CharField(db_column='C_DFinal', max_length=1)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)

    def natural_key(self):
        return (self.idedocuenta, self.codigo)

    class Meta:
        db_table = 'Estado_Cuenta'
        unique_together = (('idedocuenta','codigo'),)


class EstadoCuentaBk(models.Model):
    idedocuenta = models.BigIntegerField(db_column='idEdoCuenta', primary_key=True)  
    cuenta_bk_idcuenta = models.ForeignKey(CuentaBk, db_column='Cuenta_BK_idCuenta', blank=True, null=True)  
    codigo = models.CharField(db_column='Codigo', max_length=35)  
    origen = models.CharField(db_column='Origen', max_length=1)  
    pagina = models.BigIntegerField(db_column='Pagina')  
    balance_inicial = models.FloatField(db_column='Balance_Inicial')  
    balance_final = models.FloatField(db_column='Balance_Final')  
    m_finicial = models.CharField(db_column='M_Finicial', max_length=1)  
    m_ffinal = models.CharField(db_column='M_Ffinal', max_length=1)  
    fecha_inicial = models.DateTimeField(db_column='Fecha_Inicial')  
    fecha_final = models.DateTimeField(db_column='Fecha_Final')  
    c_dinicial = models.CharField(db_column='C_DInicial', max_length=1)  
    c_dfinal = models.CharField(db_column='C_DFinal', max_length=1)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)  

    class Meta:
        db_table = 'Estado_Cuenta_BK'


class Evento(models.Model):
    idevento = models.IntegerField(db_column='IdEvento', primary_key=True)  
    accion = models.CharField(db_column='Accion', max_length=45)  

    class Meta:
        db_table = 'Evento'


class Formatoarchivo(models.Model):
    idformato = sqlserver_ado.fields.BigAutoField(db_column='idFormato', primary_key=True)  
    cuenta_idcuenta = models.ForeignKey(Cuenta, db_column='Cuenta_idCuenta')  
    nombre = models.CharField(db_column='Nombre', max_length=100)  
    separador = models.CharField(db_column='Separador', max_length=2)  
    tipo = models.CharField(db_column='Tipo', max_length=2)  
    formato = models.CharField(db_column='Formato', max_length=20)  

    class Meta:
        db_table = 'FormatoArchivo'


class FormatoarchivoBk(models.Model):
    idformato = models.BigIntegerField(db_column='idFormato', primary_key=True)  
    cuenta_bk_idcuenta = models.ForeignKey(CuentaBk, db_column='Cuenta_BK_idCuenta')  
    nombre = models.CharField(db_column='Nombre', max_length=100)  
    separador = models.CharField(db_column='Separador', max_length=2)  
    tipo = models.CharField(db_column='Tipo', max_length=2)  
    formato = models.CharField(db_column='Formato', max_length=20)  

    class Meta:
        db_table = 'FormatoArchivo_BK'


class Historicoconsolidado(models.Model):
    idhistoricoconsolidado = sqlserver_ado.fields.BigAutoField(db_column='idHistoricoConsolidado', primary_key=True)  
    fechaconciliacion = models.DateTimeField(db_column='FechaConciliacion')  
    totalcreditoscontabilidad = models.FloatField(db_column='TotalCreditosContabilidad')  
    totaldebitoscontabilidad = models.FloatField(db_column='TotalDebitosContabilidad')  
    totalcreditoscorresponsal = models.FloatField(db_column='TotalCreditosCorresponsal')  
    totaldebitoscorresponsal = models.FloatField(db_column='TotalDebitosCorresponsal')  
    saldocontabilidad = models.FloatField(db_column='SaldoContabilidad')  
    saldocorresponsal = models.FloatField(db_column='SaldoCorresponsal')  
    balancefinalcontabilidad = models.FloatField(db_column='BalanceFinalContabilidad')  
    balancefinalcorresponsal = models.FloatField(db_column='BalanceFinalCorresponsal')  
    diferencia = models.FloatField(db_column='Diferencia')  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    autorizadopor = models.CharField(db_column='AutorizadoPor', max_length=60, blank=True)  
    firmadopor = models.CharField(db_column='FirmadoPor', max_length=60, blank=True)  
    cargofirmante = models.CharField(db_column='CargoFirmante', max_length=60, blank=True)  
    realizadopor = models.CharField(db_column='RealizadoPor', max_length=60, blank=True)  
    numedo_cont = models.CharField(db_column='NumEdo_Cont', max_length=35, blank=True)  
    pag_cont = models.IntegerField(db_column='Pag_Cont', blank=True, null=True)  
    fecha_cont = models.DateTimeField(db_column='Fecha_Cont', blank=True, null=True)  
    balance_cont = models.FloatField(db_column='Balance_Cont', blank=True, null=True)  
    cd_cont = models.CharField(db_column='CD_Cont', max_length=1, blank=True)  
    numedo_corr = models.CharField(db_column='NumEdo_Corr', max_length=35, blank=True)  
    pag_corr = models.IntegerField(db_column='Pag_Corr', blank=True, null=True)  
    fecha_corr = models.DateTimeField(db_column='Fecha_Corr', blank=True, null=True)  
    balance_corr = models.FloatField(db_column='Balance_Corr', blank=True, null=True)  
    cd_corr = models.CharField(db_column='CD_Corr', max_length=1, blank=True)  
    tasa_cambio = models.FloatField(db_column='Tasa_Cambio', blank=True, null=True)  

    class Meta:
        db_table = 'HistoricoConsolidado'


class HistoricoconsolidadoBk(models.Model):
    idhistoricoconsolidado = models.BigIntegerField(db_column='idHistoricoConsolidado', primary_key=True)  
    fechaconciliacion = models.DateTimeField(db_column='FechaConciliacion')  
    totalcreditoscontabilidad = models.FloatField(db_column='TotalCreditosContabilidad')  
    totaldebitoscontabilidad = models.FloatField(db_column='TotalDebitosContabilidad')  
    totalcreditoscorresponsal = models.FloatField(db_column='TotalCreditosCorresponsal')  
    totaldebitoscorresponsal = models.FloatField(db_column='TotalDebitosCorresponsal')  
    saldocontabilidad = models.FloatField(db_column='SaldoContabilidad')  
    saldocorresponsal = models.FloatField(db_column='SaldoCorresponsal')  
    balancefinalcontabilidad = models.FloatField(db_column='BalanceFinalContabilidad')  
    balancefinalcorresponsal = models.FloatField(db_column='BalanceFinalCorresponsal')  
    diferencia = models.FloatField(db_column='Diferencia')  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    autorizadopor = models.CharField(db_column='AutorizadoPor', max_length=60, blank=True)  
    firmadopor = models.CharField(db_column='FirmadoPor', max_length=60, blank=True)  
    cargofirmante = models.CharField(db_column='CargoFirmante', max_length=60, blank=True)  
    realizadopor = models.CharField(db_column='RealizadoPor', max_length=60, blank=True)  
    numedo_cont = models.CharField(db_column='NumEdo_Cont', max_length=35, blank=True)  
    pag_cont = models.IntegerField(db_column='Pag_Cont', blank=True, null=True)  
    fecha_cont = models.DateTimeField(db_column='Fecha_Cont', blank=True, null=True)  
    balance_cont = models.FloatField(db_column='Balance_Cont', blank=True, null=True)  
    cd_cont = models.CharField(db_column='CD_Cont', max_length=1, blank=True)  
    numedo_corr = models.CharField(db_column='NumEdo_Corr', max_length=35, blank=True)  
    pag_corr = models.IntegerField(db_column='Pag_Corr', blank=True, null=True)  
    fecha_corr = models.DateTimeField(db_column='Fecha_Corr', blank=True, null=True)  
    balance_corr = models.FloatField(db_column='Balance_Corr', blank=True, null=True)  
    cd_corr = models.CharField(db_column='CD_Corr', max_length=1, blank=True)  
    tasa_cambio = models.FloatField(db_column='Tasa_Cambio', blank=True, null=True)  

    class Meta:
        db_table = 'HistoricoConsolidado_BK'


class Historicotransacciones(models.Model):
    idhistoricotransacciones = sqlserver_ado.fields.BigAutoField(db_column='idHistoricoTransacciones', primary_key=True)  
    historicoconsolidado = models.ForeignKey(Historicoconsolidado, db_column='HistoricoConsolidado_ID')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina')  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=45, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    refvostro = models.CharField(db_column='RefVostro', max_length=16, blank=True)  
    refnostro = models.CharField(db_column='RefNostro', max_length=16, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    origen = models.CharField(db_column='Origen', max_length=1)  
    observacion = models.CharField(db_column='Observacion', max_length=300, blank=True)  
    num_transaccion = models.IntegerField(db_column='Num_Transaccion')  
    fecha_salida = models.DateTimeField(db_column='Fecha_Salida', blank=True, null=True)  
    numedo = models.CharField(db_column='NumEdo', max_length=35, blank=True)  

    class Meta:
        db_table = 'HistoricoTransacciones'


class HistoricotransaccionesBk(models.Model):
    idhistoricotransacciones = models.BigIntegerField(db_column='idHistoricoTransacciones', primary_key=True)  
    historicoconsolidado_bk = models.ForeignKey(HistoricoconsolidadoBk, db_column='HistoricoConsolidado_BK_ID')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina')  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=45, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    refvostro = models.CharField(db_column='RefVostro', max_length=16, blank=True)  
    refnostro = models.CharField(db_column='RefNostro', max_length=16, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    origen = models.CharField(db_column='Origen', max_length=1)  
    observacion = models.CharField(db_column='Observacion', max_length=300, blank=True)  
    num_transaccion = models.IntegerField(db_column='Num_Transaccion')  
    fecha_salida = models.DateTimeField(db_column='Fecha_Salida', blank=True, null=True)  
    numedo = models.CharField(db_column='NumEdo', max_length=35, blank=True)  

    class Meta:
        db_table = 'HistoricoTransacciones_BK'


class Idioma(models.Model):
    ididioma = sqlserver_ado.fields.BigAutoField(db_column='idIdioma', primary_key=True)  
    espanol = models.CharField(db_column='Espanol', max_length=200)  
    ingles = models.CharField(db_column='Ingles', max_length=200)  

    class Meta:
        db_table = 'Idioma'

class Licencia(models.Model):
    idlicencia = sqlserver_ado.fields.BigAutoField(db_column='idLicencia', primary_key=True)  
    bic = models.CharField(db_column='Bic', max_length=10)  
    num_usuarios = models.IntegerField(db_column='NumeroUsuarios')
    fecha_expira = models.DateTimeField(db_column='FechaExpira')
    llave = models.CharField(db_column='Llave', max_length=500, unique=True)
    salt = models.CharField(db_column='Salt',max_length=100,unique=True)  

    class Meta:
        db_table = 'Licencia'


class Modulos(models.Model):
    idmodulo = sqlserver_ado.fields.BigAutoField(db_column='idModulo', primary_key=True)   
    opcion = models.IntegerField(db_column='opcion', unique=True)
    activo = models.IntegerField(db_column='activo')
    descripcion = models.CharField(db_column='descripcion', max_length=150)  

    class Meta:
        db_table = 'Modulos'


class Mt95(models.Model):
    idmt95 = sqlserver_ado.fields.BigAutoField(db_column='idMT95', primary_key=True)  
    ta_corres = models.ForeignKey('TransabiertaCorresponsal', db_column='TA_Corres_ID', blank=True, null=True)  
    ta_conta = models.ForeignKey('TransabiertaContabilidad', db_column='TA_Conta_ID', blank=True, null=True)  
    codigo = models.CharField(db_column='Codigo', max_length=20)  
    codigo95_idcodigo95 = models.ForeignKey(Codigo95, db_column='Codigo95_idCodigo95', blank=True, null=True)  
    ref_relacion = models.CharField(db_column='Ref_Relacion', max_length=20)  
    query = models.CharField(db_column='Query', max_length=45)  
    narrativa = models.CharField(db_column='Narrativa', max_length=100)  
    num_mt = models.BigIntegerField(db_column='Num_MT', blank=True, null=True)  
    fecha_msg_original = models.DateTimeField(db_column='Fecha_Msg_Original', blank=True, null=True)  
    num_sesion = models.BigIntegerField(db_column='Num_Sesion', blank=True, null=True)  
    isn = models.BigIntegerField(db_column='ISN', blank=True, null=True)  
    opcion = models.BigIntegerField(db_column='Opcion', blank=True, null=True)  
    campo79 = models.TextField(db_column='Campo79', blank=True)  

    class Meta:
        db_table = 'MT95'


class Mt95Bk(models.Model):
    idmt95 = models.BigIntegerField(db_column='idMT95', primary_key=True)  
    ta_corres_bk_id = models.BigIntegerField(db_column='TA_Corres_BK_ID', blank=True, null=True)  
    ta_conta_bk_id = models.BigIntegerField(db_column='TA_Conta_BK_ID', blank=True, null=True)  
    codigo = models.CharField(db_column='Codigo', max_length=20)  
    codigo95_bk_idcodigo95 = models.BigIntegerField(db_column='Codigo95_BK_idCodigo95', blank=True, null=True)  
    ref_relacion = models.CharField(db_column='Ref_Relacion', max_length=20)  
    query = models.CharField(db_column='Query', max_length=45)  
    narrativa = models.CharField(db_column='Narrativa', max_length=100)  
    num_mt = models.BigIntegerField(db_column='Num_MT', blank=True, null=True)  
    fecha_msg_original = models.DateTimeField(db_column='Fecha_Msg_Original', blank=True, null=True)  
    num_sesion = models.BigIntegerField(db_column='Num_Sesion', blank=True, null=True)  
    isn = models.BigIntegerField(db_column='ISN', blank=True, null=True)  
    opcion = models.BigIntegerField(db_column='Opcion', blank=True, null=True)  
    campo79 = models.TextField(db_column='Campo79', blank=True)  

    class Meta:
        db_table = 'MT95_BK'


class Mt96(models.Model):
    idmt96 = sqlserver_ado.fields.BigAutoField(db_column='IdMT96', primary_key=True)  
    mt95_idmt95 = models.ForeignKey(Mt95, db_column='MT95_idMT95', blank=True, null=True)  
    codigo = models.CharField(db_column='Codigo', max_length=20)  
    codigo96_idcodigo96 = models.ForeignKey(Codigo96, db_column='Codigo96_idCodigo96', blank=True, null=True)  
    ref_relacion = models.CharField(db_column='Ref_Relacion', max_length=20)  
    answer = models.CharField(db_column='Answer', max_length=45)  
    narrativa = models.CharField(db_column='Narrativa', max_length=100)  
    num_mt = models.BigIntegerField(db_column='Num_MT', blank=True, null=True)  
    fecha_msg_original = models.DateTimeField(db_column='Fecha_Msg_Original', blank=True, null=True)  
    num_sesion = models.BigIntegerField(db_column='Num_Sesion', blank=True, null=True)  
    isn = models.BigIntegerField(db_column='ISN', blank=True, null=True)  
    opcion = models.BigIntegerField(db_column='Opcion', blank=True, null=True)  
    campo79 = models.TextField(db_column='Campo79', blank=True)  

    class Meta:
        db_table = 'MT96'


class Mt99(models.Model):
    idmt99 = sqlserver_ado.fields.BigAutoField(db_column='idMT99', primary_key=True)  
    codigo = models.CharField(db_column='Codigo', max_length=16)  
    ref_relacion = models.CharField(db_column='Ref_Relacion', max_length=16)  
    narrativa = models.CharField(db_column='Narrativa', max_length=1784)  
    bic = models.CharField(db_column='BIC', max_length=10)  
    fecha = models.DateTimeField(db_column='Fecha')  
    tipo_mt = models.IntegerField(db_column='Tipo_MT')  
    origen = models.IntegerField(db_column='Origen', blank=True, null=True)  

    class Meta:
        db_table = 'MT99'

class Mt103(models.Model):
    idmt103 = sqlserver_ado.fields.BigAutoField(db_column='idMT103', primary_key=True)  
    ref_remitente = models.CharField(db_column='ref_remitente', max_length=16)  
    ind_hora = models.TextField(db_column='ind_hora',null=True)  
    tipo_op_banco = models.CharField(db_column='tipo_op_banco', max_length=4)  
    cod_instruccion = models.TextField(db_column='cod_instruccion',null=True)  
    tipo_transaccion = models.CharField(db_column='tipo_transaccion', max_length=3,null=True)  
    fecha_moneda_monto = models.CharField(db_column='fecha_moneda_monto', max_length=24)  
    moneda_monto = models.CharField(db_column='moneda_monto', max_length=18,null=True)  
    tipo_cambio = models.CharField(db_column='tipo_cambio', max_length=12,null=True)  
    cliente_ordenante = models.CharField(db_column='cliente_ordenante', max_length=200)  
    institucion_emisor = models.CharField(db_column='institucion_emisor', max_length=55,null=True)  
    institucion_ordenante = models.CharField(db_column='institucion_ordenante', max_length=200,null=True)  
    corresponsal_remitente = models.CharField(db_column='corresponsal_remitente', max_length=200,null=True)  
    corresponsal_receptor = models.CharField(db_column='corresponsal_receptor', max_length=200,null=True)  
    institucion_reembolso = models.CharField(db_column='institucion_reembolso', max_length=200,null=True)  
    institucion_intermediaria = models.CharField(db_column='institucion_intermediaria', max_length=200,null=True)  
    cuenta_institucion = models.CharField(db_column='cuenta_institucion', max_length=200,null=True)  
    cliente_beneficiario = models.CharField(db_column='cliente_beneficiario', max_length=200)  
    info_remesa = models.CharField(db_column='info_remesa', max_length=200,null=True)  
    detalle_cargos = models.CharField(db_column='detalle_cargos', max_length=3)  
    cargos_remitente = models.TextField(db_column='cargos_remitente',null=True)  
    cargos_receptor = models.CharField(db_column='cargos_receptor', max_length=18,null=True)  
    info_remitente_a_receptor = models.CharField(db_column='info_remitente_a_receptor', max_length=250,null=True)
    reporte_regulatorio = models.CharField(db_column='reporte_regulatorio', max_length=120,null=True)
    cuenta = models.ForeignKey(Cuenta, db_column='cuenta', null=True)
    remitente = models.CharField(db_column='remitente', max_length=12)  
    receptor = models.CharField(db_column='receptor', max_length=12)  
    
    class Meta:
        db_table = 'MT103'

class Mt202(models.Model):
    idmt202 = sqlserver_ado.fields.BigAutoField(db_column='idMT202', primary_key=True)  
    ref_transaccion = models.CharField(db_column='ref_transaccion', max_length=16)  
    ref_relacion = models.CharField(db_column='ref_relacion', max_length=16)  
    ind_hora = models.TextField(db_column='ind_hora',null=True)  
    fecha_moneda_monto = models.CharField(db_column='fecha_moneda_monto', max_length=24)  
    institucion_ordenante = models.CharField(db_column='institucion_ordenante', max_length=200,null=True)  
    corresponsal_remitente = models.CharField(db_column='corresponsal_remitente', max_length=200,null=True)  
    corresponsal_receptor = models.CharField(db_column='corresponsal_receptor', max_length=200,null=True)  
    intermediario = models.CharField(db_column='intermediario', max_length=200,null=True)  
    cuenta_institucion = models.CharField(db_column='cuenta_institucion', max_length=200,null=True)  
    institucion_beneficiaria = models.CharField(db_column='institucion_beneficiaria', max_length=200)  
    info_remitente_a_receptor = models.CharField(db_column='info_remitente_a_receptor', max_length=250,null=True)
    cuenta = models.ForeignKey(Cuenta, db_column='cuenta', null=True)
    remitente = models.CharField(db_column='remitente', max_length=12)  
    receptor = models.CharField(db_column='receptor', max_length=12)  
    
    class Meta:
        db_table = 'MT202'

class Mt942(models.Model):
    idmt942 = sqlserver_ado.fields.BigAutoField(db_column='idMT942', primary_key=True)  
    ref_transaccion = models.CharField(db_column='ref_transaccion', max_length=16)  
    ref_relacion = models.CharField(db_column='ref_relacion', max_length=16,null=True)  
    id_cuenta = models.CharField(db_column='id_cuenta', max_length=35)  
    edo_cuenta_secuencia = models.CharField(db_column='edo_cuenta_secuencia', max_length=11)  
    limite_cd = models.CharField(db_column='limite_cd', max_length=19)  
    limite_credito = models.CharField(db_column='limite_credito', max_length=19,null=True)  
    fecha_hora = models.CharField(db_column='fecha_hora', max_length=15)  
    info_owner = models.TextField(db_column='info_owner',null=True)  
    total_debitos = models.CharField(db_column='total_debitos', max_length=23,null=True)  
    total_creditos = models.CharField(db_column='total_creditos', max_length=23,null=True)  
    info_owner_final = models.CharField(db_column='info_owner_final', max_length=450,null=True)  
    cuenta = models.ForeignKey(Cuenta, db_column='cuenta', null=True)
    remitente = models.CharField(db_column='remitente', max_length=12)  
    receptor = models.CharField(db_column='receptor', max_length=12)  
    
    class Meta:
        db_table = 'MT942'


class Matchconfirmado(models.Model):
    idmatch = sqlserver_ado.fields.BigAutoField(db_column='idMatch', primary_key=True)  
    tc_corres = models.ForeignKey('TranscerradaCorresponsal', db_column='TC_Corres_ID', blank=True, null=True)  
    tc_conta = models.ForeignKey('TranscerradaContabilidad', db_column='TC_Conta_ID', blank=True, null=True)  
    fecha = models.DateTimeField(db_column='Fecha')  
    auto_manual = models.IntegerField(db_column='Auto_Manual')  
    justificacion = models.CharField(db_column='Justificacion', max_length=100, blank=True)  
    codigomatch = models.CharField(db_column='CodigoMatch', max_length=20)  
    tipo_proceso = models.IntegerField(db_column='Tipo_Proceso', blank=True, null=True)  

    class Meta:
        db_table = 'MatchConfirmado'


class MatchconfirmadoBk(models.Model):
    idmatch = models.BigIntegerField(db_column='idMatch', primary_key=True)  
    tc_corres_bk_id = models.BigIntegerField(db_column='TC_Corres_BK_ID', blank=True, null=True)  
    tc_conta_bk_id = models.BigIntegerField(db_column='TC_Conta_BK_ID', blank=True, null=True)  
    fecha = models.DateTimeField(db_column='Fecha')  
    auto_manual = models.IntegerField(db_column='Auto_Manual')  
    justificacion = models.CharField(db_column='Justificacion', max_length=100, blank=True)  
    codigomatch = models.CharField(db_column='CodigoMatch', max_length=20)  
    tipo_proceso = models.IntegerField(db_column='Tipo_Proceso', blank=True, null=True)  

    class Meta:
        db_table = 'MatchConfirmado_BK'


class Matchpropuestos(models.Model):
    idmatch = sqlserver_ado.fields.BigAutoField(db_column='idMatch', primary_key=True)  
    ta_conta = models.ForeignKey('TransabiertaContabilidad', db_column='TA_Conta_ID', blank=True, null=True)  
    ta_corres = models.ForeignKey('TransabiertaCorresponsal', db_column='TA_Corres_ID', blank=True, null=True)  
    fecha = models.DateTimeField(db_column='Fecha')  
    auto_manual = models.IntegerField(db_column='Auto_Manual')  
    justificacion = models.CharField(db_column='Justificacion', max_length=100, blank=True)  
    codigomatch = models.CharField(db_column='CodigoMatch', max_length=20)  
    puntaje = models.IntegerField(db_column='Puntaje')  
    tipo_proceso = models.IntegerField(db_column='Tipo_Proceso', blank=True, null=True)  

    class Meta:
        db_table = 'MatchPropuestos'


class MatchpropuestosBk(models.Model):
    idmatch = models.BigIntegerField(db_column='idMatch', primary_key=True)  
    ta_conta_bk_id = models.BigIntegerField(db_column='TA_Conta_BK_ID', blank=True, null=True)  
    ta_corres_bk_id = models.BigIntegerField(db_column='TA_Corres_BK_ID', blank=True, null=True)  
    fecha = models.DateTimeField(db_column='Fecha')  
    auto_manual = models.IntegerField(db_column='Auto_Manual')  
    justificacion = models.CharField(db_column='Justificacion', max_length=100, blank=True)  
    codigomatch = models.CharField(db_column='CodigoMatch', max_length=20)  
    puntaje = models.IntegerField(db_column='Puntaje')  
    tipo_proceso = models.IntegerField(db_column='Tipo_Proceso', blank=True, null=True)  

    class Meta:
        db_table = 'MatchPropuestos_BK'


class Moneda(models.Model):
    idmoneda = sqlserver_ado.fields.BigAutoField(db_column='idMoneda', primary_key=True)  
    codigo = models.CharField(db_column='Codigo', max_length=3)  
    nombre = models.CharField(db_column='Nombre', max_length=10)  
    cambio_usd = models.FloatField(db_column='Cambio_USD')  

    class Meta:
        db_table = 'Moneda'


class Observacioncontabilidad(models.Model):
    idobservacion = sqlserver_ado.fields.BigAutoField(db_column='idObservacion', primary_key=True)  
    ta_conta = models.ForeignKey('TransabiertaContabilidad', db_column='TA_Conta_ID')  
    observacion = models.TextField(db_column='Observacion')  
    fecha = models.DateTimeField(db_column='Fecha')  

    class Meta:
        db_table = 'ObservacionContabilidad'


class ObservacioncontabilidadBk(models.Model):
    idobservacion = models.BigIntegerField(db_column='idObservacion', primary_key=True)  
    ta_conta_bk_id = models.BigIntegerField(db_column='TA_Conta_BK_ID')  
    observacion = models.TextField(db_column='Observacion')  
    fecha = models.DateTimeField(db_column='Fecha')  

    class Meta:
        db_table = 'ObservacionContabilidad_BK'


class Observacioncorresponsal(models.Model):
    idobservacion = sqlserver_ado.fields.BigAutoField(db_column='idObservacion', primary_key=True)  
    ta_corres = models.ForeignKey('TransabiertaCorresponsal', db_column='TA_Corres_ID')  
    observacion = models.TextField(db_column='Observacion')  
    fecha = models.DateTimeField(db_column='Fecha')  

    class Meta:
        db_table = 'ObservacionCorresponsal'


class ObservacioncorresponsalBk(models.Model):
    idobservacion = models.BigIntegerField(db_column='idObservacion', primary_key=True)  
    ta_corres_bk_id = models.BigIntegerField(db_column='TA_Corres_BK_ID')  
    observacion = models.TextField(db_column='Observacion')  
    fecha = models.DateTimeField(db_column='Fecha')  

    class Meta:
        db_table = 'ObservacionCorresponsal_BK'


class Perfil(models.Model):
    idperfil = sqlserver_ado.fields.BigAutoField(db_column='idPerfil', primary_key=True)  
    nombre = models.CharField(db_column='Nombre', max_length=20)

    class Meta:
        db_table = 'Perfil'

class Opcion(models.Model):
    idopcion = sqlserver_ado.fields.BigAutoField(db_column='idOpcion', primary_key=True)  
    nombre = models.CharField(db_column='Nombre', max_length=50)  
    funprincipal = models.BigIntegerField(db_column='FunPrincipal')  

    class Meta:
        db_table = 'Opcion'

class PerfilOpcion(models.Model):
    opcion_idopcion = models.ForeignKey(Opcion, db_column='Opcion_idOpcion', primary_key=True)  
    perfil_idperfil = models.ForeignKey(Perfil, db_column='Perfil_idPerfil')  

    class Meta:
        db_table = 'Perfil_Opcion'


class Procesado(models.Model):
    estado_cuenta_idedocuenta = models.ForeignKey(EstadoCuenta, db_column='Estado_Cuenta_idEdoCuenta', primary_key=True)  

    class Meta:
        db_table = 'Procesado'


class ProcesadoBk(models.Model):
    estado_cuenta_bk_idedocuenta = models.ForeignKey(EstadoCuentaBk, db_column='Estado_Cuenta_BK_idEdoCuenta', primary_key=True)  

    class Meta:
        db_table = 'Procesado_BK'


class ReglaTransformacion(models.Model):
    idregla_trans = sqlserver_ado.fields.BigAutoField(db_column='idRegla_Trans', primary_key=True)  
    cuenta_idcuenta = models.ForeignKey(Cuenta, db_column='Cuenta_idCuenta')  
    nombre = models.CharField(db_column='Nombre', max_length=20)  
    transaccion_corresponsal = models.CharField(db_column='Transaccion_Corresponsal', max_length=20, blank=True)  
    ref_corresponsal = models.CharField(db_column='Ref_Corresponsal', max_length=20, blank=True)  
    mascara_corresponsal = models.CharField(db_column='Mascara_Corresponsal', max_length=20, blank=True)  
    transaccion_contabilidad = models.CharField(db_column='Transaccion_Contabilidad', max_length=20, blank=True)  
    ref_contabilidad = models.CharField(db_column='Ref_Contabilidad', max_length=20, blank=True)  
    mascara_contabilidad = models.CharField(db_column='Mascara_Contabilidad', max_length=20, blank=True)  
    tipo = models.IntegerField(db_column='Tipo', blank=True, null=True)  

    class Meta:
        db_table = 'Regla_Transformacion'


class ReglaTransformacionBk(models.Model):
    idregla_trans = models.BigIntegerField(db_column='idRegla_Trans', primary_key=True)  
    cuenta_bk_idcuenta = models.ForeignKey(CuentaBk, db_column='Cuenta_BK_idCuenta')  
    nombre = models.CharField(db_column='Nombre', max_length=20)  
    transaccion_corresponsal = models.CharField(db_column='Transaccion_Corresponsal', max_length=20, blank=True)  
    ref_corresponsal = models.CharField(db_column='Ref_Corresponsal', max_length=20, blank=True)  
    mascara_corresponsal = models.CharField(db_column='Mascara_Corresponsal', max_length=20, blank=True)  
    transaccion_contabilidad = models.CharField(db_column='Transaccion_Contabilidad', max_length=20, blank=True)  
    ref_contabilidad = models.CharField(db_column='Ref_Contabilidad', max_length=20, blank=True)  
    mascara_contabilidad = models.CharField(db_column='Mascara_Contabilidad', max_length=20, blank=True)  
    tipo = models.IntegerField(db_column='Tipo', blank=True, null=True)  

    class Meta:
        db_table = 'Regla_Transformacion_BK'


class ReversocerradaContabilidad(models.Model):
    idreverso = sqlserver_ado.fields.BigAutoField(db_column='idReverso', primary_key=True)  
    tc_conta = models.ForeignKey('TranscerradaContabilidad', db_column='TC_Conta_ID', related_name='TC_Conta_ID')  
    tc_conta_id_2 = models.ForeignKey('TranscerradaContabilidad', db_column='TC_Conta_ID_2', related_name='TC_Conta_ID_2')  
    fecha = models.DateTimeField(db_column='Fecha')  
    auto_manual = models.IntegerField(db_column='Auto_Manual')  
    justificacion = models.CharField(db_column='Justificacion', max_length=100, blank=True)  
    codigomatch = models.CharField(db_column='CodigoMatch', max_length=20, blank=True)  

    class Meta:
        db_table = 'ReversoCerrada_Contabilidad'


class ReversocerradaContabilidadBk(models.Model):
    idreverso = models.BigIntegerField(db_column='idReverso', primary_key=True)  
    tc_conta_bk_id = models.BigIntegerField(db_column='TC_Conta_BK_ID')  
    tc_conta_bk_id_2 = models.BigIntegerField(db_column='TC_Conta_BK_ID_2')  
    fecha = models.DateTimeField(db_column='Fecha')
    auto_manual = models.IntegerField(db_column='Auto_Manual')  
    justificacion = models.CharField(db_column='Justificacion', max_length=100, blank=True)  
    codigomatch = models.CharField(db_column='CodigoMatch', max_length=20, blank=True)  

    class Meta:
        db_table = 'ReversoCerrada_Contabilidad_BK'


class ReversocerradaCorresponsal(models.Model):
    idreverso = sqlserver_ado.fields.BigAutoField(db_column='idRevero', primary_key=True)  
    tc_corres = models.ForeignKey('TranscerradaCorresponsal', db_column='TC_Corres_ID', related_name='TC_Corres_ID')  
    tc_corres_id_2 = models.ForeignKey('TranscerradaCorresponsal', db_column='TC_Corres_ID_2', related_name='TC_Corres_ID_2')  
    fecha = models.DateTimeField(db_column='Fecha')  
    auto_manual = models.IntegerField(db_column='Auto_Manual')  
    justificacion = models.CharField(db_column='Justificacion', max_length=100, blank=True)  
    codigomatch = models.CharField(db_column='CodigoMatch', max_length=20, blank=True)  

    class Meta:
        db_table = 'ReversoCerrada_Corresponsal'


class ReversocerradaCorresponsalBk(models.Model):
    idreverso = models.BigIntegerField(db_column='idRevero', primary_key=True)  
    tc_corres_bk_id = models.BigIntegerField(db_column='TC_Corres_BK_ID')  
    tc_corres_bk_id_2 = models.BigIntegerField(db_column='TC_Corres_BK_ID_2')  
    fecha = models.DateTimeField(db_column='Fecha')  
    auto_manual = models.IntegerField(db_column='Auto_Manual')  
    justificacion = models.CharField(db_column='Justificacion', max_length=100, blank=True)  
    codigomatch = models.CharField(db_column='CodigoMatch', max_length=20, blank=True)  

    class Meta:
        db_table = 'ReversoCerrada_Corresponsal_BK'


class Sesion(models.Model):
    idsesion = sqlserver_ado.fields.BigAutoField(db_column='idSesion', primary_key=True)  
    usuario_idusuario = models.ForeignKey('Usuario', db_column='Usuario_idUsuario', blank=True, null=True)  
    login = models.CharField(db_column='Login', max_length=20)  
    pass_field = models.CharField(db_column='Pass', max_length=35, blank=True)
    estado = models.CharField(db_column='Estado', max_length=10)  
    salt = models.CharField(db_column='Salt', max_length=35, blank=True)  
    fecha_registro = models.DateTimeField(db_column='Fecha_Registro')  
    conexion = models.CharField(db_column='Conexion', max_length=10, blank=True)  
    ldap = models.CharField(db_column='LDAP', max_length=1)  

    class Meta:
        db_table = 'Sesion'


class TransabiertaContabilidad(models.Model):
    idtransaccion = sqlserver_ado.fields.BigAutoField(db_column='idTransaccion', primary_key=True)  
    estado_cuenta_idedocuenta = models.ForeignKey(EstadoCuenta, db_column='Estado_Cuenta_idEdoCuenta')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=34, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)

    class Meta:
        db_table = 'TransAbierta_Contabilidad'


class TransabiertaContabilidadBk(models.Model):
    idtransaccion = models.BigIntegerField(db_column='idTransaccion', primary_key=True)  
    estado_cuenta_bk_idedocuenta = models.ForeignKey(EstadoCuentaBk, db_column='Estado_Cuenta_BK_idEdoCuenta')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=45, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)  

    class Meta:
        db_table = 'TransAbierta_Contabilidad_BK'


class TransabiertaCorresponsal(models.Model):
    idtransaccion = sqlserver_ado.fields.BigAutoField(db_column='idTransaccion', primary_key=True)  
    estado_cuenta_idedocuenta = models.ForeignKey(EstadoCuenta, db_column='Estado_Cuenta_idEdoCuenta')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=34, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)  

    class Meta:
        db_table = 'TransAbierta_Corresponsal'


class TransabiertaCorresponsalBk(models.Model):
    idtransaccion = models.BigIntegerField(db_column='idTransaccion', primary_key=True)  
    estado_cuenta_bk_idedocuenta = models.ForeignKey(EstadoCuentaBk, db_column='Estado_Cuenta_BK_idEdoCuenta')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=45, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)  

    class Meta:
        db_table = 'TransAbierta_Corresponsal_BK'


class TranscerradaContabilidad(models.Model):
    idtransaccion = sqlserver_ado.fields.BigAutoField(db_column='idTransaccion', primary_key=True)  
    estado_cuenta_idedocuenta = models.ForeignKey(EstadoCuenta, db_column='Estado_Cuenta_idEdoCuenta', blank=True, null=True)  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha = models.DateTimeField(db_column='Fecha')  
    descripcion = models.CharField(db_column='Descripcion', max_length=34, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)  

    class Meta:
        db_table = 'TransCerrada_Contabilidad'


class TranscerradaContabilidadBk(models.Model):
    idtransaccion = models.BigIntegerField(db_column='idTransaccion', primary_key=True)  
    estado_cuenta_bk_idedocuenta = models.ForeignKey(EstadoCuentaBk, db_column='Estado_Cuenta_BK_idEdoCuenta', blank=True, null=True)  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha = models.DateTimeField(db_column='Fecha')  
    descripcion = models.CharField(db_column='Descripcion', max_length=45, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)  

    class Meta:
        db_table = 'TransCerrada_Contabilidad_BK'


class TranscerradaCorresponsal(models.Model):
    idtransaccion = sqlserver_ado.fields.BigAutoField(db_column='idTransaccion', primary_key=True)  
    estado_cuenta_idedocuenta = models.ForeignKey(EstadoCuenta, db_column='Estado_Cuenta_idEdoCuenta')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=34, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)  

    class Meta:
        db_table = 'TransCerrada_Corresponsal'


class TranscerradaCorresponsalBk(models.Model):
    idtransaccion = models.BigIntegerField(db_column='idTransaccion', primary_key=True)  
    estado_cuenta_bk_idedocuenta = models.ForeignKey(EstadoCuentaBk, db_column='Estado_Cuenta_BK_idEdoCuenta')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=45, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  
    idbk = models.BigIntegerField(db_column='idBK', blank=True, null=True)  

    class Meta:
        db_table = 'TransCerrada_Corresponsal_BK'


class Traza(models.Model):
    idtraza = sqlserver_ado.fields.BigAutoField(db_column='idTraza', primary_key=True)  
    evento_idevento = models.ForeignKey(Evento, db_column='Evento_IdEvento')  
    usuario = models.CharField(db_column='Usuario', max_length=100, blank=True)  
    fecha_hora = models.DateTimeField(db_column='Fecha_Hora')  
    terminal = models.CharField(db_column='Terminal', max_length=20)  
    detalles = models.CharField(db_column='Detalles', max_length=500, blank=True)  

    class Meta:
        db_table = 'Traza'

class Empresa(models.Model):
    id_empresa = sqlserver_ado.fields.BigAutoField(db_column='Id_Empresa', primary_key=True)  
    nombre = models.CharField(db_column='Nombre', max_length=50)  
    dir_logo = models.CharField(db_column='Dir_Logo', max_length=200)  
    nombregrupo = models.CharField(db_column='NombreGrupo', max_length=50)  
    direccion = models.CharField(db_column='Direccion', max_length=150)  
    creditoscontabilidad = models.CharField(db_column='CreditosContabilidad', max_length=60)  
    debitoscontabilidad = models.CharField(db_column='DebitosContabilidad', max_length=60)  
    creditoscorresponsal = models.CharField(db_column='CreditosCorresponsal', max_length=60)  
    debitoscorresponsal = models.CharField(db_column='DebitosCorresponsal', max_length=60)  
    pais = models.CharField(db_column='Pais', max_length=15)  
    autorizadopor = models.CharField(db_column='AutorizadoPor', max_length=60, blank=True)  
    firmadopor = models.CharField(db_column='FirmadoPor', max_length=60, blank=True)  
    cargofirmante = models.CharField(db_column='CargoFirmante', max_length=60, blank=True)  

    class Meta:
        db_table = 'Empresa'


class Usuario(models.Model):
    idusuario = sqlserver_ado.fields.BigAutoField(db_column='idUsuario', primary_key=True)  
    ci = models.CharField(db_column='CI', max_length=20)  
    empresa_id_empresa = models.ForeignKey(Empresa, db_column='Empresa_Id_Empresa', blank=True, null=True, related_name='Empresa_id')  
    perfil_idperfil = models.ForeignKey(Perfil, db_column='Perfil_idPerfil', blank=True, null=True)  
    nombres = models.CharField(db_column='Nombres', max_length=20)  
    apellidos = models.CharField(db_column='Apellidos', max_length=20)  
    direccion = models.CharField(db_column='Direccion', max_length=100)  
    telefono = models.CharField(db_column='Telefono', max_length=20)  
    mail = models.CharField(db_column='Mail', max_length=35, blank=True)  
    observaciones = models.CharField(db_column='Observaciones', max_length=100, blank=True)  

    class Meta:
        db_table = 'Usuario'

class UsuarioCuenta(models.Model):
    usuario_idusuario = models.ForeignKey(Usuario, db_column='Usuario_idUsuario', primary_key=True)  
    cuenta_idcuenta = models.ForeignKey(Cuenta, db_column='Cuenta_idCuenta', primary_key=True)  

    class Meta:
        db_table = 'Usuario_Cuenta'


class UsuarioCuentaBk(models.Model):
    usuario_bk_idusuario = models.BigIntegerField(db_column='Usuario_BK_idUsuario', primary_key=True)  
    cuenta_bk_idcuenta = models.ForeignKey(CuentaBk, db_column='Cuenta_BK_idCuenta', primary_key=True)  

    class Meta:
        db_table = 'Usuario_Cuenta_BK'


class VAbiertasconta(models.Model):
    codigo = models.CharField(db_column='Codigo', max_length=35)  
    origen = models.CharField(db_column='Origen', max_length=1)  
    pag_edo = models.BigIntegerField(db_column='Pag_Edo')  
    idtransaccion = models.BigIntegerField(db_column='idTransaccion')  
    estado_cuenta_idedocuenta = models.BigIntegerField(db_column='Estado_Cuenta_idEdoCuenta')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=34, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  

    class Meta:
        db_table = 'v_AbiertasConta'


class VAbiertascorres(models.Model):
    idtransaccion = models.BigIntegerField(db_column='idTransaccion')  
    estado_cuenta_idedocuenta = models.BigIntegerField(db_column='Estado_Cuenta_idEdoCuenta')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina', blank=True, null=True)  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=34, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    campo86_940 = models.CharField(db_column='Campo86_940', max_length=390, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  
    codigo = models.CharField(db_column='Codigo', max_length=35)  
    origen = models.CharField(db_column='Origen', max_length=1)  
    pag_edo = models.BigIntegerField(db_column='Pag_Edo')  

    class Meta:
        db_table = 'v_AbiertasCorres'


class VCerradasconta(models.Model):
    codigo = models.CharField(db_column='Codigo', max_length=35)  
    origen = models.CharField(db_column='Origen', max_length=1)  
    pagina = models.BigIntegerField(db_column='Pagina')  
    idtransaccion = models.BigIntegerField(db_column='idTransaccion')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    estado_cuenta_idedocuenta = models.BigIntegerField(db_column='Estado_Cuenta_idEdoCuenta', blank=True, null=True)  
    expr1 = models.IntegerField(db_column='EXPR1', blank=True, null=True)  
    fecha = models.DateTimeField(db_column='Fecha')  
    descripcion = models.CharField(db_column='Descripcion', max_length=34, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  

    class Meta:
        db_table = 'v_CerradasConta'


class VCerradascorres(models.Model):
    codigo = models.CharField(db_column='Codigo', max_length=35)  
    origen = models.CharField(db_column='Origen', max_length=1)  
    pagina = models.BigIntegerField(db_column='Pagina')  
    idtransaccion = models.BigIntegerField(db_column='idTransaccion')  
    estado_cuenta_idedocuenta = models.BigIntegerField(db_column='Estado_Cuenta_idEdoCuenta')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    expr1 = models.IntegerField(db_column='EXPR1', blank=True, null=True)  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=34, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    referencianostro = models.CharField(db_column='ReferenciaNostro', max_length=16, blank=True)  
    referenciacorresponsal = models.CharField(db_column='ReferenciaCorresponsal', max_length=16, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    numtransaccion = models.IntegerField(db_column='NumTransaccion')  
    seguimiento = models.TextField(db_column='Seguimiento', blank=True)  

    class Meta:
        db_table = 'v_CerradasCorres'


class VConciliacionconsolidado(models.Model):
    codigo = models.CharField(db_column='Codigo', max_length=10)  
    ref_nostro = models.CharField(db_column='Ref_Nostro', max_length=35)  
    ref_vostro = models.CharField(db_column='Ref_Vostro', max_length=35)  
    codmoneda = models.CharField(db_column='CodMoneda', max_length=3)  
    ultimafechaconciliacion = models.DateTimeField(db_column='UltimaFechaConciliacion', blank=True, null=True)  
    tipo_cta = models.IntegerField(db_column='Tipo_Cta', blank=True, null=True)  
    idconciliacionconsolidado = models.BigIntegerField(db_column='idConciliacionConsolidado')  
    cuenta_idcuenta = models.BigIntegerField(db_column='Cuenta_idCuenta')  
    totalcreditoscontabilidad = models.FloatField(db_column='TotalCreditosContabilidad')  
    totaldebitoscontabilidad = models.FloatField(db_column='TotalDebitosContabilidad')  
    totalcreditoscorresponsal = models.FloatField(db_column='TotalCreditosCorresponsal')  
    totaldebitoscorresponsal = models.FloatField(db_column='TotalDebitosCorresponsal')  
    saldocontabilidad = models.FloatField(db_column='SaldoContabilidad')  
    saldocorresponsal = models.FloatField(db_column='SaldoCorresponsal')  
    balancefinalcontabilidad = models.FloatField(db_column='BalanceFinalContabilidad')  
    balancefinalcorresponsal = models.FloatField(db_column='BalanceFinalCorresponsal')  
    diferencia = models.FloatField(db_column='Diferencia')  
    realizadopor = models.CharField(db_column='RealizadoPor', max_length=60, blank=True)  

    class Meta:
        db_table = 'v_ConciliacionConsolidado'


class VDistincthistoricos(models.Model):
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    refnostro = models.CharField(db_column='RefNostro', max_length=16, blank=True)  
    refvostro = models.CharField(db_column='RefVostro', max_length=16, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    origen = models.CharField(db_column='Origen', max_length=1)  

    class Meta:
        db_table = 'v_DISTINCTHistoricos'

class Version(models.Model):
    idversion = sqlserver_ado.fields.BigAutoField(db_column='idVersion', primary_key=True)   
    descripcion = models.CharField(db_column='descripcion', max_length=150, blank=True)  

    class Meta:
        db_table = 'Version'


class VHistoricos(models.Model):
    idhistoricoconsolidado = models.BigIntegerField(db_column='idHistoricoConsolidado')  
    fechaconciliacion = models.DateTimeField(db_column='FechaConciliacion')  
    totalcreditoscontabilidad = models.FloatField(db_column='TotalCreditosContabilidad')  
    totaldebitoscontabilidad = models.FloatField(db_column='TotalDebitosContabilidad')  
    totalcreditoscorresponsal = models.FloatField(db_column='TotalCreditosCorresponsal')  
    totaldebitoscorresponsal = models.FloatField(db_column='TotalDebitosCorresponsal')  
    saldocontabilidad = models.FloatField(db_column='SaldoContabilidad')  
    saldocorresponsal = models.FloatField(db_column='SaldoCorresponsal')  
    balancefinalcontabilidad = models.FloatField(db_column='BalanceFinalContabilidad')  
    balancefinalcorresponsal = models.FloatField(db_column='BalanceFinalCorresponsal')  
    diferencia = models.FloatField(db_column='Diferencia')  
    autorizadopor = models.CharField(db_column='AutorizadoPor', max_length=60, blank=True)  
    firmadopor = models.CharField(db_column='FirmadoPor', max_length=60, blank=True)  
    cargofirmante = models.CharField(db_column='CargoFirmante', max_length=60, blank=True)  
    realizadopor = models.CharField(db_column='RealizadoPor', max_length=60, blank=True)  
    numedo_cont = models.CharField(db_column='NumEdo_Cont', max_length=35, blank=True)  
    pag_cont = models.IntegerField(db_column='Pag_Cont', blank=True, null=True)  
    fecha_cont = models.DateTimeField(db_column='Fecha_Cont', blank=True, null=True)  
    balance_cont = models.FloatField(db_column='Balance_Cont', blank=True, null=True)  
    cd_cont = models.CharField(db_column='CD_Cont', max_length=1, blank=True)  
    numedo_corr = models.CharField(db_column='NumEdo_Corr', max_length=35, blank=True)  
    pag_corr = models.IntegerField(db_column='Pag_Corr', blank=True, null=True)  
    fecha_corr = models.DateTimeField(db_column='Fecha_Corr', blank=True, null=True)  
    balance_corr = models.FloatField(db_column='Balance_Corr', blank=True, null=True)  
    cd_corr = models.CharField(db_column='CD_Corr', max_length=1, blank=True)  
    tasa_cambio = models.FloatField(db_column='Tasa_Cambio', blank=True, null=True)  
    idhistoricotransacciones = models.BigIntegerField(db_column='idHistoricoTransacciones')  
    historicoconsolidado_id = models.BigIntegerField(db_column='HistoricoConsolidado_ID')  
    codigo_transaccion = models.CharField(db_column='Codigo_Transaccion', max_length=4)  
    pagina = models.IntegerField(db_column='Pagina')  
    fecha_valor = models.DateTimeField(db_column='Fecha_Valor')  
    descripcion = models.CharField(db_column='Descripcion', max_length=45, blank=True)  
    monto = models.FloatField(db_column='Monto')  
    credito_debito = models.CharField(db_column='Credito_Debito', max_length=2)  
    refvostro = models.CharField(db_column='RefVostro', max_length=16, blank=True)  
    refnostro = models.CharField(db_column='RefNostro', max_length=16, blank=True)  
    codigocuenta = models.CharField(db_column='CodigoCuenta', max_length=10)  
    origen = models.CharField(db_column='Origen', max_length=1)  
    observacion = models.CharField(db_column='Observacion', max_length=300, blank=True)  
    num_transaccion = models.IntegerField(db_column='Num_Transaccion')  
    fecha_salida = models.DateTimeField(db_column='Fecha_Salida', blank=True, null=True)  
    numedo = models.CharField(db_column='NumEdo', max_length=35, blank=True)  

    class Meta:
        db_table = 'v_Historicos'
