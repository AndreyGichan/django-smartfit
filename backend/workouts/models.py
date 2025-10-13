import uuid
from django.db import models
from django.utils import timezone

from users.models import User
from programs.models import Program, ProgramWorkout
from exercises.models import Exercise


class Workout(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) 
    user = models.ForeignKey(User, related_name='workouts', on_delete=models.CASCADE)
    program = models.ForeignKey(Program, related_name='user_workouts', on_delete=models.CASCADE, null=True, blank=True)
    program_workout = models.ForeignKey(ProgramWorkout, related_name='workouts', on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField(default=timezone.now)
    notes = models.TextField(blank=True)

    def __str__(self):
        program_name = self.program.name if self.program else "Без программы"
        day_name = self.program_workout.name if self.program_workout else ""
        return f"{self.user.name or self.user.email} — {program_name} {day_name} ({self.date})"

class WorkoutExercise(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workout = models.ForeignKey(Workout, related_name='exercises', on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    sets = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()
    weight = models.FloatField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.exercise and not self.name:
            self.name = self.exercise.name
        super().save(*args, **kwargs)

    def __str__(self):
         return f"{self.name} ({self.sets}x{self.reps})"