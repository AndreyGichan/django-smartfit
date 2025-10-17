from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import UserProfileSerializer
from django_smartfit.constants import LEVEL_CHOICES, GOAL_CHOICES, TRAINING_TYPE_CHOICES, GENDER_CHOICES


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    if request.method == 'GET':
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def constants_view(request):
    return Response({
        "gender": [{"value": v[0], "label": v[1]} for v in GENDER_CHOICES],
        "level": [{"value": v[0], "label": v[1]} for v in LEVEL_CHOICES],
        "goal": [{"value": v[0], "label": v[1]} for v in GOAL_CHOICES],
        "training_type": [{"value": v[0], "label": v[1]} for v in TRAINING_TYPE_CHOICES],
    })