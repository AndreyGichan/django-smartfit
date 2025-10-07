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
    exercises = models.ManyToManyField(Exercise, related_name='programs')
