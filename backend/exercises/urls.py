from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_exercises, name='exercises_list'),
    path('<uuid:pk>/', views.exercise_details, name='exercise_details'),
]