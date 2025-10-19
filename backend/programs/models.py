import uuid
from django.db import models
from exercises.models import Exercise

from django_smartfit.constants import LEVEL_CHOICES, GOAL_CHOICES, TRAINING_TYPE_CHOICES

class Program(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    goal = models.CharField(max_length=20, choices=GOAL_CHOICES, default='maintenance')
    training_type = models.CharField(max_length=10, choices=TRAINING_TYPE_CHOICES, default='home')
    frequency = models.CharField(max_length=20, blank=True, help_text="Например: '3 раза в неделю' или '2x2'")
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


class ProgramWorkout(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    program = models.ForeignKey(Program, related_name='program_workouts', on_delete=models.CASCADE)
    name = models.CharField(max_length=120, blank=True)  
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ('program', 'order')
        ordering = ['order']

    def __str__(self):
        display_name = self.name or f'День {self.order}'
        return f"{display_name} ({self.id})"



class ProgramWorkoutExercise(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workout = models.ForeignKey(ProgramWorkout, related_name='exercises', on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    class Meta:
        unique_together = ('workout', 'exercise')

    def __str__(self):
        return f"{self.exercise.name} ({self.sets}x{self.reps})"