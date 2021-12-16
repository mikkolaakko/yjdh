"""tet URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path
from django.views.decorators.http import require_GET

urlpatterns = [
    path("oidc/", include("shared.oidc.urls")),
    path("oauth2/", include("shared.azure_adfs.urls")),
    path("admin/", admin.site.urls),
]


@require_GET
def healthz_handler(*args, **kwargs):
    return HttpResponse(status=200)


@require_GET
def readiness_handler(*args, **kwargs):
    return HttpResponse(status=200)


urlpatterns += [path("healthz", healthz_handler), path("readiness", readiness_handler)]