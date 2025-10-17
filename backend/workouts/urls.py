from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_workouts, name='workouts_list'),
    path('<uuid:pk>/', views.workout_details, name='workout_details'),
    path('add/', views.add_workout, name='add_workout'),
    path('<uuid:pk>/update/', views.update_workout, name='update_workout'),
    path('<uuid:pk>/delete/', views.delete_workout, name='delete_workout'),
    path('<uuid:pk>/exercises/', views.add_exercise_to_workout, name='add_exercise_to_workout'),
    path('<uuid:workout_pk>/exercises/<uuid:exercise_pk>/update/', views.update_workout_exercise, name='update_workout_exercise'),
    path('<uuid:workout_pk>/exercises/<uuid:exercise_pk>/delete/', views.delete_workout_exercise, name='delete_workout_exercise'),
    path('total/', views.total_workouts, name='total_workouts'),
    path('total-hours/', views.total_workout_hours, name='total_workout_hours'),
    path('activity/week/', views.workout_activity_week, name='workout_activity_week'),
    path('activity/weeks/', views.workout_activity_weeks, name='workout_activity_weeks'),
    path('muscle-distribution/', views.muscle_group_distribution, name='muscle_distribution'),
    path('exercise-progress/<uuid:exercise_id>/', views.exercise_progress, name='exercise_progress'),
    path('monthly/', views.monthly_workouts, name='monthly_workouts'),
    path('monthly-weight/', views.monthly_lifted_weight, name='monthly_lifted_weight'),
    path('monthly-avg-duration/', views.average_workout_duration, name='average_workout_duration'),
    path('avg-sets-per-workout/', views.average_sets_per_workout, name='average_sets_per_workout'),
]