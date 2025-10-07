from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .models import Program
from .serializers import ProgramSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def get_programs(request):
    programs = Program.objects.all()
    serializer = ProgramSerializer(programs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def program_details(request, pk):
    try:
        program = Program.objects.get(pk=pk)
    except Program.DoesNotExist:
        return Response({'detail': 'Программа не найдена'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProgramSerializer(program)
    return Response(serializer.data, status=status.HTTP_200_OK)