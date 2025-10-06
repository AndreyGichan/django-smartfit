import uuid
from django.db import models


from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin

class CustomUserManager(UserManager):
    def _create_user(self, name, email, password, **extra_fields):
        if not email:
            raise ValueError("You have not specified a valid email address")
        
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_user(self, name=None, email=None, password=None, **extra_fields):  # type: ignore
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_staff', False)
        return self._create_user(name, email, password, **extra_fields)
    
    def create_superuser(self, name=None, email=None, password=None, **extra_fields):  # type: ignore
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self._create_user(name, email, password, **extra_fields)
    

class User(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES= [
        ('male', 'Мужской'),
        ('female', 'Женский'),

    ]
    LEVEL_CHOICES = [
        ('beginner', 'Начинающий'),
        ('intermediate', 'Средний'),
        ('advanced', 'Продвинутый'),
    ]

    GOAL_CHOICES = [
        ('weight_loss', 'Похудение'),
        ('muscle_gain', 'Набор массы'),
        ('endurance', 'Выносливость'),
        ('maintenance', 'Поддержание формы'),
    ]

    TRAINING_TYPE_CHOICES = [
        ('home', 'Дом'),    
        ('gym', 'Зал'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=120, blank=True, null=True)

    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    goal = models.CharField(max_length=20, choices=GOAL_CHOICES, default='maintenance')
    training_type = models.CharField(max_length=10, choices=TRAINING_TYPE_CHOICES, default='home')

    
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)
    # last_login = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']