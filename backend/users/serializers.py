from rest_framework import serializers
from .models import User
from programs.models import Program 

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ["id", "name"]

class UserProfileSerializer(serializers.ModelSerializer):
    selected_program = ProgramSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "name", "age", "height", "weight", "gender", "level", "goal", "training_type", "selected_program"]
