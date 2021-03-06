import re
from Matcher.models import *
from datetime import datetime, date, time, timedelta


def sumaLineas(arreglo):
	total = 0
	for numero in arreglo:
		total += numero
	return total	

def timenow():
    return datetime.now().replace(microsecond=0)

def parsearTipoMT(archivo,directorio,idioma):
	tipo = ""
	msg = ""
	contador = 0
	dirArch = directorio + "\\" + archivo 

	#abrir archivo
	info = open(dirArch, 'r')

	line1 = info.readline().strip()
	if (line1 != "$"):
		if idioma == 0:
			msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
		else:
			msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
		return ("error", msg)
	contador += 1
	
	line2 = info.readline().strip()
	cabecera2 = line2[:3]
	if (cabecera2 != "[M]"):
		if idioma == 0:
			msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
		else:
			msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo

		return ("error",msg)
	else:
		tipo = line2[3:]

	#cerrar archivo
	info.close()
	return (tipo,"")

def parseo103(archivo,directorio,idioma):
	dirArch = directorio + "\\" + archivo

	#abrir archivo
	info = open(dirArch, 'r')

	lines = info.readlines()
	numLineas = len(lines)
	for i in range(0,numLineas):
		lines[i]=lines[i].strip()

	lineaAct = 0
	lineaAux = 0
	contador = 0
	opcionales = 0
	largoMensajes = []
	verificarOps = []
	verificarOps0 = []
	verificarOps1 = []
	numLineasActual = 0
	msg=""
	opcional = False
	finMensaje = False
	es72 = False
	contenidoLinea = ""
	mensajeTipoM = ""
	emisorS = ""
	receptorR = ""
	emisorRef20 = ""
	timeId13C = ""
	codigoBank23B = ""
	codInst23E = ""
	tipoTrans26T = ""
	fechaValor32A = ""
	moneda32A = ""
	monto32A = ""
	tipoCambio36 = ""
	moneda33B = ""
	clienteOrd50a = ""
	instEmisor51A = ""
	instOrd52a = ""
	emisorCorr53a = ""
	receptorCorr54a = ""
	instReemb55a = ""
	instInter56a = ""
	instCuenta57a = ""
	clienteBene59a = ""
	infoRemesa70 = ""
	detallesCarg71A = ""
	infoEmisor72 = ""
	cargosEmisor71F = ""
	cargosReceptor71G = ""
	reporteReg77B = ""
	fecha_entrada = ""
	moneda33 =""
	io=""
	vali = ""
	observacion =""
	cuenta = None
	#contenido77T = ""

	cuantos = 0


	while contador < numLineas:

		contenidoLinea = lines[contador]
		#Caso para primera Linea $
		if (lineaAct == 0):
			opcion = contenidoLinea

			if (opcion != "$"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorRef20 = contenidoLinea[4:]
				print ("[20]: ",emisorRef20)
		
		#Caso para Campo [13C](ciclo)si existen, sino es [23B] 
		if (lineaAct == 5):
			opcion = contenidoLinea[:5]  
			
			while(opcion == "[13C]"):
				timeId13C = timeId13C + contenidoLinea[5:] + ";"
				
				print ("[13C]: ",timeId13C)
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion = contenidoLinea[:5]

			if (opcion != "[23B]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				codigoBank23B = contenidoLinea[5:]
				print ("[23B]: ",codigoBank23B)

		if (lineaAct == (6 + opcionales)):
			opcion = contenidoLinea[:5]
			verificarOps = ["[26T]"]

			while(opcion == "[23E]"):
				
				codInst23E = codInst23E + contenidoLinea[5:] +";"
				print ("[23E]: ",codInst23E)
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion = contenidoLinea[:5]

			while(opcion == "[26T]"):
				if(opcion not in verificarOps):
					if idioma == 0:
						msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
					else:
						msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
				
					return ("error", msg)
				tipoTrans26T = contenidoLinea[5:]
				print ("[26T]: ",tipoTrans26T)
				verificarOps.remove("[26T]")
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion = contenidoLinea[:5]

			if (opcion != "[32A]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				fechaValor32A = contenidoLinea[5:11]
				fechaValor32A = datetime.strptime(fechaValor32A, "%y%m%d").date()
				fechaValor32A = fechaValor32A.strftime("%d/%m/%Y")
				moneda32A = contenidoLinea[11:14]
				monto32A = contenidoLinea[14:]
				print ("[32A]: ",fechaValor32A)

		if (lineaAct == (7 + opcionales)):
			opcion0 = contenidoLinea[:4]
			opcion1 = contenidoLinea[:5]
			verificarOps0 = ["[36]"]
			verificarOps1 = ["[33B]"]
			
			while(opcion1 == "[33B]"):
				if(opcion1 not in verificarOps1):
					if idioma == 0:
						msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
					else:
						msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
				
					return ("error", msg)

				moneda33B = contenidoLinea[5:]
				moneda33 = moneda33B[:3]
				print ("[33B]: ",moneda33B)
				verificarOps1.remove("[33B]")
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:4]
				opcion1 = contenidoLinea[:5]

			while(opcion0 == "[36]"):
				if(opcion0 not in verificarOps0):
					if idioma == 0:
						msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
					else:
						msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
				
					return ("error", msg)

				tipoCambio36 = contenidoLinea[4:]
				print ("[36]: ",tipoCambio36)
				verificarOps0.remove("[36]")
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:4]
				opcion1 = contenidoLinea[:5]

			if (opcion1 != "[50A]" and opcion1 != "[50F]" and opcion1 != "[50K]"  ): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			elif(opcion1 == "[50A]"): 
				clienteOrd50a = opcion1 + contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion = contenidoLinea[:5]
				opcion0 = contenidoLinea[:4]
				while (opcion != "[51A]" and opcion != "[52A]" and opcion != "[52D]" and opcion != "[53A]" and opcion != "[53B]" and opcion != "[53D]" and opcion != "[54A]" and opcion != "[54B]" and opcion != "[54D]" and opcion != "[55A]" and opcion != "[55B]" and opcion != "[55D]" and opcion != "[56A]" and opcion != "[56C]" and opcion != "[56D]" and opcion != "[57A]" and opcion != "[57B]" and opcion != "[57C]" and opcion != "[57D]" and opcion0 != "[59]" and opcion != "[59A]" and opcion != "[59F]"):
					clienteOrd50a = clienteOrd50a+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion = contenidoLinea[:5]
					opcion0 = contenidoLinea[:4]
				print ("[50A]: ",clienteOrd50a)
			elif(opcion1 == "[50F]"): 
				clienteOrd50a = opcion1 + contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion = contenidoLinea[:5]
				opcion0 = contenidoLinea[:4]
				while (opcion != "[51A]" and opcion != "[52A]" and opcion != "[52D]" and opcion != "[53A]" and opcion != "[53B]" and opcion != "[53D]" and opcion != "[54A]" and opcion != "[54B]" and opcion != "[54D]" and opcion != "[55A]" and opcion != "[55B]" and opcion != "[55D]" and opcion != "[56A]" and opcion != "[56C]" and opcion != "[56D]" and opcion != "[57A]" and opcion != "[57B]" and opcion != "[57C]" and opcion != "[57D]" and opcion0 != "[59]" and opcion != "[59A]" and opcion != "[59F]"):
					clienteOrd50a = clienteOrd50a+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion = contenidoLinea[:5]
					opcion0 = contenidoLinea[:4]
				print ("[50F]: ",clienteOrd50a)
			elif(opcion1 == "[50K]"): 
				clienteOrd50a = opcion1 + contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion = contenidoLinea[:5]
				opcion0 = contenidoLinea[:4]
				while (opcion != "[51A]" and opcion != "[52A]" and opcion != "[52D]" and opcion != "[53A]" and opcion != "[53B]" and opcion != "[53D]" and opcion != "[54A]" and opcion != "[54B]" and opcion != "[54D]" and opcion != "[55A]" and opcion != "[55B]" and opcion != "[55D]" and opcion != "[56A]" and opcion != "[56C]" and opcion != "[56D]" and opcion != "[57A]" and opcion != "[57B]" and opcion != "[57C]" and opcion != "[57D]" and opcion0 != "[59]" and opcion != "[59A]" and opcion != "[59F]"):
					clienteOrd50a = clienteOrd50a+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion = contenidoLinea[:5]
					opcion0 = contenidoLinea[:4]
				print ("[50K]: ",clienteOrd50a)
			
		if (lineaAct == (8 + opcionales)):
			opcion = contenidoLinea[:5]
			verificarOps0 = ["[51A]","[52A]","[52D]","[53A]","[53B]","[53D]","[54A]","[54B]","[54D]","[55A]","[55B]","[55D]","[56A]","[56C]","[56D]","[57A]","[57B]","[57C]","[57D]"]

			while (opcion == "[51A]" or opcion == "[52A]" or opcion == "[52D]" or opcion == "[53A]" or opcion == "[53B]" or opcion == "[53D]" or opcion == "[54A]" or opcion == "[54B]" or opcion == "[54D]" or opcion == "[55A]" or opcion == "[55B]" or opcion == "[55D]" or opcion == "[56A]" or opcion == "[56C]" or opcion == "[56D]" or opcion == "[57A]" or opcion == "[57B]" or opcion == "[57C]" or opcion == "[57D]"):
				if(opcion not in verificarOps0):
					if idioma == 0:
						msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
					else:
						msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
				
					return ("error", msg)
				if (opcion == "[51A]"):
					instEmisor51A = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[52A]" and opcion2 != "[52D]" and opcion2 != "[53A]" and opcion2 != "[53B]" and opcion2 != "[53D]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instEmisor51A = instEmisor51A+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[51A]: ",instEmisor51A)
				if (opcion == "[52A]"):
					instOrd52a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[53A]" and opcion2 != "[53B]" and opcion2 != "[53D]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instOrd52a = instOrd52a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[52A]: ",instOrd52a)
				if (opcion == "[52D]"):
					instOrd52a =  opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[53A]" and opcion2 != "[53B]" and opcion2 != "[53D]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instOrd52a = instOrd52a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[52D]: ",instOrd52a)
				if (opcion == "[53A]"):
					emisorCorr53a = opcion + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53A]: ",emisorCorr53a)
				if (opcion == "[53B]"):
					emisorCorr53a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53B]: ",emisorCorr53a)
				if (opcion == "[53D]"):
					emisorCorr53a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53D]: ",emisorCorr53a)
				if (opcion == "[54A]"):
					receptorCorr54a = opcion + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[54A]: ",receptorCorr54a)
				if (opcion == "[54B]"):
					receptorCorr54a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[54B]: ",receptorCorr54a)
				if (opcion == "[54D]"):
					receptorCorr54a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" ):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[54D]: ",receptorCorr54a)
				if (opcion == "[55A]"):
					instReemb55a = opcion + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instReemb55a = instReemb55a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[55A]: ",instReemb55a)
				if (opcion == "[55B]"):
					instReemb55a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instReemb55a = instReemb55a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[55B]: ",instReemb55a)
				if (opcion == "[55D]"):
					instReemb55a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instReemb55a = instReemb55a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[55D]: ",instReemb55a)
				if (opcion == "[56A]"):
					instInter56a = opcion + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instInter56a = instInter56a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[56A]: ",instInter56a)
				if (opcion == "[56C]"):
					instInter56a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while ( opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" ):
						instInter56a = instInter56a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[56C]: ",instInter56a)
				if (opcion == "[56D]"):
					instInter56a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]" and opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instInter56a = instInter56a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[56D]: ",instInter56a)
				if (opcion == "[57A]"):
					instCuenta57a = opcion + contenidoLinea[5:]
					cuantos = 3
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instCuenta57a = instCuenta57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57A]: ",instCuenta57a)
				if (opcion == "[57B]"):
					instCuenta57a = opcion + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instCuenta57a = instCuenta57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57B]: ",instCuenta57a)
				if (opcion == "[57C]"):
					instCuenta57a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instCuenta57a = instCuenta57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57C]: ",instCuenta57a)
				if (opcion == "[57D]"):
					instCuenta57a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instCuenta57a = instCuenta57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57D]: ",instCuenta57a)
				indice = verificarOps0.index(opcion)
				sumaT = cuantos + indice + 1
				verificarOps0 = verificarOps0[sumaT:]
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion = contenidoLinea[:5]
				opcion0 = contenidoLinea[:4]
				cuantos = 0

			if (opcion0 != "[59]" and opcion != "[59A]" and opcion != "[59F]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			elif (opcion == "[59A]"): 
				clienteBene59a = opcion + contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion2 = contenidoLinea[:4]
				opcion3 = contenidoLinea[:5]
				while (opcion2 != "[70]" and opcion3 != "[71A]"):
					clienteBene59a = clienteBene59a+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:4]
					opcion3 = contenidoLinea[:5]
				print ("[59A]: ",clienteBene59a)
			elif (opcion == "[59F]"): 
				clienteBene59a = opcion + contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion2 = contenidoLinea[:4]
				opcion3 = contenidoLinea[:5]
				while (opcion2 != "[70]" and opcion3 != "[71A]"):
					clienteBene59a = clienteBene59a+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:4]
					opcion3 = contenidoLinea[:5]
				print ("[59F]: ",clienteBene59a)
			elif (opcion0 == "[59]"): 
				clienteBene59a = opcion0 + contenidoLinea[4:]
				contenidoLinea = lines[contador+1]
				opcion2 = contenidoLinea[:4]
				opcion3 = contenidoLinea[:5]
				while (opcion2 != "[70]" and opcion3 != "[71A]"):
					clienteBene59a = clienteBene59a+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:4]
					opcion3 = contenidoLinea[:5]
				print ("[59]: ",clienteBene59a)
	        
	 
		if (lineaAct == (9 + opcionales)):
			opcion0 = contenidoLinea[:4]
			opcion1 = contenidoLinea[:5]

			while(opcion0 == "[70]"):
				infoRemesa70 = contenidoLinea[4:]
				contenidoLinea = lines[contador+1]
				opcion3 = contenidoLinea[:5]
				while (opcion3 != "[71A]"):
					infoRemesa70 = infoRemesa70+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:5]
				print ("[70]: ",infoRemesa70)
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:4]
				opcion1 = contenidoLinea[:5]

			if (opcion1 != "[71A]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				detallesCarg71A = contenidoLinea[5:]
				print ("[71A]: ",detallesCarg71A)

		if (lineaAct == (10 + opcionales)):
			opcion0 = contenidoLinea[:4]
			opcion1 = contenidoLinea[:5]
			verificarOps0 = ["[71G]","[72]","[77B]"] #,"[77T]"

			while(opcion1 == "[71F]"):
				
				cargosEmisor71F = cargosEmisor71F + contenidoLinea[5:] + ";"
				print ("[71F]: ",cargosEmisor71F)
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:4]
				opcion1 = contenidoLinea[:5]

			while (opcion0 == "[72]" or opcion1 == "[71G]" or opcion1 == "[77B]" ):#or opcion1 == "[77T]"
				if (opcion0 == "[72]"):
					es72 = True
				if (es72):			
					if(opcion0 not in verificarOps0):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)
				else: 
					if(opcion1 not in verificarOps0):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)		
				if (opcion0 == "[72]"):
					infoEmisor72 = contenidoLinea[4:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:2]
					opcion2 = contenidoLinea[:5]
					
					while (opcion2 != "[77B]" and opcion3 != "@@" ):
						infoEmisor72 = infoEmisor72+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:2]
						opcion2 = contenidoLinea[:5]
					
					print ("[72]: ",infoEmisor72)
					es72 = True
				if (opcion1 == "[71G]"):
					cargosReceptor71G = contenidoLinea[5:]
					print ("[71G]: ",cargosReceptor71G)
				if (opcion1 == "[77B]"):
					reporteReg77B = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:2]
					while (opcion3 != "@@"):
						reporteReg77B = reporteReg77B+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:2]
					print ("[77B]: ",reporteReg77B)
				#if (opcion1 == "[77T]"):
					#contenido77T = contenidoLinea[5:]
					#print ("[77T]: ",contenido77T)
				if (es72):
					indice = verificarOps0.index(opcion0)
					verificarOps0 = verificarOps0[indice+1:]
				else:
					indice = verificarOps0.index(opcion1)
					verificarOps0 = verificarOps0[indice+1:]
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:4]
				opcion1 = contenidoLinea[:5]
				es72 = False

			if (opcion0 != "@@"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				finMensaje =True
				largoMensajes.append(lineaAct+1)
				numLineasActual = sumaLineas(largoMensajes)
				lineaAct = contador - numLineasActual
				opcionales = 0

		if (finMensaje):
			bic = Configuracion.objects.all()[0].bic
			if (receptorR == bic):
				io = "I"
			elif (emisorS == bic):
				io = "O"
			else:
				if idioma == 0:
					vali = "Este mensaje no nos pertenece, Archivo: " + archivo
				else:
					vali = "This message does not belong to us, File: " + archivo 
			if (io =="I"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = emisorS) 
			elif (io =="O"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = receptorR) 
				
			if cuenta:
				monedaCta = cuenta[0].moneda_idmoneda.codigo
				if(monedaCta != moneda32A):
					if idioma == 0:
						observacion = "Moneda Invalida, la moneda proveniente del mensaje es : " + moneda32A + ", deberia ser : " + monedaCta + ", Archivo: " + archivo
					else:
						observacion = "Invalid Currency, currency comming from message is : " + moneda32A + ", must be: " +monedaCta + ", File: " + archivo
					vali = "vali"
				if(moneda33B != "" and moneda32A != moneda33 and tipoCambio36 == "" ):
					if idioma == 0:
						observacion = "No existe el tipo de Cambio (Campo 36, Código error: D75)  , Archivo: " + archivo
					else:
						observacion= "If field 33B is present and the currency code is different from the currency code in field 32A, Field 36 must be present, otherwise field 36 is not allowed (Error code(s): D75), File: " + archivo
					vali = "vali"
				if(instReemb55a != "" and (emisorCorr53a == "" or receptorCorr54a == "")):
					if idioma == 0:
						observacion = "Si el campo 55a esta presente, tambien deben estar los campos 53a y 54a, Archivo: " + archivo
					else:
						observacion = "If field 55a is present, then both fields 53a and 54a must also be presente (Error Code(s): E306), File: " + archivo
					vali = "vali"
				if(instInter56a != "" and instCuenta57a == "" ):
					if idioma == 0:
						observacion = "Si el campo 56a esta presente, tambien debe estar el campo 57a (Código de error: C81), Archivo: " + archivo
					else:
						observacion = "If field 56a is present, field 57a must also be present (Error code(s): C81), File: " + archivo
					vali = "vali"
				fecha_entrada = timenow()
				mensaje_intra = MensajesIntraday.objects.create(tipo = "103",cuenta = cuenta[0],fecha_entrada=fecha_entrada,i_o = io,observacion=observacion) 
				mensaje = Mt103.objects.create(mensaje_intraday = mensaje_intra,fecha_valor = fechaValor32A, moneda = moneda32A,monto = monto32A, remitente = emisorS,receptor = receptorR, ref_remitente = emisorRef20,ind_hora = timeId13C,tipo_op_banco = codigoBank23B,cod_instruccion = codInst23E,tipo_transaccion = tipoTrans26T, moneda_monto = moneda33B,tipo_cambio = tipoCambio36,cliente_ordenante = clienteOrd50a, institucion_emisor = instEmisor51A,institucion_ordenante = instOrd52a,corresponsal_remitente = emisorCorr53a, corresponsal_receptor = receptorCorr54a, institucion_reembolso = instReemb55a, institucion_intermediaria = instInter56a, cuenta_institucion = instCuenta57a,cliente_beneficiario = clienteBene59a,info_remesa = infoRemesa70,detalle_cargos = detallesCarg71A,info_remitente_a_receptor = infoEmisor72,cargos_remitente = cargosEmisor71F, cargos_receptor = cargosReceptor71G,reporte_regulatorio = reporteReg77B)
			else:
				if idioma == 0:
					vali = "No se posee cuenta donde procesar este mensaje, Archivo: " + archivo
				else:
					vali= "There is not account to procces this message, File: " + archivo
			io=""
			emisorS = ""
			receptorR = ""
			emisorRef20 = ""
			timeId13C = ""
			codigoBank23B = ""
			codInst23E = ""
			tipoTrans26T = ""
			fechaValor32A = ""
			moneda32A = ""
			monto32A = ""
			tipoCambio36 = ""
			moneda33B = ""
			clienteOrd50a = ""
			instEmisor51A = ""
			instOrd52a = ""
			emisorCorr53a = ""
			receptorCorr54a = ""
			instReemb55a = ""
			instInter56a = ""
			instCuenta57a = ""
			clienteBene59a = ""
			infoRemesa70 = ""
			detallesCarg71A = ""
			infoEmisor72 = ""
			cargosEmisor71F = ""
			cargosReceptor71G = ""
			reporteReg77B = ""
			moneda33 =""
			fecha_entrada = ""
			observacion =""
			cuenta = None
			finMensaje = False		

		lineaAct += 1
		contador += 1

		
	#cerrar archivo
	info.close()
	return ("True",vali)

def parseo202(archivo,directorio,idioma):
	dirArch = directorio + "\\" + archivo

	#abrir archivo
	info = open(dirArch, 'r')

	lines = info.readlines()
	numLineas = len(lines)
	for i in range(0,numLineas):
		lines[i]=lines[i].strip()

	lineaAct = 0
	lineaAux = 0
	contador = 0
	opcionales = 0
	largoMensajes = []
	verificarOps = []
	numLineasActual = 0
	msg=""
	opcional = False
	finMensaje = False
	contenidoLinea = ""

	mensajeTipoM = ""
	emisorS = ""
	receptorR = ""
	emisorRef20 = ""
	refRel21 = ""
	timeId13C = ""
	fechaValor32A = ""
	moneda32A = ""
	monto32A = ""
	instOrd52a = ""
	emisorCorr53a = ""
	receptorCorr54a = ""
	instInter56a = ""
	instCuenta57a = ""
	instBene58a = ""
	receptorInfo72 =""
	fecha_entrada = ""
	io=""
	observacion =""
	vali=""
	cuenta = None
	
	cuantos = 0


	while contador < numLineas:

		contenidoLinea = lines[contador]
		#Caso para primera Linea $
		if (lineaAct == 0):
			opcion = contenidoLinea

			if (opcion != "$"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorRef20 = contenidoLinea[4:]
				print ("[20]: ",emisorRef20)
		
		#Caso para Campo [21] 
		if (lineaAct == 5):
			opcion = contenidoLinea[:4]  
			
			if (opcion != "[21]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				refRel21 = contenidoLinea[4:]
				print ("[21]: ",refRel21)

		#Caso para Campo [13C](ciclo)si existen, sino es [23B] 
		if (lineaAct == 6):
			opcion = contenidoLinea[:5]  
			
			while(opcion == "[13C]"):
				timeId13C = timeId13C + contenidoLinea[5:] + ";"
				print ("[13C]: ",timeId13C)
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion = contenidoLinea[:5]

			if (opcion != "[32A]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				fechaValor32A = contenidoLinea[5:11]
				fechaValor32A = datetime.strptime(fechaValor32A, "%y%m%d").date()
				fechaValor32A = fechaValor32A.strftime("%d/%m/%Y")
				moneda32A = contenidoLinea[11:14]
				monto32A = contenidoLinea[14:]
				print ("[32A]: ",fechaValor32A)

		if (lineaAct == (7 + opcionales)):
			opcion = contenidoLinea[:5]
			verificarOps = ["[52A]","[52D]","[53A]","[53B]","[53D]","[54A]","[54B]","[54D]","[56A]","[56D]","[57A]","[57B]","[57D]"]

			while (opcion == "[52A]" or opcion == "[52D]" or opcion == "[53A]" or opcion == "[53B]" or opcion == "[53D]" or opcion == "[54A]" or opcion == "[54B]" or opcion == "[54D]" or opcion == "[56a]" or opcion == "[56A]" or opcion == "[56D]" or opcion == "[57A]" or opcion == "[57B]" or opcion == "[57D]"):
				if( opcion not in verificarOps):
					if idioma == 0:
						msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
					else:
						msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
				
					return ("error", msg)
				if (opcion == "[52A]"):
					instOrd52a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[53A]" and opcion2 != "[53B]" and opcion2 != "[53D]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[56A]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						instOrd52a = instOrd52a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[52A]: ",instOrd52a)
				if (opcion == "[52D]"):
					instOrd52a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[53A]" and opcion2 != "[53B]" and opcion2 != "[53D]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[56A]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						instOrd52a = instOrd52a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[52D]: ",instOrd52a)
				if (opcion == "[53A]"):
					emisorCorr53a = opcion + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[56A]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[53A]: ",emisorCorr53a)
				if (opcion == "[53B]"):
					emisorCorr53a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[56A]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[53B]: ",emisorCorr53a)
				if (opcion == "[53D]"):
					emisorCorr53a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[56A]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[53D]: ",emisorCorr53a)
				if (opcion == "[54A]"):
					receptorCorr54a = opcion + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[56A]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[54A]: ",receptorCorr54a)
				if (opcion == "[54B]"):
					receptorCorr54a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[56A]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[54B]: ",receptorCorr54a)
				if (opcion == "[54D]"):
					receptorCorr54a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[56A]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[54D]: ",receptorCorr54a)
				if (opcion == "[56A]"):
					instInter56a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						instInter56a = instInter56a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[56A]: ",instInter56a)
				if (opcion == "[56D]"):
					instInter56a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57D]" and opcion2 != "[58A]" and opcion2 != "[58D]"):
						instInter56a = instInter56a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[56D]: ",instInter56a)
				if (opcion == "[57A]"):
					instCuenta57a = opcion + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[58A]" and opcion2 != "[58D]"):
						instCuenta57a = instCuenta57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[57A]: ",instCuenta57a)
				if (opcion == "[57B]"):
					instCuenta57a = opcion + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[58A]" and opcion2 != "[58D]"):
						instCuenta57a = instCuenta57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[57B]: ",instCuenta57a)
				if (opcion == "[57D]"):
					instCuenta57a = opcion + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					while (opcion2 != "[58A]" and opcion2 != "[58D]"):
						instCuenta57a = instCuenta57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
					print ("[57D]: ",instCuenta57a)
				indice = verificarOps.index(opcion)
				sumaT = cuantos + indice + 1
				verificarOps = verificarOps[sumaT:]
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion = contenidoLinea[:5]
				cuantos = 0


			if (opcion != "[58A]" and opcion != "[58D]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			elif(opcion == "[58A]"): 
				instBene58a = opcion + contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion3 = contenidoLinea[:2]
				opcion2 = contenidoLinea[:4]
				
				while (opcion2 != "[72]" and opcion3 != "@@"):
					instBene58a = instBene58a+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:2]
					opcion2 = contenidoLinea[:4]

				print ("[58A]: ",instBene58a)
			elif(opcion == "[58D]"): 
				instBene58a = opcion + contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion3 = contenidoLinea[:2]
				opcion2 = contenidoLinea[:4]
				
				while (opcion2 != "[72]" and opcion3 != "@@"):
					instBene58a = instBene58a+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:2]
					opcion2 = contenidoLinea[:4]
				print ("[58D]: ",instBene58a)

		if (lineaAct == (8 + opcionales)):
			opcion = contenidoLinea[:4]

			for opc in range(0,1):
				if (opcion == "[72]"):
					receptorInfo72 = contenidoLinea[4:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:2]
					
					while (opcion3 != "@@"):
						receptorInfo72 = receptorInfo72+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:2]
						opcion2 = contenidoLinea[:4]
					print ("[72]: ",receptorInfo72)
					lineaAct += 1
					contador += 1
					contenidoLinea = lines[contador]
					opcion = contenidoLinea[:4]


			if (opcion != "@@"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				finMensaje =True
				largoMensajes.append(lineaAct+1)
				numLineasActual = sumaLineas(largoMensajes)
				lineaAct = contador - numLineasActual
				opcionales = 0
						
		
		if (finMensaje):
			bic = Configuracion.objects.all()[0].bic
			if (receptorR == bic):
				io = "I"
			elif (emisorS == bic):
				io = "O"
			else:
				if idioma == 0:
					vali = "Este mensaje no nos pertenece, Archivo: " + archivo
				else:
					vali = "This message does not belong to us, File: " + archivo

			if (io =="I"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = emisorS) 
			elif (io =="O"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = receptorR) 
			
			if cuenta:
				monedaCta = cuenta[0].moneda_idmoneda.codigo
				if(monedaCta != moneda32A):
					if idioma == 0:
						observacion = "Moneda Invalida, la moneda proveniente del mensaje es : " + moneda32A + ", deberia ser : " + monedaCta + ", Archivo: " + archivo
					else:
						observacion = "Invalid Currency, currency comming from message is : " + moneda32A + ", must be: " +monedaCta + ", File: " + archivo
					vali = "vali"
				if(instInter56a != "" and instCuenta57a == ""):
					if idioma == 0:
						observacion = "Si el campo 56a esta presente el campo 57a tambien tiene que estarlo, Archivo: " + archivo
					else:
						observacion = "If field 56a is present, then field 57a must also be present (Error code(s): C81), File " + archivo
					vali = "vali"
					
				fecha_entrada = timenow()
				mensaje_intra = MensajesIntraday.objects.create(tipo = "202",cuenta = cuenta[0],fecha_entrada=fecha_entrada,i_o=io,observacion=observacion) 
				mensaje = Mt202.objects.create(mensaje_intraday = mensaje_intra,fecha_valor = fechaValor32A, moneda = moneda32A,monto = monto32A,remitente = emisorS,receptor = receptorR, ref_transaccion = emisorRef20,ref_relacion = refRel21,ind_hora = timeId13C, institucion_ordenante = instOrd52a,corresponsal_remitente = emisorCorr53a, corresponsal_receptor = receptorCorr54a,intermediario = instInter56a, cuenta_institucion = instCuenta57a,institucion_beneficiaria = instBene58a,info_remitente_a_receptor = receptorInfo72)
			else:
				if idioma == 0:
					vali = "No se posee cuenta donde procesar este mensaje, Archivo: " + archivo
				else:
					vali = "There is not account to process this message, File: " + archivo
			io=""
			emisorS = ""
			receptorR = ""
			emisorRef20 = ""
			refRel21 = ""
			timeId13C = ""
			fechaValor32A = ""
			moneda32A = ""
			monto32A = ""
			instOrd52a = ""
			emisorCorr53a = ""
			receptorCorr54a = ""
			instInter56a = ""
			instCuenta57a = ""
			instBene58a = ""
			receptorInfo72 =""
			fecha_entrada = ""
			observacion =""
			msg=""
			finMensaje = False	
			cuenta = None			

		lineaAct += 1
		contador += 1

	#cerrar archivo
	info.close()
	return ("True",vali)


def parseo752(archivo,directorio,idioma):
	dirArch = directorio + "\\" + archivo

	#abrir archivo
	info = open(dirArch, 'r')

	lines = info.readlines()
	numLineas = len(lines)
	for i in range(0,numLineas):
		lines[i]=lines[i].strip()


	lineaAct = 0
	lineaAux = 0
	contador = 0
	opcionales = 0
	largoMensajes = []
	verificarOps = []
	numLineasActual = 0

	opcional = False
	error = False
	finMensaje = False
	es72 = False
	contenidoLinea = ""
	mensajeTipoM = ""
	emisorS = ""
	receptorR = ""
	emisorRef20 = ""
	refRel21 = ""
	id23 = ""
	fecha30 = ""
	montoTotal32B = ""
	cargosDed71B = ""
	fechaValor33A = ""
	moneda33A = ""
	monto33A = ""
	emisorCorr53a = ""
	receptorCorr54a = ""
	moneda32B = ""
	monto32B =""
	info72 = ""
	cuantos = 0
	msg = ""
	io=""
	vali=""
	observacion = ""
	cuenta = None

	while contador < numLineas:

		contenidoLinea = lines[contador]
		#Caso para primera Linea $
		if (lineaAct == 0):
			opcion = contenidoLinea

			if (opcion != "$"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorRef20 = contenidoLinea[4:]
				print ("[20]: ",emisorRef20)
		
		#Caso para Campo [21] 
		if (lineaAct == 5):
			opcion = contenidoLinea[:4]  
			
			if (opcion != "[21]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				refRel21 = contenidoLinea[4:]
				print ("[21]: ",refRel21)
		
		#Caso para Linea campo [23] 
		if (lineaAct == 6):
			
			opcion = contenidoLinea[:4]
		
			if (opcion != "[23]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				id23 = contenidoLinea[4:]
				print ("[23]: ",id23)

		#Caso para Linea campo [30] 
		if (lineaAct == 7):
			
			opcion = contenidoLinea[:4]
		
			if (opcion != "[30]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				fecha30 = contenidoLinea[4:]
				fecha30 = datetime.strptime(fecha30, "%y%m%d").date()
				fecha30 = fecha30.strftime("%d/%m/%Y")
				print ("[30]: ",fecha30)

		#caso para opcionales si existen
		if (lineaAct == 8):
			opcion0 = contenidoLinea[:4]
			opcion1 = contenidoLinea[:5]
			verificarOps = ["[32B]","[71B]","[33A]","[33B]","[53A]","[53B]","[53D]","[54A]","[54B]","[54D]","[72]"]


			while (opcion0 == "[72]" or opcion1 == "[32B]" or opcion1 == "[33A]" or opcion1 == "[33B]" or opcion1 == "[53A]" or opcion1 == "[53B]" or opcion1 == "[53D]" or opcion1 == "[54A]" or opcion1 == "[54B]" or opcion1 == "[54D]" or opcion1 == "[71B]"  ):
				if (opcion0 == "[72]"):
					es72 = True
				if (es72):			
					if(opcion0 not in verificarOps):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)
				else: 
					if(opcion1 not in verificarOps):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)	
				if (opcion1 == "[32B]"):
					montoTotal32B = contenidoLinea[5:]
					moneda32B = montoTotal32B[:3]
					monto32B = montoTotal32B[3:]
					print ("[32B]: ",montoTotal32B)
				if (opcion1 == "[71B]"):
					cargosDed71B = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:5]
					opcion2 = contenidoLinea[:4]
					while (opcion2 != "[72]" and opcion3 != "[33A]" and opcion3 != "[33B]" and opcion3 != "[53A]" and opcion3 != "[53B]" and opcion3 != "[53D]" and opcion3 != "[54A]" and opcion3 != "[54B]" and opcion3 != "[54D]" and opcion3 != "@@"):
						cargosDed71B = cargosDed71B+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:5]
						opcion2 = contenidoLinea[:4]
					
					print ("[71B]: ",cargosDed71B)
				if (opcion1 == "[33A]"):
					cuantos = 1
					fechaValor33A = contenidoLinea[5:11]
					fechaValor33A = datetime.strptime(fechaValor33A, "%y%m%d").date()
					fechaValor33A = fechaValor33A.strftime("%d/%m/%Y")
					moneda33A = contenidoLinea[11:14]
					monto33A = contenidoLinea[14:]
					if(moneda33A != moneda32B):
						if idioma == 0:
							observacion = "Los campos 32B y 33a deben tener el mismo tipo de moneda, Archivo: " + archivo
						else:
							observacion = "The currency code in the a amount fileds 33B and 33a must be the same (Error code(s): C02), File: " + archivo 
						vali = "vali"
					print ("[33A]: ",fechaValor33A)
					print ("[33A]: ",moneda33A)
					print ("[33A]: ",monto33A)
				if (opcion1 == "[33B]"):
					moneda33A = contenidoLinea[5:8]
					monto33A = contenidoLinea[8:]
					if(moneda33A != moneda32B):
						if idioma == 0:
							observacion = "Los campos 32B y 33a deben tener el mismo tipo de moneda, Archivo: " + archivo
						else:
							observacion = "The currency code in the a amount fileds 33B and 33a must be the same (Error code(s): C02), File: " + archivo 
						vali = "vali"
					print ("[33B]: ",moneda33A)
					print ("[33B]: ",monto33A)
				if (opcion1 == "[53A]"):
					emisorCorr53a = opcion1 + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					
					while (opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion3 != "[72]" and opcion3 != "@@"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					
					print ("[53A]: ",emisorCorr53a)
				if (opcion1 == "[53B]"):
					emisorCorr53a = opcion1 + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					
					while (opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion3 != "[72]" and opcion3 != "@@"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53B]: ",emisorCorr53a)
				if (opcion1 == "[53D]"):
					emisorCorr53a = opcion1 + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					
					while (opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion3 != "[72]" and opcion3 != "@@"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53D]: ",emisorCorr53a)
				if (opcion1 == "[54A]"):
					receptorCorr54a = opcion1 + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:4]
					
					while (opcion3 != "[72]" and opcion3 != "@@"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:4]
					print ("[54A]: ",receptorCorr54a)
				if (opcion1 == "[54B]"):
					receptorCorr54a = opcion1 + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:4]
					
					while (opcion3 != "[72]" and opcion3 != "@@"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:4]
					print ("[54B]: ",receptorCorr54a)
				if (opcion1 == "[54D]"):
					receptorCorr54a = opcion1 + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:4]
					
					while (opcion3 != "[72]" and opcion3 != "@@"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:4]
					print ("[54D]: ",receptorCorr54a)
				if (opcion0 == "[72]"):
					info72 = contenidoLinea[4:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:2]
					
					while (opcion3 != "@@"):
						info72 = info72+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:2]
					print ("[72]: ",info72)
				if (es72):
					indice = verificarOps.index(opcion0)
					verificarOps = verificarOps[indice+1:]
				else:
					indice = verificarOps.index(opcion1)
					sumaT = cuantos + indice + 1
					verificarOps = verificarOps[sumaT:]
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:4]
				opcion1 = contenidoLinea[:5]
				es72 = False
				cuantos = 0

			if (opcion0 != "@@"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				finMensaje =True
				largoMensajes.append(lineaAct+1)
				numLineasActual = sumaLineas(largoMensajes)
				lineaAct = contador - numLineasActual
				opcionales = 0

		if (finMensaje):
			bic = Configuracion.objects.all()[0].bic
			if (receptorR == bic):
				io = "I"
			elif (emisorS == bic):
				io = "O"
			else:
				if idioma == 0:
					vali = "Este mensaje no nos pertenece, Archivo: " + archivo
				else:
					vali = "This message does not belong to us, File: " + archivo
			if (io =="I"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = emisorS) 
			elif (io =="O"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = receptorR) 
			
			if cuenta:
				monedaCta = cuenta[0].moneda_idmoneda.codigo
				if(moneda33A != "" and monedaCta != moneda33A):
					if idioma == 0:
						observacion = "Moneda Invalida, la moneda proveniente del mensaje es : " + moneda33A + ", deberia ser : " + monedaCta + ", Archivo: " + archivo
					else:
						observacion = "Invalid currency code, the currency of the message es: " +moneda33A + ", but must be: " + monedaCta + ", File: " + archivo
					vali = "vali"
				if(montoTotal32B != "" and cargosDed71B != "" and moneda33A == ""):
					if idioma == 0:
						observacion = "Si los campos 32B y 71B existen, el campo 33a Debería estar presente (Código error: C18), Archivo: " + archivo
					else:
						observacion = "If fields 32B and 71B are both present, then field 33a must also be present (Error code(s): C18), File: " +archivo
					vali = "vali"
				if(fechaValor33A == ""):
					fechaValor33A = fecha30
				if(montoTotal32B == "" and monto33A == ""):
					monto33A = "0,"
					moneda33A = monedaCta
				elif(montoTotal32B != "" and monto33A == ""):
					monto33A = monto32B
					moneda33A = moneda32B
				if (id23 != "DEBIT"):
					monto33A = "0,"
					moneda33A = monedaCta
				fecha_entrada = timenow()
				mensaje_intra = MensajesIntraday.objects.create(tipo = "752",cuenta = cuenta[0],fecha_entrada=fecha_entrada,i_o=io,observacion=observacion) 
				mensaje = Mt752.objects.create(mensaje_intraday = mensaje_intra,fecha_valor = fechaValor33A, moneda = moneda33A,monto = monto33A,remitente = emisorS,receptor = receptorR, num_credito = emisorRef20,ref_banco_present = refRel21,proposito = id23, fecha_aviso = fecha30, monto_total = montoTotal32B, cargos_deducidos = cargosDed71B,corresponsal_remitente = emisorCorr53a, corresponsal_receptor = receptorCorr54a,info_remitente_a_receptor = info72)
			else:
				if idioma == 0:
					vali = "No se posee cuenta donde procesar este mensaje, Archivo: " + archivo
				else:
					vali = "There is not account to process the message, File: " + archivo
			emisorS = ""
			receptorR = ""
			emisorRef20 = ""
			refRel21 = ""
			id23 = ""
			fecha30 = ""
			montoTotal32B = ""
			cargosDed71B = ""
			emisorCorr53a = ""
			receptorCorr54a = ""
			info72 = ""
			fechaValor33A = ""
			moneda33A = ""
			monto33A = ""
			moneda32B = ""
			monto32B =""
			msg = ""
			io=""
			observacion = ""
			finMensaje = False	
			cuenta = None

		lineaAct += 1
		contador += 1

	#cerrar archivo
	info.close()
	return ("True",vali)



def parseo754(archivo,directorio,idioma):
	dirArch = directorio + "\\" + archivo

	#abrir archivo
	info = open(dirArch, 'r')

	lines = info.readlines()
	numLineas = len(lines)
	for i in range(0,numLineas):
		lines[i]=lines[i].strip()



	lineaAct = 0
	lineaAux = 0
	contador = 0
	opcionales = 0
	largoMensajes = []
	verificarOps = []
	numLineasActual = 0

	opcional = False
	error = False
	finMensaje = False
	es72 = False
	contenidoLinea = ""
	mensajeTipoM = ""
	emisorS = ""
	receptorR = ""
	emisorRef20 = ""
	refRel21 = ""
	fechaValor32 = ""
	moneda32 = ""
	monto32 = ""
	montoT =""
	montoAdic33B = ""
	montoDed71B = ""
	cargosAdd73 = ""
	reemBank53a = ""
	cuentaBank57a = ""
	beneBank58a = ""
	info72 =""
	narrativa77A = ""
	cuenta = None

	cuantos = 0
	msg = ""
	io=""
	vali=""
	observacion = ""

	while contador < numLineas:

		contenidoLinea = lines[contador]
		#Caso para primera Linea $
		if (lineaAct == 0):
			opcion = contenidoLinea

			if (opcion != "$"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorRef20 = contenidoLinea[4:]
				print ("[20]: ",emisorRef20)
		
		#Caso para Campo [21] 
		if (lineaAct == 5):
			opcion = contenidoLinea[:4]  
			
			if (opcion != "[21]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				refRel21 = contenidoLinea[4:]
				print ("[21]: ",refRel21)
		
		#Caso para Linea campo [32a] 
		if (lineaAct == 6):
			
			opcion = contenidoLinea[:5]
		
			if (opcion != "[32A]" and opcion != "[32B]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			elif(opcion == "[32A]" ): 
				fechaValor32 = contenidoLinea[5:11]
				fechaValor32 = datetime.strptime(fechaValor32, "%y%m%d").date()
				fechaValor32 = fechaValor32.strftime("%d/%m/%Y")
				moneda32 = contenidoLinea[11:14]
				monto32 = contenidoLinea[14:]
				montoT = opcion + fechaValor32 + moneda32 + monto32
				print ("[32A]: ",fechaValor32)
				print ("[32A]: ",moneda32)
				print ("[32A]: ",monto32)

			elif(opcion == "[32B]" ): 
				moneda32 = contenidoLinea[5:8]
				monto32 = contenidoLinea[8:]
				montoT = opcion + moneda32 + monto32
				print ("[32B]: ",moneda32)
				print ("[32B]: ",monto32)

		#caso para opcionales si existen
		if (lineaAct == 7):
			opcion0 = contenidoLinea[:4]
			opcion1 = contenidoLinea[:5]
			verificarOps = ["[33B]","[71B]","[73]","[34A]","[34B]","[53A]","[53B]","[53D]","[57A]","[57B]","[57D]","[58A]","[58B]","[72]","[77A]"]

			while (opcion0 == "[72]" or opcion0 == "[73]" or opcion1 == "[33B]" or opcion1 == "[34A]" or opcion1 == "[34B]" or opcion1 == "[53A]" or opcion1 == "[53B]"or opcion1 == "[53D]" or opcion1 == "[57A]" or opcion1 == "[57B]" or opcion1 == "[57D]" or opcion1 == "[58A]" or opcion1 == "[58B]" or opcion1 == "[71B]" or opcion1 == "[77A]" and opcion3 != "@@"):
				if (opcion0 == "[72]" or opcion0 == "[73]"):
					es72 = True
				if (es72):			
					if(opcion0 not in verificarOps):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)
				else: 
					if(opcion1 not in verificarOps):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)
				if (opcion1 == "[33B]"):
					montoAdic33B = contenidoLinea[5:]
					print ("[33B]: ",montoAdic33B)
				if (opcion1 == "[71B]"):
					montoDed71B = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[73]" and opcion2 != "[34A]" and opcion2 != "[34B]" and opcion2 !="[53A]" and opcion2 !="[53B]" and opcion2 !="[53D]" and opcion2 !="[57A]" and opcion2 !="[57B]" and opcion2 !="[57D]" and opcion2 !="[58A]" and opcion2 !="[58D]" and opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						montoDed71B = montoDed71B+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[71B]: ",montoDed71B)
				if (opcion0 == "[73]"):
					cargosAdd73 = contenidoLinea[4:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 != "[34A]" and opcion2 != "[34B]" and opcion2 !="[53A]" and opcion2 !="[53B]" and opcion2 !="[53D]" and opcion2 !="[57A]" and opcion2 !="[57B]" and opcion2 !="[57D]" and opcion2 !="[58A]" and opcion2 !="[58D]" and opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						cargosAdd73 = cargosAdd73+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[73]: ",cargosAdd73)
				if (opcion1 == "[34A]"):
					cuantos = 1
					fechaValor32 = contenidoLinea[5:11]
					fechaValor32 = datetime.strptime(fechaValor32, "%y%m%d").date()
					fechaValor32 = fechaValor32.strftime("%d/%m/%Y")
					if(contenidoLinea[11:14] != moneda32):
						if idioma == 0:
							observacion = "Los campos 32a y 34a deben tener el mismo tipo de moneda (Código error: C02), Archivo: " + archivo
						else:
							observacion = "The currency code in the amount fields 32a and 34a must be the same (Error code(s): C02), File: " + archivo
						vali = "vali"
					moneda32 = contenidoLinea[11:14]
					monto32 = contenidoLinea[14:]
					print ("[34A]: ",fechaValor32)
					print ("[34A]: ",moneda32)
					print ("[34A]: ",monto32)
				if (opcion1 == "[34B]"):
					if(contenidoLinea[5:8] != moneda32):
						if idioma == 0:
							observacion = "Los campos 32a y 34a deben tener el mismo tipo de moneda (Código error: C02), Archivo: " + archivo
						else:
							observacion = "The currency code in the amount fields 32a and 34a must be the same (Error code(s): C02), File: " + archivo
						vali = "vali"
					moneda32 = contenidoLinea[5:8]
					monto32 = contenidoLinea[8:]
					print ("[34B]: ",moneda32)
					print ("[34B]: ",monto32)
				if (opcion1 == "[53A]"):
					reemBank53a = opcion1 + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 !="[57A]" and opcion2 !="[57B]" and opcion2 !="[57D]" and opcion2 !="[58A]" and opcion2 !="[58D]" and opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						reemBank53a = reemBank53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53A]: ",reemBank53a)
				if (opcion1 == "[53B]"):
					reemBank53a = opcion1 + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 !="[57A]" and opcion2 !="[57B]" and opcion2 !="[57D]" and opcion2 !="[58A]" and opcion2 !="[58D]" and opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						reemBank53a = reemBank53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53B]: ",reemBank53a)
				if (opcion1 == "[53D]"):
					reemBank53a = opcion1 + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 !="[57A]" and opcion2 !="[57B]" and opcion2 !="[57D]" and opcion2 !="[58A]" and opcion2 !="[58D]" and opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						reemBank53a = reemBank53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53D]: ",reemBank53a)
				if (opcion1 == "[57A]"):
					
					cuentaBank57a = opcion1 + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 !="[58A]" and opcion2 !="[58D]" and opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						cuentaBank57a = cuentaBank57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57A]: ",cuentaBank57a)
				if (opcion1 == "[57B]"):
					cuentaBank57a = opcion1 + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 !="[58A]" and opcion2 !="[58D]" and opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						cuentaBank57a = cuentaBank57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57B]: ",cuentaBank57a)
				if (opcion1 == "[57D]"):
					cuentaBank57a = opcion1 + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 !="[58A]" and opcion2 !="[58D]" and opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						cuentaBank57a = cuentaBank57a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57D]: ",cuentaBank57a)
				if (opcion1 == "[58A]"):
					beneBank58a = opcion1 + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						beneBank58a = beneBank58a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[58A]: ",beneBank58a)
				if (opcion1 == "[58B]"):
					beneBank58a = opcion1 + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[72]" and opcion2 !="[77A]" and opcion3 != "@@"):
						beneBank58a = beneBank58a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[58B]: ",beneBank58a)
				if (opcion0 == "[72]"):
					info72 = contenidoLinea[4:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:2]
					while (opcion2 !="[77A]" and opcion3 != "@@"):
						info72 = info72+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[72]: ",info72)
				if (opcion1 == "[77A]"):
					
					narrativa77A = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:2]
					
					while (opcion3 != "@@"):
						narrativa77A = narrativa77A+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:2]
					print ("[77A]: ",narrativa77A)
				if (es72):
					indice = verificarOps.index(opcion0)
					verificarOps = verificarOps[indice+1:]
				else:
					indice = verificarOps.index(opcion1)
					sumaT = cuantos + indice + 1
					verificarOps = verificarOps[sumaT:]
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:4]
				opcion1 = contenidoLinea[:5]
				es72 = False
				cuantos = 0

			if (opcion0 != "@@"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				finMensaje =True
				largoMensajes.append(lineaAct+1)
				numLineasActual = sumaLineas(largoMensajes)
				lineaAct = contador - numLineasActual
				opcionales = 0

		if (finMensaje):
			bic = Configuracion.objects.all()[0].bic
			if (receptorR == bic):
				io = "I"
			elif (emisorS == bic):
				io = "O"
			else:
				if idioma == 0:
					vali = "Este mensaje no nos pertenece, Archivo: " + archivo
				else:
					vali = "This message does not belong to us, File: " + archivo 

			if (io =="I"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = emisorS) 
			elif (io =="O"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = receptorR) 
			
			if cuenta:
				monedaCta = cuenta[0].moneda_idmoneda.codigo
				if(monedaCta != moneda32):
					if idioma == 0:
						observacion = "Moneda Invalida, la moneda proveniente del mensaje es : " + moneda32 + ", deberia ser : " + monedaCta + ", Archivo: " + archivo
					else:
						observacion = "Invalid currency, currecy comming from message is: " + moneda32 + ", but must be: " + monedaCta + ", Archivo: " + archivo
					vali = "vali"
				if(reemBank53a != "" and cuentaBank57a != ""):
					if idioma == 0:
						observacion = "Los Campos 53a y 57a pueden estar presentes, pero no ambos (Código error: C14), Archivo: " + archivo
					else:
						observacion = "Either field 53a or 57a may be present, but not both (Error code(s): C14), File: " + archivo
					vali = "vali"
				if(info72 != "" and narrativa77A != ""):
					if idioma == 0:
						observacion = "Los Campos 72 y 77A pueden estar presentes, pero no ambos, (Código error: C19), Archivo: " + archivo 
					else:
						observacion ="Either field 72 or 77A may be present, but not both (Error code(s): C19), File: " + archivo
					vali = "vali"
				fecha_entrada = timenow()
				mensaje_intra = MensajesIntraday.objects.create(tipo = "754",cuenta = cuenta[0],fecha_entrada=fecha_entrada,i_o=io,observacion=observacion) 
				mensaje = Mt754.objects.create(monto_total=montoT,mensaje_intraday = mensaje_intra,fecha_valor = fechaValor32, moneda = moneda32,monto = monto32,remitente = emisorS,receptor = receptorR, ref_remitente = emisorRef20,ref_relacion = refRel21,monto_adicional = montoAdic33B, cargos_deducidos = montoDed71B,cargos_agregados = cargosAdd73, banco_reembolso = reemBank53a, cuenta_institucion = cuentaBank57a,banco_beneficiario = beneBank58a,info_remitente_a_receptor = info72,narrativa = narrativa77A)
			else:
				if idioma == 0:
					vali = "No se posee cuenta donde procesar este mensaje, Archivo: " + archivo
				else:
					vali = "There is not accounts to process the message, File: " + archivo
			emisorS = ""
			receptorR = ""
			emisorRef20 = ""
			refRel21 = ""
			fechaValor32 = ""
			moneda32 = ""
			monto32 = ""
			montoAdic33B = ""
			montoDed71B = ""
			cargosAdd73 = ""
			reemBank53a = ""
			cuentaBank57a = ""
			beneBank58a = ""
			info72 =""
			narrativa77A = ""
			montoT=""
			msg = ""
			io=""
			observacion = ""
			finMensaje = False	
			cuenta = None

		lineaAct += 1
		contador += 1


	#cerrar archivo
	info.close()
	return ("True",vali)



def parseo756(archivo,directorio,idioma):
	dirArch = directorio + "\\" + archivo

	#abrir archivo
	info = open(dirArch, 'r')

	lines = info.readlines()
	numLineas = len(lines)
	for i in range(0,numLineas):
		lines[i]=lines[i].strip()

	lineaAct = 0
	lineaAux = 0
	contador = 0
	opcionales = 0
	largoMensajes = []
	verificarOps = []
	numLineasActual = 0

	opcional = False
	error = False
	finMensaje = False
	es72 = False
	contenidoLinea = ""
	mensajeTipoM = ""
	emisorS = ""
	receptorR = ""
	emisorRef20 = ""
	refRel21 = ""
	montoTotal32B = ""
	fechaValor33A = ""
	moneda33A = ""
	monto33A = ""			
	emisorCorr53a = ""
	receptorCorr54a = ""
	info72 = ""
	moneda32B = ""
	cuantos = 0
	cuenta = None
	msg = ""
	io=""
	vali=""
	observacion = ""

	while contador < numLineas:

		contenidoLinea = lines[contador]
		#Caso para primera Linea $
		if (lineaAct == 0):
			opcion = contenidoLinea

			if (opcion != "$"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorRef20 = contenidoLinea[4:]
				print ("[20]: ",emisorRef20)
		
		#Caso para Campo [21] 
		if (lineaAct == 5):
			opcion = contenidoLinea[:4]  
			
			if (opcion != "[21]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				refRel21 = contenidoLinea[4:]
				print ("[21]: ",refRel21)
		
		#Caso para Linea campo [32B] 
		if (lineaAct == 6):
			
			opcion = contenidoLinea[:5]
		
			if (opcion != "[32B]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				montoTotal32B = contenidoLinea[5:]
				moneda32B = montoTotal32B[:3]
				print ("[32B]: ",montoTotal32B)

		#Caso para Linea campo [33A] 
		if (lineaAct == 7):
			
			opcion = contenidoLinea[:5]
		
			if (opcion != "[33A]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				fechaValor33A = contenidoLinea[5:11]
				fechaValor33A = datetime.strptime(fechaValor33A, "%y%m%d").date()
				fechaValor33A = fechaValor33A.strftime("%d/%m/%Y")
				moneda33A = contenidoLinea[11:14]
				monto33A = contenidoLinea[14:]
				if(moneda33A != moneda32B):
					if idioma == 0:
						observacion = "Los campos 32B y 33A deben tener el mismo tipo de moneda, Archivo: " + archivo
					else:
						observacion = "The currency code in the amount fields 32B and 33A must be the same (Error code(s): C02), File: " + archivo
					vali = "vali"
				print ("[33A]: ",fechaValor33A)
				print ("[33A]: ",moneda33A)
				print ("[33A]: ",monto33A)
		
		#caso para opcionales si existen
		if (lineaAct == 8):
			opcion0 = contenidoLinea[:4]
			opcion1 = contenidoLinea[:5]
			verificarOps = ["[53A]","[53B]","[53D]","[54A]","[54B]","[54D]","[72]"]

			while (opcion0 == "[72]" or opcion1 == "[53A]" or opcion1 == "[53B]" or opcion1 == "[53D]" or opcion1 == "[54A]" or opcion1 == "[54B]" or opcion1 == "[54D]" ):
				if (opcion0 == "[72]"):
					es72 = True
				if (es72):			
					if(opcion0 not in verificarOps):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)
				else: 
					if(opcion1 not in verificarOps):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)
				if (opcion1 == "[53A]"):
					emisorCorr53a = opcion1 + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion3 !="[72]" and opcion3 != "@@"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53a]: ",emisorCorr53a)
				if (opcion1 == "[53B]"):
					emisorCorr53a = opcion1 + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion3 !="[72]" and opcion3 != "@@"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53a]: ",emisorCorr53a)
				if (opcion1 == "[53D]"):
					emisorCorr53a = opcion1 + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion3 !="[72]" and opcion3 != "@@"):
						emisorCorr53a = emisorCorr53a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53a]: ",emisorCorr53a)
				if (opcion1 == "[54A]"):
					receptorCorr54a = opcion1 + contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:4]
					while (opcion3 !="[72]" and opcion3 != "@@"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:4]
					print ("[54a]: ",receptorCorr54a)
				if (opcion1 == "[54B]"):
					receptorCorr54a = opcion1 + contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:4]
					while (opcion3 !="[72]" and opcion3 != "@@"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:4]
					print ("[54a]: ",receptorCorr54a)
				if (opcion1 == "[54D]"):
					receptorCorr54a = opcion1 + contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:4]
					while (opcion3 !="[72]" and opcion3 != "@@"):
						receptorCorr54a = receptorCorr54a+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:4]
					print ("[54a]: ",receptorCorr54a)
				if (opcion0 == "[72]"):
					info72 = contenidoLinea[4:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:2]
					
					while (opcion3 != "@@"):
						info72 = info72+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:2]
						opcion2 = contenidoLinea[:4]
					print ("[72]: ",info72)
				if (es72):
					indice = verificarOps.index(opcion0)
					verificarOps = verificarOps[indice+1:]
				else:
					indice = verificarOps.index(opcion1)
					sumaT = cuantos + indice + 1
					verificarOps = verificarOps[sumaT:]
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:4]
				opcion1 = contenidoLinea[:5]
				es72 = False
				cuantos = 0
					
			if (opcion0 != "@@"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				finMensaje =True
				largoMensajes.append(lineaAct+1)
				numLineasActual = sumaLineas(largoMensajes)
				lineaAct = contador - numLineasActual
				opcionales = 0

		if (finMensaje):
			bic = Configuracion.objects.all()[0].bic
			if (receptorR == bic):
				io = "I"
			elif (emisorS == bic):
				io = "O"
			else:
				if idioma == 0:
					vali = "Este mensaje no nos pertenece, Archivo: " + archivo
				else:
					vali = "This message does not belong to us, File: " + archivo

			if (io =="I"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = emisorS) 
			elif (io =="O"):
				cuenta = Cuenta.objects.filter(banco_corresponsal_idbanco__codigo = receptorR) 
			
			if cuenta:
				monedaCta = cuenta[0].moneda_idmoneda.codigo
				if(monedaCta != moneda33A):
					if idioma == 0:
						observacion = "Moneda Invalida, la moneda proveniente del mensaje es : " + moneda33A + ", deberia ser: " + monedaCta + ", Archivo: " + archivo
					else:
						observacion = "Invalid Currency, the currency comming from the message is: " +moneda33A + ", but must be: " + monedaCta + ", File: " + archivo 
					vali = "vali"
				fecha_entrada = timenow()
				mensaje_intra = MensajesIntraday.objects.create(tipo = "756",cuenta = cuenta[0],fecha_entrada=fecha_entrada,i_o=io,observacion=observacion) 
				mensaje = Mt756.objects.create(mensaje_intraday = mensaje_intra,fecha_valor = fechaValor33A, moneda = moneda33A,monto = monto33A,remitente = emisorS,receptor = receptorR, ref_remitente = emisorRef20,ref_banco_present = refRel21,moneda_monto = montoTotal32B, corresponsal_remitente = emisorCorr53a, corresponsal_receptor = receptorCorr54a,info_remitente_a_receptor = info72)
			else:
				if idioma == 0:
					vali = "No se posee cuenta donde procesar este mensaje, Archivo: " + archivo
				else:
					vali = "There is not account to process the message, File: " + archivo

			emisorS = ""
			receptorR = ""
			emisorRef20 = ""
			refRel21 = ""
			montoTotal32B = ""
			fechaValor33A = ""
			moneda33A = ""
			monto33A = ""			
			emisorCorr53a = ""
			receptorCorr54a = ""
			info72 =""
			moneda32B = ""
			cuenta = None
			msg = ""
			io=""
			observacion = ""
			finMensaje = False		

		lineaAct += 1
		contador += 1

	#cerrar archivo
	info.close()
	return ("True",vali)


def parseo942(archivo,directorio,idioma):
	dirArch = directorio + "\\" + archivo

	#abrir archivo
	info = open(dirArch, 'r')

	lines = info.readlines()
	numLineas = len(lines)
	for i in range(0,numLineas):
		lines[i]=lines[i].strip()

	lineaAct = 0
	lineaAux = 0
	contador = 0
	opcionales = 0
	largoMensajes = []
	verificarOps = []
	numLineasActual = 0
	finMensaje = False
	es86 = False 
	contenidoLinea = ""
	mensajeTipoM = ""
	anterior = ""
	emisorS = ""
	receptorR = ""
	numRefTrans20 = ""
	refRel21 = ""
	idCuenta25 = "" 
	numEstado28c = ""
	limiteIndicador34F = ""
	limiteIndicadorOpcional34F = ""
	fechaIndicador13D = ""
	lineaDec61_86 = ""
	infoTitularOp86 = ""
	entradasDeb90D = ""
	entradasCred90C = ""
	moneda90D = ""
	moneda90C = ""
	cuenta = None
	msg = ""
	io=""
	vali=""
	observacion=""

	while contador < numLineas:

		contenidoLinea = lines[contador]
		#Caso para primera Linea $
		if (lineaAct == 0):
			opcion = contenidoLinea

			if (opcion != "$"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				numRefTrans20 = contenidoLinea[4:]
				print ("[20]: ",numRefTrans20)
		
		#Caso para Campo Opcional [21] u obligatorio [25]
		if (lineaAct == 5):
			opcion = contenidoLinea[:4]  

			for opc in range(0,1):
				if (opcion == "[21]"):	
					refRel21 = contenidoLinea[4:]
					print ("[21]: ",refRel21)
					lineaAct += 1
					contador += 1
					opcionales += 1
					contenidoLinea = lines[contador]
					opcion = contenidoLinea[:4]

			#Caso en que NO existe el campo opcional [21]
			if (opcion != "[25]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				idCuenta25 = contenidoLinea[4:]
				print ("[25]: ",idCuenta25)

		#Caso para Linea campo [25] (si existe opcional[21])
		#en caso contrario seria el campo [28C]
		if (lineaAct == (6+opcionales)):
			
			opcion = contenidoLinea[:5]
		
			if (opcion != "[28C]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				numEstado28c = contenidoLinea[5:]
				print ("[28C]: ",numEstado28c)

		#Caso para Linea campo [28C] (si existe opcional[21])
		#en caso contrario seria el campo [34F]
		if (lineaAct == (7+opcionales)):
			opcion = contenidoLinea[:5]
			
			if (opcion != "[34F]"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				limiteIndicador34F = contenidoLinea[5:]
				print ("[34F]: ",limiteIndicador34F)

		# Caso para Linea campo [34F] (si existe opcional[21])
		# en caso contrario seria el campo [34F] OPCIONAL y si este
		# no existe 
		if (lineaAct == (8+opcionales)):
			opcion = contenidoLinea[:5]

			for opc in range(0,1):
				if (opcion == "[34F]"):	
					limiteIndicador34F = contenidoLinea[5:]
					print ("[34F]: ",limiteIndicador34F)
					lineaAct += 1
					contador += 1
					opcionales += 1
					contenidoLinea = lines[contador]
					opcion = contenidoLinea[:5]
			
			if (opcion != "[13D]"):
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else:
				#Caso en que NO existe el campo opcional [34F]
				fechaIndicador13D = contenidoLinea[5:]
				print ("[13D]: ",fechaIndicador13D)

		#Caso para Linea campo [13D] (Si existen el campo [21] y el [13D] OPCIONAL)
		#Si existe solo 1 de los dos o ninguno ya seria algun campo
		if (lineaAct == (9+opcionales)):
			opcion0 = contenidoLinea[:2]
			opcion1 = contenidoLinea[:4]
			opcion2 = contenidoLinea[:5]
			verificarOps = ["[90D]","[90C]","[86]"]

			while(opcion1 == "[61]" or opcion1 == "[86]"):
				if anterior and opcion1 == "[86]":
					lineaDec61_86 = lineaDec61_86 + "$" + contenidoLinea[4:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:4]
					opcion4 = contenidoLinea[:5]
					while (opcion3 !="[61]" and opcion3 !="[61]" and opcion3 != "@@" and opcion4 !="[90D]" and opcion4 !="[90C]"):
						lineaDec61_86 = lineaDec61_86+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:4]
						opcion4 = contenidoLinea[:5]
					lineaDec61_86 = lineaDec61_86+ ";"
					anterior = False 
				if anterior and opcion1 == "[61]":
				 	lineaDec61_86 = lineaDec61_86 + ";"
				 	anterior = True
				if (opcion1 == "[61]"):
					lineaDec61_86 = lineaDec61_86 + contenidoLinea[4:]
					anterior = True
				print ("[61]: ",lineaDec61_86)
				lineaAct += 1
				contador += 1
				opcionales += 1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:2]
				opcion1 = contenidoLinea[:4]
				opcion2 = contenidoLinea[:5]

			while(opcion2 == "[90D]" or opcion2 == "[90C]" or opcion1 == "[86]"):
				if (opcion1 == "[86]"):
					es86 = True
				if (es86):			
					if(opcion1 not in verificarOps):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)
				else: 
					if(opcion2 not in verificarOps):
						if idioma == 0:
							msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						else:
							msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
					
						return ("error", msg)
				if(opcion1 == "[86]"):
					infoTitularOp86 = contenidoLinea[4:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:2]
					
					while (opcion3 != "@@"):
						infoTitularOp86 = infoTitularOp86+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:2]
						opcion2 = contenidoLinea[:4]
					print ("[86]",infoTitularOp86)
				if(opcion2 == "[90D]"):
					entradasDeb90D = contenidoLinea[5:]
					res = re.search('(?P<numero>\d{1,5})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{0,2})$', entradasDeb90D)
					nuevo = res.groupdict()
					print(nuevo['moneda'])
					moneda90D = nuevo['moneda']
					print ("[90D]",entradasDeb90D)
				if(opcion2 == "[90C]"):
					entradasCred90C = contenidoLinea[5:]
					res = re.search('(?P<numero>\d{1,5})(?P<moneda>[a-zA-Z]{3})(?P<monto>.+\,\d{0,2})$', entradasCred90C)
					nuevo = res.groupdict()
					print(nuevo['moneda'])
					moneda90C = nuevo['moneda']
					print ("[90C]",entradasCred90C)
				if (es86):
					indice = verificarOps.index(opcion1)
					verificarOps = verificarOps[indice+1:]
				else:
					indice = verificarOps.index(opcion2)
					verificarOps = verificarOps[indice+1:]
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:2]
				opcion1 = contenidoLinea[:4]
				opcion2 = contenidoLinea[:5]
				es86 = False	

			if (opcion0 != "@@"): 
				if idioma == 0:
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				else:
					msg = "Unexpected character, at line number " +str(contador+1)+ " of file " + archivo
			
				return ("error", msg)
			else: 
				finMensaje =True
				largoMensajes.append(lineaAct+1)
				numLineasActual = sumaLineas(largoMensajes)
				lineaAct = contador - numLineasActual
				opcionales = 0

		if (finMensaje):
			bic = Configuracion.objects.all()[0].bic
			if (receptorR == bic):
				io = "I"
			else:
				if idioma == 0:
					vali = "Este mensaje no nos pertenece, Archivo: " + archivo
				else:
					vali = "This message does not belong to us, File: " + archivo
			if (io =="I"):
				cuenta = Cuenta.objects.filter(ref_vostro = idCuenta25)
				
			if cuenta:
				monedaCta = cuenta[0].moneda_idmoneda.codigo
				if(monedaCta != moneda90C):
					if idioma == 0:
						observacion = "Moneda Invalida, la moneda proveniente del mensaje es : " + moneda90C + ", deberia ser : " + monedaCta + ", Archivo: " + archivo
					else:
						observacion = "Invalid Currency, the currency comming from message is: " + moneda90C + ", but must be: " + monedaCta + ", File: " + archivo
					vali = "vali"
				if(monedaCta != moneda90D):
					if idioma == 0:
						observacion = "Moneda Invalida, la moneda proveniente del mensaje es : " + moneda90D + ", deberia ser : " + monedaCta + ", Archivo: " + archivo
					else:
						observacion = "Invalid Currency, the currency comming from message is: " + moneda90D + ", but must be: " + monedaCta + ", File: " + archivo
					vali = "vali"
				if(entradasDeb90D =="" ):
					entradasDeb90D = "1"+monedaCta+"0,"
				if(entradasCred90C =="" ):
					entradasCred90C = "1"+monedaCta+"0,"
				fecha_entrada = timenow()
				mensaje_intra = MensajesIntraday.objects.create(tipo = "942",cuenta = cuenta[0],fecha_entrada=fecha_entrada,i_o=io,observacion=observacion) 
				mensaje = Mt942.objects.create(mensaje_intraday = mensaje_intra,remitente = emisorS,receptor = receptorR, ref_transaccion = numRefTrans20,ref_relacion = refRel21,id_cuenta = idCuenta25, edo_cuenta_secuencia = numEstado28c, limite_cd = limiteIndicador34F,limite_credito = limiteIndicadorOpcional34F,fecha_hora=fechaIndicador13D,info_owner=lineaDec61_86,total_debitos=entradasDeb90D,total_creditos=entradasCred90C,info_owner_final=infoTitularOp86)
			else:
				if idioma == 0:
					vali = "No se posee cuenta donde procesar este mensaje, Archivo: " + archivo
				else:
					vali = "There is not account to process the message, File: " + archivo

			io=""
			anterior = ""
			emisorS = ""
			receptorR = ""
			numRefTrans20 = ""
			refRel21 = ""
			idCuenta25 = "" 
			numEstado28c = ""
			limiteIndicador34F = ""
			limiteIndicadorOpcional34F = ""
			fechaIndicador13D = ""
			lineaDec61_86 = ""
			infoTitularOp86 = ""
			entradasDeb90D = ""
			entradasCred90C = ""
			moneda90D = ""
			moneda90C = ""
			cuenta = None
			msg = ""
			observacion = ""
			finMensaje = False
		
		lineaAct += 1
		contador += 1

	#cerrar archivo
	info.close()
	return ("True",vali)