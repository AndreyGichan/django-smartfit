from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Workout, WorkoutExercise
from exercises.models import Exercise
from .serializers import WorkoutSerializer, WorkoutExerciseSerializer

from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from calendar import day_abbr
from django.db.models import Sum, F
from django.db.models import Avg


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def total_workouts(request):
    count = Workout.objects.filter(user=request.user).count()
    return Response({"total_workouts": count})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def total_workout_hours(request):
    total_duration = Workout.objects.filter(user=request.user).aggregate(
        total=Sum('duration')
    )['total'] or timedelta(0)

    total_hours = total_duration.total_seconds() / 60

    return Response({"total_hours": round(total_hours, 1)})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def workout_activity_week(request):
    today = timezone.now().date()
    week_start = today - timedelta(days=6)  
    
    workouts = (
        Workout.objects
        .filter(user=request.user, date__range=[week_start, today])
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )

    result = []
    for i in range(7):
        day_date = week_start + timedelta(days=i)
        day_name = day_abbr[day_date.weekday()]
        day_workouts = next((w['count'] for w in workouts if w['date'] == day_date), 0)
        result.append({
            'day': day_name,
            'workouts': day_workouts
        })

    return Response(result, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def workout_activity_weeks(request):
    n_weeks = int(request.GET.get('n_weeks', 6))
    today = timezone.now().date()
    weekly_counts = []

    for i in reversed(range(n_weeks)):
        week_start = today - timedelta(days=today.weekday()) - timedelta(weeks=i)
        week_end = week_start + timedelta(days=6)
        count = Workout.objects.filter(user=request.user, date__range=[week_start, week_end]).count()
        weekly_counts.append({
            "week": f"Нед {n_weeks-i}",
            "workouts": count
        })

    return Response(weekly_counts)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def muscle_group_distribution(request):
    exercises = WorkoutExercise.objects.filter(workout__user=request.user, exercise__isnull=False)
    group_counts = exercises.values('exercise__muscle_group').annotate(count=Count('id'))

    muscle_groups = {
        "chest": 0,
        "back": 0,
        "legs": 0,
        "arms": 0,
        "shoulders": 0,
        "core": 0,
    }

    for item in group_counts:
        group = item['exercise__muscle_group']
        muscle_groups[group] = item['count']

    result = [
        {"name": group_name.capitalize(), "value": count}
        for group_name, count in muscle_groups.items()
    ]

    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exercise_progress(request, exercise_id):
    try:
        exercise = Exercise.objects.get(id=exercise_id)
    except Exercise.DoesNotExist:
        return Response({'detail': 'Упражнение не найдено'}, status=404)

    exercises = WorkoutExercise.objects.filter(
        workout__user=request.user,
        exercise=exercise
    ).order_by('workout__date')

    data = [
        {
            'date': ex.workout.date.strftime('%d %b'),
            'weight': ex.weight or 0
        }
        for ex in exercises
    ]

    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_workouts(request):
    today = timezone.now().date()
    
    current_month_start = today.replace(day=1)
    current_count = Workout.objects.filter(
        user=request.user,
        date__gte=current_month_start,
        date__lte=today
    ).count()
    
    prev_month_end = current_month_start - timedelta(days=1)
    prev_month_start = prev_month_end.replace(day=1)
    prev_count = Workout.objects.filter(
        user=request.user,
        date__gte=prev_month_start,
        date__lte=prev_month_end
    ).count()
    
    diff = current_count - prev_count
    
    return Response({
        "current": current_count,
        "previous": prev_count,
        "diff": diff
    })



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_lifted_weight(request):
    today = timezone.now().date()
    month_start = today.replace(day=1)

    total_weight = WorkoutExercise.objects.filter(
        workout__user=request.user,
        workout__date__gte=month_start,
    ).aggregate(
        total_lifted=Sum(F('weight') * F('reps') * F('sets'))
    )['total_lifted'] or 0

    prev_month_end = month_start - timedelta(days=1)
    prev_month_start = prev_month_end.replace(day=1)

    prev_total_weight = WorkoutExercise.objects.filter(
        workout__user=request.user,
        workout__date__gte=prev_month_start,
        workout__date__lte=prev_month_end
    ).aggregate(
        total_lifted=Sum(F('weight') * F('reps') * F('sets'))
    )['total_lifted'] or 0

    diff = total_weight - prev_total_weight

    return Response({
        "current": total_weight,
        "previous": prev_total_weight,
        "diff": diff
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def average_workout_duration(request):
    today = timezone.now().date()

    current_month_start = today.replace(day=1)
    current_workouts = Workout.objects.filter(
        user=request.user,
        date__gte=current_month_start,
        date__lte=today,
        duration__isnull=False
    )
    current_avg = current_workouts.aggregate(avg_duration=Avg('duration'))['avg_duration']

    prev_month_end = current_month_start - timedelta(days=1)
    prev_month_start = prev_month_end.replace(day=1)
    prev_workouts = Workout.objects.filter(
        user=request.user,
        date__gte=prev_month_start,
        date__lte=prev_month_end,
        duration__isnull=False
    )
    prev_avg = prev_workouts.aggregate(avg_duration=Avg('duration'))['avg_duration']

    def td_to_seconds(td):
        if not td:
            return 0
        return int(td.total_seconds())

    return Response({
        "current_month_avg_minutes": td_to_seconds(current_avg),
        "current_month_count": current_workouts.count(),
        "prev_month_avg_minutes": td_to_seconds(prev_avg),
        "prev_month_count": prev_workouts.count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def average_sets_per_workout(request):
    today = timezone.now().date()

    def get_avg_sets(start_date, end_date):
        workouts = Workout.objects.filter(
            user=request.user,
            date__gte=start_date,
            date__lte=end_date
        )

        if not workouts.exists():
            return 0

        total_sets_per_workout = workouts.annotate(
            total_sets=Sum('exercises__sets')
        ).values_list('total_sets', flat=True)

        total_sets_per_workout = [x for x in total_sets_per_workout if x is not None]

        if not total_sets_per_workout:
            return 0

        return sum(total_sets_per_workout) / len(total_sets_per_workout)

    current_month_start = today.replace(day=1)
    current_avg_sets = get_avg_sets(current_month_start, today)

    prev_month_end = current_month_start - timedelta(days=1)
    prev_month_start = prev_month_end.replace(day=1)
    prev_avg_sets = get_avg_sets(prev_month_start, prev_month_end)

    return Response({
        "current": round(current_avg_sets, 1),
        "previous": round(prev_avg_sets, 1),
        "diff": round(current_avg_sets - prev_avg_sets, 1)
    })