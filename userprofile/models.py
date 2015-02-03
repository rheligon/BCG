from django.db import models
from django.contrib.auth.models import AbstractUser

import sqlserver_ado.fields

# Create your models here.

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


class Perfil(models.Model):
    idperfil = sqlserver_ado.fields.BigAutoField(db_column='idPerfil', primary_key=True)  
    nombre = models.CharField(db_column='Nombre', max_length=20)

    class Meta:
        db_table = 'Perfil'


class User(AbstractUser):
    ci = models.CharField(max_length=20)
    empresa_id_empresa = models.ForeignKey(Empresa, blank=True, null=True)  
    perfil_idperfil = models.ForeignKey(Perfil, blank=True, null=True)
    direccion = models.CharField(max_length=100, blank=True)  
    telefono = models.CharField(max_length=20, blank=True)
    observaciones = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'auth_user'
