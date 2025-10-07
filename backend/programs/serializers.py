from rest_framework import serializers
from exercises.serializers import ExerciseSerializer
from .models import Program


class ProgramSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = Program
        fields = ['id', 'name', 'description', 'level', 'goal', 'training_type', 'exercises']


class ProgramCreateSerializer(serializers.ModelSerializer):
    exercise_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True, required=False
    )

    class Meta:
        model = Program
        fields = ['id', 'name', 'description', 'level', 'goal', 'training_type', 'exercise_ids']

    def create(self, validated_data):
        exercise_ids = validated_data.pop('exercise_ids', [])
        program = Program.objects.create(**validated_data)
        if exercise_ids:
            program.exercises.set(exercise_ids)
        return program

    def update(self, instance, validated_data):
        exercise_ids = validated_data.pop('exercise_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if exercise_ids is not None:
            instance.exercises.set(exercise_ids)
        return instance
