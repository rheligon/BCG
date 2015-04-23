import re
from Matcher_WS.edo_cuenta import edoCta, edc_list, Trans, Bal
from Matcher.models import Cuenta, Formatoarchivo, EstadoCuenta
from datetime import datetime

def leer_linea_conta(line):
    line = line.replace('\n','') # quitar fin de linea
    # Expresion regular para linea con formato [x]yyy
    result = re.search('\[([^]]+)\](.*)', line)
    if result is not None:
        # Se checkea a ver cual es el codigo
        if (result.group(1)=="M"):
            # Tipo de mensaje
            aux = result.group(2)
            return ("M",aux)

        elif (result.group(1)=="S"):
            # BIC del banco que envia
            aux = result.group(2)
            return ("S",aux)

        elif (result.group(1)=="R"):
            # BIC del banco que recibe
            aux = result.group(2)
            return ("R",aux)

        elif (result.group(1)=="20"):
            # Referencia de la transaccion
            aux = result.group(2)
            return ("20",aux)

        elif (result.group(1)=="25"):
            # Numero de cuenta
            aux = result.group(2)
            return ("25",aux)

        elif (result.group(1)=="28C"):
            # Numero del estado de cuenta
            aux = result.group(2)
            return ("28C", aux)

        elif (result.group(1)=="60F"):
            # 
            aux = result.group(2)
            res = re.search('(?P<DoC>[DC])(?P<fecha>\d{6})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{2})', aux)
            return ("60F", res)

        elif (result.group(1)=="60M"):
            # 
            aux = result.group(2)
            res = re.search('(?P<DoC>[DC])(?P<fecha>\d{6})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{2})', aux)
            return ("60M", res)

        elif (result.group(1)=="61"):
            # Es una transaccion
            aux = result.group(2)
            res = re.search('(?P<fecha>\d{6})(?P<DoC>[DC])(?P<monto>.+\,\d{2})(?P<tipo>.{4})(?P<refNostro>[^(]+)\(?(?P<refVostro>[^)]+)?\)?', aux)
            return ("61", res)

        elif (result.group(1)=="62M"):
            # Balance final intermedio
            aux = result.group(2)
            res = re.search('(?P<DoC>[DC])(?P<fecha>\d{6})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{2})', aux)
            return ("62M", res)

        elif (result.group(1)=="62F"):
            # Balance final real
            aux = result.group(2)
            res = re.search('(?P<DoC>[DC])(?P<fecha>\d{6})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{2})', aux)
            return ("62F", res)

        elif (result.group(1)=="64"):
            # Fondos disponibles
            aux = result.group(2)
            res = re.search('(?P<DoC>[DC])(?P<fecha>\d{6})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{2})', aux)
            return ("64", res)

    else:
    # Linea no comienza con un codigo entre []

        # Se checkea si es algo entre parentesis ()
        result = re.search('\(([^)]+)\)', line)
        if result is not None:
            return ("()", result.group(1))

        else:
        # Entonces debe ser $ o @@
            if line == "$":
                return ("$", None)

            if line == "@@":
                return ("@@", None)

            return (None,None)

def leer_linea_corr(line):

    line = line.replace('\n','') # quitar fin de linea
    # Expresion regular para linea con formato :x:yyy
    result = re.search('^:([^:]{2,3})\:(.+)', line)

    if result is not None:
        # Se checkea a ver cual es el codigo
        if (result.group(1)=="20"):
            # Referencia de la transaccion
            aux = result.group(2)
            return ("20",aux)

        elif (result.group(1)=="25"):
            # Numero de cuenta
            aux = result.group(2)
            return ("25",aux)

        elif (result.group(1)=="28C"):
            # Numero del estado de cuenta/nro de pagina
            aux = result.group(2)
            res = re.search('(?P<nroedc>[^/]+)/?(?P<pag>.+)?', aux)
            return ("28C", res)

        elif (result.group(1)=="60F"):
            # 
            aux = result.group(2)
            res = re.search('(?P<DoC>[DC])(?P<fecha>\d{6})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{0,2})', aux)
            return ("60F", res)

        elif (result.group(1)=="60M"):
            # 
            aux = result.group(2)
            res = re.search('(?P<DoC>[DC])(?P<fecha>\d{6})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{0,2})', aux)
            return ("60M", res)

        elif (result.group(1)=="61"):
            # Es una transaccion
            aux = result.group(2)
            res = re.search('(?P<fecha>^\d{6})(?P<fentrada>\d{4})?(?P<DoC>R?[CD]{1})[A-Z]?(?P<monto>\d+\,\d{0,2})(?P<tipo>.{4})(?P<refNostro>.+(?=//))/?/?(?P<refVostro>.+)?', aux)
            return ("61", res)

        elif (result.group(1)=="62M"):
            # Balance final intermedio
            aux = result.group(2)
            res = re.search('(?P<DoC>[DC])(?P<fecha>\d{6})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{0,2})', aux)
            return ("62M", res)

        elif (result.group(1)=="62F"):
            # Balance final real
            aux = result.group(2)
            res = re.search('(?P<DoC>[DC])(?P<fecha>\d{6})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{0,2})', aux)
            return ("62F", res)

        elif (result.group(1)=="86"):
            # Descripcion
            aux = result.group(2)
            return ("86", aux)

        elif (result.group(1)=="64"):
            aux = result.group(2)
            return ("64", aux)

        elif (result.group(1)=="65"):
            aux = result.group(2)
            return ("65", aux)

    else:
    # Linea no comienza con un codigo entre ::
        return ("$", line)


def leer_punto_coma(ncta,origen,f):
    #Numero de cuenta, origen, archivo
    edc_l = edc_list()
    msg = ""
    incorrecto = False

    try:
        if origen == 'conta':
            cta = Cuenta.objects.filter(ref_nostro=ncta)[0]
            # Se verifica que el tipo de archivo sea el adecuado
            tipoarch = cta.tipo_cargacont
            if tipoarch != 2:
                msg = '$La cuenta posee como formato el MT950 pero se esta tratando de leer un archivo ;'
                cta = None
                formato = None
                incorrecto = True

        elif origen == 'corr':
            cta = Cuenta.objects.filter(ref_vostro=ncta)[0]
            # Se verifica que el tipo de archivo sea el adecuado
            tipoarch = cta.tipo_carga_corr
            
            if tipoarch != 1:
                msg = '$La cuenta posee como formato el MT950 pero se esta tratando de leer un archivo ;'
                cta = None
                formato = None
                incorrecto = True
    except:
        cta = None
        formato = None

    if cta is not None:
        try:
            if origen == 'conta':
                formato = Formatoarchivo.objects.filter(cuenta_idcuenta=cta, tipo="L")[0]
            elif origen == 'corr':
                formato = Formatoarchivo.objects.filter(cuenta_idcuenta=cta, tipo="S")[0]
        except:
            formato = None

    if cta is not None and formato is not None and not incorrecto:
        tipo = cta.tipo_carga_corr
        form = re.findall(".",formato.formato)
        sep = formato.separador
        
        # Creo el estado de cuenta
        edc = edoCta(ncta)
        edc.R = cta.codigo
        primerBalance=True

        try:
            edcid = cta.ultimoedocuentacargs
            ultedc = EstadoCuenta.objects.get(pk=edcid)
            if '1' not in form:
                edc.cod28c = int(ultedc.codigo)+1
        except:
            #No tenia edo cta cargado previamente
            edc.cod28c = 1
        
        edc_l.add_edc(edc)

        for line in f:
            balance = False
            lineadict = dict()
            ln = line.replace("\n","").split(sep)

            # Saco los campos
            for i,elem in enumerate(ln):
                if form[i] == '0':
                    lineadict['ncta'] = ln[i]

                if form[i] == '1':
                    lineadict['nedc'] = ln[i]

                if form[i] == '2':
                    lineadict['moneda'] = ln[i]

                if form[i] == '3':
                    lineadict['fecha'] = ln[i]

                if form[i] == '4':
                    lineadict['cdpart'] = ln[i]

                if form[i] == '5':
                    lineadict['monto'] = ln[i]

                if form[i] == '6':
                    lineadict['tipotrans'] = ln[i]
                    if ln[i] == "":
                        balance = True

                if form[i] == '7':
                    lineadict['refnos'] = ln[i]

                if form[i] == '8':
                    lineadict['refvos'] = ln[i]

                if form[i] == '9':
                    lineadict['det'] = ln[i]

                if form[i] == 'A':
                    lineadict['saldo'] = ln[i]

                if form[i] == 'B':
                    lineadict['cdsald'] = ln[i]

            # Evaluo si la linea es un balance o es una transaccion
            if balance:
                auxdict = dict()
                auxdict['monto'] = lineadict['saldo']
                auxdict['DoC'] = lineadict.get('cdsald', None)

                fecha = ('').join(lineadict['fecha'].split('/')[::-1])[2:]
                auxdict['fecha'] = fecha

                if auxdict['DoC'] is None:
                    saldo = float(auxdict['monto'].replace(',','.'))
                    if saldo < 0:
                        auxdict['DoC'] = 'D'
                        auxdict['monto'] = str(abs(saldo))
                    else:
                        auxdict['DoC'] = 'C'

                bal = Bal()

                if primerBalance:
                    bal.inicial = auxdict
                    edc_l.add_bal_ini(edc,bal,0,"F")
                else:
                    bal.final = auxdict
                    edc_l.add_bal_fin(edc,bal,0,"F")

                primerBalance = False
            else:
                #Ajuro transferencia
                auxdict = dict()
                auxdict['DoC'] = lineadict.get('cdpart', None)
                auxdict['monto'] = lineadict['monto']
                auxdict['tipo'] = lineadict['tipotrans']
                auxdict['refNostro'] = lineadict.get('refnos', None)
                auxdict['refVostro'] = lineadict.get('refvos', None)
                desc = lineadict.get('det', None)

                fecha = ('').join(lineadict['fecha'].split('/')[::-1])[2:]
                auxdict['fecha'] = fecha


                if auxdict['DoC'] is None:
                    saldo = float(auxdict['monto'].replace(',','.'))
                    if saldo < 0:
                        auxdict['DoC'] = 'D'
                        auxdict['monto'] = str(abs(saldo))
                    else:
                        auxdict['DoC'] = 'C'

                #Se crea la transferencia y se agrega
                tran = Trans()
                tran.trans = auxdict
                tran.desc = desc
                edc_l.add_trans(edc,tran,0)

    if formato is None and cta is not None and not incorrecto:
        msg = msg+"$La cuenta no posee formato definido"

    if cta is None and not incorrecto:
        msg = msg+"$La cuenta no se encuentra registrada"

    return edc_l,msg

def validar_archivo(edc_l,origen):
    msg = ''
    cod = []
    for edc in edc_l:
        # Validacion cuenta registrada
        try:
            # Se busca la cuenta a ver si se encuentra registrada
            if origen == 'conta':
                cta = Cuenta.objects.filter(ref_nostro=edc.cod25)[0]
            elif origen == 'corr':
                cta = Cuenta.objects.filter(ref_vostro=edc.cod25)[0]
        except:
            # No existe la cuenta
            cta = None
            aux = "$Debe registrar la Cuenta "+str(edc.cod25)+" antes de cargar el Edo. de Cuenta."
            msg = msg + aux
            cod.append('2')

        if cta is not None:
            # Se verifica si es contabilidad o corresponsal
            if origen == 'conta':
                ultedcid = cta.ultimoedocuentacargc
            elif origen == 'corr':
                ultedcid = cta.ultimoedocuentacargs

            if ultedcid is not None:
                try:
                    # Ya se ha cargado un archivo antes
                    ultedc = EstadoCuenta.objects.get(idedocuenta=ultedcid)
                except:
                    # Se elimino el edc al cual se hacia referencia
                    ultedc = None
            else:
                # No se ha cargado ningun archivo antes
                ultedc = None

            if ultedc is not None:

                # Validacion balance inicial igual al ult cargado
                num1 = ultedc.balance_final
                num2 = float(edc.pagsBal[0].inicial["monto"].replace(',','.'))
                if num1 != num2:
                    aux = "$El balance inicial del estado de cuenta no coincide con el ultimo cargado"
                    msg = msg + aux
                    cod.append('1')

                # Validacion salto edc
                if int(edc.cod28c) != int(ultedc.codigo)+1:
                    aux = "$Hay un salto en la numeracion de los estados de cuenta para la cuenta: "+str(edc.cod25)
                    msg = msg + aux
                    cod.append('3')

                # Validacion archivo ya cargado
                fecha = re.findall('..?', edc.pagsBal[0].final['fecha'])
                fecha_verif = datetime(int("20"+fecha[0]), int(fecha[1]), int(fecha[2]))
                
                if ultedc.codigo == edc.cod28c and ultedc.fecha_final == fecha_verif:
                    msg = msg + "$El archivo ya se encuentra cargado."
                    cod.append('5')

        # Validacion suma balances
        for i,bal in enumerate(edc.pagsBal):
            
            balini = float(bal.inicial["monto"].replace(",","."))
            balfin = float(bal.final["monto"].replace(",","."))

            if bal.inicial["DoC"] == 'D':
                balini = -balini

            if i<len(edc.pagsTrans):
                for trans in edc.pagsTrans[i]:

                    if trans.trans["DoC"] == "C":
                        balini = balini + float(trans.trans["monto"].replace(",","."))

                    if trans.trans["DoC"] == "D":
                        balini = balini - float(trans.trans["monto"].replace(",","."))

            if ("%.2f" % abs(balini)) != ("%.2f" % balfin):
                msg = msg + "$Hay un error en los balances pag: "+str(i+1)
                cod.append('4')

    return msg,cod