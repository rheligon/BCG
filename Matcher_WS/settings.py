"""
Django settings for Matcher_WS project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '9^497rj5gxyk3$tt!!8sw6qf65ume#i8=65)r!mk=_69=ft@62'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

AUTHENTICATION_BACKENDS = (
    'Matcher_WS.backend.MyAuthBackend',
)

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
    'django.contrib.auth.hashers.SHA1PasswordHasher',
    'django.contrib.auth.hashers.MD5PasswordHasher',
    'django.contrib.auth.hashers.CryptPasswordHasher',
)
# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'Matcher',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'Matcher_WS.urls'

WSGI_APPLICATION = 'Matcher_WS.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

# MICROSOFT SERVER DB
DATABASES = {
    'default': {
        'ENGINE': 'sqlserver_ado',
        'NAME': 'Matcher',
        'HOST': '190.168.1.128',
        'PORT': '1433',
        'USER': 'sa',
        'PASSWORD':'..asdf1234',
        'OPTIONS': {
            'provider': 'SQLOLEDB'
        }
    }
}

# ORACLE DB

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.oracle',
#         'NAME': 'Matcher',
#         'HOST': '190.168.1.128',
#         'PORT': '1433',
#         'USER': 'sa',
#         'PASSWORD':'..asdf1234',
#         'OPTIONS': {
#             'provider': 'SQLOLEDB'
#         }
#     }
# }

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = False

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'templates'),
)
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

ARCHIVOS_FOLDER = os.path.join(BASE_DIR, 'archivos')

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587