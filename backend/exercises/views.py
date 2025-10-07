from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
# from django.shortcuts import get_object_or_404

from .models import Exercise
from .serializers import ExerciseSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def get_exercises(request):
    exercises = Exercise.objects.all()
    serializer = ExerciseSerializer(exercises, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def exercise_details(request, pk):
    exercise = Exercise.objects.get(pk=pk)
    # exercise = get_object_or_404(Exercise, pk=pk)
    serializer = ExerciseSerializer(exercise)
    return Response(serializer.data, status=status.HTTP_200_OK)