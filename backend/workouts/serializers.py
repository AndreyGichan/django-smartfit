from rest_framework import serializers
from .models import Workout, WorkoutExercise


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = ["id", "exercise", "sets", "reps", "weight", "duration"]


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True)

    class Meta:
        model = Workout
        fields = ["id", "program", "date", "notes", "exercises"]

    def create(self, validated_data):
        exercises_data = validated_data.pop("exercises")
        user = self.context['request'].user
        workout = Workout.objects.create(**validated_data)
        for ex_data in exercises_data:
            WorkoutExercise.objects.create(workout=workout, **ex_data)
        return workout
