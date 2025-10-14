from rest_framework import serializers
from .models import Workout, WorkoutExercise, Exercise
from programs.models import Program, ProgramWorkout

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "name"]


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)

    class Meta:
        model = WorkoutExercise
        fields = ["id", "exercise", "name", "sets", "reps", "weight", "duration"]


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True, required=False)
    program = serializers.PrimaryKeyRelatedField(queryset=Program.objects.all(), required=False, allow_null=True)
    program_workout = serializers.PrimaryKeyRelatedField(queryset=ProgramWorkout.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Workout
        fields = ["id", "user", "program", "program_workout", "date", "notes", "duration", "exercises"]
        read_only_fields = ['id', 'user']

    def create(self, validated_data):
        exercises_data = validated_data.pop("exercises", [])
        user = self.context['request'].user

        program_workout = validated_data.pop("program_workout", None)
        program = validated_data.pop("program", None)

        workout = Workout.objects.create(
            user=user,
            program=program,
            program_workout=program_workout,
            **validated_data
        )
        for ex_data in exercises_data:
            WorkoutExercise.objects.create(workout=workout, **ex_data)
        return workout
