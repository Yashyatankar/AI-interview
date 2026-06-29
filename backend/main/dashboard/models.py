from django.db import models
import uuid





class InterViewSession(models.Model):
    PROGRAMMING_CHOICES = [
    ('python', 'Python'),
    ('javascript', 'JavaScript'), 
    ('java', 'Java'),
    ('rust', 'Rust'),
    ]

    PYTHON_FRAMEWORK_CHOICES = [
        ('django', 'Django'),
        ('flask', 'Flask'),
        ('fastapi', 'FastAPI'),
    ]

    JAVASCRIPT_FRAMEWORK_CHOICES = [
        ('react', 'React'),
        ('nodejs', 'Node.js'),
        ('vue', 'Vue.js'),
    ]


    JAVA_FRAMEWORK_CHOICES = [
        ('spring_boot', 'Spring Boot'),
        ('jakarta_ee', 'Jakarta EE'),
    ]


    RUST_FRAMEWORK_CHOICES = [
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

    STATUS_CHOICE = [
        ('beginner','Beginner'),
        ('intermidiate', 'Intermidiate'),
        ('professional', 'professional'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    programming = models.CharField(choices=PROGRAMMING_CHOICES)
    pythonFrameWork = models.CharField(choices=PYTHON_FRAMEWORK_CHOICES)
    javascriptFrameWork = models.CharField(choices=JAVASCRIPT_FRAMEWORK_CHOICES)
    javaFrameWork = models.CharField(choices=JAVA_FRAMEWORK_CHOICES)

    rustFrameWork = models.CharField(choices=RUST_FRAMEWORK_CHOICES)
    jobField = models.CharField(choices=JOB_FIELD_CHOICES)
    total_questions = models.PositiveIntegerField(default=10)
    status = models.CharField(choices=STATUS_CHOICE)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    overall_score = models.FloatField(null=True, blank=True)


    class Meta:
        ordering = ['-created_at']


    def __str__(self):
        return f"{self.jobField} {self.status}"




class InterViewQuestions(models.Model):

    TOPIC_CHOICES = [
        ('core_concepts', 'Core Concepts'),
        ('practical', 'Practical / Coding'),
        ('system_design', 'System Design'),
        ('best_practices', 'Best Practices'),
        ('debugging', 'Debugging'),
        ('behavioral', 'Behavioral'),]

    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    session = models.ForeignKey(InterViewSession, on_delete=models.CASCADE, related_name='questions')
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
    question = models.OneToOneField(InterViewQuestions, on_delete=models.CASCADE, related_name='answer')
    text = models.TextField()
    score = models.FloatField(null=True, blank=True)          # 0–10
    feedback = models.TextField(blank=True)
    strengths = models.JSONField(default=list)
    improvements = models.JSONField(default=list)
    time_taken_seconds = models.PositiveIntegerField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    evaluated_at = models.DateTimeField(null=True, blank=True)
 
    def __str__(self):
        return f"Answer to Q{self.question.order} — score: {self.score}"
 