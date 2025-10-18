from django.contrib import admin
from django import forms

from .models import Program, ProgramWorkout, ProgramWorkoutExercise
from django_smartfit.supabase_utils import upload_to_supabase


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


class ProgramAdminForm(forms.ModelForm):
    image_file = forms.ImageField(required=False)

    class Meta:
        model = Program
        fields = "__all__"


class ProgramAdmin(admin.ModelAdmin):
    form = ProgramAdminForm
    list_display = ("id", "name", "level", "goal", "training_type", 'frequency')
    search_fields = ("name", "goal")
    list_filter = ("level", "goal", "training_type")
    readonly_fields = ("image_url",)
    inlines = [ProgramWorkoutInline]

    def save_model(self, request, obj, form, change):
        image_file = form.cleaned_data.get("image_file")
        if image_file:
            obj.image_url = upload_to_supabase(image_file, folder="programs")
        super().save_model(request, obj, form, change)


admin.site.register(Program, ProgramAdmin)
admin.site.register(ProgramWorkout, ProgramWorkoutAdmin)
