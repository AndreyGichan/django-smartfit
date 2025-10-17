from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_programs, name='programs_list'),
    path('<uuid:pk>/', views.program_details, name='program_details'),
    path('<uuid:program_id>/select/', views.select_program, name='select_program'),
    path('recommended/', views.recommended_programs, name='recommended_programs'),
]