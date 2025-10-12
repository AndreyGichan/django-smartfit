from rest_framework import serializers
from exercises.serializers import ExerciseSerializer
from .models import Program, ProgramWorkout, ProgramWorkoutExercise


class ProgramWorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    exercise_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = ProgramWorkoutExercise
        fields = ['id', 'exercise', 'exercise_id', 'sets', 'reps', 'weight']


class ProgramWorkoutSerializer(serializers.ModelSerializer):
    exercises = ProgramWorkoutExerciseSerializer(many=True)

    class Meta:
        model = ProgramWorkout
        fields = ['id', 'name', 'order', 'exercises']

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises', [])
        workout = ProgramWorkout.objects.create(**validated_data)
        for ex_data in exercises_data:
            ProgramWorkoutExercise.objects.create(
                workout=workout,
                exercise_id=ex_data['exercise_id'],
                sets=ex_data.get('sets'),
                reps=ex_data.get('reps'),
                weight=ex_data.get('weight')
            )
        return workout


class ProgramSerializer(serializers.ModelSerializer):
    workouts = ProgramWorkoutSerializer(many=True, read_only=True)

    class Meta:
        model = Program
        fields = ['id', 'name', 'description', 'level', 'goal', 'training_type', 'workouts']


class ProgramCreateSerializer(serializers.ModelSerializer):
    exercises = ProgramWorkoutSerializer(many=True, write_only=True)

    class Meta:
        model = Program
        fields = ['id', 'name', 'description', 'level', 'goal', 'training_type', 'workouts']

    def create(self, validated_data):
        workouts_data = validated_data.pop('workouts', [])
        program = Program.objects.create(**validated_data)
        
        for workout_data in workouts_data:
            exercises_data = workout_data.pop('exercises', [])
            workout = ProgramWorkout.objects.create(program=program, **workout_data)
            for ex_data in exercises_data:
                ProgramWorkoutExercise.objects.create(
                    workout=workout,
                    exercise_id=ex_data['exercise_id'],
                    sets=ex_data.get('sets'),
                    reps=ex_data.get('reps'),
                    weight=ex_data.get('weight')
                )


        return program