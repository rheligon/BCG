from Matcher.models import *
from Matcher_WS.mailConf import enviar_mail
from django.db.models import Sum, Q
from datetime import datetime, timedelta


def setConsolidado(codCta,request):

    #Obtengo el nombre del usuario
    username = request.user.username
    sesion = Sesion.objects.get(login=username)
    nombre = sesion.usuario_idusuario.nombres+" "+sesion.usuario_idusuario.apellidos

    try:
        # Obtengo cuenta a consolidar
        cuenta = Cuenta.objects.get(codigo=codCta)

        # Busco ultima fecha de conciliacion
        ultFC = cuenta.ultimafechaconciliacion

        # Busco ultimo edc procesado de contabilidad
        idEcCont = cuenta.ultimoedocuentaprocc

        # Busco ultimo edc procesado de corresponsal
        idEcCorr = cuenta.ultimoedocuentaprocs

        if (ultFC != None and idEcCont != None and idEcCorr != None):
            # Obtengo creditos Trans_Abiertas Contabilidad hasta la fecha indicada
            totalCredCont = TransabiertaContabilidad.objects.filter(codigocuenta=codCta, fecha_valor__lte=ultFC,credito_debito__in=['C','RD']).aggregate(Sum('monto'))
            
            #Se devuelve un diccionario por lo que accedo al valor del primer (unico) elemento
            totalCredCont = next(iter(totalCredCont.values()))
            
            if totalCredCont is None:
                totalCredCont = 0
            else:
                totalCredCont = round(totalCredCont,2)
            
            print('credcont ' + str(totalCredCont))

            # Obtengo debitos Trans_Abiertas Contabilidad hasta la fecha indicada
            totalDebCont = TransabiertaContabilidad.objects.filter(codigocuenta=codCta, fecha_valor__lte=ultFC,credito_debito__in=['D','RC']).aggregate(Sum('monto'))
            totalDebCont = next(iter(totalDebCont.values()))
            
            if totalDebCont is None:
                totalDebCont = 0
            else:
                totalDebCont = round(totalDebCont,2)

            print('debcont ' + str(totalDebCont))

            # Obtengo creditos Trans_Abiertas Corresponsal hasta la fecha indicada
            totalCredCorr = TransabiertaCorresponsal.objects.filter(codigocuenta=codCta, fecha_valor__lte=ultFC,credito_debito__in=['C','RD']).aggregate(Sum('monto'))
            totalCredCorr = next(iter(totalCredCorr.values()))
            
            if totalCredCorr is None:
                totalCredCorr = 0
            else:
                totalCredCorr = round(totalCredCorr,2)
            
            print('credcorr ' + str(totalCredCorr))

            # Obtengo debitos Trans_Abiertas Corresponsal hasta la fecha indicada
            totalDebCorr = TransabiertaCorresponsal.objects.filter(codigocuenta=codCta, fecha_valor__lte=ultFC,credito_debito__in=['D','RC']).aggregate(Sum('monto'))
            totalDebCorr = next(iter(totalDebCorr.values()))

            if totalDebCorr is None:
                totalDebCorr = 0
            else:
                totalDebCorr = round(totalDebCorr,2)

            print('debcorr ' + str(totalDebCorr))

            # Busco el balance final del ultimo edc procesado de Contabilidad
            try:
                EdcCont = EstadoCuenta.objects.get(idedocuenta=idEcCont)
            except:
                EdcCont = None

            if EdcCont is not None:
                if EdcCont.c_dfinal == 'D':
                    balanceCont = round(-1 * EdcCont.balance_final,2)
                else:
                    balanceCont = round(EdcCont.balance_final,2)
            else: 
                balanceCont = 0

            print('balcont ' + str(balanceCont))

            # Busco el balance final del ultimo edc procesado de SWIFT
            try:
                EdcCorr = EstadoCuenta.objects.get(idedocuenta=idEcCorr)
            except:
                EdcCorr = None

            if EdcCorr is not None:
                if EdcCorr.c_dfinal == 'D':
                    balanceCorr = round(-1 * EdcCorr.balance_final,2)
                else:
                    balanceCorr = round(EdcCorr.balance_final,2)
            else: 
                balanceCorr = 0

            print('balcorr ' + str(balanceCorr))

            # Busco encajes asociados a la cuenta
            encaje = cuenta.montoencajeactual

            if encaje is None:
                encaje = 0
            else:
                encaje = round(cuenta.montoencajeactual,2)

            print('encaje ' + str(encaje))

            # Saco los totales de los saldos

            if cuenta.tipo_cta == 2:
                # Saldo real para cuentas propias
                totalCont = balanceCont
                totalCorr = round(totalCredCorr - totalDebCorr,2)

                total = round(totalCont - totalCorr,2)
                diferencia = total
            else:
                # Se sacan los saldos reales de contabilidad y corresponsal
                totalCont = round(round(-(round(totalCredCorr - totalDebCorr,2) + encaje),2) + balanceCont,2)
                totalCorr = round(-round(totalCredCont - totalDebCont,2) + balanceCorr,2)

                total = round(totalCont + totalCorr,2)

                diferencia = total #Deberia ser siempre 0

            print('totcont ' + str(totalCont))
            print('totcorr ' + str(totalCorr))
            print('diferencia ' + str(diferencia))

            # Selecciono la cuenta de la tabla Consolidado para cambiar los datos de la conciliacion
            consolidado, creado = Conciliacionconsolidado.objects.get_or_create(cuenta_idcuenta=cuenta, defaults={'totalcreditoscontabilidad':totalCredCont, 'totaldebitoscontabilidad':totalDebCont, 'totalcreditoscorresponsal':totalCredCorr, 'totaldebitoscorresponsal':totalDebCorr, 'saldocontabilidad':totalCont, 'saldocorresponsal':totalCorr, 'diferencia':diferencia, 'balancefinalcontabilidad':balanceCont, 'balancefinalcorresponsal':balanceCorr, 'realizadopor':nombre})

            if not creado:
                saldoContAnt = consolidado.saldocontabilidad

                consolidado.cuenta_idcuenta = cuenta
                consolidado.totalcreditoscontabilidad = totalCredCont
                consolidado.totaldebitoscontabilidad  = totalDebCont
                consolidado.totalcreditoscorresponsal = totalCredCorr
                consolidado.totaldebitoscorresponsal = totalDebCorr
                consolidado.saldocontabilidad = totalCont
                consolidado.saldocorresponsal = totalCorr
                consolidado.diferencia = diferencia
                consolidado.balancefinalcontabilidad = balanceCont
                consolidado.balancefinalcorresponsal = balanceCorr
                consolidado.realizadopor = nombre

                consolidado.save()

            # Falta enviar correo si la diferencia != 0
            cuenta = Cuenta.objects.get(codigo=codCta)

            if cuenta.correo_alertas !="":

                correo = cuenta.correo_alertas
                alertas = AlertasCuenta.objects.filter(cuenta_idcuenta=cuenta)

                for alerta in alertas: 

                    # Alerta para diferencias de saldo
                    if alerta.alertas_idalertas.idalertas == 8:
                        try:
                            if abs(diferencia) > 0.01:
                                if idioma == 0:
                                    msg = "Le informamos que la cuenta: " + cuenta.codigo + ". Tiene una diferencia de saldos de: " + str(diferencia) + " " +cuenta.moneda_idmoneda.codigo +". Luego de haber sido conciliada."+ "\n\n\n\n Matcher\n Un producto de BCG." 
                                    enviar_mail('Alerta "Diferencia de saldos al conciliar"',msg,correo)
                                else:
                                    msg = "We notify you that account: " + cuenta.codigo + ". Has a balance difference of: " + str(diferencia) + " " +cuenta.moneda_idmoneda.codigo + ". after reconciliation." + "\n\n\n\n Matcher\n A BCG's software." 
                                    enviar_mail('"After Reconciliation Balance Difference" Alert ',msg,correo)
                        
                        except Exception as e:
                            #Hubo algun error y no envio el correo
                            print (e)

                    # Alerta para cuenta sobregirada
                    if alerta.alertas_idalertas.idalertas ==15:
                        try:
                            if totalCont < 0 or totalCorr < 0:
                                if idioma == 0:
                                    msg = "Le informamos que la cuenta: " + cuenta.codigo + ". está sobregirada por un monto de: " + str(totalCont) + " " +cuenta.moneda_idmoneda.codigo +". Luego de haber sido conciliada."+ "\n\n\n\n Matcher\n Un producto de BCG." 
                                    enviar_mail('Alerta "Cuenta Sobregirada"',msg,correo)
                                else:
                                    msg = "We notify you that account: " + cuenta.codigo + ". is overdrawn by an amount of: " + str(totalCont) + " " +cuenta.moneda_idmoneda.codigo + ". after reconciliation." + "\n\n\n\n Matcher\n A BCG's software." 
                                    enviar_mail('"Overdrawn Account" Alert ',msg,correo)
                        
                        except Exception as e:
                            #Hubo algun error y no envio el correo
                            print (e)

                    #Alertas para diferencia de saldos
                    if alerta.alertas_idalertas.idalertas == 7:
                        porcentaje = alerta.valor
                        porCorreo = str(porcentaje)
                        porcentaje = float("1."+str(porcentaje))
                        balance_ini = EstadoCuenta.objects.get(idedocuenta=idEcCont).balance_inicial
                        try:
                            if abs(diferencia) < 0.01 and (totalCont > (balance_ini)*porcentaje):

                                if idioma == 0:
                                    msg = "Le informamos que la cuenta: " + cuenta.codigo + ". luego de ser conciliada presenta cambios en su balance mayores al: " + porCorreo + " %" +"\n\n Saldo Anterior: "+ str(balance_ini) +".\n Saldo Actual: " +str(totalCont) + "\n\n\n\n Matcher\n Un producto de BCG." 
                                    enviar_mail('Alerta "Cambios en saldo mayores al"',msg,correo)
                                else:
                                    msg = "We notify you that account: " + cuenta.codigo + ". afetr reconciliation has changes on balance greater than: " + porCorreo + " %" +"\n\n Previous Balance: "+ str(balance_ini) +".\n Actual Balance: " +str(totalCont) + "\n\n\n\n Matcher\n A BCG's software." 
                                    enviar_mail('"Changes in balance greater than" Alert ',msg,correo)
                        

                        except Exception as e:
                            #Hubo algun error y no envio el correo
                            print (e)


        
    except Exception as e:
        #Hubo algun error
        print (e)
