from django.conf import settings
from django.db import models
import uuid


class InterviewSession(models.Model):
    PROGRAMMING_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('java', 'Java'),
        ('rust', 'Rust'),
    ]

    # One unified framework list — validated against `programming` in the serializer,
    # not split into 4 separate columns.
    FRAMEWORK_CHOICES = [
        # Python
        ('django', 'Django'),
        ('flask', 'Flask'),
        ('fastapi', 'FastAPI'),
        # JavaScript
        ('react', 'React'),
        ('nodejs', 'Node.js'),
        ('vue', 'Vue.js'),
        # Java
        ('spring_boot', 'Spring Boot'),
        ('jakarta_ee', 'Jakarta EE'),
        # Rust
        ('actix_web', 'Actix Web'),
        ('axum', 'Axum'),
    ]

    JOB_FIELD_CHOICES = [
        ('full_stack', 'Full Stack Developer'),
        ('frontend', 'Frontend Developer'),
        ('backend', 'Backend Developer'),
        ('mobile', 'Mobile App Developer'),
        ('devops', 'DevOps / Cloud Engineer'),
        ('data_science', 'Data Scientist / AI Engineer'),
        ('cybersecurity', 'Cybersecurity Specialist'),
        ('ui_ux', 'UI/UX Designer'),
        ('qa_testing', 'QA / Test Engineer'),
        ('product_manager', 'Product Manager'),
    ]

    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('professional', 'Professional'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='interview_sessions')

    programming = models.CharField(max_length=20, choices=PROGRAMMING_CHOICES)
    # A session can use more than one framework/library (e.g. React + Redux)
    frameworks = models.JSONField(default=list)  # e.g. ["django", "fastapi"]

    job_field = models.CharField(max_length=20, choices=JOB_FIELD_CHOICES)
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES, default='intermediate')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')

    total_questions = models.PositiveIntegerField(default=10)
    overall_score = models.FloatField(null=True, blank=True)  # 0–100

    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_job_field_display()} — {self.status}"

    def compute_score(self):
        scored = self.questions.filter(answer__score__isnull=False)
        count = scored.count()
        if not count:
            return None
        total = sum(q.answer.score for q in scored)
        return round((total / (count * 10)) * 100, 1)


class InterviewQuestion(models.Model):
    TOPIC_CHOICES = [
        ('core_concepts', 'Core Concepts'),
        ('practical', 'Practical / Coding'),
        ('system_design', 'System Design'),
        ('best_practices', 'Best Practices'),
        ('debugging', 'Debugging'),
        ('behavioral', 'Behavioral'),
    ]

    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='questions')
    order = models.PositiveIntegerField()
    text = models.TextField()
    topic = models.CharField(max_length=20, choices=TOPIC_CHOICES, default='core_concepts')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    expected_keywords = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']
        unique_together = ('session', 'order')

    def __str__(self):
        return f"Q{self.order}: {self.text[:60]}"


class Answer(models.Model):
    question = models.OneToOneField(InterviewQuestion, on_delete=models.CASCADE, related_name='answer')
    text = models.TextField()
    score = models.FloatField(null=True, blank=True)  # 0–10
    feedback = models.TextField(blank=True)
    strengths = models.JSONField(default=list)
    improvements = models.JSONField(default=list)
    time_taken_seconds = models.PositiveIntegerField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    evaluated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Answer to Q{self.question.order} — score: {self.score}"