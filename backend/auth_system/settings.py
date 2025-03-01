"""
Django settings for auth_system project.

Generated by 'django-admin startproject' using Django 5.1.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()





# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-k!#l%g=s@@q&jtp+hnbl8*f!k-p5xh_9$i-ujfhe5vx57^l*8p'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

SITE_ID = 1
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'djoser',
    'sop',
    "anymail",
    'django_extensions',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'auth_system.middleware.JWTAuthenticationMiddleware',  
]

ROOT_URLCONF = 'auth_system.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'auth_system.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PWD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}

# Construct the DATABASE_URL from the DATABASES settings
DATABASE_URL = f"postgres://{os.getenv('DB_USER')}:{os.getenv('DB_PWD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

#EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL")

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

# OneDrive API settings
#ONEDRIVE_CLIENT_ID = os.getenv('ONEDRIVE_CLIENT_ID')
#ONEDRIVE_CLIENT_SECRET = os.getenv('ONEDRIVE_CLIENT_SECRET')
#ONEDRIVE_REDIRECT_URI = os.getenv('ONEDRIVE_REDIRECT_URI')
#ONEDRIVE_AUTH_URL = os.getenv('ONEDRIVE_AUTH_URL')
#ONEDRIVE_TOKEN_URL = os.getenv('ONEDRIVE_TOKEN_URL')
ONEDRIVE_API_URL = "https://graph.microsoft.com/v1.0"


# CLIENT_VALUE = VEQ8Q~kp67DwISN-x74t62u--T1G6FredNl-9bk7 # this is what I needed in postman rather than client secret
#ONEDRIVE_CLIENT_ID = '2b826e87-862d-4227-b109-c17542639ecc'
#ONEDRIVE_CLIENT_SECRET = 'VEQ8Q~kp67DwISN-x74t62u--T1G6FredNl-9bk7'
ONEDRIVE_REDIRECT_URI = 'http://localhost:8000/onedrive/callback/'
#ONEDRIVE_CLIENT_SECRET = 'mid8Q~y3FyjYXJGYcmIPkbhGw-7fMOeAj7hU1bCw'

#SOPify_2
ONEDRIVE_CLIENT_SECRET = '6Bi8Q~OPGCDOttPe1oMkkfI2EQLAvBiOsnNTObAn'
ONEDRIVE_CLIENT_ID = '1250b861-54f0-499c-9d96-95082cb01529'
ONEDRIVE_AUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
ONEDRIVE_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token"

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'build', 'static'),
]

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated"
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        "rest_framework_simplejwt.authentication.JWTAuthentication",        
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,

    # enable JWT Cookies
    "AUTH_HEADER_TYPES": ("Bearer",),   # avoids conflicts with "JWT"  
    "AUTH_COOKIE": "access_token",  # Name of the cookie
    "AUTH_COOKIE_REFRESH": "refresh_token",
    "AUTH_COOKIE_DOMAIN": None,  # Keep it None for localhost
    "AUTH_COOKIE_SECURE": False,  # Change to True in production (requires HTTPS)
    "AUTH_COOKIE_HTTP_ONLY": True,  # Prevent JavaScript access
    "AUTH_COOKIE_PATH": "/",  # Available to all routes
    "AUTH_COOKIE_SAMESITE": "Lax",  # Controls cross-site requests
}


DJOSER = {
    "LOGIN_FIELD": "email",
    "USER_CREATE_PASSWORD_RETYPE": True,
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": True,
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": True,
    "SEND_CONFIRMATION_EMAIL": True,
    "SET_USERNAME_RETYPE": True,
    "SET_PASSWORD_RETYPE": True,
    "PASSWORD_RESET_CONFIRM_URL": "password/reset/confirm/{uid}/{token}/",
    "SEND_ACTIVATION_EMAIL": True,
    "ACTIVATION_URL": "auth/activate/{uid}/{token}",
    "SERIALIZERS": {
        "user_create": "sop.serializers.UserCreateSerializer", # custom serializer
        "user": "sop.serializers.UserCreateSerializer",
        "user_delete": "sop.serializers.UserDeleteSerializer",
    },
    "LOGIN_FIELD": "email",
}



AUTH_USER_MODEL = 'sop.UserAccount'

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Your React frontend
]
#CORS_ORIGIN_WHITELIST = [
 #   'http://localhost:3000',  # Add your frontend URL here
    #    "https://your-frontend-domain.com",  # Production domain
#]


CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',  # Add your frontend URL here
]


CSRF_COOKIE_HTTPONLY = True  # Ensure the frontend can access the cookie
CSRF_COOKIE_SECURE = False    # Use True if HTTPS is enabled, in production
SESSION_COOKIE_SECURE = False

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "filename": "debug.log",  # Log file
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "DEBUG",
            "propagate": True,
        },
    },
}
