from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Workout, WorkoutExercise
from exercises.models import Exercise
from .serializers import WorkoutSerializer, WorkoutExerciseSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_workouts(request):
    workouts = Workout.objects.filter(user=request.user)
    serializer = WorkoutSerializer(workouts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def workout_details(request, pk):
    try:
        workout = Workout.objects.get(pk=pk)
    except Workout.DoesNotExist:
        return Response({'detail': 'Тренировка не найдена'}, status=status.HTTP_404_NOT_FOUND)

    serializer = WorkoutSerializer(workout)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_workout(request):
    serializer = WorkoutSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_exercise_to_workout(request, pk):
    try:
        workout = Workout.objects.get(pk=pk, user=request.user)
    except Workout.DoesNotExist:
        return Response({'detail': 'Тренировка не найдена'}, status=404)

    data = request.data

    exercise = None
    name = None

    if 'exercise_id' in data:
        try:
            exercise = Exercise.objects.get(id=data['exercise_id'])
        except Exercise.DoesNotExist:
            return Response({'detail': 'Упражнение не найдено'}, status=404)
    else:
        name = data.get('custom_exercise')
        if not name:
            return Response({'detail': 'Имя упражнения не указано'}, status=400)
    workout_ex = WorkoutExercise.objects.create(
        workout=workout,
        exercise=exercise,
        name=name,
        sets=data['sets'],
        reps=data['reps'],
        weight=data.get('weight')
    )
    return Response(WorkoutExerciseSerializer(workout_ex).data, status=201)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_workout(request, pk):
    try:
        workout = Workout.objects.get(pk=pk, user=request.user)
    except Workout.DoesNotExist:
        return Response({'detail': 'Тренировка не найдена'}, status=status.HTTP_404_NOT_FOUND)

    serializer = WorkoutSerializer(workout, data=request.data, partial=True, context={'request': request})
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_workout(request, pk):
    try:
        workout = Workout.objects.get(pk=pk, user=request.user)
    except Workout.DoesNotExist:
        return Response({'detail': 'Тренировка не найдена'}, status=status.HTTP_404_NOT_FOUND)
    
    workout.delete()
    return Response({'detail': 'Тренировка удалена'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_workout_exercise(request, workout_pk, exercise_pk):
    try:
        workout_ex = WorkoutExercise.objects.get(pk=exercise_pk, workout__pk=workout_pk, workout__user=request.user)
    except WorkoutExercise.DoesNotExist:
        return Response({'detail': 'Упражнение не найдено'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data

    if 'exercise_id' in data:
        try:
            workout_ex.exercise = Exercise.objects.get(pk=data['exercise_id'])
            workout_ex.name = workout_ex.exercise.name # type: ignore
        except Exercise.DoesNotExist:
            return Response({'detail': 'Упражнение не найдено'}, status=status.HTTP_404_NOT_FOUND)
    elif 'name' in data:
        workout_ex.name = data['name']

    workout_ex.sets = data.get('sets', workout_ex.sets)
    workout_ex.reps = data.get('reps', workout_ex.reps)
    workout_ex.weight = data.get('weight', workout_ex.weight)
    workout_ex.duration = data.get('duration', workout_ex.duration)

    workout_ex.save()
    serializer = WorkoutExerciseSerializer(workout_ex)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_workout_exercise(request, workout_pk, exercise_pk):
    try:
        workout_ex = WorkoutExercise.objects.get(pk=exercise_pk, workout__pk=workout_pk, workout__user=request.user)
    except WorkoutExercise.DoesNotExist:
        return Response({'detail': 'Упражнение не найдено'}, status=status.HTTP_404_NOT_FOUND)

    workout_ex.delete()
    return Response({'detail': 'Упражнение удалено'}, status=status.HTTP_204_NO_CONTENT)
