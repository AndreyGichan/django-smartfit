import uuid
from django.db import models

from users.models import User
from programs.models import Program
from exercises.models import Exercise


class Workout(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) 
    user = models.ForeignKey(User, related_name='workouts', on_delete=models.CASCADE)
    program = models.ForeignKey(Program, related_name='workouts', on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)

class WorkoutExercise(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workout = models.ForeignKey(Workout, related_name='exercises', on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.FloatField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)