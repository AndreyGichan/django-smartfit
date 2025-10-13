from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_workouts, name='workouts_list'),
    path('<uuid:pk>/', views.workout_details, name='workout_details'),
    path('add/', views.add_workout, name='add_workout'),
    path('<uuid:pk>/exercises/', views.add_exercise_to_workout, name='add_exercise_to_workout'),
]