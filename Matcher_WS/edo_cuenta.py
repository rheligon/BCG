class edoCta:

    def __init__(self, cod25=None):
        self.R = ""
        self.cod28c = ""
        self.pagsTrans = [] # Arreglo de arreglos de transacciones
        self.pagsBal = [] # Arreglo de balances -- No esta en str ni rep
        self.cod64 = ""
        if cod25 is not None:
            self.cod25 = cod25
        else:
            self.cod25 = ""

    def add_trans(self, trans, pag):
        if (pag >= len(self.pagsTrans)):
            self.pagsTrans.append([])

        self.pagsTrans[pag].append(trans)

    def add_trans_existe(self, trans):
        for elem in self.pagsTrans:
            for tran in elem:
                if tran.grupo.group(1) == trans.grupo.group(1):
                    tran.desc = trans.desc

    def add_bal_ini(self, bal, pag, mof):
        if (pag >= len(self.pagsBal)):
            self.pagsBal.append(Bal())

        self.pagsBal[pag] = bal
        self.pagsBal[pag].MoFi = mof 

    def add_bal_fin(self, bal, pag, mof):
        self.pagsBal[pag].final = bal.final
        self.pagsBal[pag].MoFf = mof

    def __str__(self):
        return " R: %s, cod25: %s, cod28c: %s, pagsTrans: %s, pagsBal: %s, cod64: %s" % (self.R, self.cod25, self.cod28c, str(len(self.pagsTrans)), str(len(self.pagsBal)), self.cod64)

    def __repr__(self):
        return "<EDC R: %s, cod25: %s, cod28c: %s, pagsTrans: %s, pagsBal: %s, cod64: %s>" % (self.R, self.cod25, self.cod28c, str(len(self.pagsTrans)), str(len(self.pagsBal)), self.cod64)

class edc_list:
    def __init__(self):
        self.edcl = []

    def add_edc(self,edc):
        self.edcl.append(edc)

    def add_28c(self,edc,nro):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25:
                elem.cod28c = nro

    def add_trans(self,edc,trans,pag):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25:
                elem.add_trans(trans, pag)

    def add_trans_existe(self,edc,trans):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25:
                elem.add_trans_existe(trans)

    def add_bal_ini(self, edc, bal, pag, mof):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25:
                elem.add_bal_ini(bal,pag, mof)

    def add_bal_fin(self, edc, bal, pag, mof):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25:
                elem.add_bal_fin(bal,pag, mof)


    def esta(self,ref):
        for elem in self.edcl:
            if elem.cod25 == ref:
                return (True, elem)
        return (False, None)

    def find(self,edc):
        for elem in self.edcl:
            if elem.cod25 == edc.cod25:
                return True
        return False

    def __str__(self):
        return str(self.edcl)

    def __iter__(self):
        for attr in self.edcl:
            yield attr

class Trans:

    def __init__(self, grupo=None, desc=None):
        self.grupo = None # Un grupo de expresion regular
        self.desc = None  # String

        if grupo is not None:
            self.grupo = grupo
        if desc is not None:
            self.desc = desc

    def __str__(self):
        return " nro-trans: %s, desc: %s" % (self.grupo.group(5), self.desc)

    def __repr__(self):
        return "<Trans nro-trans: %s, desc: %s>" % (self.grupo.group(5), self.desc)

class Bal:

    def __init__(self, inicial=None, final=None):
        self.inicial = None # Un grupo de expresion regular
        self.final = None  # Un grupo de expresion regular
        self.MoFi = ""      # M o F
        self.MoFf = ""      # M o F

        if inicial is not None:
            self.inicial = inicial
        if final is not None:
            self.final = final

    def __str__(self):
        if self.final is not None and self.inicial is not None:
            return "inicial: %s, final: %s, MoFi: %s, MoFf: %s" % (self.inicial.groups(), self.final.groups(), self.MoFi, self.MoFf)
        else:
            return "inicial: %s, final: %s, MoFi: %s, MoFf: %s" % (self.inicial.groups(), None, self.MoFi, self.MoFf)


    def __repr__(self):
        if self.final is not None:
            return "<Trans inicial: %s, final: %s, MoF: %s>" % (self.inicial.groups(), self.final.groups(), self.MoF)
        else:
            return "<Trans inicial: %s, final: %s, MoF: %s>" % (self.inicial.groups(), None, self.MoF)