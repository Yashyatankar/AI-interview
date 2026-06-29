from django.db import models



frameworkOptions = {
    'Python': [
        {'name': 'Django', 'value': 'django'},
        {'name': 'Flask', 'value': 'flask'},
        {'name': 'FastAPI', 'value': 'fastapi'}
    ],
    'JavaScrip': [ 
        {'name': 'React', 'value': 'react'},
        {'name': 'Node.js', 'value': 'nodejs'},
        {'name': 'Vue.js', 'value': 'vue'}
    ],
    'Java': [
        {'name': 'Spring Boot', 'value': 'spring_boot'},
        {'name': 'Jakarta EE', 'value': 'jakarta_ee'},
        {'name': 'Hibernate', 'value': 'hibernate'}
    ],
    'Rust': [
        {'name': 'Actix Web', 'value': 'actix_web'},
        {'name': 'Axum', 'value': 'axum'},
        {'name': 'Rocket', 'value': 'rocket'}
    ],
    'C#': [
        {'name': '.NET MAUI', 'value': 'net_maui'},
        {'name': 'ASP.NET Core', 'value': 'aspnet_core'},
        {'name': 'Blazor', 'value': 'blazor'}
    ],
    'C++': [
        {'name': 'Qt', 'value': 'qt'},
        {'name': 'Unreal Engine', 'value': 'unreal_engine'},
        {'name': 'Crow', 'value': 'crow'}
    ],
}


class OptionsForTechs(models.Model):
    pass
