from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_programs, name='programs_list'),
    path('<uuid:pk>/', views.program_details, name='program_details'),
]