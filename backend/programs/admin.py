from django.contrib import admin

from .models import Program

class ProgramAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'level', 'goal', 'training_type')
    search_fields = ('name', 'goal')
    list_filter = ('level', 'goal', 'training_type')


admin.site.register(Program, ProgramAdmin)
