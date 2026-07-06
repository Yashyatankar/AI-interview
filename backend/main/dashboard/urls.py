from django.urls import path
from .views import InterviewSessionViewSet

urlpatterns = [
    path('sessions/', InterviewSessionViewSet.as_view({'get': 'list', 'post': 'create'}), name='interview-session-list'),
    path('sessions/<uuid:pk>/', InterviewSessionViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='interview-session-detail'),
    path('sessions/<uuid:pk>/submit-answer/', InterviewSessionViewSet.as_view({'post': 'submit_answer'}), name='interview-session-submit-answer'),
]
