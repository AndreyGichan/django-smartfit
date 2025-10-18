from django.contrib import admin
from django import forms

from .models import Exercise
from django_smartfit.supabase_utils import upload_to_supabase


class ExerciseAdminForm(forms.ModelForm):
    image_file = forms.ImageField(required=False)
    video_file = forms.FileField(required=False)

    class Meta:
        model = Exercise
        fields = '__all__'


class ExerciseAdmin(admin.ModelAdmin):
    form = ExerciseAdminForm
    list_display = ('id', 'name', 'description','muscle_group', 'equipment_needed')
    search_fields = ('name', 'muscle_group')
    list_filter = ('muscle_group',)
    readonly_fields = ('image_url', 'video_url')

    def save_model(self, request, obj, form, change):
        image_file = request.FILES.get("image_file")
        video_file = request.FILES.get("video_file")

        if image_file:
            obj.image_url = upload_to_supabase(image_file, folder="exercises")
        if video_file:
            obj.video_url = upload_to_supabase(video_file, folder="exercises/videos")

        super().save_model(request, obj, form, change)

admin.site.register(Exercise, ExerciseAdmin)
