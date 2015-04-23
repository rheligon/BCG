class edoCta:

    def __init__(self, cod25=None):
        self.R = "" # Codigo banco
        self.cod28c = "Pendiente" # Numero Edc
        self.pagsTrans = [] # Arreglo de arreglos de transacciones
        self.pagsBal = [] # Arreglo de balances
        if cod25 is not None: #Numero de la cuenta
            self.cod25 = cod25
        else:
            self.cod25 = ""

    def add_trans(self, trans, pag):
        #Sirve para agregar una nueva transferencia a la lista de edc en la pagina dada
        if (pag >= len(self.pagsTrans)):
            ult = pag-len(self.pagsTrans)+1
            
            for i in range(0,ult):
                self.pagsTrans.append([])

        self.pagsTrans[pag].append(trans)

    def add_trans_existe(self, trans):
        # Sirve para agregar la descripcion de una transferencia ya agregada previamente
        for elem in self.pagsTrans:
            for tran in elem:
                if tran.trans == trans.trans:
                    tran.desc = trans.desc

    def add_bal_ini(self, bal, pag, mof):
        # Sirve para agregar el balance inicial
        if (pag >= len(self.pagsBal)):
            ult = pag-len(self.pagsBal)+1

            for i in range(0,ult):
                self.pagsBal.append(Bal())

        self.pagsBal[pag] = bal
        self.pagsBal[pag].MoFi = mof

    def add_bal_fin(self, bal, pag, mof):
        # Sirve para agregar el balance final
        self.pagsBal[pag].final = bal.final
        self.pagsBal[pag].MoFf = mof

    def __str__(self):
        return " R: %s, cod25: %s, cod28c: %s, pagsTrans: %s, pagsBal: %s" % (self.R, self.cod25, self.cod28c, str(len(self.pagsTrans)), str(len(self.pagsBal)))

    def __repr__(self):
        return "<EDC R: %s, cod25: %s, cod28c: %s, pagsTrans: %s, pagsBal: %s>" % (self.R, self.cod25, self.cod28c, str(len(self.pagsTrans)), str(len(self.pagsBal)))

class edc_list:
    def __init__(self):
        self.edcl = []

    def add_edc(self,edc):
        self.edcl.append(edc)

    def add_28c(self,edc,nro):
        if edc.cod28c == "Pendiente":
            for elem in self.edcl:
                if elem.cod25 == edc.cod25 and elem.cod28c == "Pendiente":
                    elem.cod28c = nro
                    return elem
        else:
            for elem in self.edcl:
                if elem.cod25 == edc.cod25 and elem.cod28c == nro:
                    return elem
            # No encontro un edc con el mismo num estado de cuenta y misma ref, entonces se agrega
            edo = edoCta(edc.cod25)
            edo.R = edc.R
            edo.cod28c = nro
            self.add_edc(edo)
            return edo

    def sinpag(self,edc,nro):
        for elem in self.edcl:
                if elem.cod25 == edc.cod25 and elem.cod28c == nro:
                    return len(elem.pagsBal)
        return 0

    def add_trans(self,edc,trans,pag):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25 and elem.cod28c == edc.cod28c:
                elem.add_trans(trans, pag)

    def add_trans_existe(self,edc,trans):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25 and elem.cod28c == edc.cod28c:
                elem.add_trans_existe(trans)

    def add_bal_ini(self, edc, bal, pag, mof):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25 and elem.cod28c == edc.cod28c:
                elem.add_bal_ini(bal,pag,mof)


    def add_bal_fin(self, edc, bal, pag, mof):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25 and elem.cod28c == edc.cod28c:
                elem.add_bal_fin(bal,pag,mof)

    def esta(self,ref):
        # Para saber si una referencia esta en la lista,
        # en caso que este, devuelve el estado de cuenta
        for elem in self.edcl:
            if elem.cod25 == ref:
                return (True, elem)
        return (False, None)

    def __str__(self):
        return str(self.edcl)

    def __iter__(self):
        for attr in self.edcl:
            yield attr

class Trans:

    def __init__(self, grupo=None, desc=None):
        self.trans = None # Un diccionario de grupo de expresion regular
        self.desc = None  # String

        if grupo is not None:
            self.trans = grupo.groupdict()
        if desc is not None:
            self.desc = desc

    def __str__(self):
        return " trans: %s, desc: %s" % (self.trans, self.desc)

    def __repr__(self):
        return "<Trans trans: %s, desc: %s>" % (self.trans, self.desc)

class Bal:

    def __init__(self, inicial=None, final=None):
        self.inicial = None # Un diccionario de grupo de expresion regular
        self.final = None  # Un diccionario de grupo de expresion regular
        self.MoFi = ""      # M o F
        self.MoFf = ""      # M o F

        if inicial is not None:
            self.inicial = inicial.groupdict()
        if final is not None:
            self.final = final.groupdict()

    def __str__(self):
        if self.final is not None and self.inicial is not None:
            return "inicial: %s, final: %s, MoFi: %s, MoFf: %s" % (self.inicial, self.final, self.MoFi, self.MoFf)
        else:
            return "inicial: %s, final: %s, MoFi: %s, MoFf: %s" % (self.inicial, None, self.MoFi, self.MoFf)


    def __repr__(self):
        if self.final is not None:
            return "<Trans inicial: %s, final: %s, MoFi: %s, MoFf: %s>" % (self.inicial, self.final, self.MoFi, self.MoFf)
        else:
            return "<Trans inicial: %s, final: %s, MoFi: %s, MoFf: %s>" % (self.inicial, None, self.MoFi, self.MoFf)