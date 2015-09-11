from Matcher.models import *
from Matcher_WS.mailConf import enviar_mail
import os
import unicodedata
from datetime import datetime, timedelta

# Proceso demonio para las alertas
def daemon(request,language):
	login = request.user.username 
	idioma = language
	cuentas = Cuenta.objects.all()
	for cuenta in cuentas:
		if cuenta.correo_alertas !="":
			correo = cuenta.correo_alertas
			alertas = AlertasCuenta.objects.filter(cuenta_idcuenta=cuenta)
			for alerta in alertas:

				if alerta.alertas_idalertas.idalertas == 11:
					try:
						dias = alerta.valor
						ultimaConciliacion = cuenta.ultimafechaconciliacion
						hoy = timenow()
						delta = hoy - ultimaConciliacion
						diferencia = int(delta.days)
						if diferencia >= dias:
							if idioma == 0:
								msg = "Le informamos que la cuenta: " + cuenta.codigo + ". Tiene más de " + str(dias) + " días sin ser conciliada.\n Última fecha de conciliacón: " + str(("-").join(list(reversed((str(ultimaConciliacion).split(" ")[0]).split("-"))))) + "\n\n\n\n Matcher\n Un producto de BCG." 
								enviar_mail('Alerta "Días Sin Conciliar"',msg,correo)
							else:
								msg = "We notify you that account: " + cuenta.codigo + ". Has more than " + str(dias) + " days without reconciliation.\n Last Reconciliation date: " + str(ultimaConciliacion).split(" ")[0] + "\n\n\n\n Matcher\n A BCG's software." 
								enviar_mail('"Exceded Reconciliation Days" Alert ',msg,correo)
					except:
						if idioma == 0:
							msg = "Le informamos que, a pesar de que la cuenta: " + cuenta.codigo + " está configurada para notficar de manera automática cuando se tengan más de " + str(dias) + " días desde su útima conciliación, la misma no posee conciliaciones registradas." + "\n\n\n\n Matcher\n Un producto de BCG." 
							enviar_mail('Alerta "Días Sin Conciliar"',msg,correo)
						else:
							msg = "We notify you that account: " + cuenta.codigo + " is configured to send automatic alerts mails after " + str(dias) + " days without reconciliation. Nevertheless account has not reconciliation at all." + "\n\n\n\n Matcher\n A BCG's software." 
							enviar_mail('"Exceded Reconciliation Days" Alert ',msg,correo)
				

				
				if alerta.alertas_idalertas.idalertas == 4:
					try:
						dias = alerta.valor
						hoy = timenow()

						ultimo_procS = EstadoCuenta.objects.get(idedocuenta=cuenta.ultimoedocuentaprocs)
						ultimo_procL = EstadoCuenta.objects.get(idedocuenta=cuenta.ultimoedocuentaprocc)
						
						fecha = cuenta.ultimafechaconciliacion

						if idioma == 0:
							fecha_mail = "Fecha de la última conciliación: " + str(("-").join(list(reversed((str(fecha).split(" ")[0]).split("-")))))+"."
						else:
							fecha_mail = "Last Reconciliation date: " + str(fecha).split(" ")[0]+"."

						partidascorresp = TransabiertaCorresponsal.objects.filter(estado_cuenta_idedocuenta=ultimo_procS)
						partidaslibro = TransabiertaContabilidad.objects.filter(estado_cuenta_idedocuenta=ultimo_procL)
						
						if partidaslibro and partidascorresp:
							if idioma == 0:
								msg_edo = "Números de estados de cuenta a los que pertenecen las partidas: \n    Estado de cuenta Corresponsal: " + str(ultimo_procS.idedocuenta) + ".\n    Estado de cuenta Contabilidad: " + str(ultimo_procL.idedocuenta)+ ".\n" + fecha_mail
							else:
								msg_edo = "Numbers of account statement to which the entries belong: \n    Correspondent Account Statement: " + str(ultimo_procS.idedocuenta) + ".\n    Accounting Account Statement: " + str(ultimo_procL.idedocuenta)+ ".\n" + fecha_mail

						elif partidaslibro:
							if idioma == 0:
								msg_edo = "Número de estado de cuenta al que pertenecen las partidas: \n    Estado de cuenta Contabilidad: " + str(ultimo_procL.idedocuenta)+ ".\n" + fecha_mail
							else:
								msg_edo = "Number of account statement to which the entries belong: \n    Accounting Account Statement: " + str(ultimo_procL.idedocuenta)+ ".\n" + fecha_mail
								
						elif partidascorresp:
							if idioma == 0:
								msg_edo = "Número de estado de cuenta al que pertenecen las partidas: \n    Estado de cuenta Corresponsal: " + str(ultimo_procS.idedocuenta)+ ".\n" + fecha_mail
							else:
								msg_edo = "Number of account statement to which the entries belong: \n    Correspondent Account Statement: " + str(ultimo_procS.idedocuenta)+ ".\n" + fecha_mail

						else:
							msg_edo = ""

						if hoy > (fecha + timedelta(dias)) or hoy > (fecha + timedelta(dias)):
							if partidascorresp or partidaslibro:

								if idioma == 0:
									msg = "Le informamos que la cuenta: " + cuenta.codigo + ". Tiene partidas pendientes por más de " + str(dias) + " días luego de haber sido procesado el último estado de cuenta.\n\n" + msg_edo + "\n\n\n\n Matcher\n Un producto de BCG." 
									enviar_mail('Partidas pendientes sin conciliar',msg,correo)
								else:
									msg = "We notify you that account: " + cuenta.codigo + ". Has open entries for more than " + str(dias) + " days after last reconciliation.\n\n" + msg_edo + "\n\n\n\n Matcher\n A BCG's software." 
									enviar_mail('"Open Entries" Alert ',msg,correo)
							
					except:
						if idioma == 0:
							msg = "Le informamos que, a pesar de que la cuenta: " + cuenta.codigo + " está configurada para notificar de manera automática cuando se tengan partidas abiertas por más de " + str(dias) + " días desde que su último estado de cuenta fue procesado, la misma no posee estados de cuenta registrados." + "\n\n\n\n Matcher\n Un producto de BCG." 
							enviar_mail('Alerta de partidas abiertas',msg,correo)
						else:
							msg = "We notify you that account: " + cuenta.codigo + " is configured to send automatic alerts mails after " + str(dias) + " days with existent open entries since last account statement was processing. Nevertheless the account has not account statement at all." + "\n\n\n\n Matcher\n A BCG's software." 
							enviar_mail('"Open entries" Alert ',msg,correo)

				
				
				
				if alerta.alertas_idalertas.idalertas == 6:
					dias = alerta.valor
					try:
						ultimo_cargadoS = EstadoCuenta.objects.get(idedocuenta=cuenta.ultimoedocuentacargs)
						ultimo_cargadoL = EstadoCuenta.objects.get(idedocuenta=cuenta.ultimoedocuentacargc)
						fechaS = ultimo_cargadoS.fecha_final
						fechaL = ultimo_cargadoL.fecha_final
						if fechaS < fechaL:
							fecha = fechaL
						elif fechaL < fechaS:
							fecha = fechaS
						else:
							fecha = fechaL

						hoy = timenow()
						delta = hoy - fecha
						diferencia = int(delta.days)

						if diferencia >= dias:
							if idioma == 0:
								msg = "Le informamos que la cuenta: " + cuenta.codigo + ". Tiene más de " + str(dias) + " días sin que se carguen nuevos estados de cuenta.\n Última fecha de carga de estado de cuenta: " + str(("-").join(list(reversed((str(fecha).split(" ")[0]).split("-"))))) + "\n\n\n\n Matcher\n Un producto de BCG." 
								enviar_mail('No se han cargado Estados de Cuenta',msg,correo)
							else:
								msg = "We notify you that account: " + cuenta.codigo + ". Has more than " + str(dias) + " days without new account statement loaded.\n Last load statement date: " + str(fecha).split(" ")[0] + "\n\n\n\n Matcher\n A BCG's software." 
								enviar_mail('No account statement loaded',msg,correo)

					except:
						if idioma == 0:
							msg = "Le informamos que, a pesar de que la cuenta: " + cuenta.codigo + " está configurada para notficar de manera automática cuando se tengan más de " + str(dias) + " días sin que se carguen nuevos estados de cuenta la misma no posee ningún estado de cuenta registrado." + "\n\n\n\n Matcher\n Un producto de BCG." 
							enviar_mail('No se han cargado Estados de Cuenta',msg,correo)
						else:
							msg = "We notify you that account: " + cuenta.codigo + " is configured to send automatic alerts mails after " + str(dias) + " days without new account statement loaded. Nevertheless account has not account statement at all." + "\n\n\n\n Matcher\n A BCG's software." 
							enviar_mail('No account statement loaded',msg,correo)
				
				# Falta el caso de partidas pendientes con observaciones, pero la funcionalidad aún no está programada
				#if alerta.alertas_idalertas.idalertas == (13):
				#	print("partidas pendientes sin observación")

	
	aux = VerificarAlertas.objects.get(idVA=1) 
	aux.flag = 0
	aux.fecha = timenow()
	aux.save()

# Tiempo justo ahora
def timenow():
    return datetime.now().replace(microsecond=0)