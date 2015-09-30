from Matcher.models import Configuracion

conf = Configuracion.objects.all()[0]

# Datos del servidor
try:
	SERVER_HOST = conf.ldap_ip
	SERVER_PORT = int(conf.ldap_puerto)

	ROOT_DC = 'dc=bcgve,dc=local'

	# Nombre de los campos en el server LDAP para buscarlos
	USERNAME_FIELD = 'sAMAccountName'
	FIRST_NAME_FIELD = 'sn'
	LAST_NAME_FIELD = 'givenName'

except:
	print("hola") 


def get_username(username):
    # El username se construye de la forma username@ROOT_DC_elems
    # (ROOT_DC_elems = cada elemento de ROOT_DC)
    local = []
    rootDC = ROOT_DC
    filling = rootDC.split(",")
    for fill in filling:
        local.append(fill.split("=")[1])

    res = username.upper()+'@'+'.'.join(local)
    return res