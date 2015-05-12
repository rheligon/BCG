from Matcher.models import *
from django.db.models import Sum, Q


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
            totalCredCont = TransabiertaContabilidad.objects.filter(fecha_valor__lte=ultFC,credito_debito__in=['C','RD']).aggregate(Sum('monto'))
            
            #Se devuelve un diccionario por lo que accedo al valor del primer (unico) elemento
            totalCredCont = next(iter(totalCredCont.values()))
            
            if totalCredCont is None:
                totalCredCont = 0
            
            print('credcont ' + str(totalCredCont))

            # Obtengo debitos Trans_Abiertas Contabilidad hasta la fecha indicada
            totalDebCont = TransabiertaContabilidad.objects.filter(fecha_valor__lte=ultFC,credito_debito__in=['D','RC']).aggregate(Sum('monto'))
            totalDebCont = next(iter(totalDebCont.values()))
            
            if totalDebCont is None:
                totalDebCont = 0

            print('debcont ' + str(totalDebCont))

            # Obtengo creditos Trans_Abiertas Corresponsal hasta la fecha indicada
            totalCredCorr = TransabiertaCorresponsal.objects.filter(fecha_valor__lte=ultFC,credito_debito__in=['C','RD']).aggregate(Sum('monto'))
            totalCredCorr = next(iter(totalCredCorr.values()))
            
            if totalCredCorr is None:
                totalCredCorr = 0
            
            print('credcorr ' + str(totalCredCorr))

            # Obtengo debitos Trans_Abiertas Contabilidad hasta la fecha indicada
            totalDebCorr = TransabiertaCorresponsal.objects.filter(fecha_valor__lte=ultFC,credito_debito__in=['D','RC']).aggregate(Sum('monto'))
            totalDebCorr = next(iter(totalDebCorr.values()))

            if totalDebCorr is None:
                totalDebCorr = 0

            print('debcorr ' + str(totalDebCorr))

            # Busco el balance final del ultimo edc procesado de Contabilidad
            try:
                EdcCont = EstadoCuenta.objects.get(idedocuenta=idEcCont)
            except:
                EdcCont = None

            if EdcCont is not None:
                if EdcCont.c_dfinal == 'D':
                    balanceCont = -1 * EdcCont.balance_final
                else:
                    balanceCont = EdcCont.balance_final
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
                    balanceCorr = -1 * EdcCorr.balance_final
                else:
                    balanceCorr = EdcCorr.balance_final
            else: 
                balanceCorr = 0

            print('balcorr ' + str(balanceCorr))

            # Busco encajes asociados a la cuenta
            encaje = cuenta.montoencajeactual

            if encaje is None:
                encaje = 0

            print('encaje ' + str(encaje))

            # Saco los totales de los saldos

            if cuenta.tipo_cta == 2:
                # Saldo real para cuentas propias
                totalCont = balanceCont
                totalCorr = totalCredCorr - totalDebCorr

                total = totalCont - totalCorr
                diferencia = round(total)
            else:
                # Se sacan los saldos reales de contabilidad y corresponsal
                totalCont = -(totalCredCorr - totalDebCorr + encaje) + balanceCont
                totalCorr = -(totalCredCont - totalDebCont) + balanceCorr

                total = totalCont + totalCorr

                diferencia = round(total,2) #Deberia ser siempre 0

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
        
    except Exception as e:
        #Hubo algun error
        print (e)
