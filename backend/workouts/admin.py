from django.contrib import admin

from .models import Workout, WorkoutExercise


class WorkoutExerciseInline(admin.TabularInline):
    model = WorkoutExercise
    extra = 1


class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'program', 'date')
    inlines = [WorkoutExerciseInline]
    search_fields = ('user__username',)
    list_filter = ('date',)


admin.site.register(Workout, WorkoutAdmin)
