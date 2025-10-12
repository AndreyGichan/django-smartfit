from django.contrib import admin

from .models import Program, ProgramWorkout, ProgramWorkoutExercise


class ProgramWorkoutExerciseInline(admin.TabularInline):
    model = ProgramWorkoutExercise
    extra = 1
    fields = ("exercise", "sets", "reps", "weight")
    autocomplete_fields = ["exercise"]


class ProgramWorkoutInline(admin.TabularInline):
    model = ProgramWorkout
    extra = 1
    fields = ("name", "order")
    inlines = [ProgramWorkoutExerciseInline]


class ProgramWorkoutAdmin(admin.ModelAdmin):
    list_display = ("id", "program", "name", "order")
    inlines = [ProgramWorkoutExerciseInline]


class ProgramAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "level", "goal", "training_type")
    search_fields = ("name", "goal")
    list_filter = ("level", "goal", "training_type")
    inlines = [ProgramWorkoutInline]


admin.site.register(Program, ProgramAdmin)
admin.site.register(ProgramWorkout, ProgramWorkoutAdmin)
