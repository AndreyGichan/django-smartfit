import uuid
from django.db import models


class Exercise(models.Model):
    MUSCLE_GROUP_CHOICES = [
        ("chest", "Грудь"),
        ("back", "Спина"),
        ("legs", "Ноги"),
        ("arms", "Руки"),
        ("shoulders", "Плечи"),
        ("core", "Пресс"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    muscle_group = models.CharField(max_length=20, choices=MUSCLE_GROUP_CHOICES)
    equipment_needed = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to="exercises/", blank=True, null=True)
