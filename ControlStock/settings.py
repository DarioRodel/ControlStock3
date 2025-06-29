from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv()  # Esto debe estar antes de llamar a os.getenv()

BASE_DIR = Path(__file__).resolve().parent.parent

DB_PASSWORD = os.getenv("DB_PASSWORD")


from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
from crispy_forms import templatetags

print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))


SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
DEBUG = True

ALLOWED_HOSTS = [
    '46.202.131.81', '127.0.0.1', 'localhost', 'paratugym.es',
    'controlstock.es'
]

INSTALLED_APPS = [
    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'crispy_forms',
    'rest_framework',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.microsoft',
    'allauth.socialaccount.providers.apple',
    'crispy_bootstrap5',
    'widget_tweaks',
    'jazzmin',
    'control',
]

SITE_ID = 1

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}
CSRF_TRUSTED_ORIGINS = [
    'http://127.0.0.1',
    'http://localhost',
    'https://paratugym.es',
    'https://controlstock.es',
    'http://46.202.131.81',
]
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ControlStock.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'control/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

IS_DOCKER = os.environ.get('IS_DOCKER', False)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DJANGO_DB_NAME', 'controlstock'),
        'USER': os.environ.get('DJANGO_DB_USER', 'root'),
        'PASSWORD': os.environ.get('DJANGO_DB_PASSWORD', ''),
        'HOST': os.environ.get('DJANGO_DB_HOST', '127.0.0.1' if not IS_DOCKER else 'control_stock'),
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
WSGI_APPLICATION = 'ControlStock.wsgi.application'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': os.getenv("GOOGLE_CLIENT_ID"),
            'secret': os.getenv("GOOGLE_CLIENT_SECRET"),
            'key': ''
        }
    }
}

LANGUAGE_CODE = 'es'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "control/static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5"
CRISPY_TEMPLATE_PACK = "bootstrap5"

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR)

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

AUTH_USER_MODEL = 'control.UsuarioPersonalizado'
LOGIN_URL = '/cuentas/login/'
ACCOUNT_LOGOUT_REDIRECT_URL = 'login'
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_SIGNUP_FIELDS = ['email', 'username', 'password1', 'password2']
LOGIN_REDIRECT_URL = 'stock:dashboard'
LOGOUT_REDIRECT_URL = '/cuentas/login/'

HANDLER403 = 'tu_app.views.custom_permission_denied_view'

GROUPS_PERMISSIONS = {
    'Administradores': [
        'add_producto', 'change_producto', 'delete_producto',
        'puede_ver_reportes', 'puede_gestionar_usuarios'
    ],
    'Operarios Almacén': [
        'add_producto', 'change_producto', 'view_producto'
    ],
    'Equipo Ventas': [
        'view_producto'
    ],
}
