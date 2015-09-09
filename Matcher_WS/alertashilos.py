from Matcher.models import *
from Matcher_WS.mailConf import enviar_mail
import os
import unicodedata
from datetime import datetime

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
					dias = alerta.valor
					ultimaConciliacion = cuenta.ultimafechaconciliacion
					hoy = timenow()
					delta = hoy - ultimaConciliacion
					diferencia = int(delta.days)
					if diferencia >= dias:
						if idioma == 0:
							msg = "Le informamos que la cuenta: " + cuenta.codigo + ".\n Tiene mas de " + str(dias) + " días sin ser conciliada.\n Última fecha de conciliacón: " + str(("-").join(list(reversed((str(ultimaConciliacion).split(" ")[0]).split("-"))))) + "\n\n\n\n Matcher\n Un producto de BCG." 
							enviar_mail('Alerta "Días Sin Conciliar"',msg,correo)
						else:
							msg = "We notify you that account: " + cuenta.codigo + ".\n Has more than " + str(dias) + " days without reconciliation.\n Last Reconciliation date: " + str(ultimaConciliacion).split(" ")[0] + "\n\n\n\n Matcher\n A BCG's software." 
							enviar_mail('"Exceded Reconciliation Days" Alert ',msg,correo)
					

				if alerta.alertas_idalertas.idalertas == 4:
					print("Partidas pendientes por mas de ")

				if alerta.alertas_idalertas.idalertas == 6:
					print("No cargado edo cuenta en tantos días")

				#if alerta.alertas_idalertas.idalertas == (13):
				#	print("partidas pendientes sin observación")

	
	aux = VerificarAlertas.objects.get(idVA=1)
	#aux.fecha = timenow() 
	aux.flag = 0
	aux.save()

# Tiempo justo ahora
def timenow():
    return datetime.now().replace(microsecond=0)