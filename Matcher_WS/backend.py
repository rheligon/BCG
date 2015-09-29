#http://www.djangorocks.com/tutorials/creating-a-custom-authentication-backend/creating-the-imap-authentication-backend.html

# http://fle.github.io/combine-ldap-and-classical-authentication-in-django.html

from django.contrib.auth import get_backends, get_user_model
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import *
from Matcher.models import Sesion
from ldap3 import  Server, Connection, SEARCH_SCOPE_WHOLE_SUBTREE, GET_SCHEMA_INFO, STRATEGY_SYNC, AUTH_SIMPLE
from Matcher_WS.LDAP import * 

class MyAuthBackend(ModelBackend):

    def authenticate(self, username=None, password=None):

        # Si el usuario tiene ldap, se ingresa por ldap
        if (self.ldap == "1"):

            try:
                sname = SERVER_HOST
                sport = SERVER_PORT
                baseDC = ROOT_DC

                # Nombre de los campos en el server LDAP
                login_field = USERNAME_FIELD
                fn_field = FIRST_NAME_FIELD
                ln_field = LAST_NAME_FIELD

                #auth_usr = 'cn=Carolina Perozo,ou=Oficina Caracas,dc=bcgve,dc=local'

                auth_usr = get_username(username)
                auth_pwd = password

                # Se buscan los 3 atributos para incluirlos en el auth_user de django
                attrnames = [login_field, ln_field, fn_field]

                s = Server(sname, port=sport, get_info = GET_SCHEMA_INFO)
                c = Connection(s, auto_bind = True, client_strategy = STRATEGY_SYNC, user=auth_usr, password=auth_pwd, authentication=AUTH_SIMPLE, check_names=True)
                query = '(&(objectCategory=person)('+login_field+'='+username.upper()+'))'
                with c:
                    c.search(baseDC, query, SEARCH_SCOPE_WHOLE_SUBTREE, attributes = attrnames)

                # Crear usuario en auth_django sino se encuentra creado
                if c.response is not None:
                    fn = c.response[0]['attributes'][fn_field]
                    ln = c.response[0]['attributes'][ln_field]
                    user_model = get_user_model()
                    user, creado = user_model.objects.get_or_create(username=username, defaults={'first_name':fn, 'last_name':ln})
                    user.backend = 'Matcher_WS.backend.MyAuthBackend'
                    
            except Exception as e:
                print(e)
                return None

            return user

        # Sino posee ldap, se chequea que la clave este correcta
        enc = 'pbkdf2_sha1$15000$'+self.salt+'$'+self.pass_field

        if (check_password(password,enc)):
            user_model = get_user_model()
            user,creado = user_model.objects.get_or_create(username=username)
            user.backend = 'Matcher_WS.backend.MyAuthBackend'
            return user

        return None