from django.db import models



PROGRAMMING_CHOICES = [
    ('python', 'Python'),
    ('javascript', 'JavaScript'), # Fixed the typo here for database safety!
    ('java', 'Java'),
    ('rust', 'Rust'),
]

# Separate framework choices grouped by language
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


class OptionsForTechs(models.Model):
    pass
