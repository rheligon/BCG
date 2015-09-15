from Matcher.models import *
from datetime import datetime, date, time, timedelta

def eliminarIntraday():
    mt103 = None
    mt202 = None
    mt752 = None
    mt754 = None
    mt756 = None
    mt942 = None
    cta = Cuenta.objects.get(idcuenta=8078)
    hoy = datetime.now().replace(hour=0,minute=0,second=0,microsecond=0)
    mensajes = MensajesIntraday.objects.filter(cuenta = cta, fecha_entrada__lt=hoy)
    if not mensajes:
        print("no hay")
    for elem in mensajes:
        if(elem.tipo == "103"):
            try:
                mt103 = Mt103.objects.get(mensaje_intraday = elem.idmensaje).delete()
                print("soy el mensaje intraday " + str(elem.idmensaje)+ "y 103 :"+ str(mt103.idmt103))
            except:
                print("no")
        if(elem.tipo == "202"):
            try:
                mt202 = Mt202.objects.get(mensaje_intraday = elem.idmensaje).delete()
                print("soy el mensaje intraday " + str(elem.idmensaje)+ "y 202 :"+ str(mt202.idmt202))
            except:
                print("no")
        if(elem.tipo == "752"):
            try:
                mt752 = Mt752.objects.get(mensaje_intraday = elem.idmensaje).delete()
                print("soy el mensaje intraday " + str(elem.idmensaje)+ "y 752 :"+ str(mt752.idmt752))
            except:
                print("no")
        if(elem.tipo == "754"):
            try:
                mt754 = Mt754.objects.get(mensaje_intraday = elem.idmensaje).delete()
                print("soy el mensaje intraday " + str(elem.idmensaje)+ "y 754 :"+ str(mt754.idmt754))
            except:
                print("no")
        if(elem.tipo == "756"):
            try:
                mt756 = Mt756.objects.get(mensaje_intraday = elem.idmensaje).delete()
                print("soy el mensaje intraday " + str(elem.idmensaje)+ "y 756 :"+ str(mt756.idmt756))
            except:
                print("no")
        if(elem.tipo == "942"):
            try:
                mt942 = Mt942.objects.get(mensaje_intraday = elem.idmensaje).delete()
                print("soy el mensaje intraday " + str(elem.idmensaje)+ "y 942 :"+ str(mt942.idmt942))
            except:
                print("no")

    mensajes.delete()