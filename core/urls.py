from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Rota para a página inicial
    # Se você tiver outras rotas, adicione aqui
]