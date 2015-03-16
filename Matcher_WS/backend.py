#http://www.djangorocks.com/tutorials/creating-a-custom-authentication-backend/creating-the-imap-authentication-backend.html

# import the User object
from django.contrib.auth.models import User

# import time - this is used to create Django's internal username
import time

# Name my backend 'MyCustomBackend'
class MyCustomBackend:

    # Create an authentication method
    # This is called by the standard Django login procedure
    def authenticate(self, username=None, password=None):
        try:
            # Check if this user is valid on the mail server
            c = IMAP4('my_mail_server')
            c.login(username, password)
            c.logout()
        except:
            return None

        try:
            # Check if the user exists in Django's local database
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            # Create a user in Django's local database
            user = User.objects.create_user(time.time(), username, 'passworddoesntmatter')

        return user

    # Required for your backend to work properly - unchanged in most scenarios
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None



# http://fle.github.io/combine-ldap-and-classical-authentication-in-django.html

from django.contrib.auth import get_backends, get_user_model
from django.contrib.auth.backends import ModelBackend

class MyAuthBackend(ModelBackend):
    """ A custom authentication backend overriding django ModelBackend """

    @staticmethod
    def _is_ldap_backend_activated():
        """ Returns True if MyLDAPBackend is activated """
        return MyLDAPBackend in [b.__class__ for b in get_backends()]

    def authenticate(self, username, password):
        """ Overrides ModelBackend to refuse LDAP users if MyLDAPBackend is activated """

        if self._is_ldap_backend_activated():
            user_model = get_user_model()
            try:
                user_model.objects.get(username=username, from_ldap=False)
            except:
                return None

        user = ModelBackend.authenticate(self, username, password)

        return user


from django_auth_ldap.backend import LDAPBackend
from django.contrib.auth import get_user_model

class MyLDAPBackend(LDAPBackend):
    """ A custom LDAP authentication backend """

    def authenticate(self, username, password):
        """ Overrides LDAPBackend.authenticate to save user password in django """

        user = LDAPBackend.authenticate(self, username, password)

        # If user has successfully logged, save his password in django database
        if user:
            user.set_password(password)
            user.save()

        return user

    def get_or_create_user(self, username, ldap_user):
        """ Overrides LDAPBackend.get_or_create_user to force from_ldap to True """
        kwargs = {
            'username': username,
            'defaults': {'from_ldap': True}
        }
        user_model = get_user_model()
        return user_model.objects.get_or_create(**kwargs)