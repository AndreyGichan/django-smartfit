from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Workout
from .serializers import WorkoutSerializer

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
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)