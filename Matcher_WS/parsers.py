def sumaLineas(arreglo):
	total = 0
	for numero in arreglo:
		total += numero
	return total	

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

	error = False
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
				print ("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
		
		#Caso para Linea campo [M] Tipo de Mensaje
		if (lineaAct == 1):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[M]"):
				print ("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
			else:
				mensajeTipoM = contenidoLinea[3:]
				print ("[M]: ",mensajeTipoM)

		#Caso para Linea campo [S] Emisor
		if (lineaAct == 2):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[S]"):
				print ("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
			else:
				emisorS = contenidoLinea[3:]
				print ("[S]: ",emisorS)

		#Caso para Linea campo [R] Receptor
		if (lineaAct == 3):
			opcion = contenidoLinea[:3] 
			
			if (opcion != "[R]"):
				print ("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
			else:
				receptorR = contenidoLinea[3:]
				print ("[R]: ",receptorR)

		#Caso para Linea campo [20]
		if (lineaAct == 4):
			opcion = contenidoLinea[:4] 
			
			if (opcion != "[20]"):
				print ("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
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
				print("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
			else: 
				idCuenta25 = contenidoLinea[4:]
				print ("[25]: ",idCuenta25)

		#Caso para Linea campo [25] (si existe opcional[21])
		#en caso contrario seria el campo [28C]
		if (lineaAct == (6+opcionales)):
			
			opcion = contenidoLinea[:5]
		
			if (opcion != "[28C]"): 
				print("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
			else: 
				numEstado28c = contenidoLinea[5:]
				print ("[28C]: ",numEstado28c)

		#Caso para Linea campo [28C] (si existe opcional[21])
		#en caso contrario seria el campo [34F]
		if (lineaAct == (7+opcionales)):
			opcion = contenidoLinea[:5]
			
			if (opcion != "[34F]"): 
				print("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
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
				print("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
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
						print("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
						error = True
						break
				else: 
					if(opcion2 not in verificarOps):
						print("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
						error = True
						break
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

			if(error):
				break		

			if (opcion0 != "@@"): 
				print("Caracter inesperado, en la línea número " +str(contador+1)+ " del archivo", archivo)
				break
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
	return False