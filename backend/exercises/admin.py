from django.contrib import admin

from .models import Exercise

class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description','muscle_group', 'equipment_needed')
    search_fields = ('name', 'muscle_group')
    list_filter = ('muscle_group',)

admin.site.register(Exercise, ExerciseAdmin)
