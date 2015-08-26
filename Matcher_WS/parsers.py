def sumaLineas(arreglo):
	total = 0
	for numero in arreglo:
		total += numero
	return total	

def parsearTipoMT(archivo,directorio):
	tipo = ""
	msg = ""
	contador = 0
	dirArch = directorio + "\\" + archivo

	#abrir archivo
	info = open(dirArch, 'r')

	line1 = info.readline().strip()
	if (line1 != "$"):
		msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
		return ("error", msg)
	contador += 1
	
	line2 = info.readline().strip()
	cabecera2 = line2[:3]
	if (cabecera2 != "[M]"):
		msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
		return ("error",msg)
	else:
		tipo = line2[3:]

	#cerrar archivo
	info.close()
	return (tipo,"")

def parseo103(archivo,directorio):
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
	tipoCambio36 = ""
	moneda33B = ""
	clienteOrd50A = ""
	clienteOrd50F = ""
	clienteOrd50K = ""
	instEmisor51A = ""
	instOrd52A = ""
	instOrd52D = ""
	emisorCorr53A = ""
	emisorCorr53B = ""
	emisorCorr53D = ""
	receptorCorr54A = ""
	receptorCorr54B = ""
	receptorCorr54D = ""
	instReemb55A = ""
	instReemb55B = ""
	instReemb55D = ""
	instInter56A = ""
	instInter56C = ""
	instInter56D = ""
	instCuenta57A = ""
	instCuenta57B = ""
	instCuenta57C = ""
	instCuenta57D = ""
	clienteBene59 = ""
	clienteBene59A = ""
	clienteBene59F = ""
	infoRemesa70 = ""
	detallesCarg71a = ""
	infoEmisor72 = ""
	cargosEmisor71F = ""
	cargosReceptor71G = ""
	reporteReg77B = ""
	#contenido77T = ""

	cuantos = 0


	while contador < numLineas:

		contenidoLinea = lines[contador]
		#Caso para primera Linea $
		if (lineaAct == 0):
			opcion = contenidoLinea

			if (opcion != "$"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else: 
				codigoBank23B = contenidoLinea[5:]
				print ("[23B]: ",codigoBank23B)

		if (lineaAct == (6 + opcionales)):
			opcion = contenidoLinea[:5]
			verificarOps = ["[26T]"]

			while(opcion == "[23E]"):
				
				codInst23E = contenidoLinea[5:]
				print ("[23E]: ",codInst23E)
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion = contenidoLinea[:5]

			while(opcion == "[26T]"):
				if(opcion not in verificarOps):
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else: 
				fechaValor32A = contenidoLinea[5:]
				print ("[32A]: ",fechaValor32A)

		if (lineaAct == (7 + opcionales)):
			opcion0 = contenidoLinea[:4]
			opcion1 = contenidoLinea[:5]
			verificarOps0 = ["[36]"]
			verificarOps1 = ["[33B]"]
			
			while(opcion1 == "[33B]"):
				if(opcion1 not in verificarOps1):
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
					return ("error", msg)
				moneda33B = contenidoLinea[5:]
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
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			elif(opcion1 == "[50A]"): 
				clienteOrd50A = contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion = contenidoLinea[:5]
				opcion0 = contenidoLinea[:4]
				while (opcion != "[51A]" and opcion != "[52A]" and opcion != "[52D]" and opcion != "[53A]" and opcion != "[53B]" and opcion != "[53D]" and opcion != "[54A]" and opcion != "[54B]" and opcion != "[54D]" and opcion != "[55A]" and opcion != "[55B]" and opcion != "[55D]" and opcion != "[56A]" and opcion != "[56C]" and opcion != "[56D]" and opcion != "[57A]" and opcion != "[57B]" and opcion != "[57C]" and opcion != "[57D]" and opcion0 != "[59]" and opcion != "[59A]" and opcion != "[59F]"):
					clienteOrd50A = clienteOrd50A+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion = contenidoLinea[:5]
					opcion0 = contenidoLinea[:4]
				print ("[50A]: ",clienteOrd50A)
			elif(opcion1 == "[50F]"): 
				clienteOrd50F = contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion = contenidoLinea[:5]
				opcion0 = contenidoLinea[:4]
				while (opcion != "[51A]" and opcion != "[52A]" and opcion != "[52D]" and opcion != "[53A]" and opcion != "[53B]" and opcion != "[53D]" and opcion != "[54A]" and opcion != "[54B]" and opcion != "[54D]" and opcion != "[55A]" and opcion != "[55B]" and opcion != "[55D]" and opcion != "[56A]" and opcion != "[56C]" and opcion != "[56D]" and opcion != "[57A]" and opcion != "[57B]" and opcion != "[57C]" and opcion != "[57D]" and opcion0 != "[59]" and opcion != "[59A]" and opcion != "[59F]"):
					clienteOrd50F = clienteOrd50F+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion = contenidoLinea[:5]
					opcion0 = contenidoLinea[:4]
				print ("[50F]: ",clienteOrd50F)
			elif(opcion1 == "[50K]"): 
				clienteOrd50K = contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion = contenidoLinea[:5]
				opcion0 = contenidoLinea[:4]
				while (opcion != "[51A]" and opcion != "[52A]" and opcion != "[52D]" and opcion != "[53A]" and opcion != "[53B]" and opcion != "[53D]" and opcion != "[54A]" and opcion != "[54B]" and opcion != "[54D]" and opcion != "[55A]" and opcion != "[55B]" and opcion != "[55D]" and opcion != "[56A]" and opcion != "[56C]" and opcion != "[56D]" and opcion != "[57A]" and opcion != "[57B]" and opcion != "[57C]" and opcion != "[57D]" and opcion0 != "[59]" and opcion != "[59A]" and opcion != "[59F]"):
					clienteOrd50K = clienteOrd50K+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion = contenidoLinea[:5]
					opcion0 = contenidoLinea[:4]
				print ("[50K]: ",clienteOrd50K)
			
		if (lineaAct == (8 + opcionales)):
			opcion = contenidoLinea[:5]
			verificarOps0 = ["[51A]","[52A]","[52D]","[53A]","[53B]","[53D]","[54A]","[54B]","[54D]","[55A]","[55B]","[55D]","[56A]","[56C]","[56D]","[57A]","[57B]","[57C]","[57D]"]

			while (opcion == "[51A]" or opcion == "[52A]" or opcion == "[52D]" or opcion == "[53A]" or opcion == "[53B]" or opcion == "[53D]" or opcion == "[54A]" or opcion == "[54B]" or opcion == "[54D]" or opcion == "[55A]" or opcion == "[55B]" or opcion == "[55D]" or opcion == "[56A]" or opcion == "[56C]" or opcion == "[56D]" or opcion == "[57A]" or opcion == "[57B]" or opcion == "[57C]" or opcion == "[57D]"):
				if(opcion not in verificarOps0):
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
					return ("error", msg)
				if (opcion == "[51A]"):
					instEmisor51A = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[52A]" and opcion2 != "[52D]" and opcion2 != "[53A]" and opcion2 != "[53B]" and opcion2 != "[53D]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						instEmisor51A = instEmisor51A+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[51A]: ",instEmisor51A)
				if (opcion == "[52A]"):
					instOrd52A = contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[53A]" and opcion2 != "[53B]" and opcion2 != "[53D]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						instOrd52A = instOrd52A+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[52A]: ",instOrd52A)
				if (opcion == "[52D]"):
					instOrd52D = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[53A]" and opcion2 != "[53B]" and opcion2 != "[53D]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						instOrd52D = instOrd52D+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[52D]: ",instOrd52D)
				if (opcion == "[53A]"):
					emisorCorr53A = contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						emisorCorr53A = emisorCorr53A+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53A]: ",emisorCorr53A)
				if (opcion == "[53B]"):
					emisorCorr53B = contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						emisorCorr53B = emisorCorr53B+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53B]: ",emisorCorr53B)
				if (opcion == "[53D]"):
					emisorCorr53D = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[54A]" and opcion2 != "[54B]" and opcion2 != "[54D]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						emisorCorr53D = emisorCorr53D+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[53D]: ",emisorCorr53D)
				if (opcion == "[54A]"):
					receptorCorr54A = contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						receptorCorr54A = receptorCorr54A+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[54A]: ",receptorCorr54A)
				if (opcion == "[54B]"):
					receptorCorr54B = contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						receptorCorr54B = receptorCorr54B+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[54B]: ",receptorCorr54B)
				if (opcion == "[54D]"):
					receptorCorr54D = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[55A]" and opcion2 != "[55B]" and opcion2 != "[55D]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						receptorCorr54D = receptorCorr54D+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[54D]: ",receptorCorr54D)
				if (opcion == "[55A]"):
					instReemb55A = contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						instReemb55A = instReemb55A+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[55A]: ",instReemb55A)
				if (opcion == "[55B]"):
					instReemb55B = contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						instReemb55B = instReemb55B+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[55B]: ",instReemb55B)
				if (opcion == "[55D]"):
					instReemb55D = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[56A]" and opcion2 != "[56C]" and opcion2 != "[56D]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						instReemb55D = instReemb55D+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[55D]: ",instReemb55D)
				if (opcion == "[56A]"):
					instInter56A = contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						instInter56A = instInter56A+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[56A]: ",instInter56A)
				if (opcion == "[56C]"):
					instInter56C = contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						instInter56C = instInter56C+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[56C]: ",instInter56C)
				if (opcion == "[56D]"):
					instInter56D = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]" and opcion2 != "[57A]" and opcion2 != "[57B]" and opcion2 != "[57C]" and opcion2 != "[57D]"):
						instInter56D = instInter56D+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[56D]: ",instInter56D)
				if (opcion == "[57A]"):
					instCuenta57A = contenidoLinea[5:]
					cuantos = 3
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instCuenta57A = instCuenta57A+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57A]: ",instCuenta57A)
				if (opcion == "[57B]"):
					instCuenta57B = contenidoLinea[5:]
					cuantos = 2
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instCuenta57B = instCuenta57B+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57B]: ",instCuenta57B)
				if (opcion == "[57C]"):
					instCuenta57C = contenidoLinea[5:]
					cuantos = 1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instCuenta57C = instCuenta57C+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57C]: ",instCuenta57C)
				if (opcion == "[57D]"):
					instCuenta57D = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:5]
					opcion3 = contenidoLinea[:4]
					while (opcion3 != "[59]" and opcion2 != "[59A]" and opcion2 != "[59F]"):
						instCuenta57D = instCuenta57D+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion2 = contenidoLinea[:5]
						opcion3 = contenidoLinea[:4]
					print ("[57D]: ",instCuenta57D)
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			elif (opcion == "[59A]"): 
				clienteBene59A = contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion2 = contenidoLinea[:4]
				opcion3 = contenidoLinea[:5]
				while (opcion2 != "[70]" and opcion3 != "[71A]"):
					clienteBene59A = clienteBene59A+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:4]
					opcion3 = contenidoLinea[:5]
				print ("[59A]: ",clienteBene59A)
			elif (opcion == "[59F]"): 
				clienteBene59F = contenidoLinea[5:]
				contenidoLinea = lines[contador+1]
				opcion2 = contenidoLinea[:4]
				opcion3 = contenidoLinea[:5]
				while (opcion2 != "[70]" and opcion3 != "[71A]"):
					clienteBene59F = clienteBene59F+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:4]
					opcion3 = contenidoLinea[:5]
				print ("[59F]: ",clienteBene59F)
			elif (opcion0 == "[59]"): 
				clienteBene59 = contenidoLinea[4:]
				contenidoLinea = lines[contador+1]
				opcion2 = contenidoLinea[:4]
				opcion3 = contenidoLinea[:5]
				while (opcion2 != "[70]" and opcion3 != "[71A]"):
					clienteBene59 = clienteBene59+"\n"+contenidoLinea
					lineaAct += 1
					contador += 1
					opcionales +=1
					contenidoLinea = lines[contador+1]
					opcion2 = contenidoLinea[:4]
					opcion3 = contenidoLinea[:5]
				print ("[59]: ",clienteBene59)
	        
	 
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else: 
				detallesCarg71a = contenidoLinea[5:]
				print ("[71A]: ",detallesCarg71a)

		if (lineaAct == (10 + opcionales)):
			opcion0 = contenidoLinea[:4]
			opcion1 = contenidoLinea[:5]
			verificarOps0 = ["[71G]","[72]","[77B]"] #,"[77T]"

			while(opcion1 == "[71F]"):
				
				cargosEmisor71F = contenidoLinea[5:]
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
						msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						return ("error", msg)
				else: 
					if(opcion1 not in verificarOps0):
						msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						return ("error", msg)		
				if (opcion0 == "[72]"):
					infoEmisor72 = contenidoLinea[4:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:3]
					opcion2 = contenidoLinea[:5]
					
					while (opcion3 != "@@" and opcion2 != "[77B]"):
						infoEmisor72 = infoEmisor72+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:3]
						opcion2 = contenidoLinea[:5]
					
					print ("[72]: ",infoEmisor72)
					es72 = True
				if (opcion1 == "[71G]"):
					cargosReceptor71G = contenidoLinea[5:]
					print ("[71G]: ",cargosReceptor71G)
				if (opcion1 == "[77B]"):
					reporteReg77B = contenidoLinea[5:]
					contenidoLinea = lines[contador+1]
					opcion3 = contenidoLinea[:3]
					while (opcion3 != "@@"):
						reporteReg77B = reporteReg77B+"\n"+contenidoLinea
						lineaAct += 1
						contador += 1
						opcionales +=1
						contenidoLinea = lines[contador+1]
						opcion3 = contenidoLinea[:3]
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else: 
				finMensaje =True
				largoMensajes.append(lineaAct+1)
				numLineasActual = sumaLineas(largoMensajes)
				lineaAct = contador - numLineasActual
				opcionales = 0

		if (finMensaje):
			finMensaje = False		

		lineaAct += 1
		contador += 1

		#mensaje = MT103.create(remitente = emisorS,receptor = receptorR, ref_remitente = emisorRef20,ind_hora = timeId13C )

	#cerrar archivo
	info.close()
	return ("True","")

def parseo202(archivo,directorio):
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
	instOrd52A = ""
	instOrd52D = ""
	emisorCorr53A = ""
	emisorCorr53B = ""
	emisorCorr53D = ""
	receptorCorr54A = ""
	receptorCorr54B = ""
	receptorCorr54D = ""
	instInter56A = ""
	instInter56D = ""
	instCuenta57A = ""
	instCuenta57B = ""
	instCuenta57D = ""
	instBene58A = ""
	instBene58D = ""

	cuantos = 0


	while contador < numLineas:

		contenidoLinea = lines[contador]
		#Caso para primera Linea $
		if (lineaAct == 0):
			opcion = contenidoLinea

			if (opcion != "$"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				emisorRef20 = contenidoLinea[4:]
				print ("[20]: ",emisorRef20)
		
		#Caso para Campo [21] 
		if (lineaAct == 5):
			opcion = contenidoLinea[:4]  
			
			if (opcion != "[21]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				refRel21 = contenidoLinea[4:]
				print ("[21]: ",refRel21)

		#Caso para Campo [13C](ciclo)si existen, sino es [23B] 
		if (lineaAct == 6):
			opcion = contenidoLinea[:5]  
			
			while(opcion == "[13C]"):
				timeId13C = contenidoLinea[5:]
				print ("[13C]: ",timeId13C)
				lineaAct += 1
				contador += 1
				opcionales +=1
				contenidoLinea = lines[contador]
				opcion = contenidoLinea[:5]

			if (opcion != "[32A]"): 
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else: 
				fechaValor32A = contenidoLinea[5:]
				print ("[32A]: ",fechaValor32A)

		if (lineaAct == (7 + opcionales)):
			opcion = contenidoLinea[:5]
			verificarOps = ["[52A]","[52D]","[53A]","[53B]","[53D]","[54A]","[54B]","[54D]","[56A]","[56D]","[57A]","[57B]","[57D]"]

			while (opcion == "[52A]" or opcion == "[52D]" or opcion == "[53A]" or opcion == "[53B]" or opcion == "[53D]" or opcion == "[54A]" or opcion == "[54B]" or opcion == "[54D]" or opcion == "[56a]" or opcion == "[56A]" or opcion == "[56D]" or opcion == "[57A]" or opcion == "[57B]" or opcion == "[57D]"):
				if( opcion not in verificarOps):
					msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
					return ("error", msg)
				if (opcion == "[52A]"):
					instOrd52A = contenidoLinea[5:]
					cuantos = 1
					print ("[52A]: ",instOrd52A)
				if (opcion == "[52D]"):
					instOrd52D = contenidoLinea[5:]
					print ("[52D]: ",instOrd52D)
				if (opcion == "[53A]"):
					emisorCorr53A = contenidoLinea[5:]
					cuantos = 2
					print ("[53A]: ",emisorCorr53A)
				if (opcion == "[53B]"):
					emisorCorr53B = contenidoLinea[5:]
					cuantos = 1
					print ("[53B]: ",emisorCorr53B)
				if (opcion == "[53D]"):
					emisorCorr53D = contenidoLinea[5:]
					print ("[53D]: ",emisorCorr53D)
				if (opcion == "[54A]"):
					receptorCorr54A = contenidoLinea[5:]
					cuantos = 2
					print ("[54A]: ",receptorCorr54A)
				if (opcion == "[54B]"):
					receptorCorr54B = contenidoLinea[5:]
					cuantos = 1
					print ("[54B]: ",receptorCorr54B)
				if (opcion == "[54D]"):
					receptorCorr54D = contenidoLinea[5:]
					print ("[54D]: ",receptorCorr54D)
				if (opcion == "[56A]"):
					instInter56A = contenidoLinea[5:]
					cuantos = 1
					print ("[56A]: ",instInter56A)
				if (opcion == "[56D]"):
					instInter56D = contenidoLinea[5:]
					print ("[56D]: ",instInter56D)
				if (opcion == "[57A]"):
					instCuenta57A = contenidoLinea[5:]
					cuantos = 2
					print ("[57A]: ",instCuenta57A)
				if (opcion == "[57B]"):
					instCuenta57B = contenidoLinea[5:]
					cuantos = 1
					print ("[57B]: ",instCuenta57B)
				if (opcion == "[57D]"):
					instCuenta57D = contenidoLinea[5:]
					print ("[57D]: ",instCuenta57D)
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			elif(opcion == "[58A]"): 
				instBene58A = contenidoLinea[5:]
				print ("[58A]: ",instBene58A)
			elif(opcion == "[58D]"): 
				instBene58D = contenidoLinea[5:]
				print ("[58D]: ",instBene58D)

		if (lineaAct == (8 + opcionales)):
			opcion = contenidoLinea[:4]

			for opc in range(0,1):
				if (opcion == "[72]"):
					receptorInfo72 = contenidoLinea[4:]
					print ("[72]: ",receptorInfo72)
					lineaAct += 1
					contador += 1
					contenidoLinea = lines[contador]
					opcion = contenidoLinea[:4]


			if (opcion != "@@"): 
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else: 
				finMensaje =True
				largoMensajes.append(lineaAct+1)
				numLineasActual = sumaLineas(largoMensajes)
				lineaAct = contador - numLineasActual
				opcionales = 0
						
		
		if (finMensaje):
			print("Fin del mensaje")
			finMensaje = False				

		lineaAct += 1
		contador += 1

	#cerrar archivo
	info.close()
	return ("True","")


def parseo942(archivo,directorio):
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
	msg = ""
	finMensaje = False
	es86 = False 
	contenidoLinea = ""
	mensajeTipoM = ""
	emisorS = ""
	receptorR = ""
	numRefTrans20 = ""
	refRel21 = ""
	idCuenta25 = "" 
	numEstado28c = ""
	limiteIndicador34F = ""
	limiteIndicadorOpcional34F = ""
	fechaIndicador13D = ""
	lineaDec61 = ""
	infoTitular86 = ""
	infoTitularOp86 = ""
	entradasDeb90D = ""
	entradasCred90C = ""


	while contador < numLineas:

		contenidoLinea = lines[contador]
		#Caso para primera Linea $
		if (lineaAct == 0):
			opcion = contenidoLinea

			if (opcion != "$"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else: 
				idCuenta25 = contenidoLinea[4:]
				print ("[25]: ",idCuenta25)

		#Caso para Linea campo [25] (si existe opcional[21])
		#en caso contrario seria el campo [28C]
		if (lineaAct == (6+opcionales)):
			
			opcion = contenidoLinea[:5]
		
			if (opcion != "[28C]"): 
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else: 
				numEstado28c = contenidoLinea[5:]
				print ("[28C]: ",numEstado28c)

		#Caso para Linea campo [28C] (si existe opcional[21])
		#en caso contrario seria el campo [34F]
		if (lineaAct == (7+opcionales)):
			opcion = contenidoLinea[:5]
			
			if (opcion != "[34F]"): 
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
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
				if (opcion1 == "[61]"):
					lineaDec61 = contenidoLinea[5:]
					print ("[61]: ",lineaDec61)
				if (opcion1 == "[86]"):
					infoTitular86 = contenidoLinea[5:]
					print ("[86]: ",infoTitular86)
				lineaAct += 1
				contador += 1
				opcionales += 1
				contenidoLinea = lines[contador]
				opcion0 = contenidoLinea[:2]
				opcion1 = contenidoLinea[:4]
				opcion2 = contenidoLinea[:5]

			while(opcion1 == "[86]" or opcion2 == "[90D]" or opcion2 == "[90C]"):
				if (opcion1 == "[86]"):
					es86 = True
				if (es86):			
					if(opcion1 not in verificarOps):
						msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						return ("error", msg)
				else: 
					if(opcion2 not in verificarOps):
						msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
						return ("error", msg)
				if(opcion1 == "[86]"):
					infoTitularOp86 = contenidoLinea[4:]
					print ("[86]",infoTitularOp86)
				if(opcion2 == "[90D]"):
					entradasDeb90D = contenidoLinea[5:]
					print ("[90D]",entradasDeb90D)
				if(opcion2 == "[90C]"):
					entradasCred90C = contenidoLinea[5:]
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
				msg = "Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo " + archivo
				return ("error", msg)
			else: 
				finMensaje =True
				largoMensajes.append(lineaAct+1)
				numLineasActual = sumaLineas(largoMensajes)
				lineaAct = contador - numLineasActual
				opcionales = 0

		if (finMensaje):
			finMensaje = False
		
		lineaAct += 1
		contador += 1

	#cerrar archivo
	info.close()
	return ("True","")